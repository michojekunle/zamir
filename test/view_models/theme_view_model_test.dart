import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:zamir_app/view_models/theme_view_model.dart';

void main() {
  late ThemeViewModel viewModel;

  setUp(() {
    viewModel = ThemeViewModel();
  });

  group('Initial State', () {
    test('should start with dark theme', () {
      expect(viewModel.themeMode, ThemeMode.dark);
    });

    test('isDarkMode should be true initially', () {
      expect(viewModel.isDarkMode, true);
    });
  });

  group('toggleTheme', () {
    test('should switch from dark to light', () {
      expect(viewModel.themeMode, ThemeMode.dark);

      viewModel.toggleTheme();

      expect(viewModel.themeMode, ThemeMode.light);
    });

    test('should switch from light back to dark', () {
      viewModel.toggleTheme(); // dark -> light
      viewModel.toggleTheme(); // light -> dark

      expect(viewModel.themeMode, ThemeMode.dark);
    });

    test('isDarkMode should update after toggle', () {
      expect(viewModel.isDarkMode, true);

      viewModel.toggleTheme();

      expect(viewModel.isDarkMode, false);
    });

    test('should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.toggleTheme();

      expect(notified, true);
    });

    test('multiple toggles should work correctly', () {
      viewModel.toggleTheme(); // light
      expect(viewModel.isDarkMode, false);

      viewModel.toggleTheme(); // dark
      expect(viewModel.isDarkMode, true);

      viewModel.toggleTheme(); // light
      expect(viewModel.isDarkMode, false);

      viewModel.toggleTheme(); // dark
      expect(viewModel.isDarkMode, true);
    });
  });

  group('setThemeMode', () {
    test('should set to light mode', () {
      viewModel.setThemeMode(ThemeMode.light);

      expect(viewModel.themeMode, ThemeMode.light);
      expect(viewModel.isDarkMode, false);
    });

    test('should set to dark mode', () {
      viewModel.setThemeMode(ThemeMode.light); // Change first
      viewModel.setThemeMode(ThemeMode.dark);

      expect(viewModel.themeMode, ThemeMode.dark);
      expect(viewModel.isDarkMode, true);
    });

    test('should set to system mode', () {
      viewModel.setThemeMode(ThemeMode.system);

      expect(viewModel.themeMode, ThemeMode.system);
      // isDarkMode will be false since system != dark
      expect(viewModel.isDarkMode, false);
    });

    test('should notify listeners', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.setThemeMode(ThemeMode.light);

      expect(notified, true);
    });

    test('should notify even if setting same mode', () {
      bool notified = false;
      viewModel.addListener(() => notified = true);

      viewModel.setThemeMode(ThemeMode.dark); // Same as initial

      expect(notified, true);
    });
  });

  group('isDarkMode getter', () {
    test('should return true only for ThemeMode.dark', () {
      viewModel.setThemeMode(ThemeMode.dark);
      expect(viewModel.isDarkMode, true);

      viewModel.setThemeMode(ThemeMode.light);
      expect(viewModel.isDarkMode, false);

      viewModel.setThemeMode(ThemeMode.system);
      expect(viewModel.isDarkMode, false);
    });
  });

  group('Listener Management', () {
    test('should support multiple listeners', () {
      int notificationCount = 0;
      viewModel.addListener(() => notificationCount++);
      viewModel.addListener(() => notificationCount++);

      viewModel.toggleTheme();

      expect(notificationCount, 2);
    });

    test('removed listener should not be called', () {
      int count = 0;
      void listener() => count++;

      viewModel.addListener(listener);
      viewModel.removeListener(listener);

      viewModel.toggleTheme();

      expect(count, 0);
    });
  });
}
