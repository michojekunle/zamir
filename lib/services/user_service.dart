import 'package:cloud_firestore/cloud_firestore.dart';

class UserService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  CollectionReference get _usersCollection => _firestore.collection('users');

  // Create or update user profile
  Future<void> createOrUpdateUser({
    required String uid,
    required String email,
    String? name,
    String? profileImage,
    List<String>? favoriteGenres,
    List<String>? inspirations,
    List<String>? themes,
    bool? onboardingComplete,
  }) async {
    final userData = <String, dynamic>{
      'email': email,
      'updatedAt': FieldValue.serverTimestamp(),
    };

    if (name != null) userData['name'] = name;
    if (profileImage != null) userData['profileImage'] = profileImage;
    if (favoriteGenres != null) userData['favoriteGenres'] = favoriteGenres;
    if (inspirations != null) userData['inspirations'] = inspirations;
    if (themes != null) userData['themes'] = themes;
    if (onboardingComplete != null)
      userData['onboardingComplete'] = onboardingComplete;

    await _usersCollection.doc(uid).set(userData, SetOptions(merge: true));
  }

  // Get user profile
  Future<UserProfile?> getUserProfile(String uid) async {
    final doc = await _usersCollection.doc(uid).get();
    if (!doc.exists) return null;

    final data = doc.data() as Map<String, dynamic>;
    return UserProfile.fromMap(uid, data);
  }

  // Stream user profile changes
  Stream<UserProfile?> streamUserProfile(String uid) {
    return _usersCollection.doc(uid).snapshots().map((doc) {
      if (!doc.exists) return null;
      final data = doc.data() as Map<String, dynamic>;
      return UserProfile.fromMap(uid, data);
    });
  }

  // Save onboarding preferences
  Future<void> saveOnboardingPreferences({
    required String uid,
    required String handle,
    required List<String> genres,
    required List<String> inspirations,
    required List<String> themes,
  }) async {
    await _usersCollection.doc(uid).set({
      'handle': handle,
      'favoriteGenres': genres,
      'inspirations': inspirations,
      'themes': themes,
      'onboardingComplete': true,
      'updatedAt': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));
  }

  // Check if handle is available
  Future<bool> isHandleAvailable(String handle) async {
    final query = await _usersCollection
        .where('handle', isEqualTo: handle.toLowerCase())
        .limit(1)
        .get();
    return query.docs.isEmpty;
  }
}

class UserProfile {
  final String uid;
  final String email;
  final String? name;
  final String? handle;
  final String? profileImage;
  final List<String> favoriteGenres;
  final List<String> inspirations;
  final List<String> themes;
  final bool onboardingComplete;

  UserProfile({
    required this.uid,
    required this.email,
    this.name,
    this.handle,
    this.profileImage,
    this.favoriteGenres = const [],
    this.inspirations = const [],
    this.themes = const [],
    this.onboardingComplete = false,
  });

  factory UserProfile.fromMap(String uid, Map<String, dynamic> data) {
    return UserProfile(
      uid: uid,
      email: data['email'] ?? '',
      name: data['name'],
      handle: data['handle'],
      profileImage: data['profileImage'],
      favoriteGenres: List<String>.from(data['favoriteGenres'] ?? []),
      inspirations: List<String>.from(data['inspirations'] ?? []),
      themes: List<String>.from(data['themes'] ?? []),
      onboardingComplete: data['onboardingComplete'] ?? false,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'email': email,
      'name': name,
      'handle': handle,
      'profileImage': profileImage,
      'favoriteGenres': favoriteGenres,
      'inspirations': inspirations,
      'themes': themes,
      'onboardingComplete': onboardingComplete,
    };
  }
}
