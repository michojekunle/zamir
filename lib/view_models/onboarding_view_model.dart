import 'package:flutter/material.dart';
import '../models/app_models.dart';

class OnboardingViewModel extends ChangeNotifier {
  String _userName = '';
  List<Genre> _selectedGenres = [];
  List<String> _selectedInspirations = [];
  List<String> _selectedThemes = [];
  
  // Available genres
  final List<Genre> _availableGenres = [
    Genre(id: '1', name: 'Psalms', icon: '🎵'),
    Genre(id: '2', name: 'Worship', icon: '🙏'),
    Genre(id: '3', name: 'Gospel', icon: '✝️'),
    Genre(id: '4', name: 'Praise', icon: '🎶'),
    Genre(id: '5', name: 'Contemporary', icon: '🎸'),
    Genre(id: '6', name: 'Traditional', icon: '📖'),
    Genre(id: '7', name: 'Hymns', icon: '⛪'),
  ];

  // Available inspirations
  final List<String> _availableInspirations = [
    'Peace',
    'Faith',
    'Hope',
    'Love',
    'Gratitude',
    'Strength',
    'Joy',
    'Comfort',
    'Healing',
    'Wisdom',
  ];

  // Available themes
  final List<String> _availableThemes = [
    'Morning Devotion',
    'Evening Prayer',
    'Meditation',
    'Thanksgiving',
    'Worship',
    'Bible Study',
    'Reflection',
    'Celebration',
  ];

  String get userName => _userName;
  List<Genre> get selectedGenres => _selectedGenres;
  List<Genre> get availableGenres => _availableGenres;
  List<String> get selectedInspirations => _selectedInspirations;
  List<String> get availableInspirations => _availableInspirations;
  List<String> get selectedThemes => _selectedThemes;
  List<String> get availableThemes => _availableThemes;

  void setUserName(String name) {
    _userName = name;
    notifyListeners();
  }

  void toggleGenre(String genreId) {
    final index = _availableGenres.indexWhere((g) => g.id == genreId);
    if (index != -1) {
      final genre = _availableGenres[index];
      if (_selectedGenres.any((g) => g.id == genreId)) {
        _selectedGenres.removeWhere((g) => g.id == genreId);
      } else {
        _selectedGenres.add(genre);
      }
      notifyListeners();
    }
  }

  bool isGenreSelected(String genreId) {
    return _selectedGenres.any((g) => g.id == genreId);
  }

  void toggleInspiration(String inspiration) {
    if (_selectedInspirations.contains(inspiration)) {
      _selectedInspirations.remove(inspiration);
    } else {
      _selectedInspirations.add(inspiration);
    }
    notifyListeners();
  }

  bool isInspirationSelected(String inspiration) {
    return _selectedInspirations.contains(inspiration);
  }

  void toggleTheme(String theme) {
    if (_selectedThemes.contains(theme)) {
      _selectedThemes.remove(theme);
    } else {
      _selectedThemes.add(theme);
    }
    notifyListeners();
  }

  bool isThemeSelected(String theme) {
    return _selectedThemes.contains(theme);
  }

  void reset() {
    _userName = '';
    _selectedGenres = [];
    _selectedInspirations = [];
    _selectedThemes = [];
    notifyListeners();
  }

  bool get canProceedFromUserName => _userName.trim().isNotEmpty;
  bool get canProceedFromGenres => _selectedGenres.isNotEmpty;
  bool get canProceedFromInspirations => _selectedInspirations.isNotEmpty;
  bool get canProceedFromThemes => _selectedThemes.isNotEmpty;
}