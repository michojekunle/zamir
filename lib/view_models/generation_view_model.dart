import 'dart:async';
import 'package:flutter/material.dart';
import '../services/suno_service.dart';
import '../services/user_service.dart';

class GenerationViewModel extends ChangeNotifier {
  final SunoService _sunoService;
  final UserService _userService;

  GenerationViewModel({SunoService? sunoService, UserService? userService})
    : _sunoService = sunoService ?? SunoService(),
      _userService = userService ?? UserService();

  // Generation state
  GenerationState _state = GenerationState.idle;
  GenerationState get state => _state;

  // Current generation
  String _currentTaskId = '';
  double _progress = 0.0;
  double get progress => _progress;
  String _error = '';
  String get error => _error;

  // Generated song
  GeneratedSong? _generatedSong;
  GeneratedSong? get generatedSong => _generatedSong;

  // Input fields
  String _scripture = '';
  String _verse = '';
  String? _selectedMood;

  String get scripture => _scripture;
  String get verse => _verse;
  String? get selectedMood => _selectedMood;

  // User's generated songs history
  List<GeneratedSong> _generatedSongs = [];
  List<GeneratedSong> get generatedSongs => _generatedSongs;

  Timer? _pollingTimer;

  void setApiKey(String key) {
    _sunoService.setApiKey(key);
  }

  void setScripture(String value) {
    _scripture = value;
    notifyListeners();
  }

  void setVerse(String value) {
    _verse = value;
    notifyListeners();
  }

  void setMood(String? mood) {
    _selectedMood = mood;
    notifyListeners();
  }

  bool get canGenerate =>
      _verse.trim().isNotEmpty && _scripture.trim().isNotEmpty;

  // Start generation
  Future<void> generate() async {
    if (!canGenerate) return;

    _state = GenerationState.generating;
    _progress = 0.0;
    _error = '';
    notifyListeners();

    final result = await _sunoService.generateFromScripture(
      scripture: _scripture,
      verse: _verse,
      mood: _selectedMood,
    );

    if (result.status == GenerationStatus.pending) {
      _currentTaskId = result.taskId!;
      _startPolling();
    } else if (result.status == GenerationStatus.failed) {
      _state = GenerationState.error;
      _error = result.error ?? 'Generation failed';
      notifyListeners();
    }
  }

  void _startPolling() {
    _pollingTimer?.cancel();
    _pollingTimer = Timer.periodic(const Duration(seconds: 3), (timer) async {
      await _checkStatus();
    });
  }

  Future<void> _checkStatus() async {
    if (_currentTaskId.isEmpty) return;

    final result = await _sunoService.checkGenerationStatus(_currentTaskId);

    switch (result.status) {
      case GenerationStatus.completed:
        _pollingTimer?.cancel();
        _generatedSong = result.song;
        _state = GenerationState.completed;
        notifyListeners();
        break;
      case GenerationStatus.processing:
        _progress = result.progress ?? _progress + 0.1;
        if (_progress > 0.95) _progress = 0.95;
        notifyListeners();
        break;
      case GenerationStatus.failed:
        _pollingTimer?.cancel();
        _state = GenerationState.error;
        _error = result.error ?? 'Generation failed';
        notifyListeners();
        break;
      case GenerationStatus.pending:
        // Still waiting, increment progress slightly
        _progress = (_progress + 0.05).clamp(0.0, 0.3);
        notifyListeners();
        break;
    }
  }

  // Save generated song to user's library
  Future<void> saveToLibrary(String userId) async {
    if (_generatedSong == null) return;

    await _sunoService.saveGeneratedSong(
      userId: userId,
      song: _generatedSong!,
      scripture: _scripture,
      verse: _verse,
    );
  }

  // Load user's generated songs
  void loadGeneratedSongs(String userId) {
    _sunoService.streamGeneratedSongs(userId).listen((songs) {
      _generatedSongs = songs;
      notifyListeners();
    });
  }

  // Reset state for new generation
  void reset() {
    _pollingTimer?.cancel();
    _state = GenerationState.idle;
    _currentTaskId = '';
    _progress = 0.0;
    _error = '';
    _generatedSong = null;
    _scripture = '';
    _verse = '';
    _selectedMood = null;
    notifyListeners();
  }

  // Set scripture from suggestion
  void setFromSuggestion(String reference, String verseText) {
    _scripture = reference;
    _verse = verseText;
    notifyListeners();
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }
}

enum GenerationState { idle, generating, completed, error }
