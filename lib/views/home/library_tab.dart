import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../view_models/playlist_view_model.dart';
import '../../view_models/music_view_model.dart';
import '../player/now_playing_screen.dart';

class LibraryTab extends StatefulWidget {
  const LibraryTab({super.key});

  @override
  State<LibraryTab> createState() => _LibraryTabState();
}

class _LibraryTabState extends State<LibraryTab> {
  bool _showFavorites = false;

  @override
  Widget build(BuildContext context) {
    final playlistVM = context.watch<PlaylistViewModel>();
    final musicVM = context.watch<MusicViewModel>();

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            floating: true,
            title: Text(
              'Your Library',
              style: Theme.of(
                context,
              ).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            backgroundColor: Theme.of(context).scaffoldBackgroundColor,
            surfaceTintColor: Colors.transparent,
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _LibrarySection(
                    title: 'Playlists',
                    icon: Icons.queue_music_rounded,
                    count: playlistVM.playlists.length,
                    onTap: () {},
                  ),
                  const SizedBox(height: 12),
                  _LibrarySection(
                    title: 'Favorites',
                    icon: Icons.favorite_rounded,
                    count: musicVM.favorites.length,
                    isExpanded: _showFavorites,
                    onTap: () {
                      setState(() {
                        _showFavorites = !_showFavorites;
                      });
                    },
                  ),

                  // Favorite Songs List
                  if (_showFavorites) ...[
                    const SizedBox(height: 12),
                    if (musicVM.favorites.isEmpty)
                      Padding(
                        padding: const EdgeInsets.all(20),
                        child: Center(
                          child: Column(
                            children: [
                              Icon(
                                Icons.favorite_border_rounded,
                                size: 48,
                                color: Theme.of(
                                  context,
                                ).disabledColor.withValues(alpha: 0.3),
                              ),
                              const SizedBox(height: 12),
                              Text(
                                'No favorites yet',
                                style: TextStyle(
                                  color: Theme.of(context).disabledColor,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Tap the heart icon on songs to save them here',
                                style: TextStyle(
                                  color: Theme.of(context).disabledColor,
                                  fontSize: 13,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),
                      )
                    else
                      ...musicVM.favorites.map((song) {
                        final isPlaying = musicVM.currentSong?.id == song.id;
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Container(
                            decoration: BoxDecoration(
                              color: isPlaying
                                  ? Theme.of(context).colorScheme.primary
                                        .withValues(alpha: 0.08)
                                  : Theme.of(context).cardTheme.color,
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: [
                                BoxShadow(
                                  color: Theme.of(
                                    context,
                                  ).shadowColor.withValues(alpha: 0.03),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: ListTile(
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 4,
                              ),
                              leading: Container(
                                width: 48,
                                height: 48,
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: isPlaying
                                        ? [
                                            Theme.of(
                                              context,
                                            ).colorScheme.primary,
                                            Theme.of(
                                              context,
                                            ).colorScheme.secondary,
                                          ]
                                        : [
                                            Theme.of(context)
                                                .colorScheme
                                                .primary
                                                .withValues(alpha: 0.15),
                                            Theme.of(context)
                                                .colorScheme
                                                .secondary
                                                .withValues(alpha: 0.15),
                                          ],
                                  ),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Icon(
                                  isPlaying
                                      ? Icons.pause_rounded
                                      : Icons.music_note_rounded,
                                  color: isPlaying
                                      ? Colors.white
                                      : Theme.of(context).colorScheme.primary,
                                  size: 22,
                                ),
                              ),
                              title: Text(
                                song.title,
                                style: TextStyle(
                                  fontWeight: isPlaying
                                      ? FontWeight.bold
                                      : FontWeight.w600,
                                  fontSize: 15,
                                  color: isPlaying
                                      ? Theme.of(context).colorScheme.primary
                                      : null,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              subtitle: Text(
                                song.scripture,
                                style: Theme.of(context).textTheme.bodySmall,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              trailing: IconButton(
                                icon: const Icon(
                                  Icons.favorite_rounded,
                                  color: Colors.redAccent,
                                ),
                                iconSize: 22,
                                onPressed: () {
                                  musicVM.toggleFavorite(song.id);
                                },
                              ),
                              onTap: () {
                                musicVM.playSong(song);
                                Navigator.of(
                                  context,
                                ).push(NowPlayingScreen.slideUpRoute());
                              },
                            ),
                          ),
                        );
                      }),
                  ],

                  const SizedBox(height: 12),
                  _LibrarySection(
                    title: 'Downloaded',
                    icon: Icons.download_rounded,
                    count: 0,
                    onTap: () {},
                  ),
                  const SizedBox(height: 32),
                  Text(
                    'Recent Playlists',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  if (playlistVM.playlists.isEmpty)
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.all(32.0),
                        child: Text(
                          'No playlists yet',
                          style: TextStyle(
                            color: Theme.of(context).disabledColor,
                          ),
                        ),
                      ),
                    )
                  else
                    ...playlistVM.playlists.map((playlist) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Container(
                          decoration: BoxDecoration(
                            color: Theme.of(context).cardTheme.color,
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: Theme.of(
                                  context,
                                ).shadowColor.withValues(alpha: 0.04),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: ListTile(
                            contentPadding: const EdgeInsets.all(12),
                            leading: Container(
                              width: 50,
                              height: 50,
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    Theme.of(context).colorScheme.primary
                                        .withValues(alpha: 0.2),
                                    Theme.of(context).colorScheme.secondary
                                        .withValues(alpha: 0.2),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Icon(
                                Icons.queue_music_rounded,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            ),
                            title: Text(
                              playlist.name,
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            subtitle: Text(
                              '${playlist.songCount} songs',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                            trailing: Icon(
                              Icons.chevron_right_rounded,
                              color: Theme.of(context).disabledColor,
                            ),
                            onTap: () {},
                          ),
                        ),
                      );
                    }),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _LibrarySection extends StatelessWidget {
  final String title;
  final IconData icon;
  final int count;
  final VoidCallback onTap;
  final bool isExpanded;

  const _LibrarySection({
    required this.title,
    required this.icon,
    required this.count,
    required this.onTap,
    this.isExpanded = false,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).cardTheme.color,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Theme.of(context).shadowColor.withValues(alpha: 0.04),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Theme.of(
                  context,
                ).colorScheme.primary.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(
                icon,
                color: Theme.of(context).colorScheme.primary,
                size: 24,
              ),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '$count items',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            AnimatedRotation(
              turns: isExpanded ? 0.25 : 0,
              duration: const Duration(milliseconds: 200),
              child: Icon(
                Icons.chevron_right_rounded,
                color: Theme.of(context).disabledColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
