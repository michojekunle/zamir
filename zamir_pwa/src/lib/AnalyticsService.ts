import { db } from "./firebase";
import {
  doc,
  updateDoc,
  increment,
  setDoc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export const trackEvent = async (eventName: string, data: any = {}) => {
  try {
    await addDoc(collection(db, "events"), {
      event: eventName,
      ...data,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error tracking event:", error);
  }
};

export const incrementGlobalStat = async (
  statName: string,
  amount: number = 1,
) => {
  const statRef = doc(db, "stats", "global");
  try {
    await updateDoc(statRef, {
      [statName]: increment(amount),
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    // If doc doesn't exist, create it
    await setDoc(
      statRef,
      { [statName]: amount, lastUpdated: serverTimestamp() },
      { merge: true },
    );
  }
};

export const incrementUserStat = async (
  uid: string,
  statName: string,
  amount: number = 1,
) => {
  if (!uid) return;
  const userStatRef = doc(db, "users", uid, "stats", "overview");
  try {
    await updateDoc(userStatRef, {
      [statName]: increment(amount),
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    await setDoc(
      userStatRef,
      { [statName]: amount, lastUpdated: serverTimestamp() },
      { merge: true },
    );
  }
};

export const logPlay = async (
  uid: string | undefined,
  trackId: string,
  trackTitle: string,
) => {
  // 1. Increment global plays
  await incrementGlobalStat("totalPlays");

  // 2. Increment track specific plays
  const trackRef = doc(db, "public_tracks", trackId);
  try {
    await updateDoc(trackRef, { plays: increment(1) });
  } catch (e) {
    // If it's a private track, it might be in user's library
    if (uid) {
      try {
        const privateTrackRef = doc(db, "users", uid, "library", trackId);
        await updateDoc(privateTrackRef, { plays: increment(1) });
      } catch (e2) {}
    }
  }

  // 3. Track user specific stats
  if (uid) {
    await incrementUserStat(uid, "totalPlays");
  }

  // 4. Detailed event log
  await trackEvent("play_start", { uid, trackId, trackTitle });
};

export const logListenTime = async (
  uid: string | undefined,
  seconds: number,
) => {
  if (uid) {
    await incrementUserStat(uid, "secondsListened", seconds);
  }
  await incrementGlobalStat("totalSecondsListened", seconds);
};
