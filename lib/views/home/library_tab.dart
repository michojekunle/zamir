import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../view_models/playlist_view_model.dart';
import '../../view_models/music_view_model.dart';

class LibraryTab extends StatelessWidget {
  const LibraryTab({super.key});

  @override
  Widget build(BuildContext context) {
    final playlistVM = context.watch<PlaylistViewModel>();
    final musicVM = context.watch<MusicViewModel>();

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          const SliverAppBar(
            floating: true,
            title: Text('Your Library'),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _LibrarySection(
                    title: 'Playlists',
                    icon: Icons.queue_music,
                    count: playlistVM.playlists.length,
                    onTap: () {},
                  ),
                  const SizedBox(height: 12),
                  _LibrarySection(
                    title: 'Favorites',
                    icon: Icons.favorite,
                    count: musicVM.favorites.length,
                    onTap: () {},
                  ),
                  const SizedBox(height: 12),
                  _LibrarySection(
                    title: 'Downloaded',
                    icon: Icons.download,
                    count: 0,
                    onTap: () {},
                  ),
                  const SizedBox(height: 32),
                  Text(
                    'Recent Playlists',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 16),
                  ...playlistVM.playlists.map((playlist) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        leading: Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                            color: Theme.of(context)
                                .colorScheme
                                .primary
                                .withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(
                            Icons.queue_music,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                        ),
                        title: Text(playlist.name),
                        subtitle: Text('${playlist.songCount} songs'),
                        trailing: const Icon(Icons.chevron_right),
                        onTap: () {},
                      ),
                    );
                  }).toList(),
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

  const _LibrarySection({
    required this.title,
    required this.icon,
    required this.count,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: isDark 
              ? null 
              : Border.all(color: Colors.grey.shade200),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                icon,
                color: Theme.of(context).colorScheme.primary,
              ),
            ),
            const SizedBox(width: 16),
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
                  Text(
                    '$count items',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right),
          ],
        ),
      ),
    );
  }
}