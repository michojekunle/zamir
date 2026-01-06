import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;
import '../services/auth_service.dart';
import '../services/user_service.dart';

class AuthViewModel extends ChangeNotifier {
  final AuthService _authService;
  final UserService _userService;

  // Auth state
  firebase_auth.User? _firebaseUser;
  UserProfile? _userProfile;
  bool _isLoading = false;
  String? _error;
  StreamSubscription? _authSubscription;
  StreamSubscription? _profileSubscription;

  // Getters
  firebase_auth.User? get firebaseUser => _firebaseUser;
  UserProfile? get userProfile => _userProfile;
  bool get isAuthenticated => _firebaseUser != null;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasCompletedOnboarding => _userProfile?.onboardingComplete ?? false;

  // User display properties
  String get displayName =>
      _userProfile?.name ?? _firebaseUser?.displayName ?? 'User';
  String get email => _firebaseUser?.email ?? '';
  String? get handle => _userProfile?.handle;
  String? get photoUrl => _firebaseUser?.photoURL ?? _userProfile?.profileImage;

  AuthViewModel({AuthService? authService, UserService? userService})
    : _authService = authService ?? AuthService(),
      _userService = userService ?? UserService() {
    _init();
  }

  void _init() {
    _authSubscription = _authService.authStateChanges.listen((user) {
      _firebaseUser = user;
      if (user != null) {
        _loadUserProfile(user.uid);
      } else {
        _userProfile = null;
        _profileSubscription?.cancel();
      }
      notifyListeners();
    });
  }

  void _loadUserProfile(String uid) {
    _profileSubscription?.cancel();
    _profileSubscription = _userService.streamUserProfile(uid).listen((
      profile,
    ) {
      _userProfile = profile;
      notifyListeners();
    });
  }

  // Sign in with email and password
  Future<bool> signIn(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final result = await _authService.signInWithEmailPassword(email, password);

    _isLoading = false;
    if (result.isSuccess) {
      notifyListeners();
      return true;
    } else {
      _error = result.error;
      notifyListeners();
      return false;
    }
  }

  // Sign up with email and password
  Future<bool> signUp(String email, String password, String name) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final result = await _authService.signUpWithEmailPassword(
      email,
      password,
      name,
    );

    if (result.isSuccess && result.user != null) {
      // Create user profile in Firestore
      await _userService.createOrUpdateUser(
        uid: result.user!.uid,
        email: email,
        name: name,
        onboardingComplete: false,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } else {
      _isLoading = false;
      _error = result.error;
      notifyListeners();
      return false;
    }
  }

  // Sign in with Google
  Future<bool> signInWithGoogle() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final result = await _authService.signInWithGoogle();

    if (result.isSuccess && result.user != null) {
      // Create/update user profile
      await _userService.createOrUpdateUser(
        uid: result.user!.uid,
        email: result.user!.email ?? '',
        name: result.user!.displayName,
        profileImage: result.user!.photoURL,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } else {
      _isLoading = false;
      _error = result.error;
      notifyListeners();
      return false;
    }
  }

  // Sign in with Apple
  Future<bool> signInWithApple() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final result = await _authService.signInWithApple();

    if (result.isSuccess && result.user != null) {
      await _userService.createOrUpdateUser(
        uid: result.user!.uid,
        email: result.user!.email ?? '',
        name: result.user!.displayName,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } else {
      _isLoading = false;
      _error = result.error;
      notifyListeners();
      return false;
    }
  }

  // Send password reset email
  Future<bool> sendPasswordResetEmail(String email) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final result = await _authService.sendPasswordResetEmail(email);

    _isLoading = false;
    if (result.isSuccess) {
      notifyListeners();
      return true;
    } else {
      _error = result.error;
      notifyListeners();
      return false;
    }
  }

  // Sign out
  Future<void> signOut() async {
    _isLoading = true;
    notifyListeners();

    await _authService.signOut();

    _isLoading = false;
    _firebaseUser = null;
    _userProfile = null;
    notifyListeners();
  }

  // Complete onboarding
  Future<void> completeOnboarding({
    required String handle,
    required List<String> genres,
    required List<String> inspirations,
    required List<String> themes,
  }) async {
    if (_firebaseUser == null) return;

    await _userService.saveOnboardingPreferences(
      uid: _firebaseUser!.uid,
      handle: handle,
      genres: genres,
      inspirations: inspirations,
      themes: themes,
    );
  }

  // Check if handle is available
  Future<bool> isHandleAvailable(String handle) async {
    return await _userService.isHandleAvailable(handle);
  }

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }

  @override
  void dispose() {
    _authSubscription?.cancel();
    _profileSubscription?.cancel();
    super.dispose();
  }
}
