import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../view_models/music_view_model.dart';
import '../../view_models/auth_view_model.dart';
import '../../view_models/generation_view_model.dart';
import '../../utils/constants.dart';
import '../settings/settings_screen.dart';
import '../generate/ai_generation_screen.dart';
import '../player/now_playing_screen.dart';
import 'widgets/daily_verse_card.dart';

class HomeTab extends StatelessWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    final musicVM = context.watch<MusicViewModel>();
    final authVM = context.watch<AuthViewModel>();

    // Greeting logic
    final hour = DateTime.now().hour;
    String greeting = 'Good morning,';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon,';
    if (hour >= 17) greeting = 'Good evening,';

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 10),
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 20,
                        backgroundColor: Theme.of(context).cardTheme.color,
                        backgroundImage: authVM.photoUrl != null
                            ? NetworkImage(authVM.photoUrl!)
                            : null, // Add default avatar asset if needed
                        child: authVM.photoUrl == null
                            ? Icon(
                                Icons.person,
                                color: Theme.of(context).primaryColor,
                              )
                            : null,
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            greeting,
                            style: Theme.of(context).textTheme.bodySmall
                                ?.copyWith(
                                  color: Theme.of(context).disabledColor,
                                ),
                          ),
                          Text(
                            authVM.displayName.isNotEmpty
                                ? authVM.displayName
                                : 'Friend',
                            style: Theme.of(context).textTheme.titleLarge
                                ?.copyWith(fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardTheme.color,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.notifications_none_rounded),
                      onPressed: () {},
                      color: Theme.of(context).textTheme.bodyLarge?.color,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Daily Verse Hero Card
              DailyVerseCard(
                verse: 'The Lord is my shepherd; I shall not want.',
                reference: 'Psalm 23:1',
                onListenTap: () {
                  // Navigate to a daily mix or play context
                  // For now, just play a sample
                  if (musicVM.sampleSongs.isNotEmpty) {
                    musicVM.playSong(musicVM.sampleSongs.first);
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const NowPlayingScreen(),
                      ),
                    );
                  }
                },
              ),
              const SizedBox(height: 24),

              // Generate Input Trigger (Optional, based on mockup looking like a search bar)
              GestureDetector(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const AIGenerationScreen(),
                    ),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardTheme.color,
                    borderRadius: BorderRadius.circular(30),
                    border: Border.all(
                      color: Theme.of(context).dividerColor.withOpacity(0.1),
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.auto_awesome,
                        color: Theme.of(context).colorScheme.primary,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Type a verse or feeling to generate',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Theme.of(context).disabledColor,
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.primary,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.arrow_forward,
                          color: Colors.white,
                          size: 16,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Browse by Mood
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Browse by Mood',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () {},
                    child: Text(
                      'See All',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(
                height: 40,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: MoodOptions.moods.length,
                  itemBuilder: (context, index) {
                    final mood = MoodOptions.moods[index];
                    return Padding(
                      padding: const EdgeInsets.only(right: 10),
                      child: ActionChip(
                        label: Text(mood['name']),
                        avatar:
                            null, // Removed emoji for cleaner look as per mockup, or keep if desired
                        backgroundColor: index == 0
                            ? Theme.of(context).colorScheme.primary
                            : Theme.of(context).cardTheme.color,
                        labelStyle: TextStyle(
                          color: index == 0
                              ? Colors.white
                              : Theme.of(context).textTheme.bodyMedium?.color,
                          fontWeight: FontWeight.w600,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                          side: BorderSide.none,
                        ),
                        onPressed: () {
                          // Navigate or filter
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => const AIGenerationScreen(),
                            ),
                          );
                        },
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 32),

              // Community Favorites
              Text(
                'Community Favorites',
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              SizedBox(
                height: 160,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: 5,
                  separatorBuilder: (_, __) => const SizedBox(width: 16),
                  itemBuilder: (context, index) {
                    return _CommunitySongCard(
                      title: index == 0 ? 'Sermon Mount' : 'Proverbs 3:5',
                      subtitle: index == 0 ? 'LoFi Beats' : 'Orchestral',
                      imageUrl: 'assets/images/cover_$index.png', // Placeholder
                      color: index.isEven
                          ? Colors.teal.shade200
                          : Colors.orange.shade200, // Placeholder color
                    );
                  },
                ),
              ),
              const SizedBox(height: 32),

              // Recently Generated
              Text(
                'Recently Generated',
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              ListView.separated(
                physics: const NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                itemCount: 3,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(12),
                        gradient: LinearGradient(
                          colors: [
                            Colors.purple.shade200,
                            Colors.blue.shade200,
                          ],
                        ),
                      ),
                    ),
                    title: const Text(
                      'Isaiah 40:31 - Strength',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: const Text('Piano Solo • 3:42'),
                    trailing: const Icon(Icons.more_vert),
                  );
                },
              ),

              const SizedBox(height: 100), // Bottom padding
            ],
          ),
        ),
      ),
    );
  }
}

class _CommunitySongCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String imageUrl;
  final Color color;

  const _CommunitySongCard({
    required this.title,
    required this.subtitle,
    required this.imageUrl,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Container(
            width: 140,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(16),
              image: const DecorationImage(
                image: AssetImage(
                  'assets/images/placeholder_cover.png',
                ), // Fallback
                fit: BoxFit.cover,
                opacity: 0.8,
              ),
            ),
            child: Stack(
              children: [
                Center(
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.8),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.play_arrow_rounded,
                      color: Colors.black,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        Text(
          subtitle,
          style: TextStyle(
            color: Theme.of(context).disabledColor,
            fontSize: 12,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ],
    );
  }
}
