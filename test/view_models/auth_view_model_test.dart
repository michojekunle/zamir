import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:zamir_app/view_models/auth_view_model.dart';
import 'package:zamir_app/services/auth_service.dart';
import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;
import 'package:zamir_app/services/user_service.dart';
import '../helpers/test_helpers.mocks.dart';

void main() {
  late AuthViewModel viewModel;
  late MockAuthService mockAuthService;
  late MockUserService mockUserService;

  setUp(() {
    mockAuthService = MockAuthService();
    mockUserService = MockUserService();

    // Stub authStateChanges to return an empty stream by default
    when(
      mockAuthService.authStateChanges,
    ).thenAnswer((_) => Stream.value(null));

    viewModel = AuthViewModel(
      authService: mockAuthService,
      userService: mockUserService,
    );
  });

  tearDown(() {
    viewModel.dispose();
  });

  group('Initial State', () {
    test('should NOT be authenticated initially', () {
      expect(viewModel.isAuthenticated, false);
      expect(viewModel.firebaseUser, isNull);
    });

    test('should have no error', () {
      expect(viewModel.error, isNull);
    });

    test('should not be loading', () {
      expect(viewModel.isLoading, false);
    });
  });

  group('signInWithEmailPassword', () {
    test('should call authService.signInWithEmailPassword', () async {
      when(
        mockAuthService.signInWithEmailPassword(any, any),
      ).thenAnswer((_) async => AuthResult.success(null));

      await viewModel.signIn('test@example.com', 'password');

      verify(
        mockAuthService.signInWithEmailPassword('test@example.com', 'password'),
      ).called(1);
    });

    test('should set loaded state on success', () async {
      when(
        mockAuthService.signInWithEmailPassword(any, any),
      ).thenAnswer((_) async => AuthResult.success(null));

      final success = await viewModel.signIn('test@example.com', 'pass');

      expect(success, true);
      expect(viewModel.isLoading, false);
      expect(viewModel.error, isNull);
    });

    test('should set error state on failure', () async {
      when(
        mockAuthService.signInWithEmailPassword(any, any),
      ).thenAnswer((_) async => AuthResult.failure('Login failed'));

      final success = await viewModel.signIn('test@example.com', 'pass');

      expect(success, false);
      expect(viewModel.isLoading, false);
      expect(viewModel.error, 'Login failed');
    });

    test('should notify listeners', () async {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      when(
        mockAuthService.signInWithEmailPassword(any, any),
      ).thenAnswer((_) async => AuthResult.success(null));

      await viewModel.signIn('test@email.com', 'pass');

      expect(notified, true);
    });
  });

  group('signUpWithEmailPassword', () {
    test('should call authService.signUpWithEmailPassword', () async {
      when(
        mockAuthService.signUpWithEmailPassword(any, any, any),
      ).thenAnswer((_) async => AuthResult.success(null));

      // Stub UserService.createOrUpdateUser as it might be called
      when(
        mockUserService.createOrUpdateUser(
          uid: anyNamed('uid'),
          email: anyNamed('email'),
          name: anyNamed('name'),
        ),
      ).thenAnswer((_) async {});

      await viewModel.signUp('test@example.com', 'password', 'Test User');

      verify(
        mockAuthService.signUpWithEmailPassword(
          'test@example.com',
          'password',
          'Test User',
        ),
      ).called(1);
    });
  });

  group('signOut', () {
    test('should call authService.signOut', () async {
      when(mockAuthService.signOut()).thenAnswer((_) async {});

      await viewModel.signOut();

      verify(mockAuthService.signOut()).called(1);
    });
  });

  group('AuthStateChanges', () {
    test('should update user when auth state changes', () async {
      final mockUser = MockUser();
      when(mockUser.uid).thenReturn('123');
      when(mockUser.email).thenReturn('test@example.com');

      // Re-create VM with a stream that emits a user
      when(
        mockAuthService.authStateChanges,
      ).thenAnswer((_) => Stream.value(mockUser));

      // Stub user profile loading
      when(mockUserService.streamUserProfile(any)).thenAnswer(
        (_) => Stream.value(UserProfile(uid: '123', email: 'test@example.com')),
      );

      viewModel = AuthViewModel(
        authService: mockAuthService,
        userService: mockUserService,
      );

      // Wait for stream event to propagate
      await Future.delayed(Duration.zero);

      expect(viewModel.firebaseUser, mockUser);
      expect(viewModel.isAuthenticated, true);
    });
  });
}
