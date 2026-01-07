import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../view_models/generation_view_model.dart';
import '../../utils/constants.dart';
import 'generating_screen.dart';
import 'widgets/style_selection_grid.dart';

class AIGenerationScreen extends StatefulWidget {
  const AIGenerationScreen({super.key});

  @override
  State<AIGenerationScreen> createState() => _AIGenerationScreenState();
}

class _AIGenerationScreenState extends State<AIGenerationScreen> {
  final TextEditingController _scriptureController = TextEditingController();
  double _duration = 2.5; // Default 2 min 30 sec (represented as float minutes)
  String? _selectedStyle = 'Meditation';

  @override
  void dispose() {
    _scriptureController.dispose();
    super.dispose();
  }

  String _formatDuration(double value) {
    final minutes = value.floor();
    final seconds = ((value - minutes) * 60).round();
    return '$minutes min ${seconds.toString().padLeft(2, '0')} sec';
  }

  @override
  Widget build(BuildContext context) {
    final genVM = context.watch<GenerationViewModel>();

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          'Compose from Scripture',
          style: Theme.of(
            context,
          ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.history_rounded),
            onPressed: () {
              // Show history
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Your Inspiration
            Text(
              'Your Inspiration',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Container(
              height: 180,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white, // White card for light mode, dark for dark
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 15,
                    offset: const Offset(0, 5),
                  ),
                ],
                border: Border.all(
                  color: Theme.of(context).dividerColor.withOpacity(0.1),
                ),
              ),
              child: Column(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _scriptureController,
                      maxLines: null,
                      decoration: InputDecoration(
                        hintText:
                            'Type a verse like Psalm 23, or a theme like \'Hope\' to guide the melody...',
                        hintStyle: TextStyle(
                          color: Theme.of(context).disabledColor,
                          height: 1.5,
                        ),
                        border: InputBorder.none,
                      ),
                      onChanged: (val) {
                        genVM.setScripture(val);
                      },
                    ),
                  ),
                  Align(
                    alignment: Alignment.bottomRight,
                    child: Icon(
                      Icons
                          .filter_center_focus_rounded, // Use a maximize/expand icon lookalike
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Quick Chips
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _QuickChip(
                    label: '✨ Verse of the Day',
                    color: const Color(0xFFEBF8FF),
                    textColor: const Color(0xFF4299E1),
                    onTap: () {
                      _scriptureController.text = 'Psalm 23:1';
                      genVM.setScripture('Psalm 23:1');
                    },
                  ),
                  const SizedBox(width: 12),
                  _QuickChip(label: 'Psalms', onTap: () {}),
                  const SizedBox(width: 12),
                  _QuickChip(label: 'Proverbs', onTap: () {}),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Musical Style
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Musical Style',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  child: Text(
                    'View All',
                    style: TextStyle(color: Theme.of(context).primaryColor),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            StyleSelectionGrid(
              selectedStyle: _selectedStyle,
              onStyleSelected: (style) {
                setState(() {
                  _selectedStyle = style;
                });
                genVM.setMood(style);
              },
            ),
            const SizedBox(height: 32),

            // Duration
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Duration',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Theme.of(
                      context,
                    ).colorScheme.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    _formatDuration(_duration),
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.primary,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            SliderTheme(
              data: SliderTheme.of(context).copyWith(
                activeTrackColor: Theme.of(context).colorScheme.primary,
                inactiveTrackColor: Theme.of(
                  context,
                ).dividerColor.withOpacity(0.2),
                thumbColor: Theme.of(context).colorScheme.primary,
                overlayColor: Theme.of(
                  context,
                ).colorScheme.primary.withOpacity(0.2),
                trackHeight: 6.0,
                thumbShape: const RoundSliderThumbShape(
                  enabledThumbRadius: 10.0,
                  elevation: 4,
                ),
                overlayShape: const RoundSliderOverlayShape(
                  overlayRadius: 18.0,
                ),
              ),
              child: Slider(
                value: _duration,
                min: 0.5,
                max: 5.0,
                divisions: 9,
                onChanged: (val) {
                  setState(() {
                    _duration = val;
                  });
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '30s',
                    style: TextStyle(
                      color: Theme.of(context).disabledColor,
                      fontSize: 12,
                    ),
                  ),
                  Text(
                    '5m',
                    style: TextStyle(
                      color: Theme.of(context).disabledColor,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),
            Center(
              child: Text(
                'AI will generate a unique melody based on the\nsentiment of your text.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Theme.of(context).disabledColor,
                  fontSize: 12,
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Generate Button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton.icon(
                onPressed: () {
                  // Logic to generate
                  genVM.generate();
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const GeneratingScreen()),
                  );
                },
                icon: const Icon(Icons.music_note_rounded),
                label: const Text(
                  'Generate Music',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2F80ED), // Bright Blue
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  elevation: 4,
                  shadowColor: const Color(0xFF2F80ED).withOpacity(0.5),
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}

class _QuickChip extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  final Color? color;
  final Color? textColor;

  const _QuickChip({
    required this.label,
    required this.onTap,
    this.color,
    this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: color ?? Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey.withOpacity(0.2)),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: textColor ?? Colors.grey.shade700,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}
