import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../view_models/generation_view_model.dart';
import '../../view_models/auth_view_model.dart';
import '../../utils/constants.dart';
import '../../utils/animations.dart';
import 'generating_screen.dart';

class AIGenerationScreen extends StatefulWidget {
  const AIGenerationScreen({super.key});

  @override
  State<AIGenerationScreen> createState() => _AIGenerationScreenState();
}

class _AIGenerationScreenState extends State<AIGenerationScreen> {
  final TextEditingController _scriptureController = TextEditingController();
  final TextEditingController _verseController = TextEditingController();
  String? _selectedMood;

  @override
  void dispose() {
    _scriptureController.dispose();
    _verseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final genVM = context.watch<GenerationViewModel>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              floating: true,
              title: const Text('Create'),
              centerTitle: true,
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Text(
                      'What verse speaks\nto you today?',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        height: 1.2,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Enter a scripture and we\'ll create a unique melody just for you.',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    const SizedBox(height: 32),

                    // Quick inspiration chips
                    Text(
                      'Quick Inspiration',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 40,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: ScriptureSamples.samples.length,
                        itemBuilder: (context, index) {
                          final sample = ScriptureSamples.samples[index];
                          return Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: ActionChip(
                              label: Text(sample['reference']!),
                              onPressed: () {
                                _scriptureController.text =
                                    sample['reference']!;
                                _verseController.text = sample['verse']!;
                                genVM.setScripture(sample['reference']!);
                                genVM.setVerse(sample['verse']!);
                              },
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Scripture reference input
                    TextField(
                      controller: _scriptureController,
                      onChanged: genVM.setScripture,
                      decoration: InputDecoration(
                        labelText: 'Scripture Reference',
                        hintText: 'e.g., Psalm 23:1-6',
                        prefixIcon: Icon(Icons.book),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Verse input
                    TextField(
                      controller: _verseController,
                      onChanged: genVM.setVerse,
                      maxLines: 4,
                      decoration: InputDecoration(
                        labelText: 'Verse Text',
                        hintText: 'Enter the scripture verse...',
                        alignLabelWithHint: true,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Mood selection
                    Text(
                      'How are you feeling?',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: MoodOptions.moods.map((mood) {
                        final isSelected = _selectedMood == mood['name'];
                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              _selectedMood = isSelected ? null : mood['name'];
                            });
                            genVM.setMood(_selectedMood);
                          },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 10,
                            ),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? Color(mood['color'])
                                  : Theme.of(context).colorScheme.surface,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: isSelected
                                    ? Color(mood['color'])
                                    : Theme.of(context).dividerColor,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(mood['emoji']),
                                const SizedBox(width: 6),
                                Text(
                                  mood['name'],
                                  style: TextStyle(
                                    color: isSelected ? Colors.white : null,
                                    fontWeight: isSelected
                                        ? FontWeight.w600
                                        : FontWeight.normal,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 32),

                    // Generate button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: genVM.canGenerate
                            ? () {
                                genVM.generate();
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (_) => const GeneratingScreen(),
                                  ),
                                );
                              }
                            : null,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.auto_awesome),
                            const SizedBox(width: 8),
                            Text(
                              'Generate Music',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Recent generations
                    if (genVM.generatedSongs.isNotEmpty) ...[
                      Text(
                        'Recent Creations',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 16),
                      ...genVM.generatedSongs.take(5).map((song) {
                        return ListTile(
                          leading: Container(
                            width: 50,
                            height: 50,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Theme.of(context).colorScheme.primary,
                                  Theme.of(context).colorScheme.secondary,
                                ],
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Icon(Icons.music_note, color: Colors.white),
                          ),
                          title: Text(song.title),
                          subtitle: Text(song.scripture ?? ''),
                          trailing: Icon(Icons.play_circle_fill),
                          onTap: () {
                            // Play the song
                          },
                        );
                      }),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
