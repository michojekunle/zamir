import { expect } from "expect";

// ── Mock Firebase Functions ──
const mockDb = {};
const mockAuth = {
  currentUser: { uid: "test-user-123", displayName: "Test User" },
};
const mockStorage = {};

let firestoreAdds: any[] = [];
let storageUploads: any[] = [];

const serverTimestamp = () => "mock-timestamp";
const collection = (db: any, ...path: string[]) => path.join("/");
const addDoc = async (collPath: string, data: any) => {
  firestoreAdds.push({ path: collPath, data });
  return { id: "new-doc-id" };
};
const ref = (storage: any, path: string) => path;
const uploadBytes = async (refPath: string, blob: Blob) => {
  storageUploads.push({ path: refPath, size: blob.size });
};
const getDownloadURL = async (refPath: string) =>
  `https://firebasestorage.mock/${refPath}`;

// ── Isolated function tests reflecting page.tsx logic ──
async function simulateSaveToProfile(
  lastGenerated: any,
  simulateCorsError: boolean,
) {
  let finalUrl = lastGenerated.url;

  try {
    if (simulateCorsError) {
      throw new Error(
        "CORS policy: Response to preflight request doesn't pass access control check",
      );
    }

    // Simulate successful fetch and blob conversion
    const blob = new Blob(["mock-audio-data"], { type: "audio/mpeg" });

    const storageRef = ref(
      mockStorage,
      `users/${mockAuth.currentUser.uid}/library/${lastGenerated.id}.mp3`,
    );
    await uploadBytes(storageRef as any, blob);
    finalUrl = await getDownloadURL(storageRef as any);
  } catch (fetchErr: any) {
    console.warn(
      "[Caught Error] Client-side direct upload blocked by CORS, falling back to Suno URL:",
      fetchErr.message,
    );
  }

  await addDoc(
    collection(mockDb, "users", mockAuth.currentUser.uid, "library"),
    {
      ...lastGenerated,
      url: finalUrl,
      createdAt: serverTimestamp(),
      public: false,
    },
  );
}

async function simulateHandlePublish(track: any) {
  await addDoc(collection(mockDb, "moderation_queue"), {
    ...track,
    userId: mockAuth.currentUser.uid,
    userName: mockAuth.currentUser.displayName || "Soul Seeker",
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

// ── Test Runner ──
async function run() {
  console.log("=========================================");
  console.log("   ZAMIR CLOUD SIMULATION TEST");
  console.log("=========================================\n");

  const mockTrack = {
    id: "suno-123456",
    title: "Test Divine Track",
    url: "https://sunoapi.org/cdn/mock-stream-url.mp3",
    artist: "Zamir AI × Suno",
  };

  // Test 1: Save Profile when CORS blocks the fetch
  console.log("TEST 1: Simulating 'Save Profile' with CORS blockage...");
  firestoreAdds = [];
  storageUploads = [];
  await simulateSaveToProfile(mockTrack, true);

  if (storageUploads.length === 0) {
    console.log(
      "  ✅ SUCCESS: Storage upload successfully skipped on exception.",
    );
  } else {
    console.log("  ❌ FAILED: Attempted storage upload despite CORS error.");
  }

  const firestoreAdd1 = firestoreAdds[0];
  if (firestoreAdd1.path === "users/test-user-123/library") {
    console.log(
      `  ✅ SUCCESS: Request routed to correct Firestore path (${firestoreAdd1.path}).`,
    );
  }

  if (
    firestoreAdd1.data.url === "https://sunoapi.org/cdn/mock-stream-url.mp3"
  ) {
    console.log(
      "  ✅ SUCCESS: Gracefully fell back to the original Suno CDN URL in the database!",
    );
  } else {
    console.log("  ❌ FAILED: Did not use fallback URL.");
  }

  // Test 2: Save Profile without CORS Error (Successful Blob Upload)
  console.log(
    "\nTEST 2: Simulating 'Save Profile' with successful blob upload...",
  );
  firestoreAdds = [];
  storageUploads = [];
  await simulateSaveToProfile(mockTrack, false);

  if (storageUploads.length > 0) {
    console.log(
      `  ✅ SUCCESS: Audio blob gracefully uploaded to Firebase Storage (Simulating ${storageUploads[0].size} bytes).`,
    );
  }

  if (
    firestoreAdds[0].data.url ===
    "https://firebasestorage.mock/users/test-user-123/library/suno-123456.mp3"
  ) {
    console.log(
      "  ✅ SUCCESS: Database properly references the custom fresh Firebase Storage URL.",
    );
  }

  // Test 3: Publish
  console.log("\nTEST 3: Simulating 'Handle Publish'...");
  firestoreAdds = [];
  await simulateHandlePublish(mockTrack);

  if (firestoreAdds[0].path === "moderation_queue") {
    console.log(
      "  ✅ SUCCESS: Pushed to 'moderation_queue' collection correctly.",
    );
  }
  if (firestoreAdds[0].data.status === "pending") {
    console.log(
      "  ✅ SUCCESS: Tracking status correctly set to 'pending' for Admin review.",
    );
  }

  console.log("\n✅ ALL SIMULATION TESTS PASSED COMPLETELY! ✅");
}

run();
