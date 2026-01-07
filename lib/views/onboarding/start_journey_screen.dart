import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import '../../view_models/onboarding_view_model.dart';
import 'create_handle_screen.dart';

class StartJourneyScreen extends StatelessWidget {
  const StartJourneyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              // Optional: Wrapped in a FadeIn animation if available, otherwise just Text
              Text(
                'Start Your Journey',
                style: Theme.of(context).textTheme.displayLarge?.copyWith(
                  fontSize: 32, // Ensure prompt text size
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Every day should begin and end with worship',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Theme.of(context).textTheme.bodyMedium?.color,
                ),
              ),
              const SizedBox(height: 48),
              _buildFeatureItem(
                context,
                'Curated Playlists',
                'Discover faith-inspired music tailored to your spiritual journey',
                Icons.playlist_play_rounded,
              ),
              const SizedBox(height: 24),
              _buildFeatureItem(
                context,
                'Daily Devotionals',
                'Start each day with scripture and song',
                Icons.calendar_today_rounded,
              ),
              const SizedBox(height: 24),
              _buildFeatureItem(
                context,
                'Personalized',
                'AI-powered recommendations based on your preferences',
                Icons.auto_awesome_rounded,
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const CreateHandleScreen(),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    elevation: 4,
                    shadowColor: Theme.of(
                      context,
                    ).primaryColor.withOpacity(0.4),
                  ),
                  child: const Text('Get Started'),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureItem(
    BuildContext context,
    String title,
    String description,
    IconData icon,
  ) {
    // Determine container color based on theme brightness for better contrast
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final iconBgColor = isDark
        ? Theme.of(context).colorScheme.surface
        : Theme.of(context).colorScheme.primary.withOpacity(0.1);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Theme.of(context).dividerColor.withOpacity(0.05),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: iconBgColor,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(
              icon,
              color: Theme.of(context).colorScheme.primary,
              size: 28,
            ),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w700,
                    fontSize: 18,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  description,
                  style: Theme.of(
                    context,
                  ).textTheme.bodyMedium?.copyWith(height: 1.4),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
