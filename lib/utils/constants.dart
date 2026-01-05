// Scripture samples for AI generation prompts
class ScriptureSamples {
  static const List<Map<String, String>> samples = [
    {
      'reference': 'Psalm 23:1',
      'verse': 'The Lord is my shepherd; I shall not want.',
    },
    {'reference': 'Psalm 46:10', 'verse': 'Be still, and know that I am God.'},
    {
      'reference': 'Isaiah 40:31',
      'verse': 'They that wait upon the Lord shall renew their strength.',
    },
    {
      'reference': 'Philippians 4:13',
      'verse': 'I can do all things through Christ who strengthens me.',
    },
    {
      'reference': 'Romans 8:28',
      'verse': 'All things work together for good to them that love God.',
    },
    {
      'reference': 'Jeremiah 29:11',
      'verse': 'For I know the plans I have for you, declares the Lord.',
    },
    {
      'reference': 'Proverbs 3:5-6',
      'verse': 'Trust in the Lord with all your heart.',
    },
    {
      'reference': 'Matthew 11:28',
      'verse': 'Come to me, all who are weary, and I will give you rest.',
    },
  ];
}

// Mood options for music generation
class MoodOptions {
  static const List<Map<String, dynamic>> moods = [
    {'name': 'Peaceful', 'emoji': '🕊️', 'color': 0xFF64B5F6},
    {'name': 'Joyful', 'emoji': '✨', 'color': 0xFFFFD54F},
    {'name': 'Grateful', 'emoji': '🙏', 'color': 0xFF81C784},
    {'name': 'Seeking', 'emoji': '🔍', 'color': 0xFFBA68C8},
    {'name': 'Hopeful', 'emoji': '🌅', 'color': 0xFFFFB74D},
    {'name': 'Reflective', 'emoji': '💭', 'color': 0xFF90A4AE},
    {'name': 'Healing', 'emoji': '💚', 'color': 0xFF4DB6AC},
    {'name': 'Worship', 'emoji': '🎵', 'color': 0xFFE57373},
  ];
}

// Music genres for onboarding
class GenreOptions {
  static const List<Map<String, String>> genres = [
    {'id': '1', 'name': 'Worship', 'icon': '🙏'},
    {'id': '2', 'name': 'Gospel', 'icon': '✝️'},
    {'id': '3', 'name': 'Hymns', 'icon': '📖'},
    {'id': '4', 'name': 'Contemporary', 'icon': '🎸'},
    {'id': '5', 'name': 'Psalms', 'icon': '🎵'},
    {'id': '6', 'name': 'Meditative', 'icon': '🧘'},
    {'id': '7', 'name': 'Praise', 'icon': '🎶'},
    {'id': '8', 'name': 'Acoustic', 'icon': '🪕'},
  ];
}

// Theme options for focus journey
class ThemeOptions {
  static const List<String> themes = [
    'Morning Devotion',
    'Evening Prayer',
    'Meditation',
    'Thanksgiving',
    'Worship',
    'Bible Study',
    'Reflection',
    'Celebration',
    'Healing',
    'Comfort',
  ];
}

// Bible books for inspiration selection
class BibleBooks {
  static const List<String> popular = [
    'Psalms',
    'Proverbs',
    'Isaiah',
    'John',
    'Romans',
    'Matthew',
    'Luke',
    'Genesis',
    'Philippians',
    'Ephesians',
  ];

  static const List<String> all = [
    'Genesis',
    'Exodus',
    'Leviticus',
    'Numbers',
    'Deuteronomy',
    'Joshua',
    'Judges',
    'Ruth',
    '1 Samuel',
    '2 Samuel',
    '1 Kings',
    '2 Kings',
    '1 Chronicles',
    '2 Chronicles',
    'Ezra',
    'Nehemiah',
    'Esther',
    'Job',
    'Psalms',
    'Proverbs',
    'Ecclesiastes',
    'Song of Solomon',
    'Isaiah',
    'Jeremiah',
    'Lamentations',
    'Ezekiel',
    'Daniel',
    'Hosea',
    'Joel',
    'Amos',
    'Obadiah',
    'Jonah',
    'Micah',
    'Nahum',
    'Habakkuk',
    'Zephaniah',
    'Haggai',
    'Zechariah',
    'Malachi',
    'Matthew',
    'Mark',
    'Luke',
    'John',
    'Acts',
    'Romans',
    '1 Corinthians',
    '2 Corinthians',
    'Galatians',
    'Ephesians',
    'Philippians',
    'Colossians',
    '1 Thessalonians',
    '2 Thessalonians',
    '1 Timothy',
    '2 Timothy',
    'Titus',
    'Philemon',
    'Hebrews',
    'James',
    '1 Peter',
    '2 Peter',
    '1 John',
    '2 John',
    '3 John',
    'Jude',
    'Revelation',
  ];
}

// App constants
class AppConstants {
  static const String appName = 'Zamir';
  static const String tagline = 'Scripture in Song';

  // Animation durations
  static const Duration shortAnimation = Duration(milliseconds: 200);
  static const Duration mediumAnimation = Duration(milliseconds: 400);
  static const Duration longAnimation = Duration(milliseconds: 600);

  // API configuration
  static const String sunoApiBaseUrl = 'https://api.sunoapi.org/api/v1';

  // Storage keys
  static const String keyOnboardingComplete = 'onboarding_complete';
  static const String keyThemeMode = 'theme_mode';
  static const String keySunoApiKey = 'suno_api_key';
}
