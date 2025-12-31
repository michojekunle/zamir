import 'package:flutter/material.dart';
import '../models/app_models.dart';

class MusicViewModel extends ChangeNotifier {
  Song? _currentSong;
  bool _isPlaying = false;
  Duration _currentPosition = Duration.zero;
  List<Song> _recentlyPlayed = [];
  List<Song> _favorites = [];

  Song? get currentSong => _currentSong;
  bool get isPlaying => _isPlaying;
  Duration get currentPosition => _currentPosition;
  List<Song> get recentlyPlayed => _recentlyPlayed;
  List<Song> get favorites => _favorites;

  // Sample songs
  List<Song> get sampleSongs => [
    Song(
      id: '1',
      title: 'Psalm 23',
      verse: 'The Lord is my shepherd',
      scripture: 'Psalm 23:1-6',
      imageUrl: 'https://picsum.photos/400/400?random=1',
      duration: const Duration(minutes: 3, seconds: 45),
      themes: ['Peace', 'Comfort'],
    ),
    Song(
      id: '2',
      title: 'Isaiah 40:31',
      verse: 'They shall mount up with wings',
      scripture: 'Isaiah 40:31',
      imageUrl: 'https://picsum.photos/400/400?random=2',
      duration: const Duration(minutes: 4, seconds: 12),
      themes: ['Strength', 'Hope'],
    ),
    Song(
      id: '3',
      title: 'Philippians 4:13',
      verse: 'I can do all things',
      scripture: 'Philippians 4:13',
      imageUrl: 'https://picsum.photos/400/400?random=3',
      duration: const Duration(minutes: 3, seconds: 30),
      themes: ['Strength', 'Faith'],
    ),
  ];

  void playSong(Song song) {
    _currentSong = song;
    _isPlaying = true;
    _currentPosition = Duration.zero;
    
    if (!_recentlyPlayed.any((s) => s.id == song.id)) {
      _recentlyPlayed.insert(0, song);
      if (_recentlyPlayed.length > 10) {
        _recentlyPlayed.removeLast();
      }
    }
    
    notifyListeners();
  }

  void togglePlayPause() {
    _isPlaying = !_isPlaying;
    notifyListeners();
  }

  void pause() {
    _isPlaying = false;
    notifyListeners();
  }

  void resume() {
    _isPlaying = true;
    notifyListeners();
  }

  void seek(Duration position) {
    _currentPosition = position;
    notifyListeners();
  }

  void toggleFavorite(String songId) {
    final song = sampleSongs.firstWhere((s) => s.id == songId);
    
    if (_favorites.any((s) => s.id == songId)) {
      _favorites.removeWhere((s) => s.id == songId);
    } else {
      _favorites.add(song);
    }
    notifyListeners();
  }

  bool isFavorite(String songId) {
    return _favorites.any((s) => s.id == songId);
  }

  void nextSong() {
    if (_currentSong != null && sampleSongs.isNotEmpty) {
      final currentIndex = sampleSongs.indexWhere((s) => s.id == _currentSong!.id);
      final nextIndex = (currentIndex + 1) % sampleSongs.length;
      playSong(sampleSongs[nextIndex]);
    }
  }

  void previousSong() {
    if (_currentSong != null && sampleSongs.isNotEmpty) {
      final currentIndex = sampleSongs.indexWhere((s) => s.id == _currentSong!.id);
      final prevIndex = currentIndex > 0 ? currentIndex - 1 : sampleSongs.length - 1;
      playSong(sampleSongs[prevIndex]);
    }
  }
}