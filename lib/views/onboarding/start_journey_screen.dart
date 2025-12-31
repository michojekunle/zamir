import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import '../../view_models/onboarding_view_model.dart';
import 'create_handle_screen.dart';

class StartJourneyScreen extends StatelessWidget {
  const StartJourneyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              const Text(
                'Start Your Journey',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Every day should begin and end with worship',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 60),
              _buildFeatureItem(
                context,
                'Curated Playlists',
                'Discover faith-inspired music tailored to your spiritual journey',
                Icons.playlist_play_rounded,
              ),
              const SizedBox(height: 32),
              _buildFeatureItem(
                context,
                'Daily Devotionals',
                'Start each day with scripture and song',
                Icons.calendar_today_rounded,
              ),
              const SizedBox(height: 32),
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
                  child: const Text(
                    'Get Started',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
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
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            icon,
            color: Theme.of(context).colorScheme.primary,
            size: 24,
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
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                description,
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ],
          ),
        ),
      ],
    );
  }
}