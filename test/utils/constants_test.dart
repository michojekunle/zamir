import 'package:flutter_test/flutter_test.dart';
import 'package:zamir_app/utils/constants.dart';

void main() {
  group('ScriptureSamples', () {
    test('should have samples list', () {
      expect(ScriptureSamples.samples, isNotEmpty);
    });

    test('samples should have at least 5 entries', () {
      expect(ScriptureSamples.samples.length, greaterThanOrEqualTo(5));
    });

    test('each sample should have reference and verse keys', () {
      for (final sample in ScriptureSamples.samples) {
        expect(
          sample.containsKey('reference'),
          true,
          reason: 'Sample missing "reference" key',
        );
        expect(
          sample.containsKey('verse'),
          true,
          reason: 'Sample missing "verse" key',
        );
      }
    });

    test('each sample should have non-empty values', () {
      for (final sample in ScriptureSamples.samples) {
        expect(
          sample['reference'],
          isNotEmpty,
          reason: 'Reference should not be empty',
        );
        expect(
          sample['verse'],
          isNotEmpty,
          reason: 'Verse should not be empty',
        );
      }
    });

    test('should include common scriptures', () {
      final references = ScriptureSamples.samples
          .map((s) => s['reference'])
          .toList();

      expect(references, contains('Psalm 23:1'));
      expect(references, contains('Philippians 4:13'));
    });
  });

  group('MoodOptions', () {
    test('should have moods list', () {
      expect(MoodOptions.moods, isNotEmpty);
    });

    test('should have at least 5 moods', () {
      expect(MoodOptions.moods.length, greaterThanOrEqualTo(5));
    });

    test('each mood should have name, emoji, and color', () {
      for (final mood in MoodOptions.moods) {
        expect(
          mood.containsKey('name'),
          true,
          reason: 'Mood missing "name" key',
        );
        expect(
          mood.containsKey('emoji'),
          true,
          reason: 'Mood missing "emoji" key',
        );
        expect(
          mood.containsKey('color'),
          true,
          reason: 'Mood missing "color" key',
        );
      }
    });

    test('mood names should be non-empty strings', () {
      for (final mood in MoodOptions.moods) {
        expect(mood['name'], isA<String>());
        expect((mood['name'] as String).isNotEmpty, true);
      }
    });

    test('mood colors should be valid color integers', () {
      for (final mood in MoodOptions.moods) {
        expect(mood['color'], isA<int>());
        expect(mood['color'] as int, greaterThan(0));
      }
    });

    test('should include common moods', () {
      final names = MoodOptions.moods.map((m) => m['name']).toList();

      expect(names, contains('Peaceful'));
      expect(names, contains('Joyful'));
      expect(names, contains('Hopeful'));
    });
  });

  group('GenreOptions', () {
    test('should have genres list', () {
      expect(GenreOptions.genres, isNotEmpty);
    });

    test('should have at least 5 genres', () {
      expect(GenreOptions.genres.length, greaterThanOrEqualTo(5));
    });

    test('each genre should have id, name, and icon', () {
      for (final genre in GenreOptions.genres) {
        expect(genre.containsKey('id'), true, reason: 'Genre missing "id" key');
        expect(
          genre.containsKey('name'),
          true,
          reason: 'Genre missing "name" key',
        );
        expect(
          genre.containsKey('icon'),
          true,
          reason: 'Genre missing "icon" key',
        );
      }
    });

    test('genre ids should be unique', () {
      final ids = GenreOptions.genres.map((g) => g['id']).toList();
      final uniqueIds = ids.toSet();

      expect(
        ids.length,
        uniqueIds.length,
        reason: 'Genre IDs should be unique',
      );
    });

    test('genre values should be non-empty', () {
      for (final genre in GenreOptions.genres) {
        expect(genre['id'], isNotEmpty);
        expect(genre['name'], isNotEmpty);
        expect(genre['icon'], isNotEmpty);
      }
    });

    test('should include common worship genres', () {
      final names = GenreOptions.genres.map((g) => g['name']).toList();

      expect(names, contains('Worship'));
      expect(names, contains('Gospel'));
    });
  });

  group('ThemeOptions', () {
    test('should have themes list', () {
      expect(ThemeOptions.themes, isNotEmpty);
    });

    test('should have at least 5 themes', () {
      expect(ThemeOptions.themes.length, greaterThanOrEqualTo(5));
    });

    test('all themes should be non-empty strings', () {
      for (final theme in ThemeOptions.themes) {
        expect(theme, isNotEmpty);
      }
    });

    test('should include common themes', () {
      expect(ThemeOptions.themes, contains('Morning Devotion'));
      expect(ThemeOptions.themes, contains('Worship'));
      expect(ThemeOptions.themes, contains('Meditation'));
    });
  });

  group('BibleBooks', () {
    test('should have popular books list', () {
      expect(BibleBooks.popular, isNotEmpty);
    });

    test('should have all books list', () {
      expect(BibleBooks.all, isNotEmpty);
    });

    test('popular should have at least 5 books', () {
      expect(BibleBooks.popular.length, greaterThanOrEqualTo(5));
    });

    test('all should have 66 books', () {
      expect(BibleBooks.all.length, 66);
    });

    test('popular books should be non-empty strings', () {
      for (final book in BibleBooks.popular) {
        expect(book, isNotEmpty);
      }
    });

    test('all books should be non-empty strings', () {
      for (final book in BibleBooks.all) {
        expect(book, isNotEmpty);
      }
    });

    test('popular should include common books', () {
      expect(BibleBooks.popular, contains('Psalms'));
      expect(BibleBooks.popular, contains('John'));
      expect(BibleBooks.popular, contains('Romans'));
    });

    test('all books should include Old Testament', () {
      expect(BibleBooks.all, contains('Genesis'));
      expect(BibleBooks.all, contains('Exodus'));
      expect(BibleBooks.all, contains('Psalms'));
      expect(BibleBooks.all, contains('Isaiah'));
      expect(BibleBooks.all, contains('Malachi'));
    });

    test('all books should include New Testament', () {
      expect(BibleBooks.all, contains('Matthew'));
      expect(BibleBooks.all, contains('John'));
      expect(BibleBooks.all, contains('Acts'));
      expect(BibleBooks.all, contains('Romans'));
      expect(BibleBooks.all, contains('Revelation'));
    });

    test('popular books should be subset of all books', () {
      for (final book in BibleBooks.popular) {
        expect(
          BibleBooks.all,
          contains(book),
          reason: '$book should be in all books',
        );
      }
    });
  });

  group('AppConstants', () {
    test('should have app name', () {
      expect(AppConstants.appName, isNotEmpty);
      expect(AppConstants.appName, 'Zamir');
    });

    test('should have tagline', () {
      expect(AppConstants.tagline, isNotEmpty);
      expect(AppConstants.tagline, 'Scripture in Song');
    });

    group('Animation Durations', () {
      test('short animation should be defined', () {
        expect(AppConstants.shortAnimation, isNotNull);
        expect(AppConstants.shortAnimation.inMilliseconds, greaterThan(0));
      });

      test('medium animation should be defined', () {
        expect(AppConstants.mediumAnimation, isNotNull);
        expect(AppConstants.mediumAnimation.inMilliseconds, greaterThan(0));
      });

      test('long animation should be defined', () {
        expect(AppConstants.longAnimation, isNotNull);
        expect(AppConstants.longAnimation.inMilliseconds, greaterThan(0));
      });

      test('animation durations should be in order', () {
        expect(
          AppConstants.shortAnimation.inMilliseconds,
          lessThan(AppConstants.mediumAnimation.inMilliseconds),
        );
        expect(
          AppConstants.mediumAnimation.inMilliseconds,
          lessThan(AppConstants.longAnimation.inMilliseconds),
        );
      });

      test('short animation should be around 200ms', () {
        expect(AppConstants.shortAnimation.inMilliseconds, 200);
      });

      test('medium animation should be around 400ms', () {
        expect(AppConstants.mediumAnimation.inMilliseconds, 400);
      });

      test('long animation should be around 600ms', () {
        expect(AppConstants.longAnimation.inMilliseconds, 600);
      });
    });

    group('API Configuration', () {
      test('should have Suno API base URL', () {
        expect(AppConstants.sunoApiBaseUrl, isNotEmpty);
        expect(AppConstants.sunoApiBaseUrl, startsWith('https://'));
      });
    });

    group('Storage Keys', () {
      test('should have onboarding complete key', () {
        expect(AppConstants.keyOnboardingComplete, isNotEmpty);
      });

      test('should have theme mode key', () {
        expect(AppConstants.keyThemeMode, isNotEmpty);
      });

      test('should have Suno API key storage key', () {
        expect(AppConstants.keySunoApiKey, isNotEmpty);
      });

      test('storage keys should be unique', () {
        final keys = [
          AppConstants.keyOnboardingComplete,
          AppConstants.keyThemeMode,
          AppConstants.keySunoApiKey,
        ];
        final uniqueKeys = keys.toSet();

        expect(
          keys.length,
          uniqueKeys.length,
          reason: 'Storage keys should be unique',
        );
      });
    });
  });
}
