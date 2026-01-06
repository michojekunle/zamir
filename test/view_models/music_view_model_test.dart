import 'package:flutter_test/flutter_test.dart';
import 'package:zamir_app/view_models/music_view_model.dart';
import 'package:zamir_app/models/app_models.dart';

void main() {
  late MusicViewModel viewModel;

  setUp(() {
    viewModel = MusicViewModel();
  });

  group('Initial State', () {
    test('should have no current song', () {
      expect(viewModel.currentSong, isNull);
    });

    test('should not be playing', () {
      expect(viewModel.isPlaying, false);
    });

    test('should have zero current position', () {
      expect(viewModel.currentPosition, Duration.zero);
    });

    test('should have empty recentlyPlayed', () {
      expect(viewModel.recentlyPlayed, isEmpty);
    });

    test('should have empty favorites', () {
      expect(viewModel.favorites, isEmpty);
    });

    test('should have sample songs', () {
      expect(viewModel.sampleSongs, isNotEmpty);
      expect(viewModel.sampleSongs.length, 3);
    });
  });

  group('Sample Songs', () {
    test('sample songs should have valid structure', () {
      for (final song in viewModel.sampleSongs) {
        expect(song.id, isNotEmpty);
        expect(song.title, isNotEmpty);
        expect(song.verse, isNotEmpty);
        expect(song.scripture, isNotEmpty);
        expect(song.imageUrl, isNotEmpty);
        expect(song.duration.inSeconds, greaterThan(0));
      }
    });

    test('sample songs should have themes', () {
      for (final song in viewModel.sampleSongs) {
        expect(song.themes, isNotEmpty);
      }
    });
  });

  group('playSong', () {
    test('should set current song', () {
      final song = viewModel.sampleSongs.first;
      viewModel.playSong(song);

      expect(viewModel.currentSong, song);
    });

    test('should set isPlaying to true', () {
      viewModel.playSong(viewModel.sampleSongs.first);

      expect(viewModel.isPlaying, true);
    });

    test('should reset position to zero', () {
      viewModel.playSong(viewModel.sampleSongs.first);

      expect(viewModel.currentPosition, Duration.zero);
    });

    test('should add song to recentlyPlayed', () {
      final song = viewModel.sampleSongs.first;
      viewModel.playSong(song);

      expect(viewModel.recentlyPlayed, contains(song));
    });

    test('should not duplicate song in recentlyPlayed', () {
      final song = viewModel.sampleSongs.first;
      viewModel.playSong(song);
      viewModel.playSong(song);

      expect(viewModel.recentlyPlayed.where((s) => s.id == song.id).length, 1);
    });

    test('should add new songs to beginning of recentlyPlayed', () {
      final song1 = viewModel.sampleSongs[0];
      final song2 = viewModel.sampleSongs[1];

      viewModel.playSong(song1);
      viewModel.playSong(song2);

      expect(viewModel.recentlyPlayed.first.id, song2.id);
    });

    test('recentlyPlayed should limit to 10 songs', () {
      // Create and play more than 10 songs
      for (int i = 0; i < 15; i++) {
        final song = Song(
          id: 'song_$i',
          title: 'Song $i',
          verse: 'Verse $i',
          scripture: 'Scripture $i',
          imageUrl: 'https://example.com/$i.jpg',
          duration: const Duration(minutes: 3),
        );
        viewModel.playSong(song);
      }

      expect(viewModel.recentlyPlayed.length, lessThanOrEqualTo(10));
    });

    test('should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.playSong(viewModel.sampleSongs.first);

      expect(notified, true);
    });
  });

  group('Play Controls', () {
    test('togglePlayPause should toggle isPlaying from false to true', () {
      viewModel.togglePlayPause();
      expect(viewModel.isPlaying, true);
    });

    test('togglePlayPause should toggle isPlaying from true to false', () {
      viewModel.playSong(viewModel.sampleSongs.first);
      expect(viewModel.isPlaying, true);

      viewModel.togglePlayPause();
      expect(viewModel.isPlaying, false);
    });

    test('togglePlayPause should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.togglePlayPause();

      expect(notified, true);
    });

    test('pause should set isPlaying to false', () {
      viewModel.playSong(viewModel.sampleSongs.first);
      viewModel.pause();

      expect(viewModel.isPlaying, false);
    });

    test('resume should set isPlaying to true', () {
      viewModel.resume();
      expect(viewModel.isPlaying, true);
    });

    test('pause should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.pause();

      expect(notified, true);
    });

    test('resume should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.resume();

      expect(notified, true);
    });
  });

  group('seek', () {
    test('should update currentPosition', () {
      const newPosition = Duration(minutes: 1, seconds: 30);
      viewModel.seek(newPosition);

      expect(viewModel.currentPosition, newPosition);
    });

    test('should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.seek(const Duration(seconds: 45));

      expect(notified, true);
    });
  });

  group('Favorites', () {
    test('toggleFavorite should add song to favorites', () {
      final song = viewModel.sampleSongs.first;
      viewModel.toggleFavorite(song.id);

      expect(viewModel.favorites, isNotEmpty);
      expect(viewModel.favorites.first.id, song.id);
    });

    test(
      'toggleFavorite should remove song from favorites if already added',
      () {
        final song = viewModel.sampleSongs.first;
        viewModel.toggleFavorite(song.id);
        viewModel.toggleFavorite(song.id);

        expect(viewModel.favorites, isEmpty);
      },
    );

    test('toggleFavorite should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.toggleFavorite(viewModel.sampleSongs.first.id);

      expect(notified, true);
    });

    test('isFavorite should return true for favorited song', () {
      final song = viewModel.sampleSongs.first;
      viewModel.toggleFavorite(song.id);

      expect(viewModel.isFavorite(song.id), true);
    });

    test('isFavorite should return false for non-favorited song', () {
      expect(viewModel.isFavorite(viewModel.sampleSongs.first.id), false);
    });

    test('should allow multiple favorites', () {
      viewModel.toggleFavorite(viewModel.sampleSongs[0].id);
      viewModel.toggleFavorite(viewModel.sampleSongs[1].id);

      expect(viewModel.favorites.length, 2);
    });
  });

  group('Next/Previous Song', () {
    test('nextSong should play next song in list', () {
      viewModel.playSong(viewModel.sampleSongs[0]);
      viewModel.nextSong();

      expect(viewModel.currentSong?.id, viewModel.sampleSongs[1].id);
    });

    test('nextSong should wrap around to first song', () {
      viewModel.playSong(viewModel.sampleSongs.last);
      viewModel.nextSong();

      expect(viewModel.currentSong?.id, viewModel.sampleSongs.first.id);
    });

    test('previousSong should play previous song in list', () {
      viewModel.playSong(viewModel.sampleSongs[1]);
      viewModel.previousSong();

      expect(viewModel.currentSong?.id, viewModel.sampleSongs[0].id);
    });

    test('previousSong should wrap around to last song', () {
      viewModel.playSong(viewModel.sampleSongs.first);
      viewModel.previousSong();

      expect(viewModel.currentSong?.id, viewModel.sampleSongs.last.id);
    });

    test('nextSong should do nothing if no current song', () {
      viewModel.nextSong();
      expect(viewModel.currentSong, isNull);
    });

    test('previousSong should do nothing if no current song', () {
      viewModel.previousSong();
      expect(viewModel.currentSong, isNull);
    });
  });
}
