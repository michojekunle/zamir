import 'package:flutter_test/flutter_test.dart';
import 'package:zamir_app/view_models/onboarding_view_model.dart';

void main() {
  late OnboardingViewModel viewModel;

  setUp(() {
    viewModel = OnboardingViewModel();
  });

  group('Initial State', () {
    test('should have empty userName', () {
      expect(viewModel.userName, '');
    });

    test('should have empty selectedGenres', () {
      expect(viewModel.selectedGenres, isEmpty);
    });

    test('should have empty selectedInspirations', () {
      expect(viewModel.selectedInspirations, isEmpty);
    });

    test('should have empty selectedThemes', () {
      expect(viewModel.selectedThemes, isEmpty);
    });

    test('should have non-empty availableGenres', () {
      expect(viewModel.availableGenres, isNotEmpty);
      expect(viewModel.availableGenres.length, 7);
    });

    test('should have non-empty availableInspirations', () {
      expect(viewModel.availableInspirations, isNotEmpty);
      expect(viewModel.availableInspirations.length, 10);
    });

    test('should have non-empty availableThemes', () {
      expect(viewModel.availableThemes, isNotEmpty);
      expect(viewModel.availableThemes.length, 8);
    });
  });

  group('userName', () {
    test('setUserName should update userName', () {
      viewModel.setUserName('John');
      expect(viewModel.userName, 'John');
    });

    test('setUserName should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.setUserName('Jane');

      expect(notified, true);
    });

    test('canProceedFromUserName should be false when empty', () {
      expect(viewModel.canProceedFromUserName, false);
    });

    test('canProceedFromUserName should be false for whitespace only', () {
      viewModel.setUserName('   ');
      expect(viewModel.canProceedFromUserName, false);
    });

    test('canProceedFromUserName should be true when name is set', () {
      viewModel.setUserName('John');
      expect(viewModel.canProceedFromUserName, true);
    });
  });

  group('Genre Selection', () {
    test('toggleGenre should add genre when not selected', () {
      viewModel.toggleGenre('1');

      expect(viewModel.selectedGenres.length, 1);
      expect(viewModel.selectedGenres.first.id, '1');
    });

    test('toggleGenre should remove genre when already selected', () {
      viewModel.toggleGenre('1');
      viewModel.toggleGenre('1');

      expect(viewModel.selectedGenres, isEmpty);
    });

    test('toggleGenre should allow multiple selections', () {
      viewModel.toggleGenre('1');
      viewModel.toggleGenre('2');
      viewModel.toggleGenre('3');

      expect(viewModel.selectedGenres.length, 3);
    });

    test('toggleGenre should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.toggleGenre('1');

      expect(notified, true);
    });

    test('isGenreSelected should return true for selected genre', () {
      viewModel.toggleGenre('1');

      expect(viewModel.isGenreSelected('1'), true);
      expect(viewModel.isGenreSelected('2'), false);
    });

    test('toggleGenre with invalid id should not throw', () {
      expect(() => viewModel.toggleGenre('invalid'), returnsNormally);
      expect(viewModel.selectedGenres, isEmpty);
    });

    test('canProceedFromGenres should be false when empty', () {
      expect(viewModel.canProceedFromGenres, false);
    });

    test('canProceedFromGenres should be true when genres selected', () {
      viewModel.toggleGenre('1');
      expect(viewModel.canProceedFromGenres, true);
    });
  });

  group('Inspiration Selection', () {
    test('toggleInspiration should add inspiration when not selected', () {
      viewModel.toggleInspiration('Peace');

      expect(viewModel.selectedInspirations, contains('Peace'));
    });

    test(
      'toggleInspiration should remove inspiration when already selected',
      () {
        viewModel.toggleInspiration('Peace');
        viewModel.toggleInspiration('Peace');

        expect(viewModel.selectedInspirations, isEmpty);
      },
    );

    test('toggleInspiration should allow multiple selections', () {
      viewModel.toggleInspiration('Peace');
      viewModel.toggleInspiration('Hope');
      viewModel.toggleInspiration('Love');

      expect(viewModel.selectedInspirations.length, 3);
    });

    test('toggleInspiration should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.toggleInspiration('Peace');

      expect(notified, true);
    });

    test('isInspirationSelected should return correct value', () {
      viewModel.toggleInspiration('Faith');

      expect(viewModel.isInspirationSelected('Faith'), true);
      expect(viewModel.isInspirationSelected('Hope'), false);
    });

    test('canProceedFromInspirations should be false when empty', () {
      expect(viewModel.canProceedFromInspirations, false);
    });

    test('canProceedFromInspirations should be true when selected', () {
      viewModel.toggleInspiration('Peace');
      expect(viewModel.canProceedFromInspirations, true);
    });
  });

  group('Theme Selection', () {
    test('toggleTheme should add theme when not selected', () {
      viewModel.toggleTheme('Morning Devotion');

      expect(viewModel.selectedThemes, contains('Morning Devotion'));
    });

    test('toggleTheme should remove theme when already selected', () {
      viewModel.toggleTheme('Meditation');
      viewModel.toggleTheme('Meditation');

      expect(viewModel.selectedThemes, isEmpty);
    });

    test('toggleTheme should allow multiple selections', () {
      viewModel.toggleTheme('Morning Devotion');
      viewModel.toggleTheme('Evening Prayer');
      viewModel.toggleTheme('Worship');

      expect(viewModel.selectedThemes.length, 3);
    });

    test('toggleTheme should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.toggleTheme('Worship');

      expect(notified, true);
    });

    test('isThemeSelected should return correct value', () {
      viewModel.toggleTheme('Worship');

      expect(viewModel.isThemeSelected('Worship'), true);
      expect(viewModel.isThemeSelected('Meditation'), false);
    });

    test('canProceedFromThemes should be false when empty', () {
      expect(viewModel.canProceedFromThemes, false);
    });

    test('canProceedFromThemes should be true when selected', () {
      viewModel.toggleTheme('Worship');
      expect(viewModel.canProceedFromThemes, true);
    });
  });

  group('Reset', () {
    test('reset should clear all selections', () {
      // Set up some state
      viewModel.setUserName('John');
      viewModel.toggleGenre('1');
      viewModel.toggleGenre('2');
      viewModel.toggleInspiration('Peace');
      viewModel.toggleTheme('Worship');

      // Reset
      viewModel.reset();

      // Verify all cleared
      expect(viewModel.userName, '');
      expect(viewModel.selectedGenres, isEmpty);
      expect(viewModel.selectedInspirations, isEmpty);
      expect(viewModel.selectedThemes, isEmpty);
    });

    test('reset should notify listeners', () {
      viewModel.setUserName('John');

      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.reset();

      expect(notified, true);
    });
  });

  group('Available Options Validation', () {
    test('availableGenres should have correct structure', () {
      for (final genre in viewModel.availableGenres) {
        expect(genre.id, isNotEmpty);
        expect(genre.name, isNotEmpty);
        expect(genre.icon, isNotEmpty);
      }
    });

    test('availableInspirations should all be non-empty strings', () {
      for (final inspiration in viewModel.availableInspirations) {
        expect(inspiration, isNotEmpty);
      }
    });

    test('availableThemes should all be non-empty strings', () {
      for (final theme in viewModel.availableThemes) {
        expect(theme, isNotEmpty);
      }
    });
  });
}
