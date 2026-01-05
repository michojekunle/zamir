import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:just_audio/just_audio.dart';
import '../../view_models/generation_view_model.dart';
import '../../view_models/auth_view_model.dart';
import '../../utils/animations.dart';
import '../home/home_screen.dart';

class GeneratedSongScreen extends StatefulWidget {
  const GeneratedSongScreen({super.key});

  @override
  State<GeneratedSongScreen> createState() => _GeneratedSongScreenState();
}

class _GeneratedSongScreenState extends State<GeneratedSongScreen> {
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool _isPlaying = false;
  Duration _position = Duration.zero;
  Duration _duration = Duration.zero;
  int _currentLyricIndex = 0;
  bool _saved = false;

  List<String> _lyricLines = [];

  @override
  void initState() {
    super.initState();
    _initAudio();
  }

  void _initAudio() async {
    final genVM = context.read<GenerationViewModel>();
    final song = genVM.generatedSong;

    if (song != null) {
      // Parse lyrics into lines
      _lyricLines = song.lyrics
          .split('\n')
          .where((l) => l.trim().isNotEmpty)
          .toList();

      try {
        await _audioPlayer.setUrl(song.audioUrl);
        _duration = _audioPlayer.duration ?? Duration.zero;

        _audioPlayer.positionStream.listen((position) {
          setState(() {
            _position = position;
            // Update current lyric based on position
            if (_lyricLines.isNotEmpty && _duration.inSeconds > 0) {
              final progress =
                  position.inMilliseconds / _duration.inMilliseconds;
              _currentLyricIndex = (progress * _lyricLines.length)
                  .floor()
                  .clamp(0, _lyricLines.length - 1);
            }
          });
        });

        _audioPlayer.playerStateStream.listen((state) {
          setState(() {
            _isPlaying = state.playing;
          });
        });
      } catch (e) {
        debugPrint('Error loading audio: $e');
      }
    }
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }

  void _togglePlayPause() async {
    if (_isPlaying) {
      await _audioPlayer.pause();
    } else {
      await _audioPlayer.play();
    }
  }

  Future<void> _saveToLibrary() async {
    final genVM = context.read<GenerationViewModel>();
    final authVM = context.read<AuthViewModel>();

    if (authVM.firebaseUser != null) {
      await genVM.saveToLibrary(authVM.firebaseUser!.uid);
      setState(() {
        _saved = true;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Saved to your library'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final genVM = context.watch<GenerationViewModel>();
    final song = genVM.generatedSong;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (song == null) {
      return Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: isDark
                ? [const Color(0xFF1A1F26), const Color(0xFF0F1419)]
                : [
                    Theme.of(context).colorScheme.primary.withOpacity(0.1),
                    Colors.white,
                  ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // App bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(
                      icon: Icon(Icons.close),
                      onPressed: () {
                        genVM.reset();
                        Navigator.of(context).pushAndRemoveUntil(
                          MaterialPageRoute(builder: (_) => const HomeScreen()),
                          (route) => false,
                        );
                      },
                    ),
                    Text(
                      'Your Creation',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.share),
                      onPressed: () {
                        // Share functionality
                      },
                    ),
                  ],
                ),
              ),

              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      // Album art
                      Container(
                        width: double.infinity,
                        height: 280,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              Theme.of(context).colorScheme.primary,
                              Theme.of(context).colorScheme.secondary,
                            ],
                          ),
                          borderRadius: BorderRadius.circular(24),
                          boxShadow: [
                            BoxShadow(
                              color: Theme.of(
                                context,
                              ).colorScheme.primary.withOpacity(0.3),
                              blurRadius: 30,
                              offset: const Offset(0, 15),
                            ),
                          ],
                        ),
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            AnimatedWaveform(
                              color: Colors.white.withOpacity(0.3),
                              height: 100,
                              barCount: 40,
                              isAnimating: _isPlaying,
                            ),
                            Icon(
                              Icons.music_note,
                              size: 80,
                              color: Colors.white,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Song title
                      Text(
                        song.title,
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        genVM.scripture,
                        style: TextStyle(
                          fontSize: 16,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Lyrics with typewriter effect
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.surface,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Column(
                          children: [
                            Text(
                              'Lyrics',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            ),
                            const SizedBox(height: 16),
                            if (_lyricLines.isEmpty)
                              TypewriterText(
                                text: song.lyrics,
                                style: TextStyle(fontSize: 16, height: 1.8),
                                charDuration: const Duration(milliseconds: 30),
                              )
                            else
                              ...List.generate(_lyricLines.length, (index) {
                                return Padding(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 6,
                                  ),
                                  child: AnimatedLyricLine(
                                    text: _lyricLines[index],
                                    isActive: index == _currentLyricIndex,
                                    isPast: index < _currentLyricIndex,
                                  ),
                                );
                              }),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Player controls
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(24),
                  ),
                ),
                child: Column(
                  children: [
                    // Progress bar
                    SliderTheme(
                      data: SliderTheme.of(context).copyWith(
                        trackHeight: 4,
                        thumbShape: const RoundSliderThumbShape(
                          enabledThumbRadius: 6,
                        ),
                      ),
                      child: Slider(
                        value: _position.inMilliseconds.toDouble(),
                        max: _duration.inMilliseconds > 0
                            ? _duration.inMilliseconds.toDouble()
                            : 1,
                        onChanged: (value) {
                          _audioPlayer.seek(
                            Duration(milliseconds: value.toInt()),
                          );
                        },
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            _formatDuration(_position),
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          Text(
                            _formatDuration(_duration),
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Controls
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        IconButton(
                          icon: Icon(
                            _saved ? Icons.favorite : Icons.favorite_border,
                            color: _saved ? Colors.red : null,
                          ),
                          iconSize: 28,
                          onPressed: _saveToLibrary,
                        ),
                        IconButton(
                          icon: Icon(Icons.replay_10),
                          iconSize: 32,
                          onPressed: () {
                            final newPosition =
                                _position - const Duration(seconds: 10);
                            _audioPlayer.seek(
                              newPosition > Duration.zero
                                  ? newPosition
                                  : Duration.zero,
                            );
                          },
                        ),
                        GestureDetector(
                          onTap: _togglePlayPause,
                          child: Container(
                            width: 72,
                            height: 72,
                            decoration: BoxDecoration(
                              color: Theme.of(context).colorScheme.primary,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.primary.withOpacity(0.3),
                                  blurRadius: 20,
                                  offset: const Offset(0, 8),
                                ),
                              ],
                            ),
                            child: Icon(
                              _isPlaying ? Icons.pause : Icons.play_arrow,
                              color: Colors.white,
                              size: 36,
                            ),
                          ),
                        ),
                        IconButton(
                          icon: Icon(Icons.forward_10),
                          iconSize: 32,
                          onPressed: () {
                            final newPosition =
                                _position + const Duration(seconds: 10);
                            _audioPlayer.seek(
                              newPosition < _duration ? newPosition : _duration,
                            );
                          },
                        ),
                        IconButton(
                          icon: Icon(Icons.download_outlined),
                          iconSize: 28,
                          onPressed: () {
                            // Download functionality
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatDuration(Duration duration) {
    final minutes = duration.inMinutes;
    final seconds = duration.inSeconds % 60;
    return '${minutes}:${seconds.toString().padLeft(2, '0')}';
  }
}
