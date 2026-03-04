import 'package:flutter/material.dart';

class AppTheme {
  // Colors - Premium Jet Black & Gold Palette
  static const Color primaryIndigo = Color(0xFFC9A042); // Replaced with Gold
  static const Color secondaryTeal = Color(0xFFE6D070); // Light Gold
  static const Color accentCoral = Color(0xFFE53E3E); // Soft Red for error

  // Backgrounds
  static const Color lightBackground = Color(0xFFFAFAFA); // Pearl White
  static const Color lightSurface = Color(0xFFFFFFFF);

  static const Color darkBackground = Color(0xFF09090B); // Jet Black
  static const Color darkSurface = Color(0xFF18181B); // Zinc-900

  // Text Colors
  static const Color textDark = Color(0xFF09090B);
  static const Color textLight = Color(0xFFFAFAFA);

  // Golden gradients for premium feel (to be used in UI components)
  static const LinearGradient premiumGold = LinearGradient(
    colors: [Color(0xFFC9A042), Color(0xFFE6D070)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Dark Theme
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: darkBackground,
    primaryColor: primaryIndigo,
    colorScheme: const ColorScheme.dark(
      primary: primaryIndigo,
      secondary: secondaryTeal,
      tertiary: Color(0xFF27272A), // Zinc-800
      surface: darkSurface,
      error: accentCoral,
    ),
    cardTheme: CardThemeData(
      color: darkSurface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: const BorderSide(color: Color(0xFF27272A), width: 1),
      ),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: darkBackground,
      elevation: 0,
      centerTitle: false,
      iconTheme: IconThemeData(color: Colors.white),
      titleTextStyle: TextStyle(
        color: Colors.white,
        fontSize: 24,
        fontWeight: FontWeight.w600,
        fontFamily: 'DM Serif Display', // Using the modern serif font
        letterSpacing: -0.5,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryIndigo,
        foregroundColor: textDark, // Black text on gold is premium
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 18),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
        textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: const Color(0xFF18181B), // Zinc-900
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: Color(0xFF27272A)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: Color(0xFF27272A)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: primaryIndigo, width: 1.5),
      ),
      labelStyle: const TextStyle(color: Color(0xFFA1A1AA)), // Zinc-400
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        fontSize: 36,
        fontWeight: FontWeight.w700,
        color: Colors.white,
        letterSpacing: -1.0,
        fontFamily: 'DM Serif Display',
      ),
      displayMedium: TextStyle(
        fontSize: 28,
        fontWeight: FontWeight.w600,
        color: Colors.white,
        fontFamily: 'DM Serif Display',
        letterSpacing: -0.5,
      ),
      bodyLarge: TextStyle(
        fontSize: 16,
        color: Colors.white,
        height: 1.6,
        fontFamily: 'Plus Jakarta Sans',
      ),
      bodyMedium: TextStyle(
        fontSize: 14,
        color: Color(0xFFA1A1AA),
        height: 1.6,
        fontFamily: 'Plus Jakarta Sans',
      ),
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
      tertiary: Color(0xFFE4E4E7), // Zinc-200
      surface: lightSurface,
      error: accentCoral,
      surfaceContainerHighest: Color(0xFFF4F4F5),
    ),
    cardTheme: CardThemeData(
      color: lightSurface,
      elevation: 0,
      shadowColor: primaryIndigo.withValues(alpha: 0.05),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: BorderSide(color: Colors.black.withValues(alpha: 0.05)),
      ),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: lightBackground,
      elevation: 0,
      centerTitle: false,
      iconTheme: IconThemeData(color: textDark),
      titleTextStyle: TextStyle(
        color: textDark,
        fontSize: 24,
        fontWeight: FontWeight.w600,
        fontFamily: 'DM Serif Display',
        letterSpacing: -0.5,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryIndigo,
        foregroundColor: textDark,
        elevation: 0,
        shadowColor: primaryIndigo.withValues(alpha: 0.2),
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 18),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
        textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide(color: Colors.black.withValues(alpha: 0.05)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide(color: Colors.black.withValues(alpha: 0.05)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: primaryIndigo, width: 1.5),
      ),
      labelStyle: TextStyle(color: textDark.withValues(alpha: 0.5)),
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        fontSize: 36,
        fontWeight: FontWeight.w700,
        color: textDark,
        letterSpacing: -1.0,
        fontFamily: 'DM Serif Display',
      ),
      displayMedium: TextStyle(
        fontSize: 28,
        fontWeight: FontWeight.w600,
        color: textDark,
        fontFamily: 'DM Serif Display',
        letterSpacing: -0.5,
      ),
      bodyLarge: TextStyle(
        fontSize: 16,
        color: textDark,
        height: 1.6,
        fontFamily: 'Plus Jakarta Sans',
      ),
      bodyMedium: TextStyle(
        fontSize: 14,
        color: Color(0xFF52525B), // Zinc-600
        height: 1.6,
        fontFamily: 'Plus Jakarta Sans',
      ),
    ),
    dividerColor: const Color(0xFFF4F4F5),
  );
}
