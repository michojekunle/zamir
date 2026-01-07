import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../view_models/music_view_model.dart';
import 'home_tab.dart';
import 'library_tab.dart';
import '../settings/settings_screen.dart';
import '../generate/ai_generation_screen.dart';
import '../player/now_playing_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final musicVM = context.watch<MusicViewModel>();

    // Current screen content
    Widget currentScreen;
    switch (_selectedIndex) {
      case 0:
        currentScreen = const HomeTab();
        break;
      case 1:
        currentScreen = const LibraryTab();
        break;
      case 2:
        // Create tab is handled by button, but if selected via index, show gen screen
        // ideally we push it, so this might be a placeholder or we prevent selection
        currentScreen = const SizedBox();
        break;
      case 3:
        currentScreen = const _BibleTabPlaceholder();
        break;
      case 4:
        currentScreen =
            const SettingsScreen(); // Note: SettingsScreen usually has its own Scaffold
        break;
      default:
        currentScreen = const HomeTab();
    }

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      // We stack the body options or just switch them.
      // Using IndexedStack prevents rebuilds but we'll stick to switch for now for simplicity of settings
      body: Stack(
        children: [
          // Content
          Positioned.fill(
            child: _selectedIndex == 4
                ? Navigator(
                    onGenerateRoute: (settings) => MaterialPageRoute(
                      builder: (_) => const SettingsScreen(),
                    ),
                  )
                : (_selectedIndex == 2 ? const SizedBox() : currentScreen),
            // Case 2 handled by FAB, but if logic fails.
          ),

          // Custom Bottom Navigation
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Mini Player
                if (musicVM.currentSong != null)
                  GestureDetector(
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => const NowPlayingScreen(),
                        ),
                      );
                    },
                    child: Container(
                      margin: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      decoration: BoxDecoration(
                        color: Theme.of(context).cardTheme.color,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Theme.of(
                              context,
                            ).shadowColor.withOpacity(0.08),
                            blurRadius: 15,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: Theme.of(
                                context,
                              ).colorScheme.primary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Icon(
                              Icons.music_note,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  musicVM.currentSong!.title,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  musicVM.currentSong!.scripture,
                                  style: const TextStyle(fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: Icon(
                              musicVM.isPlaying
                                  ? Icons.pause_rounded
                                  : Icons.play_arrow_rounded,
                            ),
                            onPressed: () => musicVM.togglePlayPause(),
                          ),
                        ],
                      ),
                    ),
                  ),

                // Nav Bar
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 0,
                    vertical: 0,
                  ),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardTheme.color,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 20,
                        offset: const Offset(0, -5),
                      ),
                    ],
                  ),
                  child: SafeArea(
                    child: SizedBox(
                      height: 70,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _NavItem(
                            icon: Icons.home_rounded,
                            label: 'Home',
                            isSelected: _selectedIndex == 0,
                            onTap: () => setState(() => _selectedIndex = 0),
                          ),
                          _NavItem(
                            icon: Icons.library_music_rounded,
                            label: 'Library',
                            isSelected: _selectedIndex == 1,
                            onTap: () => setState(() => _selectedIndex = 1),
                          ),
                          // Center Prompt Button
                          GestureDetector(
                            onTap: () {
                              // Open Generate Screen
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (_) => const AIGenerationScreen(),
                                ),
                              );
                            },
                            child: Container(
                              width: 56,
                              height: 56,
                              decoration: BoxDecoration(
                                color: Theme.of(
                                  context,
                                ).colorScheme.primary, // Green/Primary
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.primary.withOpacity(0.4),
                                    blurRadius: 15,
                                    offset: const Offset(0, 8),
                                  ),
                                ],
                              ),
                              child: const Icon(
                                Icons.add_rounded,
                                color: Colors.white,
                                size: 32,
                              ),
                            ),
                          ),
                          _NavItem(
                            icon: Icons.menu_book_rounded,
                            label: 'Bible',
                            isSelected: _selectedIndex == 3,
                            onTap: () => setState(() => _selectedIndex = 3),
                          ),
                          _NavItem(
                            icon: Icons.settings_rounded,
                            label: 'Settings',
                            isSelected: _selectedIndex == 4,
                            onTap: () => setState(() => _selectedIndex = 4),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        width: 60,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: isSelected
                  ? Theme.of(context).colorScheme.primary
                  : Theme.of(context).disabledColor,
              size: 26,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                color: isSelected
                    ? Theme.of(context).colorScheme.primary
                    : Theme.of(context).disabledColor,
                fontSize: 10,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BibleTabPlaceholder extends StatelessWidget {
  const _BibleTabPlaceholder();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bible')),
      body: const Center(child: Text('Bible Tab Placeholder')),
    );
  }
}
