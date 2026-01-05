import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../view_models/playlist_view_model.dart';
import '../../view_models/music_view_model.dart';
import '../../models/app_models.dart';
import '../player/now_playing_screen.dart';

class PlaylistDetailScreen extends StatelessWidget {
  final Playlist playlist;

  const PlaylistDetailScreen({super.key, required this.playlist});

  @override
  Widget build(BuildContext context) {
    final musicVM = context.watch<MusicViewModel>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Header with gradient
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Theme.of(context).colorScheme.primary,
                      Theme.of(context).colorScheme.primary.withOpacity(0.3),
                      Theme.of(context).scaffoldBackgroundColor,
                    ],
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Playlist icon
                        Container(
                          width: 120,
                          height: 120,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Icon(
                            Icons.queue_music,
                            size: 60,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 24),
                        Text(
                          playlist.name,
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${playlist.songCount} songs • ${_formatDuration(playlist.totalDuration)}',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.8),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Action buttons
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: playlist.songs.isNotEmpty
                          ? () {
                              musicVM.playSong(playlist.songs.first);
                            }
                          : null,
                      icon: Icon(Icons.play_arrow),
                      label: Text('Play All'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: playlist.songs.isNotEmpty
                          ? () {
                              final shuffled = List<Song>.from(playlist.songs)
                                ..shuffle();
                              musicVM.playSong(shuffled.first);
                            }
                          : null,
                      icon: Icon(Icons.shuffle),
                      label: Text('Shuffle'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Song list
          if (playlist.songs.isEmpty)
            SliverFillRemaining(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.music_off,
                      size: 64,
                      color: Theme.of(
                        context,
                      ).colorScheme.primary.withOpacity(0.3),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No songs yet',
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Create some music to add here!',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
            )
          else
            SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final song = playlist.songs[index];
                final isPlaying = musicVM.currentSong?.id == song.id;

                return ListTile(
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 4,
                  ),
                  leading: Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: isPlaying
                            ? [
                                Theme.of(context).colorScheme.primary,
                                Theme.of(context).colorScheme.secondary,
                              ]
                            : [
                                Theme.of(
                                  context,
                                ).colorScheme.primary.withOpacity(0.2),
                                Theme.of(
                                  context,
                                ).colorScheme.primary.withOpacity(0.1),
                              ],
                      ),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      isPlaying ? Icons.pause : Icons.music_note,
                      color: isPlaying
                          ? Colors.white
                          : Theme.of(context).colorScheme.primary,
                    ),
                  ),
                  title: Text(
                    song.title,
                    style: TextStyle(
                      fontWeight: isPlaying
                          ? FontWeight.w600
                          : FontWeight.normal,
                      color: isPlaying
                          ? Theme.of(context).colorScheme.primary
                          : null,
                    ),
                  ),
                  subtitle: Text(song.scripture),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        _formatSongDuration(song.duration),
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      IconButton(
                        icon: Icon(Icons.more_vert),
                        onPressed: () => _showSongOptions(context, song),
                      ),
                    ],
                  ),
                  onTap: () {
                    musicVM.playSong(song);
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const NowPlayingScreen(),
                      ),
                    );
                  },
                );
              }, childCount: playlist.songs.length),
            ),

          // Bottom padding
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }

  void _showSongOptions(BuildContext context, Song song) {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: Icon(Icons.play_arrow),
                title: Text('Play'),
                onTap: () {
                  Navigator.pop(context);
                  context.read<MusicViewModel>().playSong(song);
                },
              ),
              ListTile(
                leading: Icon(Icons.favorite_border),
                title: Text('Add to favorites'),
                onTap: () {
                  Navigator.pop(context);
                  context.read<MusicViewModel>().toggleFavorite(song.id);
                },
              ),
              ListTile(
                leading: Icon(Icons.delete_outline),
                title: Text('Remove from playlist'),
                onTap: () {
                  Navigator.pop(context);
                  // Remove from playlist logic
                },
              ),
            ],
          ),
        );
      },
    );
  }

  String _formatDuration(Duration duration) {
    final hours = duration.inHours;
    final minutes = duration.inMinutes % 60;
    if (hours > 0) {
      return '$hours hr $minutes min';
    }
    return '$minutes min';
  }

  String _formatSongDuration(Duration duration) {
    final minutes = duration.inMinutes;
    final seconds = duration.inSeconds % 60;
    return '$minutes:${seconds.toString().padLeft(2, '0')}';
  }
}
