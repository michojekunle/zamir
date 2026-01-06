import 'package:flutter_test/flutter_test.dart';
import 'package:zamir_app/view_models/playlist_view_model.dart';
import 'package:zamir_app/models/app_models.dart';

void main() {
  late PlaylistViewModel viewModel;

  setUp(() {
    viewModel = PlaylistViewModel();
  });

  group('Initial State', () {
    test('should have sample playlists on init', () {
      expect(viewModel.playlists, isNotEmpty);
    });

    test('should have 3 sample playlists', () {
      expect(viewModel.playlists.length, 3);
    });

    test('sample playlists should have valid structure', () {
      for (final playlist in viewModel.playlists) {
        expect(playlist.id, isNotEmpty);
        expect(playlist.name, isNotEmpty);
      }
    });

    test('samplePlaylists getter should return playlists', () {
      expect(viewModel.samplePlaylists, isNotEmpty);
      expect(viewModel.samplePlaylists.length, 3);
    });
  });

  group('createPlaylist', () {
    test('should add new playlist', () {
      final initialCount = viewModel.playlists.length;

      viewModel.createPlaylist('My New Playlist');

      expect(viewModel.playlists.length, initialCount + 1);
    });

    test('should create playlist with correct name', () {
      viewModel.createPlaylist('Worship Mix');

      final created = viewModel.playlists.last;
      expect(created.name, 'Worship Mix');
    });

    test('should create playlist with description', () {
      viewModel.createPlaylist(
        'Worship Mix',
        description: 'My favorite worship songs',
      );

      final created = viewModel.playlists.last;
      expect(created.description, 'My favorite worship songs');
    });

    test('should create playlist with no description if not provided', () {
      viewModel.createPlaylist('Simple Playlist');

      final created = viewModel.playlists.last;
      expect(created.description, isNull);
    });

    test('should generate unique id', () async {
      viewModel.createPlaylist('Playlist 1');
      await Future.delayed(const Duration(milliseconds: 2));
      viewModel.createPlaylist('Playlist 2');

      final playlist1 = viewModel.playlists[viewModel.playlists.length - 2];
      final playlist2 = viewModel.playlists.last;

      expect(playlist1.id, isNot(playlist2.id));
    });

    test('should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.createPlaylist('New Playlist');

      expect(notified, true);
    });

    test('created playlist should have createdAt set', () {
      final before = DateTime.now();
      viewModel.createPlaylist('Timed Playlist');
      final after = DateTime.now();

      final created = viewModel.playlists.last;
      expect(
        created.createdAt.isAfter(before) ||
            created.createdAt.isAtSameMomentAs(before),
        true,
      );
      expect(
        created.createdAt.isBefore(after) ||
            created.createdAt.isAtSameMomentAs(after),
        true,
      );
    });
  });

  group('addSongToPlaylist', () {
    late Song testSong;

    setUp(() {
      testSong = Song(
        id: 'test_song_1',
        title: 'Test Song',
        verse: 'Test verse',
        scripture: 'Test 1:1',
        imageUrl: 'https://example.com/test.jpg',
        duration: const Duration(minutes: 3),
      );
    });

    test('should add song to correct playlist', () {
      final playlistId = viewModel.playlists.first.id;

      viewModel.addSongToPlaylist(playlistId, testSong);

      final playlist = viewModel.getPlaylist(playlistId);
      expect(playlist?.songs, contains(testSong));
    });

    test('should not affect other playlists', () {
      final playlistId = viewModel.playlists.first.id;
      final otherPlaylistId = viewModel.playlists[1].id;

      viewModel.addSongToPlaylist(playlistId, testSong);

      final otherPlaylist = viewModel.getPlaylist(otherPlaylistId);
      expect(otherPlaylist?.songs, isEmpty);
    });

    test('should add multiple songs', () {
      final playlistId = viewModel.playlists.first.id;
      final song2 = Song(
        id: 'test_song_2',
        title: 'Test Song 2',
        verse: 'Verse 2',
        scripture: 'Test 2:2',
        imageUrl: 'https://example.com/test2.jpg',
        duration: const Duration(minutes: 4),
      );

      viewModel.addSongToPlaylist(playlistId, testSong);
      viewModel.addSongToPlaylist(playlistId, song2);

      final playlist = viewModel.getPlaylist(playlistId);
      expect(playlist?.songs.length, 2);
    });

    test('should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.addSongToPlaylist(viewModel.playlists.first.id, testSong);

      expect(notified, true);
    });

    test('should do nothing for invalid playlist id', () {
      final initialPlaylists = List.of(viewModel.playlists);

      viewModel.addSongToPlaylist('invalid_id', testSong);

      expect(viewModel.playlists.length, initialPlaylists.length);
    });
  });

  group('removeSongFromPlaylist', () {
    late Song testSong;
    late String playlistId;

    setUp(() {
      testSong = Song(
        id: 'test_song_remove',
        title: 'Song to Remove',
        verse: 'Verse',
        scripture: 'Ref',
        imageUrl: 'url',
        duration: const Duration(minutes: 2),
      );
      playlistId = viewModel.playlists.first.id;
      viewModel.addSongToPlaylist(playlistId, testSong);
    });

    test('should remove song from playlist', () {
      viewModel.removeSongFromPlaylist(playlistId, testSong.id);

      final playlist = viewModel.getPlaylist(playlistId);
      expect(playlist?.songs.where((s) => s.id == testSong.id), isEmpty);
    });

    test('should not affect other songs in playlist', () {
      final song2 = Song(
        id: 'song_to_keep',
        title: 'Keep This',
        verse: 'V',
        scripture: 'R',
        imageUrl: 'u',
        duration: const Duration(minutes: 1),
      );
      viewModel.addSongToPlaylist(playlistId, song2);

      viewModel.removeSongFromPlaylist(playlistId, testSong.id);

      final playlist = viewModel.getPlaylist(playlistId);
      expect(playlist?.songs.length, 1);
      expect(playlist?.songs.first.id, 'song_to_keep');
    });

    test('should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.removeSongFromPlaylist(playlistId, testSong.id);

      expect(notified, true);
    });

    test('should do nothing for invalid playlist id', () {
      // Should not throw
      expect(
        () => viewModel.removeSongFromPlaylist('invalid', testSong.id),
        returnsNormally,
      );
    });
  });

  group('deletePlaylist', () {
    test('should remove playlist from list', () {
      final playlistToDelete = viewModel.playlists.first;
      final initialCount = viewModel.playlists.length;

      viewModel.deletePlaylist(playlistToDelete.id);

      expect(viewModel.playlists.length, initialCount - 1);
      expect(
        viewModel.playlists.where((p) => p.id == playlistToDelete.id),
        isEmpty,
      );
    });

    test('should not affect other playlists', () {
      final playlistToDelete = viewModel.playlists.first;
      final remainingIds = viewModel.playlists
          .skip(1)
          .map((p) => p.id)
          .toList();

      viewModel.deletePlaylist(playlistToDelete.id);

      for (final id in remainingIds) {
        expect(viewModel.getPlaylist(id), isNotNull);
      }
    });

    test('should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.deletePlaylist(viewModel.playlists.first.id);

      expect(notified, true);
    });

    test('should do nothing for invalid playlist id', () {
      final initialCount = viewModel.playlists.length;

      viewModel.deletePlaylist('invalid_id');

      expect(viewModel.playlists.length, initialCount);
    });
  });

  group('getPlaylist', () {
    test('should return correct playlist by id', () {
      final expected = viewModel.playlists[1];

      final result = viewModel.getPlaylist(expected.id);

      expect(result, isNotNull);
      expect(result?.id, expected.id);
      expect(result?.name, expected.name);
    });

    test('should return null for invalid id', () {
      final result = viewModel.getPlaylist('non_existent_id');

      expect(result, isNull);
    });

    test('should return null for empty id', () {
      final result = viewModel.getPlaylist('');

      expect(result, isNull);
    });
  });

  group('Sample Playlists Structure', () {
    test('Recently Played playlist should exist', () {
      final recentlyPlayed = viewModel.playlists.firstWhere(
        (p) => p.name == 'Recently Played',
        orElse: () => throw Exception('Not found'),
      );

      expect(recentlyPlayed, isNotNull);
      expect(recentlyPlayed.description, isNotNull);
    });

    test('Morning Devotion playlist should exist', () {
      final morningDevotion = viewModel.playlists.firstWhere(
        (p) => p.name == 'Morning Devotion',
        orElse: () => throw Exception('Not found'),
      );

      expect(morningDevotion, isNotNull);
      expect(morningDevotion.description, isNotNull);
    });

    test('Psalms of Comfort playlist should exist', () {
      final psalmsComfort = viewModel.playlists.firstWhere(
        (p) => p.name == 'Psalms of Comfort',
        orElse: () => throw Exception('Not found'),
      );

      expect(psalmsComfort, isNotNull);
      expect(psalmsComfort.description, isNotNull);
    });

    test('all sample playlists should have cover images', () {
      for (final playlist in viewModel.samplePlaylists) {
        expect(playlist.coverImage, isNotNull);
        expect(playlist.coverImage, isNotEmpty);
      }
    });
  });
}
