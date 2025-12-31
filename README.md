# Zamir - Scripture in Song 🎵

A beautiful, faith-inspired music application built with Flutter using the **MVVM (Model-View-ViewModel)** architecture pattern. Features dark and light themes with smooth animations and an intuitive user interface.

## 📱 Features

### Core Features
- **Splash Screen** with animated logo and loading indicator
- **Onboarding Flow** with user personalization
  - Create unique handle
  - Select favorite genres
  - Choose inspirations
  - Focus journey themes
- **Home Screen** with bottom navigation
  - Featured daily songs
  - Recently played
  - Curated playlists
- **Music Player** with full playback controls
- **Dark/Light Theme** toggle
- **Explore Tab** for discovering new content
- **Library Tab** for managing personal collection

### Architecture
- **MVVM Pattern** (Model-View-ViewModel)
- **Provider** for state management
- **Separation of Concerns** with clear file structure
- **Reactive UI** updates

## 📁 Project Structure

```
zamir_app/
├── lib/
│   ├── main.dart                          # App entry point
│   ├── models/
│   │   └── app_models.dart                # Data models (User, Song, Playlist, etc.)
│   ├── views/
│   │   ├── splash_screen.dart             # Animated splash screen
│   │   ├── onboarding/
│   │   │   ├── start_journey_screen.dart  # First onboarding screen
│   │   │   ├── create_handle_screen.dart  # User handle creation
│   │   │   ├── select_genres_screen.dart  # Genre selection
│   │   │   ├── select_inspirations_screen.dart
│   │   │   └── focus_journey_screen.dart  # Theme selection
│   │   ├── home/
│   │   │   ├── home_screen.dart           # Main screen with bottom nav
│   │   │   ├── home_tab.dart              # Home feed
│   │   │   ├── explore_tab.dart           # Explore content
│   │   │   └── library_tab.dart           # User library
│   │   └── player/
│   │       └── now_playing_screen.dart    # Full-screen player
│   ├── view_models/
│   │   ├── theme_view_model.dart          # Theme state management
│   │   ├── auth_view_model.dart           # Authentication logic
│   │   ├── onboarding_view_model.dart     # Onboarding state
│   │   ├── music_view_model.dart          # Music playback logic
│   │   └── playlist_view_model.dart       # Playlist management
│   ├── theme/
│   │   └── app_theme.dart                 # Dark/Light theme definitions
│   └── ...
├── pubspec.yaml                           # Dependencies
└── README.md                              # This file
```

## 🎨 Design Principles

### MVVM Architecture
```
View (UI) ↔ ViewModel (Logic) ↔ Model (Data)
```

- **Models**: Plain data classes representing app entities
- **Views**: UI components that display data and handle user input
- **ViewModels**: Business logic and state management using Provider

### Theme System
- Complete dark and light theme implementations
- Consistent color schemes across all screens
- Material Design 3 components
- Smooth theme transitions

## 🚀 Getting Started

### Prerequisites
- Flutter SDK (>=3.0.0)
- Dart SDK (>=3.0.0)
- iOS Simulator / Android Emulator / Physical Device

### Installation

1. **Clone or download the project**

2. **Navigate to the project directory**
   ```bash
   cd zamir_app
   ```

3. **Install dependencies**
   ```bash
   flutter pub get
   ```

4. **Run the app**
   ```bash
   flutter run
   ```

### Build for Release

**Android:**
```bash
flutter build apk --release
```

**iOS:**
```bash
flutter build ios --release
```

## 🎯 Key Components

### State Management (Provider)
The app uses Provider for state management with multiple ViewModels:

```dart
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => ThemeViewModel()),
    ChangeNotifierProvider(create: (_) => AuthViewModel()),
    ChangeNotifierProvider(create: (_) => OnboardingViewModel()),
    ChangeNotifierProvider(create: (_) => MusicViewModel()),
    ChangeNotifierProvider(create: (_) => PlaylistViewModel()),
  ],
  child: MyApp(),
)
```

### Theme Toggle
```dart
// In any widget
final themeVM = context.watch<ThemeViewModel>();

// Toggle theme
themeVM.toggleTheme();

// Check current theme
if (themeVM.isDarkMode) {
  // Dark mode specific logic
}
```

### Playing Music
```dart
// In any widget
final musicVM = context.watch<MusicViewModel>();

// Play a song
musicVM.playSong(song);

// Toggle play/pause
musicVM.togglePlayPause();

// Check if playing
if (musicVM.isPlaying) {
  // Show pause icon
}
```

## 🎨 Screens Overview

### 1. Splash Screen
- Animated logo with bounce effect
- Pulsing glow animation
- Fade-in text
- Loading progress bar
- Auto-navigates to onboarding

### 2. Onboarding Flow
- **Start Journey**: Feature introduction
- **Create Handle**: User identity setup
- **Select Genres**: Music preferences (min 3)
- **Select Inspirations**: Thematic preferences
- **Focus Journey**: Daily devotion themes

### 3. Home Screen
- **Home Tab**: Featured songs, recently played, curated playlists
- **Explore Tab**: Search and browse by mood
- **Library Tab**: Playlists, favorites, downloads
- **Mini Player**: Persistent bottom player
- **Bottom Navigation**: Easy tab switching

### 4. Now Playing
- Full-screen music player
- Album art display
- Scripture verse display
- Playback controls
- Progress slider
- Favorite toggle

## 🔧 Customization

### Adding New Songs
Edit `lib/view_models/music_view_model.dart`:

```dart
List<Song> get sampleSongs => [
  Song(
    id: 'unique_id',
    title: 'Song Title',
    verse: 'Key verse text',
    scripture: 'Book Chapter:Verse',
    imageUrl: 'https://...',
    duration: const Duration(minutes: 3, seconds: 45),
    themes: ['Peace', 'Hope'],
  ),
  // Add more songs...
];
```

### Modifying Theme Colors
Edit `lib/theme/app_theme.dart`:

```dart
static const Color primaryBlue = Color(0xFF3B82F6);  // Change primary color
static const Color darkBackground = Color(0xFF0F1419);  // Change dark bg
```

### Adding New Genres/Themes
Edit `lib/view_models/onboarding_view_model.dart`:

```dart
final List<Genre> _availableGenres = [
  Genre(id: 'new_id', name: 'New Genre', icon: '🎵'),
  // Add more...
];
```

## 📦 Dependencies

```yaml
dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.1  # State management
  cupertino_icons: ^1.0.6  # iOS-style icons
```

## 🎭 Animations

The app features smooth animations throughout:
- Splash screen bounce and fade effects
- Page transitions
- Theme switching
- Card interactions
- Button press effects
- Loading indicators

## 🌈 Color Palette

### Dark Theme
- Background: `#0F1419`
- Card: `#1A1F26`
- Primary: `#3B82F6`
- Accent: `#FF8C42`

### Light Theme
- Background: `#F8F9FA`
- Card: `#FFFFFF`
- Primary: `#3B82F6`
- Accent: `#FF8C42`

## 📱 Responsive Design

The app is designed to work on:
- Small phones (320px+)
- Large phones
- Tablets
- Both orientations (portrait/landscape)

## 🐛 Troubleshooting

### Common Issues

**1. "Provider not found" error**
- Ensure you're using `context.watch<>()` or `context.read<>()` within a widget that has Provider in its ancestor tree

**2. Theme not updating**
- Make sure you're watching the ThemeViewModel with `context.watch<ThemeViewModel>()`

**3. Hot reload issues**
- Try hot restart (`Shift + R` in terminal)
- If that doesn't work, stop and restart the app

## 🔮 Future Enhancements

Potential features to add:
- [ ] Actual audio playback integration
- [ ] User authentication (Firebase)
- [ ] Cloud storage for playlists
- [ ] Offline mode and downloads
- [ ] Social features (sharing, following)
- [ ] Search functionality
- [ ] Lyrics display
- [ ] Sleep timer
- [ ] Crossfade between tracks
- [ ] Equalizer
- [ ] Chromecast support

## 📄 License

This project is free to use and modify for your purposes.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📞 Support

For questions or issues, please refer to the Flutter documentation or create an issue in your repository.

---

**Built with ❤️ using Flutter**