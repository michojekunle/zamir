import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../view_models/music_view_model.dart';

/// Loop mode for playback
enum LoopMode { off, all, once }

class NowPlayingScreen extends StatefulWidget {
  const NowPlayingScreen({super.key});

  /// Creates a slide-up route to this screen.
  /// Use this everywhere instead of MaterialPageRoute to guarantee a
  /// bottom-to-top transition that dismisses by sliding down.
  static Route<void> slideUpRoute() {
    return PageRouteBuilder(
      pageBuilder: (context, animation, secondaryAnimation) =>
          const NowPlayingScreen(),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(0.0, 1.0);
        const end = Offset.zero;
        const curve = Curves.easeInOut;
        final tween = Tween(
          begin: begin,
          end: end,
        ).chain(CurveTween(curve: curve));
        return SlideTransition(position: animation.drive(tween), child: child);
      },
      transitionDuration: const Duration(milliseconds: 350),
      reverseTransitionDuration: const Duration(milliseconds: 300),
      fullscreenDialog: true,
    );
  }

  @override
  State<NowPlayingScreen> createState() => _NowPlayingScreenState();
}

class _NowPlayingScreenState extends State<NowPlayingScreen> {
  double _sliderValue = 0.3;
  LoopMode _loopMode = LoopMode.off;

  void _cycleLoopMode() {
    setState(() {
      switch (_loopMode) {
        case LoopMode.off:
          _loopMode = LoopMode.all;
          break;
        case LoopMode.all:
          _loopMode = LoopMode.once;
          break;
        case LoopMode.once:
          _loopMode = LoopMode.off;
          break;
      }
    });

    // Show feedback
    final label = switch (_loopMode) {
      LoopMode.off => 'Loop Off',
      LoopMode.all => 'Loop All',
      LoopMode.once => 'Loop Once',
    };

    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(label),
        duration: const Duration(seconds: 1),
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.only(bottom: 80, left: 40, right: 40),
      ),
    );
  }

  IconData get _loopIcon {
    return switch (_loopMode) {
      LoopMode.off => Icons.repeat_rounded,
      LoopMode.all => Icons.repeat_rounded,
      LoopMode.once => Icons.repeat_one_rounded,
    };
  }

  Color _loopColor(BuildContext context) {
    return switch (_loopMode) {
      LoopMode.off => Theme.of(context).disabledColor,
      LoopMode.all => const Color(0xFFC9A042),
      LoopMode.once => const Color(0xFFC9A042),
    };
  }

  @override
  Widget build(BuildContext context) {
    final musicVM = context.watch<MusicViewModel>();
    final song =
        musicVM.currentSong ??
        (musicVM.sampleSongs.isNotEmpty ? musicVM.sampleSongs.first : null);

    if (song == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('No song playing')),
      );
    }

    final isFav = musicVM.isFavorite(song.id);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.keyboard_arrow_down_rounded, size: 32),
          onPressed: () => Navigator.of(context).pop(),
          color: Theme.of(context).textTheme.bodyLarge?.color,
        ),
        title: Column(
          children: [
            Text(
              'NOW PLAYING',
              style: Theme.of(context).textTheme.labelMedium?.copyWith(
                letterSpacing: 1.5,
                color: Theme.of(context).disabledColor,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Bible Verse AI',
              style: Theme.of(
                context,
              ).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.more_horiz_rounded),
            onPressed: () {},
            color: Theme.of(context).textTheme.bodyLarge?.color,
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).padding.bottom + 8,
        ),
        child: Column(
          children: [
            // Album Art
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
              child: AspectRatio(
                aspectRatio: 1,
                child: Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(40),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.2),
                        blurRadius: 30,
                        offset: const Offset(0, 15),
                      ),
                    ],
                    gradient: LinearGradient(
                      colors: [Colors.blueGrey.shade800, Colors.black],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(40),
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            const Color(0xFFC9A042).withValues(alpha: 0.3),
                            const Color(0xFFE6D070).withValues(alpha: 0.1),
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                      ),
                      child: Center(
                        child: Icon(
                          Icons.grain,
                          size: 100,
                          color: Colors.white.withValues(alpha: 0.2),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // Song Info + Like Button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          song.title,
                          style: Theme.of(context).textTheme.headlineSmall
                              ?.copyWith(fontWeight: FontWeight.bold),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          song.scripture,
                          style: const TextStyle(
                            color: Color(0xFFC9A042),
                            fontWeight: FontWeight.w600,
                            fontSize: 15,
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Like / Favorite Button
                  IconButton(
                    icon: Icon(
                      isFav
                          ? Icons.favorite_rounded
                          : Icons.favorite_border_rounded,
                    ),
                    color: isFav
                        ? Colors.redAccent
                        : Theme.of(context).disabledColor,
                    iconSize: 28,
                    onPressed: () {
                      musicVM.toggleFavorite(song.id);
                      ScaffoldMessenger.of(context).clearSnackBars();
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            musicVM.isFavorite(song.id)
                                ? 'Added to Favorites'
                                : 'Removed from Favorites',
                          ),
                          duration: const Duration(seconds: 1),
                          behavior: SnackBarBehavior.floating,
                          margin: const EdgeInsets.only(
                            bottom: 80,
                            left: 40,
                            right: 40,
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),

            const Spacer(),

            // Lyrics / Verse
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Column(
                children: [
                  Text(
                    song.verse,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Theme.of(
                        context,
                      ).textTheme.bodyMedium?.color?.withValues(alpha: 0.7),
                      fontWeight: FontWeight.w500,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    song.scripture,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      height: 1.3,
                    ),
                    textAlign: TextAlign.center,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'He leads me beside quiet waters',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Theme.of(context).disabledColor,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const Spacer(),

            // Controls
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  // Progress Slider
                  SliderTheme(
                    data: SliderTheme.of(context).copyWith(
                      activeTrackColor: const Color(0xFFC9A042),
                      inactiveTrackColor: Theme.of(
                        context,
                      ).dividerColor.withValues(alpha: 0.2),
                      thumbColor: const Color(0xFFC9A042),
                      overlayShape: SliderComponentShape.noOverlay,
                      trackHeight: 4,
                      thumbShape: const RoundSliderThumbShape(
                        enabledThumbRadius: 6,
                      ),
                    ),
                    child: Slider(
                      value: _sliderValue,
                      onChanged: (val) {
                        setState(() {
                          _sliderValue = val;
                        });
                      },
                    ),
                  ),
                  const SizedBox(height: 4),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '1:12',
                          style: TextStyle(
                            color: Theme.of(context).disabledColor,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          '3:45',
                          style: TextStyle(
                            color: Theme.of(context).disabledColor,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Playback Controls
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      // Shuffle
                      IconButton(
                        icon: const Icon(Icons.shuffle_rounded),
                        color: Theme.of(context).disabledColor,
                        iconSize: 24,
                        onPressed: () {},
                      ),
                      // Previous
                      IconButton(
                        icon: const Icon(Icons.skip_previous_rounded),
                        color: Theme.of(context).textTheme.bodyLarge?.color,
                        iconSize: 32,
                        onPressed: () => musicVM.previousSong(),
                      ),
                      // Play/Pause
                      Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          color: const Color(0xFFC9A042),
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: const Color(
                                0xFFC9A042,
                              ).withValues(alpha: 0.3),
                              blurRadius: 20,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        child: IconButton(
                          icon: Icon(
                            musicVM.isPlaying
                                ? Icons.pause_rounded
                                : Icons.play_arrow_rounded,
                            color: Colors.white,
                          ),
                          iconSize: 36,
                          onPressed: () => musicVM.togglePlayPause(),
                        ),
                      ),
                      // Next
                      IconButton(
                        icon: const Icon(Icons.skip_next_rounded),
                        color: Theme.of(context).textTheme.bodyLarge?.color,
                        iconSize: 32,
                        onPressed: () => musicVM.nextSong(),
                      ),
                      // Loop (3-state: off → all → once → off)
                      IconButton(
                        icon: Icon(_loopIcon),
                        color: _loopColor(context),
                        iconSize: 24,
                        onPressed: _cycleLoopMode,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
