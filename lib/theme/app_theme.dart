import 'package:flutter/material.dart';

class AppTheme {
  // Colors - Welcoming Palette
  static const Color primaryIndigo = Color(0xFF6C63FF); // Soft Indigo
  static const Color secondaryTeal = Color(0xFF2EC4B6); // Friendly Teal
  static const Color accentCoral = Color(0xFFFF6584); // Warm Coral

  // Backgrounds
  static const Color lightBackground = Color(
    0xFFFDFBF7,
  ); // Warm Cream/Off-white
  static const Color lightSurface = Color(0xFFFFFFFF);

  static const Color darkBackground = Color(0xFF171C26); // Deep Gunmetal
  static const Color darkSurface = Color(0xFF222B36); // Lighter Gunmetal

  // Text Colors
  static const Color textDark = Color(0xFF2D3436);
  static const Color textLight = Color(0xFFFDFBF7);

  // Dark Theme
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: darkBackground,
    primaryColor: primaryIndigo,
    colorScheme: const ColorScheme.dark(
      primary: primaryIndigo,
      secondary: secondaryTeal,
      tertiary: Color(0xFFB794F4), // Lighter Soft Purple for Dark Mode
      surface: darkSurface,
      error: accentCoral,
      background: darkBackground,
    ),
    cardTheme: CardThemeData(
      color: darkSurface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20), // Softer corners
      ),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: darkBackground,
      elevation: 0,
      centerTitle: false,
      iconTheme: IconThemeData(color: Colors.white),
      titleTextStyle: TextStyle(
        color: Colors.white,
        fontSize: 22,
        fontWeight: FontWeight.w700,
        fontFamily:
            'Nunito', // Hypothetical friendly font, falling back to default
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryIndigo,
        foregroundColor: Colors.white,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: darkSurface,
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: primaryIndigo, width: 2),
      ),
      labelStyle: const TextStyle(color: Colors.white70),
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        fontSize: 32,
        fontWeight: FontWeight.w800,
        color: Colors.white,
        letterSpacing: -0.5,
      ),
      displayMedium: TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.w700,
        color: Colors.white,
      ),
      bodyLarge: TextStyle(fontSize: 16, color: Colors.white, height: 1.5),
      bodyMedium: TextStyle(fontSize: 14, color: Colors.white70, height: 1.5),
    ),
  );

  // Light Theme
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: lightBackground,
    primaryColor: primaryIndigo,
    colorScheme: const ColorScheme.light(
      primary: primaryIndigo,
      secondary: secondaryTeal,
      tertiary: Color(0xFF9F7AEA), // Soft Purple
      surface: lightSurface,
      background: lightBackground,
      error: accentCoral,
      surfaceVariant: Color(0xFFF0F0F0),
    ),
    cardTheme: CardThemeData(
      color: lightSurface,
      elevation: 0,
      shadowColor: const Color(0xFF6C63FF).withOpacity(0.08), // Colored shadow
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(color: Colors.grey.withOpacity(0.05)),
      ),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: lightBackground,
      elevation: 0,
      centerTitle: false,
      iconTheme: IconThemeData(color: textDark),
      titleTextStyle: TextStyle(
        color: textDark,
        fontSize: 22,
        fontWeight: FontWeight.w700,
        fontFamily: 'Nunito',
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryIndigo,
        foregroundColor: Colors.white,
        elevation: 0,
        shadowColor: primaryIndigo.withOpacity(0.3),
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: primaryIndigo, width: 2),
      ),
      labelStyle: TextStyle(color: textDark.withOpacity(0.6)),
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        fontSize: 32,
        fontWeight: FontWeight.w800,
        color: textDark,
        letterSpacing: -0.5,
      ),
      displayMedium: TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.w700,
        color: textDark,
      ),
      bodyLarge: TextStyle(fontSize: 16, color: textDark, height: 1.5),
      bodyMedium: TextStyle(
        fontSize: 14,
        color: Color(0xFF505050),
        height: 1.5,
      ),
    ),
    dividerColor: const Color(0xFFEEEEEE),
  );
}
