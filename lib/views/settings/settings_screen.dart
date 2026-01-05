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
      appBar: AppBar(
        title: const Text('Settings'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Profile Section
          _ProfileCard(
            name: authVM.displayName,
            email: authVM.email,
            imageUrl: authVM.photoUrl,
            isDark: isDark,
          ),
          const SizedBox(height: 24),

          // Theme Toggle
          _SectionHeader(title: 'DISPLAY'),
          const SizedBox(height: 12),
          _SettingsTile(
            icon: Icons.light_mode,
            iconColor: Theme.of(context).colorScheme.primary,
            title: 'Light',
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
          ),
          const SizedBox(height: 8),
          _SettingsTile(
            icon: Icons.dark_mode,
            iconColor: Theme.of(context).colorScheme.primary,
            title: 'Dark',
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
          ),
          const SizedBox(height: 8),
          _SettingsTile(
            icon: Icons.phone_android,
            iconColor: Theme.of(context).colorScheme.primary,
            title: 'Auto',
            trailing: Radio<bool>(
              value: false,
              groupValue: true,
              onChanged: null,
              activeColor: Theme.of(context).colorScheme.primary,
            ),
            onTap: () {},
          ),
          const SizedBox(height: 24),

          // General Section
          _SectionHeader(title: 'GENERAL'),
          const SizedBox(height: 12),
          _SettingsTile(
            icon: Icons.notifications_outlined,
            iconColor: Theme.of(context).colorScheme.primary,
            title: 'Notifications',
            onTap: () {},
          ),
          const SizedBox(height: 8),
          _SettingsTile(
            icon: Icons.credit_card,
            iconColor: Theme.of(context).colorScheme.primary,
            title: 'Audio Quality',
            subtitle: 'High quality',
            onTap: () {},
          ),
          const SizedBox(height: 8),
          _SettingsTile(
            icon: Icons.language,
            iconColor: Theme.of(context).colorScheme.primary,
            title: 'No Subscript language (Can grow, ot...',
            onTap: () {},
          ),
          const SizedBox(height: 24),

          // Account Section
          _SectionHeader(title: 'ACCOUNT'),
          const SizedBox(height: 12),
          _SettingsTile(
            icon: Icons.person_outline,
            iconColor: Theme.of(context).colorScheme.primary,
            title: 'Email/Phone',
            subtitle: authVM.email.isNotEmpty ? authVM.email : 'Not set',
            onTap: () {},
          ),
          const SizedBox(height: 8),
          _SettingsTile(
            icon: Icons.verified_user_outlined,
            iconColor: Theme.of(context).colorScheme.primary,
            title: 'Manage Subscription',
            subtitle: 'Pro',
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.green,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text(
                'PRO',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            onTap: () {},
          ),
          const SizedBox(height: 24),

          // Support Section
          _SectionHeader(title: 'SUPPORT'),
          const SizedBox(height: 12),
          _SettingsTile(
            icon: Icons.help_outline,
            iconColor: Theme.of(context).colorScheme.primary,
            title: 'Help Center',
            onTap: () {},
          ),
          const SizedBox(height: 8),
          _SettingsTile(
            icon: Icons.policy_outlined,
            iconColor: Theme.of(context).colorScheme.primary,
            title: 'Privacy Policy',
            onTap: () {},
          ),
          const SizedBox(height: 24),

          // Logout Button
          Center(
            child: TextButton(
              onPressed: () {
                // Show logout confirmation
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Logout'),
                    content: const Text('Are you sure you want to logout?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () {
                          authVM.signOut();
                          Navigator.pop(context);
                          Navigator.pop(context);
                        },
                        child: Text(
                          'Logout',
                          style: TextStyle(color: Colors.red),
                        ),
                      ),
                    ],
                  ),
                );
              },
              child: Text(
                'Log Out',
                style: TextStyle(
                  color: Colors.red,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
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
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.1) : Colors.grey.shade200,
        ),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 30,
            backgroundColor: Theme.of(
              context,
            ).colorScheme.primary.withOpacity(0.1),
            child: imageUrl != null
                ? ClipOval(
                    child: Image.network(
                      imageUrl!,
                      fit: BoxFit.cover,
                      width: 60,
                      height: 60,
                    ),
                  )
                : Icon(
                    Icons.person,
                    size: 32,
                    color: Theme.of(context).colorScheme.primary,
                  ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(email, style: Theme.of(context).textTheme.bodyMedium),
              ],
            ),
          ),
          Icon(
            Icons.chevron_right,
            color: Theme.of(context).textTheme.bodyMedium?.color,
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
    return Text(
      title,
      style: TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.w600,
        color: Theme.of(context).textTheme.bodyMedium?.color,
        letterSpacing: 0.5,
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
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isDark
                ? Colors.white.withOpacity(0.1)
                : Colors.grey.shade200,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitle!,
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ],
              ),
            ),
            if (trailing != null)
              trailing!
            else
              Icon(
                Icons.chevron_right,
                color: Theme.of(context).textTheme.bodyMedium?.color,
              ),
          ],
        ),
      ),
    );
  }
}
