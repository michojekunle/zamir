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
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => Navigator.of(context).pop(),
        ),
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        surfaceTintColor: Colors.transparent,
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Profile Section
          _ProfileCard(
            name: authVM.displayName,
            email: authVM.email,
            imageUrl: authVM.photoUrl,
            isDark: isDark,
          ),
          const SizedBox(height: 32),

          // Theme Toggle
          _SectionHeader(title: 'DISPLAY'),
          const SizedBox(height: 16),
          Container(
            decoration: BoxDecoration(
              color: Theme.of(context).cardTheme.color,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Theme.of(context).shadowColor.withOpacity(0.04),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                _SettingsTile(
                  icon: Icons.light_mode_rounded,
                  iconColor: Theme.of(context).colorScheme.tertiary,
                  title: 'Light Mode',
                  trailing: Radio<bool>(
                    value: false,
                    groupValue: isDark,
                    onChanged: (value) {
                      if (value != null && value != isDark) {
                        themeVM.toggleTheme();
                      }
                    },
                    activeColor: Theme.of(context).colorScheme.primary,
                  ),
                  onTap: () {
                    if (isDark) themeVM.toggleTheme();
                  },
                  useContainer: false,
                ),
                Divider(
                  height: 1,
                  color: Theme.of(context).dividerColor.withOpacity(0.5),
                ),
                _SettingsTile(
                  icon: Icons.dark_mode_rounded,
                  iconColor: Theme.of(context).colorScheme.primary,
                  title: 'Dark Mode',
                  trailing: Radio<bool>(
                    value: true,
                    groupValue: isDark,
                    onChanged: (value) {
                      if (value != null && value != isDark) {
                        themeVM.toggleTheme();
                      }
                    },
                    activeColor: Theme.of(context).colorScheme.primary,
                  ),
                  onTap: () {
                    if (!isDark) themeVM.toggleTheme();
                  },
                  useContainer: false,
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // General Section
          _SectionHeader(title: 'GENERAL'),
          const SizedBox(height: 16),
          _SettingsTile(
            icon: Icons.notifications_outlined,
            iconColor: Theme.of(context).colorScheme.primary,
            title: 'Notifications',
            onTap: () {},
          ),
          const SizedBox(height: 12),
          _SettingsTile(
            icon: Icons.high_quality_rounded,
            iconColor: Theme.of(context).colorScheme.secondary,
            title: 'Audio Quality',
            subtitle: 'High quality',
            onTap: () {},
          ),

          const SizedBox(height: 32),

          // Account Section
          _SectionHeader(title: 'ACCOUNT'),
          const SizedBox(height: 16),
          _SettingsTile(
            icon: Icons.person_outline_rounded,
            iconColor: Theme.of(context).colorScheme.tertiary,
            title: 'Email/Phone',
            subtitle: authVM.email.isNotEmpty ? authVM.email : 'Not set',
            onTap: () {},
          ),
          const SizedBox(height: 12),
          _SettingsTile(
            icon: Icons.verified_user_outlined,
            iconColor: Theme.of(context).colorScheme.primary,
            title: 'Manage Subscription',
            subtitle: 'Pro',
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text(
                'PRO',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            onTap: () {},
          ),
          const SizedBox(height: 32),

          // Support Section
          _SectionHeader(title: 'SUPPORT'),
          const SizedBox(height: 16),
          _SettingsTile(
            icon: Icons.help_outline_rounded,
            iconColor: Theme.of(context).colorScheme.secondary,
            title: 'Help Center',
            onTap: () {},
          ),
          const SizedBox(height: 12),
          _SettingsTile(
            icon: Icons.policy_outlined,
            iconColor: Theme.of(context).colorScheme.tertiary,
            title: 'Privacy Policy',
            onTap: () {},
          ),
          const SizedBox(height: 48),

          // Logout Button
          Center(
            child: TextButton.icon(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Logout'),
                    content: const Text('Are you sure you want to logout?'),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () {
                          authVM.signOut();
                          Navigator.pop(context); // Dialog
                          Navigator.pop(context); // Screen
                        },
                        child: Text(
                          'Logout',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.error,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
              icon: Icon(
                Icons.logout_rounded,
                color: Theme.of(context).colorScheme.error,
              ),
              label: Text(
                'Log Out',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.error,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
                backgroundColor: Theme.of(
                  context,
                ).colorScheme.error.withOpacity(0.1),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
              ),
            ),
          ),
          const SizedBox(height: 40),
        ],
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
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Theme.of(context).shadowColor.withOpacity(0.06),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: Theme.of(context).colorScheme.primary.withOpacity(0.2),
                width: 2,
              ),
            ),
            child: CircleAvatar(
              radius: 32,
              backgroundColor: Theme.of(
                context,
              ).colorScheme.primary.withOpacity(0.1),
              child: imageUrl != null
                  ? ClipOval(
                      child: Image.network(
                        imageUrl!,
                        fit: BoxFit.cover,
                        width: 64,
                        height: 64,
                      ),
                    )
                  : Icon(
                      Icons.person_rounded,
                      size: 36,
                      color: Theme.of(context).colorScheme.primary,
                    ),
            ),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: Theme.of(
                    context,
                  ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  email,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(
                      context,
                    ).textTheme.bodyMedium?.color?.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;

  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 8),
      child: Text(
        title,
        style: Theme.of(context).textTheme.labelLarge?.copyWith(
          fontWeight: FontWeight.bold,
          color: Theme.of(context).primaryColor,
          letterSpacing: 1.0,
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
  final bool useContainer;

  const _SettingsTile({
    required this.icon,
    required this.iconColor,
    required this.title,
    this.subtitle,
    this.trailing,
    required this.onTap,
    this.useContainer = true,
  });

  @override
  Widget build(BuildContext context) {
    final content = Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.12),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Icon(icon, color: iconColor, size: 22),
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
              if (subtitle != null) ...[
                const SizedBox(height: 4),
                Text(
                  subtitle!,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Theme.of(
                      context,
                    ).textTheme.bodySmall?.color?.withOpacity(0.8),
                  ),
                ),
              ],
            ],
          ),
        ),
        if (trailing != null)
          trailing!
        else
          Icon(
            Icons.chevron_right_rounded,
            color: Theme.of(context).disabledColor,
          ),
      ],
    );

    if (!useContainer) {
      return InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: content,
        ),
      );
    }

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
              color: Theme.of(context).shadowColor.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: content,
      ),
    );
  }
}
