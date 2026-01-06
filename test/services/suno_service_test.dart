import 'package:flutter_test/flutter_test.dart';
import 'package:fake_cloud_firestore/fake_cloud_firestore.dart';
import 'package:mockito/mockito.dart';
import 'package:http/http.dart' as http;
import 'package:zamir_app/services/suno_service.dart';
import 'dart:convert';
import '../helpers/test_helpers.mocks.dart';

void main() {
  late SunoService sunoService;
  late MockClient mockClient;
  late FakeFirebaseFirestore fakeFirestore;

  setUp(() {
    mockClient = MockClient();
    fakeFirestore = FakeFirebaseFirestore();
    sunoService = SunoService(
      apiKey: 'test-api-key',
      firestore: fakeFirestore,
      client: mockClient,
    );
  });

  group('generateFromScripture', () {
    test('should return pending when success', () async {
      // Mock API response
      when(
        mockClient.post(
          any,
          headers: anyNamed('headers'),
          body: anyNamed('body'),
        ),
      ).thenAnswer(
        (_) async => http.Response(jsonEncode({'id': 'task_123'}), 200),
      );

      final result = await sunoService.generateFromScripture(
        scripture: 'Psalm 23',
        verse: 'The Lord is my shepherd',
      );

      expect(result.status, GenerationStatus.pending);
      expect(result.taskId, 'task_123');
    });

    test('should return failure on API error', () async {
      when(
        mockClient.post(
          any,
          headers: anyNamed('headers'),
          body: anyNamed('body'),
        ),
      ).thenAnswer(
        (_) async =>
            http.Response(jsonEncode({'message': 'Insufficient credits'}), 400),
      );

      final result = await sunoService.generateFromScripture(
        scripture: 'Psalm 23',
        verse: 'Test',
      );

      expect(result.status, GenerationStatus.failed);
      expect(result.error, contains('Insufficient credits'));
    });
  });

  group('checkGenerationStatus', () {
    test('should return completed with song when done', () async {
      when(mockClient.get(any, headers: anyNamed('headers'))).thenAnswer(
        (_) async => http.Response(
          jsonEncode({
            'status': 'completed',
            'id': 'task_123',
            'title': 'Generated Song',
            'audio_url': 'http://audio.url',
            'lyrics': 'Lyrics',
            'duration': 180,
          }),
          200,
        ),
      );

      final result = await sunoService.checkGenerationStatus('task_123');

      expect(result.status, GenerationStatus.completed);
      expect(result.song, isNotNull);
      expect(result.song?.title, 'Generated Song');
    });
  });

  group('saveGeneratedSong', () {
    test('should save song to firestore', () async {
      final song = GeneratedSong(
        id: 'song_1',
        title: 'Title',
        audioUrl: 'url',
        lyrics: 'lyrics',
        duration: Duration(minutes: 3),
        createdAt: DateTime.now(),
      );

      await sunoService.saveGeneratedSong(
        userId: 'user_1',
        song: song,
        scripture: 'Psalm 23',
        verse: 'The Lord is my shepherd',
      );

      final snapshot = await fakeFirestore
          .collection('users')
          .doc('user_1')
          .collection('generated_songs')
          .doc('song_1')
          .get();

      expect(snapshot.exists, true);
      expect(snapshot.data()?['title'], 'Title');
    });
  });
}
