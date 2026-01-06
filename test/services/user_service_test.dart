import 'package:flutter_test/flutter_test.dart';
import 'package:fake_cloud_firestore/fake_cloud_firestore.dart';
import 'package:zamir_app/services/user_service.dart';

void main() {
  late UserService userService;
  late FakeFirebaseFirestore fakeFirestore;

  setUp(() {
    fakeFirestore = FakeFirebaseFirestore();
    userService = UserService(firestore: fakeFirestore);
  });

  group('createOrUpdateUser', () {
    test('should create user document', () async {
      await userService.createOrUpdateUser(
        uid: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      );

      final snapshot = await fakeFirestore
          .collection('users')
          .doc('user123')
          .get();

      expect(snapshot.exists, true);
      expect(snapshot.data()?['email'], 'test@example.com');
      expect(snapshot.data()?['name'], 'Test User');
    });

    test('should merge data on update', () async {
      // Create initial
      await fakeFirestore.collection('users').doc('user123').set({
        'email': 'original@test.com',
        'foo': 'bar',
      });

      // Update
      await userService.createOrUpdateUser(
        uid: 'user123',
        email: 'new@test.com',
      );

      final snapshot = await fakeFirestore
          .collection('users')
          .doc('user123')
          .get();

      expect(snapshot.data()?['email'], 'new@test.com');
      expect(snapshot.data()?['foo'], 'bar'); // Should be preserved
    });
  });

  group('getUserProfile', () {
    test('should return profile when exists', () async {
      await fakeFirestore.collection('users').doc('user123').set({
        'email': 'test@example.com',
        'name': 'Found User',
      });

      final profile = await userService.getUserProfile('user123');

      expect(profile, isNotNull);
      expect(profile?.email, 'test@example.com');
      expect(profile?.name, 'Found User');
    });

    test('should return null when not exists', () async {
      final profile = await userService.getUserProfile('non_existent');
      expect(profile, isNull);
    });
  });

  group('isHandleAvailable', () {
    test('should return true if no user has handle', () async {
      final available = await userService.isHandleAvailable('new_handle');
      expect(available, true);
    });

    test('should return false if handle taken', () async {
      await fakeFirestore.collection('users').add({'handle': 'taken_handle'});

      final available = await userService.isHandleAvailable('taken_handle');
      expect(available, false);
    });
  });
}
