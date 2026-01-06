import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:zamir_app/services/auth_service.dart';
import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;
import '../helpers/test_helpers.mocks.dart';

void main() {
  late AuthService authService;
  late MockFirebaseAuth mockFirebaseAuth;
  late MockGoogleSignIn mockGoogleSignIn;
  late MockUserCredential mockUserCredential;
  late MockUser mockUser;

  setUp(() {
    mockFirebaseAuth = MockFirebaseAuth();
    mockGoogleSignIn = MockGoogleSignIn();
    mockUserCredential = MockUserCredential();
    mockUser = MockUser();

    authService = AuthService(
      auth: mockFirebaseAuth,
      googleSignIn: mockGoogleSignIn,
    );
  });

  group('signInWithEmailPassword', () {
    test('should return success when firebase auth succeeds', () async {
      // Setup
      when(
        mockFirebaseAuth.signInWithEmailAndPassword(
          email: anyNamed('email'),
          password: anyNamed('password'),
        ),
      ).thenAnswer((_) async => mockUserCredential);

      when(mockUserCredential.user).thenReturn(mockUser);

      // Act
      final result = await authService.signInWithEmailPassword(
        'test@test.com',
        '123456',
      );

      // Assert
      expect(result.isSuccess, true);
      expect(result.user, mockUser);
      verify(
        mockFirebaseAuth.signInWithEmailAndPassword(
          email: 'test@test.com',
          password: '123456',
        ),
      ).called(1);
    });

    test('should return failure when firebase auth throws', () async {
      // Setup
      when(
        mockFirebaseAuth.signInWithEmailAndPassword(
          email: anyNamed('email'),
          password: anyNamed('password'),
        ),
      ).thenThrow(firebase_auth.FirebaseAuthException(code: 'user-not-found'));

      // Act
      final result = await authService.signInWithEmailPassword(
        'test@test.com',
        '123456',
      );

      // Assert
      expect(result.isSuccess, false);
      expect(result.error, contains('No account found'));
    });
  });

  group('signOut', () {
    test('should call signOut on firebase and google', () async {
      when(mockFirebaseAuth.signOut()).thenAnswer((_) async {});
      when(mockGoogleSignIn.signOut()).thenAnswer((_) async => null);

      await authService.signOut();

      verify(mockFirebaseAuth.signOut()).called(1);
      verify(mockGoogleSignIn.signOut()).called(1);
    });
  });
}
