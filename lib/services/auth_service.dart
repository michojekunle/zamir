import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';

class AuthService {
  final firebase_auth.FirebaseAuth _auth;
  final GoogleSignIn _googleSignIn;

  AuthService({firebase_auth.FirebaseAuth? auth, GoogleSignIn? googleSignIn})
    : _auth = auth ?? firebase_auth.FirebaseAuth.instance,
      _googleSignIn = googleSignIn ?? GoogleSignIn();

  // Current user stream
  Stream<firebase_auth.User?> get authStateChanges => _auth.authStateChanges();

  // Current user
  firebase_auth.User? get currentUser => _auth.currentUser;

  // Sign in with email and password
  Future<AuthResult> signInWithEmailPassword(
    String email,
    String password,
  ) async {
    try {
      final credential = await _auth.signInWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );
      return AuthResult.success(credential.user);
    } on firebase_auth.FirebaseAuthException catch (e) {
      return AuthResult.failure(_mapFirebaseError(e.code));
    } catch (e) {
      return AuthResult.failure('An unexpected error occurred');
    }
  }

  // Sign up with email and password
  Future<AuthResult> signUpWithEmailPassword(
    String email,
    String password,
    String name,
  ) async {
    try {
      final credential = await _auth.createUserWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );

      // Update display name
      await credential.user?.updateDisplayName(name);
      await credential.user?.reload();

      return AuthResult.success(_auth.currentUser);
    } on firebase_auth.FirebaseAuthException catch (e) {
      return AuthResult.failure(_mapFirebaseError(e.code));
    } catch (e) {
      return AuthResult.failure('An unexpected error occurred');
    }
  }

  // Sign in with Google
  Future<AuthResult> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        return AuthResult.failure('Google sign in cancelled');
      }

      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;
      final credential = firebase_auth.GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final userCredential = await _auth.signInWithCredential(credential);
      return AuthResult.success(userCredential.user);
    } catch (e) {
      return AuthResult.failure('Google sign in failed: ${e.toString()}');
    }
  }

  // Sign in with Apple
  Future<AuthResult> signInWithApple() async {
    try {
      final appleCredential = await SignInWithApple.getAppleIDCredential(
        scopes: [
          AppleIDAuthorizationScopes.email,
          AppleIDAuthorizationScopes.fullName,
        ],
      );

      final oauthCredential = firebase_auth.OAuthProvider('apple.com')
          .credential(
            idToken: appleCredential.identityToken,
            accessToken: appleCredential.authorizationCode,
          );

      final userCredential = await _auth.signInWithCredential(oauthCredential);

      // Update display name if available from Apple
      if (appleCredential.givenName != null &&
          userCredential.user?.displayName == null) {
        final fullName =
            '${appleCredential.givenName ?? ''} ${appleCredential.familyName ?? ''}'
                .trim();
        if (fullName.isNotEmpty) {
          await userCredential.user?.updateDisplayName(fullName);
        }
      }

      return AuthResult.success(userCredential.user);
    } catch (e) {
      return AuthResult.failure('Apple sign in failed: ${e.toString()}');
    }
  }

  // Send password reset email
  Future<AuthResult> sendPasswordResetEmail(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email.trim());
      return AuthResult.success(null);
    } on firebase_auth.FirebaseAuthException catch (e) {
      return AuthResult.failure(_mapFirebaseError(e.code));
    } catch (e) {
      return AuthResult.failure('Failed to send reset email');
    }
  }

  // Sign out
  Future<void> signOut() async {
    await Future.wait([_auth.signOut(), _googleSignIn.signOut()]);
  }

  // Map Firebase error codes to user-friendly messages
  String _mapFirebaseError(String code) {
    switch (code) {
      case 'user-not-found':
        return 'No account found with this email';
      case 'wrong-password':
        return 'Incorrect password';
      case 'email-already-in-use':
        return 'An account already exists with this email';
      case 'weak-password':
        return 'Password is too weak';
      case 'invalid-email':
        return 'Invalid email address';
      case 'user-disabled':
        return 'This account has been disabled';
      case 'too-many-requests':
        return 'Too many attempts. Please try again later';
      case 'invalid-credential':
        return 'Invalid email or password';
      default:
        return 'Authentication failed. Please try again';
    }
  }
}

// Auth result wrapper
class AuthResult {
  final bool isSuccess;
  final firebase_auth.User? user;
  final String? error;

  AuthResult._({required this.isSuccess, this.user, this.error});

  factory AuthResult.success(firebase_auth.User? user) {
    return AuthResult._(isSuccess: true, user: user);
  }

  factory AuthResult.failure(String error) {
    return AuthResult._(isSuccess: false, error: error);
  }
}
