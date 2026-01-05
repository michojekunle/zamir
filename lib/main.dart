import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'theme/app_theme.dart';
import 'views/splash_screen.dart';
import 'view_models/theme_view_model.dart';
import 'view_models/auth_view_model.dart';
import 'view_models/onboarding_view_model.dart';
import 'view_models/music_view_model.dart';
import 'view_models/playlist_view_model.dart';
import 'view_models/generation_view_model.dart';
import 'firebase_options.dart';
import 'config/api_config.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeViewModel()),
        ChangeNotifierProvider(create: (_) => AuthViewModel()),
        ChangeNotifierProvider(create: (_) => OnboardingViewModel()),
        ChangeNotifierProvider(create: (_) => MusicViewModel()),
        ChangeNotifierProvider(create: (_) => PlaylistViewModel()),
        ChangeNotifierProvider(
          create: (_) {
            final genVM = GenerationViewModel();
            // Set Suno API key from config
            if (ApiConfig.isSunoConfigured) {
              genVM.setApiKey(ApiConfig.sunoApiKey);
            }
            return genVM;
          },
        ),
      ],
      child: Consumer<ThemeViewModel>(
        builder: (context, themeViewModel, child) {
          return MaterialApp(
            title: 'Zamir',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: themeViewModel.themeMode,
            home: const SplashScreen(),
          );
        },
      ),
    );
  }
}
