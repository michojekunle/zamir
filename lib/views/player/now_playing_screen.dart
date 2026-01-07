import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../view_models/music_view_model.dart';

class NowPlayingScreen extends StatefulWidget {
  const NowPlayingScreen({super.key});

  @override
  State<NowPlayingScreen> createState() => _NowPlayingScreenState();
}

class _NowPlayingScreenState extends State<NowPlayingScreen> {
  // Placeholder state for UI
  double _sliderValue = 0.3;

  @override
  Widget build(BuildContext context) {
    final musicVM = context.watch<MusicViewModel>();
    // Use a placeholder song if none selected for UI testing
    final song =
        musicVM.currentSong ??
        (musicVM.sampleSongs.isNotEmpty ? musicVM.sampleSongs.first : null);

    if (song == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('No song playing')),
      );
    }

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.keyboard_arrow_down_rounded),
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
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
              child: AspectRatio(
                aspectRatio: 1, // Square
                child: Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(40),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 30,
                        offset: const Offset(0, 15),
                      ),
                    ],
                    image: const DecorationImage(
                      image: AssetImage(
                        'assets/images/album_art_placeholder.png',
                      ), // Need generic asset or gradient
                      fit: BoxFit.cover,
                    ),
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
                            const Color(0xFF6C63FF).withOpacity(0.3),
                            const Color(0xFF2EC4B6).withOpacity(0.1),
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                      ),
                      child: Center(
                        child: Icon(
                          Icons.grain,
                          size: 100,
                          color: Colors.white.withOpacity(0.2),
                        ), // Placeholder visual
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // Song Info
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  Text(
                    song.title,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Acoustic Folk Style', // Placeholder style or get from song
                    style: TextStyle(
                      color: const Color(0xFF4299E1), // Blue/Link color
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                    ),
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
                    song.verse, // Using 'verse' content as the subtitle text
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Theme.of(
                        context,
                      ).textTheme.bodyMedium?.color?.withOpacity(0.7),
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
                    'He leads me beside quiet waters', // Hardcoded secondary line from mockup or use data
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
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
              child: Column(
                children: [
                  // Slider
                  SliderTheme(
                    data: SliderTheme.of(context).copyWith(
                      activeTrackColor: const Color(0xFF2F80ED),
                      inactiveTrackColor: Theme.of(
                        context,
                      ).dividerColor.withOpacity(0.2),
                      thumbColor: Colors
                          .transparent, // Mockup often hides thumb or makes it small
                      overlayShape: SliderComponentShape.noOverlay,
                      trackHeight: 4,
                      thumbShape: const RoundSliderThumbShape(
                        enabledThumbRadius: 0,
                      ), // Hiding thumb for cleaner look
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
                  const SizedBox(height: 8),
                  Row(
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
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.shuffle_rounded),
                        color: Theme.of(context).disabledColor,
                        iconSize: 24,
                        onPressed: () {},
                      ),
                      IconButton(
                        icon: const Icon(Icons.skip_previous_rounded),
                        color: Theme.of(context).textTheme.bodyLarge?.color,
                        iconSize: 32,
                        onPressed: () => musicVM.previousSong(),
                      ),
                      Container(
                        width: 72,
                        height: 72,
                        decoration: const BoxDecoration(
                          color: Color(0xFF2F80ED), // Bright Blue
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: Color(0x4D2F80ED),
                              blurRadius: 20,
                              offset: Offset(0, 10),
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
                      IconButton(
                        icon: const Icon(Icons.skip_next_rounded),
                        color: Theme.of(context).textTheme.bodyLarge?.color,
                        iconSize: 32,
                        onPressed: () => musicVM.nextSong(),
                      ),
                      IconButton(
                        icon: const Icon(Icons.repeat_rounded),
                        color: Theme.of(context).disabledColor,
                        iconSize: 24,
                        onPressed: () {},
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
