import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../view_models/theme_view_model.dart';
import '../../view_models/auth_view_model.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final themeVM = context.watch<ThemeViewModel>();
    final authVM = context.watch<AuthViewModel>();
    final isDark = themeVM.isDarkMode;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          'Settings',
          style: Theme.of(
            context,
          ).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
        ),
        leading: Navigator.of(context).canPop()
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded),
                onPressed: () => Navigator.of(context).pop(),
              )
            : null,
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        surfaceTintColor: Colors.transparent,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          // Profile Section
          _ProfileCard(
            name: authVM.displayName,
            email: authVM.email,
            imageUrl: authVM.photoUrl,
            isDark: isDark,
          ),
          const SizedBox(height: 32),

          // Appearance Section
          _SectionHeader(title: 'APPEARANCE'),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: Theme.of(context).cardTheme.color,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Theme.of(context).dividerColor.withOpacity(0.1),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: _AppearanceButton(
                    icon: Icons.light_mode_rounded,
                    label: 'Light',
                    isSelected: !isDark,
                    onTap: () {
                      if (isDark) themeVM.toggleTheme();
                    },
                  ),
                ),
                Expanded(
                  child: _AppearanceButton(
                    icon: Icons.dark_mode_rounded,
                    label: 'Dark',
                    isSelected: isDark,
                    onTap: () {
                      if (!isDark) themeVM.toggleTheme();
                    },
                  ),
                ),
                // Auto/System option could go here
              ],
            ),
          ),
          const SizedBox(height: 32),

          // General Group
          _SectionHeader(title: 'GENERAL'),
          const SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(
              color: Theme.of(context).cardTheme.color,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: Theme.of(context).dividerColor.withOpacity(0.05),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                _SettingsTile(
                  icon: Icons.notifications_rounded,
                  iconColor: const Color(0xFFFF6B6B), // Pastel Red
                  title: 'Notifications',
                  onTap: () {},
                ),
                Divider(
                  height: 1,
                  indent: 64,
                  color: Theme.of(context).dividerColor.withOpacity(0.2),
                ),
                _SettingsTile(
                  icon: Icons.graphic_eq_rounded,
                  iconColor: const Color(0xFF4ECDC4), // Teal
                  title: 'Audio Quality',
                  subtitle: 'High (Streaming)',
                  onTap: () {},
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // Account Group
          _SectionHeader(title: 'ACCOUNT'),
          const SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(
              color: Theme.of(context).cardTheme.color,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: Theme.of(context).dividerColor.withOpacity(0.05),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                _SettingsTile(
                  icon: Icons.email_rounded,
                  iconColor: const Color(0xFF45B7D1), // Blue
                  title: 'Email',
                  subtitle: authVM.email.isNotEmpty
                      ? authVM.email
                      : 'Link Email',
                  onTap: () {},
                ),
                Divider(
                  height: 1,
                  indent: 64,
                  color: Theme.of(context).dividerColor.withOpacity(0.2),
                ),
                _SettingsTile(
                  icon: Icons.workspace_premium_rounded,
                  iconColor: const Color(0xFFFFBE0B), // Yellow/Gold
                  title: 'Subscription',
                  subtitle: 'Free Plan',
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFBE0B).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Text(
                      'UPGRADE',
                      style: TextStyle(
                        color: Color(0xFFF59F00),
                        fontWeight: FontWeight.bold,
                        fontSize: 10,
                      ),
                    ),
                  ),
                  onTap: () {},
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // Support Group
          _SectionHeader(title: 'SUPPORT'),
          const SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(
              color: Theme.of(context).cardTheme.color,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: Theme.of(context).dividerColor.withOpacity(0.05),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                _SettingsTile(
                  icon: Icons.help_rounded,
                  iconColor: const Color(0xFF96F550), // Lime
                  title: 'Help Center',
                  onTap: () {},
                ),
                Divider(
                  height: 1,
                  indent: 64,
                  color: Theme.of(context).dividerColor.withOpacity(0.2),
                ),
                _SettingsTile(
                  icon: Icons.privacy_tip_rounded,
                  iconColor: const Color(0xFFA06CD5), // Purple
                  title: 'Privacy Policy',
                  onTap: () {},
                ),
              ],
            ),
          ),

          const SizedBox(height: 48),

          // Log Out
          Center(
            child: TextButton(
              onPressed: () {
                themeVM.toggleTheme(); // Just for demo, fix to logout
                // authVM.signOut();
                // Navigator...
              },
              style: TextButton.styleFrom(
                foregroundColor: Theme.of(context).colorScheme.error,
              ),
              child: const Text(
                'Log Out',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Center(
            child: Text(
              'Version 1.0.0',
              style: TextStyle(
                color: Theme.of(context).disabledColor,
                fontSize: 12,
              ),
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}

class _AppearanceButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _AppearanceButton({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected
              ? Theme.of(context).scaffoldBackgroundColor
              : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ]
              : [],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 20,
              color: isSelected
                  ? Theme.of(context).textTheme.bodyLarge?.color
                  : Theme.of(context).disabledColor,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: isSelected
                    ? Theme.of(context).textTheme.bodyLarge?.color
                    : Theme.of(context).disabledColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileCard extends StatelessWidget {
  final String name;
  final String email;
  final String? imageUrl;
  final bool isDark;

  const _ProfileCard({
    required this.name,
    required this.email,
    this.imageUrl,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        CircleAvatar(
          radius: 36,
          backgroundColor: Theme.of(
            context,
          ).colorScheme.primary.withOpacity(0.1),
          backgroundImage: imageUrl != null ? NetworkImage(imageUrl!) : null,
          child: imageUrl == null
              ? Icon(
                  Icons.person,
                  size: 36,
                  color: Theme.of(context).colorScheme.primary,
                )
              : null,
        ),
        const SizedBox(width: 20),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                name.isNotEmpty ? name : 'Guest',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                email.isNotEmpty ? email : 'Sign in to sync your library',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).disabledColor,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 12),
      child: Text(
        title,
        style: Theme.of(context).textTheme.labelLarge?.copyWith(
          fontWeight: FontWeight.w900,
          color: Theme.of(context).disabledColor,
          letterSpacing: 1.2,
          fontSize: 12,
        ),
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String? subtitle;
  final Widget? trailing;
  final VoidCallback onTap;

  const _SettingsTile({
    required this.icon,
    required this.iconColor,
    required this.title,
    this.subtitle,
    this.trailing,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: iconColor.withOpacity(0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: iconColor, size: 20),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
      subtitle: subtitle != null
          ? Text(
              subtitle!,
              style: TextStyle(
                color: Theme.of(context).disabledColor,
                fontSize: 12,
              ),
            )
          : null,
      trailing:
          trailing ??
          Icon(
            Icons.chevron_right_rounded,
            color: Theme.of(context).disabledColor,
            size: 20,
          ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
    );
  }
}
