import 'package:flutter/material.dart';

class StyleSelectionGrid extends StatelessWidget {
  final String? selectedStyle;
  final Function(String) onStyleSelected;

  const StyleSelectionGrid({
    super.key,
    required this.selectedStyle,
    required this.onStyleSelected,
  });

  @override
  Widget build(BuildContext context) {
    final styles = [
      {'name': 'Meditation', 'icon': Icons.self_improvement_rounded},
      {'name': 'Praise', 'icon': Icons.church_rounded},
      {
        'name': 'Lullaby',
        'icon': Icons.nightlight_round,
      }, // Using nightlight_round as a moon approximation
      {'name': 'Cinematic', 'icon': Icons.movie_filter_rounded},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 1.5,
      ),
      itemCount: styles.length,
      itemBuilder: (context, index) {
        final style = styles[index];
        final name = style['name'] as String;
        final icon = style['icon'] as IconData;
        final isSelected = selectedStyle == name;

        return GestureDetector(
          onTap: () => onStyleSelected(name),
          child: Container(
            decoration: BoxDecoration(
              color: isSelected
                  ? const Color(0xFF4299E1)
                  : Theme.of(context)
                        .cardTheme
                        .color, // Blue when selected, Card color otherwise
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: isSelected
                    ? const Color(0xFF4299E1)
                    : Theme.of(context).dividerColor.withOpacity(0.1),
                width: 2,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                        color: const Color(0xFF4299E1).withOpacity(0.3),
                        blurRadius: 15,
                        offset: const Offset(0, 8),
                      ),
                    ]
                  : [],
            ),
            padding: const EdgeInsets.all(16),
            child: Stack(
              children: [
                // Icon background graphic (faded)
                Positioned(
                  right: -10,
                  bottom: -10,
                  child: Icon(
                    icon,
                    size: 60,
                    color: isSelected
                        ? Colors.white.withOpacity(0.2)
                        : Theme.of(context).disabledColor.withOpacity(0.1),
                  ),
                ),

                // Content
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Check mark circle
                    Container(
                      width: 24,
                      height: 24,
                      decoration: BoxDecoration(
                        color: isSelected ? Colors.white : Colors.transparent,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: isSelected
                              ? Colors.white
                              : Theme.of(
                                  context,
                                ).disabledColor.withOpacity(0.3),
                          width: isSelected ? 0 : 2,
                        ),
                      ),
                      child: isSelected
                          ? const Icon(
                              Icons.check,
                              size: 16,
                              color: Color(0xFF4299E1),
                            )
                          : null,
                    ),
                    const Spacer(),
                    Text(
                      name,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: isSelected
                            ? Colors.white
                            : Theme.of(context).textTheme.bodyLarge?.color,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
