import 'package:flutter/material.dart';
import '../models/app_models.dart';

class PlaylistViewModel extends ChangeNotifier {
  List<Playlist> _playlists = [];

  List<Playlist> get playlists => _playlists;

  // Sample playlists
  List<Playlist> get samplePlaylists => [
    Playlist(
      id: '1',
      name: 'Recently Played',
      description: 'Your recently listened songs',
      coverImage: 'https://picsum.photos/300/300?random=10',
      songs: [],
      createdAt: DateTime.now(),
    ),
    Playlist(
      id: '2',
      name: 'Morning Devotion',
      description: 'Start your day with worship',
      coverImage: 'https://picsum.photos/300/300?random=11',
      songs: [],
      createdAt: DateTime.now(),
    ),
    Playlist(
      id: '3',
      name: 'Psalms of Comfort',
      description: 'Find peace in scripture',
      coverImage: 'https://picsum.photos/300/300?random=12',
      songs: [],
      createdAt: DateTime.now(),
    ),
  ];

  PlaylistViewModel() {
    _playlists = samplePlaylists;
  }

  void createPlaylist(String name, {String? description}) {
    final playlist = Playlist(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: name,
      description: description,
      createdAt: DateTime.now(),
    );
    _playlists.add(playlist);
    notifyListeners();
  }

  void addSongToPlaylist(String playlistId, Song song) {
    final index = _playlists.indexWhere((p) => p.id == playlistId);
    if (index != -1) {
      final playlist = _playlists[index];
      final updatedSongs = List<Song>.from(playlist.songs)..add(song);
      _playlists[index] = playlist.copyWith(songs: updatedSongs);
      notifyListeners();
    }
  }

  void removeSongFromPlaylist(String playlistId, String songId) {
    final index = _playlists.indexWhere((p) => p.id == playlistId);
    if (index != -1) {
      final playlist = _playlists[index];
      final updatedSongs = playlist.songs.where((s) => s.id != songId).toList();
      _playlists[index] = playlist.copyWith(songs: updatedSongs);
      notifyListeners();
    }
  }

  void deletePlaylist(String playlistId) {
    _playlists.removeWhere((p) => p.id == playlistId);
    notifyListeners();
  }

  Playlist? getPlaylist(String playlistId) {
    try {
      return _playlists.firstWhere((p) => p.id == playlistId);
    } catch (e) {
      return null;
    }
  }
}