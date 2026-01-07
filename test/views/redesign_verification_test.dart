import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:zamir_app/view_models/music_view_model.dart';
import 'package:zamir_app/view_models/auth_view_model.dart';
import 'package:zamir_app/view_models/generation_view_model.dart';
import 'package:zamir_app/view_models/theme_view_model.dart';
import 'package:zamir_app/views/home/home_tab.dart';
import 'package:zamir_app/views/home/widgets/daily_verse_card.dart';
import 'package:zamir_app/views/generate/ai_generation_screen.dart';
import 'package:zamir_app/views/player/now_playing_screen.dart';
import 'package:zamir_app/views/settings/settings_screen.dart';
import 'package:zamir_app/models/app_models.dart' as app_models;
import 'package:zamir_app/services/suno_service.dart';
import 'package:zamir_app/services/user_service.dart'; // Added for UserProfile
import 'package:mockito/mockito.dart';

// Mock ViewModels (Manual implementation to avoid build_runner)
class MockMusicViewModel extends ChangeNotifier implements MusicViewModel {
  @override
  app_models.Song? currentSong;
  @override
  bool isPlaying = false;
  @override
  List<app_models.Song> recentlyPlayed = [];
  @override
  List<app_models.Song> sampleSongs = [];
  @override
  bool get hasError => false;
  @override
  String? get errorMessage => null;
  @override
  bool get isLoading => false;
  @override
  Duration get currentPosition => Duration.zero;
  @override
  List<app_models.Song> get favorites => [];

  @override
  bool isFavorite(String id) => false;
  @override
  void togglePlayPause() {}
  @override
  void nextSong() {}
  @override
  void previousSong() {}
  @override
  void playSong(app_models.Song song) {}
  @override
  void toggleFavorite(String id) {}
  @override
  Future<void> loadFeaturedSongs() async {}
  @override
  Future<void> loadRecentlyPlayed() async {}
  @override
  void seek(Duration position) {}
  @override
  void pause() {}
  @override
  void resume() {}

  @override
  void setError(String message) {}

  @override
  void clearError() {}

  @override
  void setLoading(bool loading) {}
}

class MockAuthViewModel extends ChangeNotifier implements AuthViewModel {
  @override
  String get displayName => 'Test User';
  @override
  String? get photoUrl => null;
  @override
  String get handle => 'testuser';
  @override
  String get email => 'test@example.com';
  @override
  String? get errorMessage => null;
  @override
  String? get error => null;

  @override
  bool get isLoading => false;
  @override
  User? get user => null;
  @override
  User? get firebaseUser => null;

  @override
  UserProfile? get userProfile => null;

  @override
  bool get isAuthenticated => true;
  @override
  bool get hasCompletedOnboarding => true;

  @override
  Future<void> signOut() async {}

  @override
  Future<void> completeOnboarding({
    required String handle,
    required List<String> genres,
    required List<String> inspirations,
    required List<String> themes,
  }) async {}

  @override
  Future<bool> isHandleAvailable(String handle) async => true;

  @override
  Future<void> loadUserProfile() async {}
  @override
  Future<bool> signInWithEmail(String email, String password) async => true;
  @override
  Future<bool> signInWithGoogle() async => true;
  @override
  Future<bool> signUp(String email, String password, String name) async => true;
  @override
  Future<bool> signInWithApple() async => true;
  @override
  Future<bool> sendPasswordResetEmail(String email) async => true;

  Future<void> signUpWithEmail(
    String email,
    String password,
    String name,
  ) async {}

  @override
  bool get isOnboardingComplete => true;

  @override
  void clearError() {}

  @override
  void setError(String message) {}

  @override
  void setLoading(bool loading) {}

  @override
  Future<bool> signIn(String email, String password) async => true;
}

class MockGenViewModel extends ChangeNotifier implements GenerationViewModel {
  @override
  bool get canGenerate => true;
  @override
  List<GeneratedSong> generatedSongs = [];
  @override
  String? get errorMessage => null;
  @override
  bool get isGenerating => false;

  @override
  void setScripture(String val) {}
  @override
  void setVerse(String val) {}
  @override
  void setMood(String? val) {}
  @override
  Future<void> generate() async {}

  @override
  void clearError() {}

  @override
  void setError(String message) {}

  @override
  void setLoading(bool loading) {}

  @override
  GeneratedSong? get currentGeneration => null;

  @override
  String get error => '';

  @override
  GeneratedSong? get generatedSong => null;

  @override
  void loadGeneratedSongs(String userId) {}

  @override
  double get progress => 0.0;

  @override
  void reset() {}

  @override
  Future<void> saveToLibrary(String userId) async {}

  @override
  String get scripture => '';

  @override
  String? get selectedMood => null;

  @override
  void setApiKey(String key) {}

  @override
  void setFromSuggestion(String reference, String verseText) {}

  @override
  GenerationState get state => GenerationState.idle;

  @override
  String get verse => '';
}

class MockThemeViewModel extends ChangeNotifier implements ThemeViewModel {
  @override
  bool get isDarkMode => false;
  @override
  ThemeMode get themeMode => ThemeMode.light;

  @override
  void toggleTheme() {}

  @override
  void setThemeMode(ThemeMode mode) {}
}

void main() {
  Widget createWidgetUnderTest(Widget child) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<MusicViewModel>(
          create: (_) => MockMusicViewModel(),
        ),
        ChangeNotifierProvider<AuthViewModel>(
          create: (_) => MockAuthViewModel(),
        ),
        ChangeNotifierProvider<GenerationViewModel>(
          create: (_) => MockGenViewModel(),
        ),
        ChangeNotifierProvider<ThemeViewModel>(
          create: (_) => MockThemeViewModel(),
        ),
      ],
      child: MaterialApp(home: child),
    );
  }

  testWidgets('HomeTab renders DailyVerseCard and headers', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(createWidgetUnderTest(const HomeTab()));
    await tester.pumpAndSettle(); // Allow timers/animations to settle if any

    // Verify DailyVerseCard is present
    expect(find.byType(DailyVerseCard), findsOneWidget);

    // Verify new headers
    expect(find.textContaining('Browse by Mood'), findsOneWidget);
    expect(find.textContaining('Community Favorites'), findsOneWidget);
  });

  testWidgets('AIGenerationScreen renders input and style grid', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(createWidgetUnderTest(const AIGenerationScreen()));
    await tester.pumpAndSettle();

    // Verify Inspiration text
    expect(find.text('Your Inspiration'), findsOneWidget);

    // Verify specific styling elements
    expect(find.text('Musical Style'), findsOneWidget);

    // Scroll to bottom to ensure visibility of later elements
    await tester.drag(
      find.byType(SingleChildScrollView),
      const Offset(0, -500),
    );
    await tester.pumpAndSettle();

    expect(find.text('Meditation'), findsOneWidget);
  });

  testWidgets('SettingsScreen renders key sections', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(createWidgetUnderTest(const SettingsScreen()));
    await tester.pumpAndSettle();

    // Verify Headers
    expect(find.text('APPEARANCE'), findsOneWidget);
    expect(find.text('GENERAL'), findsOneWidget);

    // Verify Toggle Buttons
    expect(find.text('Light'), findsOneWidget);
    expect(find.text('Dark'), findsOneWidget);
  });
}
