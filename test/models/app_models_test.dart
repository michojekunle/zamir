import 'package:flutter_test/flutter_test.dart';
import 'package:zamir_app/models/app_models.dart';

void main() {
  group('User Model', () {
    test('should create User with required parameters', () {
      final user = User(id: '123', name: 'John Doe', email: 'john@example.com');

      expect(user.id, '123');
      expect(user.name, 'John Doe');
      expect(user.email, 'john@example.com');
      expect(user.profileImage, isNull);
      expect(user.favoriteGenres, isEmpty);
      expect(user.inspirations, isEmpty);
    });

    test('should create User with all parameters', () {
      final user = User(
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        profileImage: 'https://example.com/image.jpg',
        favoriteGenres: ['Worship', 'Gospel'],
        inspirations: ['Peace', 'Hope'],
      );

      expect(user.profileImage, 'https://example.com/image.jpg');
      expect(user.favoriteGenres, ['Worship', 'Gospel']);
      expect(user.inspirations, ['Peace', 'Hope']);
    });

    test('copyWith should preserve unchanged values', () {
      final user = User(
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        favoriteGenres: ['Worship'],
      );

      final copiedUser = user.copyWith(name: 'Jane Doe');

      expect(copiedUser.id, '123');
      expect(copiedUser.name, 'Jane Doe');
      expect(copiedUser.email, 'john@example.com');
      expect(copiedUser.favoriteGenres, ['Worship']);
    });

    test('copyWith should update multiple values', () {
      final user = User(id: '123', name: 'John Doe', email: 'john@example.com');

      final copiedUser = user.copyWith(
        name: 'Jane Doe',
        email: 'jane@example.com',
        profileImage: 'new_image.jpg',
      );

      expect(copiedUser.name, 'Jane Doe');
      expect(copiedUser.email, 'jane@example.com');
      expect(copiedUser.profileImage, 'new_image.jpg');
    });
  });

  group('Song Model', () {
    test('should create Song with required parameters', () {
      final song = Song(
        id: 's1',
        title: 'Amazing Grace',
        verse: 'Amazing grace how sweet the sound',
        scripture: 'John 3:16',
        imageUrl: 'https://example.com/song.jpg',
        duration: const Duration(minutes: 4, seconds: 30),
      );

      expect(song.id, 's1');
      expect(song.title, 'Amazing Grace');
      expect(song.verse, 'Amazing grace how sweet the sound');
      expect(song.scripture, 'John 3:16');
      expect(song.imageUrl, 'https://example.com/song.jpg');
      expect(song.duration, const Duration(minutes: 4, seconds: 30));
      expect(song.themes, isEmpty);
      expect(song.isFavorite, false);
    });

    test('should create Song with all parameters', () {
      final song = Song(
        id: 's1',
        title: 'Amazing Grace',
        verse: 'Amazing grace how sweet the sound',
        scripture: 'John 3:16',
        imageUrl: 'https://example.com/song.jpg',
        duration: const Duration(minutes: 4, seconds: 30),
        themes: ['Peace', 'Grace'],
        isFavorite: true,
      );

      expect(song.themes, ['Peace', 'Grace']);
      expect(song.isFavorite, true);
    });

    test('copyWith should preserve unchanged values', () {
      final song = Song(
        id: 's1',
        title: 'Amazing Grace',
        verse: 'Amazing grace',
        scripture: 'John 3:16',
        imageUrl: 'image.jpg',
        duration: const Duration(minutes: 3),
        isFavorite: false,
      );

      final copiedSong = song.copyWith(isFavorite: true);

      expect(copiedSong.id, 's1');
      expect(copiedSong.title, 'Amazing Grace');
      expect(copiedSong.isFavorite, true);
    });

    test('copyWith should update multiple values', () {
      final song = Song(
        id: 's1',
        title: 'Old Title',
        verse: 'Old verse',
        scripture: 'Old ref',
        imageUrl: 'old.jpg',
        duration: const Duration(minutes: 2),
      );

      final copiedSong = song.copyWith(title: 'New Title', themes: ['Hope']);

      expect(copiedSong.title, 'New Title');
      expect(copiedSong.themes, ['Hope']);
      expect(copiedSong.verse, 'Old verse');
    });
  });

  group('Playlist Model', () {
    test('should create Playlist with required parameters', () {
      final now = DateTime.now();
      final playlist = Playlist(
        id: 'p1',
        name: 'Morning Worship',
        createdAt: now,
      );

      expect(playlist.id, 'p1');
      expect(playlist.name, 'Morning Worship');
      expect(playlist.description, isNull);
      expect(playlist.coverImage, isNull);
      expect(playlist.songs, isEmpty);
      expect(playlist.createdAt, now);
    });

    test('should create Playlist with all parameters', () {
      final now = DateTime.now();
      final songs = [
        Song(
          id: 's1',
          title: 'Song 1',
          verse: 'Verse 1',
          scripture: 'Ref 1',
          imageUrl: 'img1.jpg',
          duration: const Duration(minutes: 3),
        ),
        Song(
          id: 's2',
          title: 'Song 2',
          verse: 'Verse 2',
          scripture: 'Ref 2',
          imageUrl: 'img2.jpg',
          duration: const Duration(minutes: 4),
        ),
      ];

      final playlist = Playlist(
        id: 'p1',
        name: 'Morning Worship',
        description: 'Start your day with praise',
        coverImage: 'cover.jpg',
        songs: songs,
        createdAt: now,
      );

      expect(playlist.description, 'Start your day with praise');
      expect(playlist.coverImage, 'cover.jpg');
      expect(playlist.songs, songs);
    });

    test('songCount should return number of songs', () {
      final songs = [
        Song(
          id: 's1',
          title: 'Song 1',
          verse: 'V1',
          scripture: 'R1',
          imageUrl: 'i1.jpg',
          duration: const Duration(minutes: 3),
        ),
        Song(
          id: 's2',
          title: 'Song 2',
          verse: 'V2',
          scripture: 'R2',
          imageUrl: 'i2.jpg',
          duration: const Duration(minutes: 4),
        ),
        Song(
          id: 's3',
          title: 'Song 3',
          verse: 'V3',
          scripture: 'R3',
          imageUrl: 'i3.jpg',
          duration: const Duration(minutes: 5),
        ),
      ];

      final playlist = Playlist(
        id: 'p1',
        name: 'Test Playlist',
        songs: songs,
        createdAt: DateTime.now(),
      );

      expect(playlist.songCount, 3);
    });

    test('songCount should return 0 for empty playlist', () {
      final playlist = Playlist(
        id: 'p1',
        name: 'Empty Playlist',
        createdAt: DateTime.now(),
      );

      expect(playlist.songCount, 0);
    });

    test('totalDuration should calculate sum of all song durations', () {
      final songs = [
        Song(
          id: 's1',
          title: 'Song 1',
          verse: 'V1',
          scripture: 'R1',
          imageUrl: 'i1.jpg',
          duration: const Duration(minutes: 3, seconds: 30),
        ),
        Song(
          id: 's2',
          title: 'Song 2',
          verse: 'V2',
          scripture: 'R2',
          imageUrl: 'i2.jpg',
          duration: const Duration(minutes: 4, seconds: 15),
        ),
      ];

      final playlist = Playlist(
        id: 'p1',
        name: 'Test Playlist',
        songs: songs,
        createdAt: DateTime.now(),
      );

      expect(playlist.totalDuration, const Duration(minutes: 7, seconds: 45));
    });

    test('totalDuration should return zero for empty playlist', () {
      final playlist = Playlist(
        id: 'p1',
        name: 'Empty Playlist',
        createdAt: DateTime.now(),
      );

      expect(playlist.totalDuration, Duration.zero);
    });

    test('copyWith should preserve unchanged values', () {
      final now = DateTime.now();
      final playlist = Playlist(
        id: 'p1',
        name: 'Original',
        description: 'Original desc',
        createdAt: now,
      );

      final copied = playlist.copyWith(name: 'Updated');

      expect(copied.id, 'p1');
      expect(copied.name, 'Updated');
      expect(copied.description, 'Original desc');
      expect(copied.createdAt, now);
    });
  });

  group('Genre Model', () {
    test('should create Genre with required parameters', () {
      final genre = Genre(id: 'g1', name: 'Worship', icon: '🙏');

      expect(genre.id, 'g1');
      expect(genre.name, 'Worship');
      expect(genre.icon, '🙏');
      expect(genre.isSelected, false);
    });

    test('should create Genre with isSelected true', () {
      final genre = Genre(
        id: 'g1',
        name: 'Gospel',
        icon: '✝️',
        isSelected: true,
      );

      expect(genre.isSelected, true);
    });

    test('copyWith should toggle isSelected', () {
      final genre = Genre(
        id: 'g1',
        name: 'Hymns',
        icon: '📖',
        isSelected: false,
      );

      final toggled = genre.copyWith(isSelected: true);

      expect(toggled.id, 'g1');
      expect(toggled.name, 'Hymns');
      expect(toggled.isSelected, true);
    });

    test('copyWith should update multiple values', () {
      final genre = Genre(id: 'g1', name: 'Old Name', icon: '🎵');

      final updated = genre.copyWith(name: 'New Name', icon: '🎶');

      expect(updated.name, 'New Name');
      expect(updated.icon, '🎶');
      expect(updated.id, 'g1');
    });
  });

  group('OnboardingStep Model', () {
    test('should create OnboardingStep with required parameters', () {
      final step = OnboardingStep(
        title: 'Welcome',
        subtitle: 'Get started with Zamir',
        stepNumber: 1,
      );

      expect(step.title, 'Welcome');
      expect(step.subtitle, 'Get started with Zamir');
      expect(step.stepNumber, 1);
      expect(step.description, isNull);
    });

    test('should create OnboardingStep with description', () {
      final step = OnboardingStep(
        title: 'Choose Genres',
        subtitle: 'Select your favorites',
        description: 'Pick at least 3 genres you enjoy',
        stepNumber: 2,
      );

      expect(step.description, 'Pick at least 3 genres you enjoy');
    });

    test('should correctly store step number', () {
      final step1 = OnboardingStep(
        title: 'Step 1',
        subtitle: 'First step',
        stepNumber: 1,
      );
      final step2 = OnboardingStep(
        title: 'Step 2',
        subtitle: 'Second step',
        stepNumber: 2,
      );
      final step3 = OnboardingStep(
        title: 'Step 3',
        subtitle: 'Third step',
        stepNumber: 3,
      );

      expect(step1.stepNumber, 1);
      expect(step2.stepNumber, 2);
      expect(step3.stepNumber, 3);
    });
  });
}
