# Zamir - The Word in Melody

A beautiful, faith-inspired ecosystem built to transform the Word of God into ambient melodies. This repository is a monorepo containing the core mobile application, the Progressive Web App (PWA), and the marketing website for Zamir.

## 📁 Repository Structure

```text
zamir/
├── lib/               # 📱 Flutter Mobile App (Root directory)
├── zamir_pwa/         # 🌐 Next.js Progressive Web App
└── marketing_site/    # ✨ Vite + React Marketing Website
```

## 1. 📱 Zamir Mobile App (Flutter)

The core mobile experience built with Flutter, using the **MVVM (Model-View-ViewModel)** architecture pattern for iOS and Android. It features dark and light themes, smooth animations, and an intuitive user interface.

### Features

- **Splash Screen** with animated logo and loading indicator
- **Onboarding Flow** with user personalization (handle creation, genre & inspiration selection)
- **Home Screen** with bottom navigation (Featured daily songs, Recently played, Curated playlists)
- **Music Player** with full playback controls
- **Offline & Library Tab** for managing personal collections

### Architecture & Tech Stack

- **Framework:** Flutter & Dart
- **Architecture:** MVVM Pattern (Model-View-ViewModel)
- **State Management:** Provider
- **Reactive UI** updates with clear separation of concerns

### Getting Started (Mobile)

1. Ensure you have the Flutter SDK installed.
2. From the root directory, install dependencies:
   ```bash
   flutter pub get
   ```
3. Run the app:
   ```bash
   flutter run
   ```

<details>
<summary><b>Click to view detailed Flutter App documentation</b></summary>

### Customization & State Management

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

#### Theme Toggle

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

#### Color Palette

**Dark Theme**

- Background: `#0F1419`
- Card: `#1A1F26`
- Primary: `#3B82F6`
- Accent: `#FF8C42`

**Light Theme**

- Background: `#F8F9FA`
- Card: `#FFFFFF`
- Primary: `#3B82F6`
- Accent: `#FF8C42`

</details>

---

## 2. 🌐 Zamir Web App (PWA)

A fully-featured Progressive Web App that brings the Zamir experience to the browser. Built to replicate the core mobile features with AI-powered melody generation, authentication, and a responsive dashboard.

### Features

- **AI Melody Generation:** Integrates with AI models (Google Generative AI/OpenAI) to generate scripture-inspired audio based on user prompts.
- **PWA Capabilities:** Installable on desktop and mobile browsers for a native-like experience.
- **Authentication:** Firebase integration for secure user accounts and stats tracking.
- **Robust Dashboard:** Discover harmonies, view trending tracks, and manage listening history.

### Architecture & Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS & Framer Motion
- **Backend/Auth:** Firebase & Next.js API Routes
- **Icons:** Lucide React

### Getting Started (PWA)

1. Navigate to the PWA directory:
   ```bash
   cd zamir_pwa
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## 3. ✨ Zamir Marketing Site

The public-facing landing page designed to showcase Zamir, attract users, and provide links to the Web App and Mobile App downloads. It also features programmatic video rendering capabilities for promotional content.

### Features

- **Modern Landing Page:** High-performance, SEO-friendly marketing pages utilizing Vite.
- **Cinematic Trailers:** Built-in programmatic video generation for promotional material using Remotion.
- **Brand Aesthetic:** Uses identical brand guidelines (Zamir Gold, deep dark mode) as the core apps for a unified and seamless experience.

### Architecture & Tech Stack

- **Framework:** Vite + React
- **Styling:** Tailwind CSS & Framer Motion
- **Video Rendering:** Remotion

### Getting Started (Marketing Site)

1. Navigate to the marketing site directory:
   ```bash
   cd marketing_site
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Preview Remotion Studio:
   ```bash
   npm run studio
   ```
5. Render promotional video:
   ```bash
   npm run render
   ```

---

## 📄 License & Contributing

This project is free to use and modify. Feel free to fork this project and customize it for your needs! For questions or issues, please refer to the documentation or create an issue in the repository.

**Built with ❤️ using Flutter, Next.js, and React**
