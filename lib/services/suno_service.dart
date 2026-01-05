import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:cloud_firestore/cloud_firestore.dart';

class SunoService {
  // Using environment variable or configuration for API key
  // For production, use flutter_dotenv or similar
  static const String _baseUrl = 'https://api.sunoapi.org/api/v1';
  String? _apiKey;

  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  SunoService({String? apiKey}) : _apiKey = apiKey;

  void setApiKey(String key) {
    _apiKey = key;
  }

  // Generate music from scripture/prompt
  Future<GenerationResult> generateFromScripture({
    required String scripture,
    required String verse,
    String? mood,
    String style = 'worship, spiritual, peaceful',
  }) async {
    if (_apiKey == null || _apiKey!.isEmpty) {
      return GenerationResult.failure('API key not configured');
    }

    try {
      // Create a descriptive prompt for the AI
      final prompt = _buildPrompt(scripture, verse, mood, style);

      // Start the generation
      final response = await http.post(
        Uri.parse('$_baseUrl/generate'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_apiKey',
        },
        body: jsonEncode({
          'prompt': prompt,
          'lyrics': verse,
          'style': style,
          'wait_audio': false, // We'll poll for completion
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        final taskId = data['task_id'] ?? data['id'];

        if (taskId != null) {
          return GenerationResult.pending(taskId);
        }
        return GenerationResult.failure('No task ID received');
      } else {
        final error = jsonDecode(response.body);
        return GenerationResult.failure(
          error['message'] ?? 'Generation failed',
        );
      }
    } catch (e) {
      return GenerationResult.failure('Network error: ${e.toString()}');
    }
  }

  // Poll for generation completion
  Future<GenerationResult> checkGenerationStatus(String taskId) async {
    if (_apiKey == null || _apiKey!.isEmpty) {
      return GenerationResult.failure('API key not configured');
    }

    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/generations/$taskId'),
        headers: {'Authorization': 'Bearer $_apiKey'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final status = data['status']?.toString().toLowerCase();

        if (status == 'completed' || status == 'complete') {
          return GenerationResult.success(
            GeneratedSong(
              id: taskId,
              title: data['title'] ?? 'Generated Song',
              audioUrl: data['audio_url'] ?? data['audio'],
              lyrics: data['lyrics'] ?? '',
              duration: Duration(seconds: data['duration'] ?? 180),
              createdAt: DateTime.now(),
            ),
          );
        } else if (status == 'failed' || status == 'error') {
          return GenerationResult.failure(data['error'] ?? 'Generation failed');
        } else {
          // Still processing
          final progress = data['progress'] ?? 0;
          return GenerationResult.processing(taskId, progress.toDouble());
        }
      }
      return GenerationResult.failure('Failed to check status');
    } catch (e) {
      return GenerationResult.failure('Network error: ${e.toString()}');
    }
  }

  // Save generated song to Firestore
  Future<void> saveGeneratedSong({
    required String userId,
    required GeneratedSong song,
    required String scripture,
    required String verse,
  }) async {
    await _firestore
        .collection('users')
        .doc(userId)
        .collection('generated_songs')
        .doc(song.id)
        .set({
          'title': song.title,
          'audioUrl': song.audioUrl,
          'lyrics': song.lyrics,
          'scripture': scripture,
          'verse': verse,
          'duration': song.duration.inSeconds,
          'createdAt': FieldValue.serverTimestamp(),
        });
  }

  // Get user's generated songs
  Stream<List<GeneratedSong>> streamGeneratedSongs(String userId) {
    return _firestore
        .collection('users')
        .doc(userId)
        .collection('generated_songs')
        .orderBy('createdAt', descending: true)
        .limit(20)
        .snapshots()
        .map(
          (snapshot) => snapshot.docs.map((doc) {
            final data = doc.data();
            return GeneratedSong(
              id: doc.id,
              title: data['title'] ?? '',
              audioUrl: data['audioUrl'] ?? '',
              lyrics: data['lyrics'] ?? '',
              scripture: data['scripture'],
              verse: data['verse'],
              duration: Duration(seconds: data['duration'] ?? 0),
              createdAt:
                  (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
            );
          }).toList(),
        );
  }

  String _buildPrompt(
    String scripture,
    String verse,
    String? mood,
    String style,
  ) {
    final moodText = mood != null ? 'The mood should be $mood. ' : '';
    return '''
Create a beautiful, worshipful song based on this scripture:
"$verse" - $scripture

${moodText}Style: $style
Make it inspiring, peaceful, and spiritually uplifting.
''';
  }
}

class GeneratedSong {
  final String id;
  final String title;
  final String audioUrl;
  final String lyrics;
  final String? scripture;
  final String? verse;
  final Duration duration;
  final DateTime createdAt;

  GeneratedSong({
    required this.id,
    required this.title,
    required this.audioUrl,
    required this.lyrics,
    this.scripture,
    this.verse,
    required this.duration,
    required this.createdAt,
  });
}

class GenerationResult {
  final GenerationStatus status;
  final GeneratedSong? song;
  final String? taskId;
  final double? progress;
  final String? error;

  GenerationResult._({
    required this.status,
    this.song,
    this.taskId,
    this.progress,
    this.error,
  });

  factory GenerationResult.success(GeneratedSong song) {
    return GenerationResult._(status: GenerationStatus.completed, song: song);
  }

  factory GenerationResult.pending(String taskId) {
    return GenerationResult._(status: GenerationStatus.pending, taskId: taskId);
  }

  factory GenerationResult.processing(String taskId, double progress) {
    return GenerationResult._(
      status: GenerationStatus.processing,
      taskId: taskId,
      progress: progress,
    );
  }

  factory GenerationResult.failure(String error) {
    return GenerationResult._(status: GenerationStatus.failed, error: error);
  }
}

enum GenerationStatus { pending, processing, completed, failed }
