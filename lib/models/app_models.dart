class User {
  final String id;
  final String name;
  final String email;
  final String? profileImage;
  final List<String> favoriteGenres;
  final List<String> inspirations;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.profileImage,
    this.favoriteGenres = const [],
    this.inspirations = const [],
  });

  User copyWith({
    String? id,
    String? name,
    String? email,
    String? profileImage,
    List<String>? favoriteGenres,
    List<String>? inspirations,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      profileImage: profileImage ?? this.profileImage,
      favoriteGenres: favoriteGenres ?? this.favoriteGenres,
      inspirations: inspirations ?? this.inspirations,
    );
  }
}

class Song {
  final String id;
  final String title;
  final String verse;
  final String scripture;
  final String imageUrl;
  final Duration duration;
  final List<String> themes;
  final bool isFavorite;

  Song({
    required this.id,
    required this.title,
    required this.verse,
    required this.scripture,
    required this.imageUrl,
    required this.duration,
    this.themes = const [],
    this.isFavorite = false,
  });

  Song copyWith({
    String? id,
    String? title,
    String? verse,
    String? scripture,
    String? imageUrl,
    Duration? duration,
    List<String>? themes,
    bool? isFavorite,
  }) {
    return Song(
      id: id ?? this.id,
      title: title ?? this.title,
      verse: verse ?? this.verse,
      scripture: scripture ?? this.scripture,
      imageUrl: imageUrl ?? this.imageUrl,
      duration: duration ?? this.duration,
      themes: themes ?? this.themes,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}

class Playlist {
  final String id;
  final String name;
  final String? description;
  final String? coverImage;
  final List<Song> songs;
  final DateTime createdAt;

  Playlist({
    required this.id,
    required this.name,
    this.description,
    this.coverImage,
    this.songs = const [],
    required this.createdAt,
  });

  int get songCount => songs.length;

  Duration get totalDuration {
    return songs.fold(Duration.zero, (total, song) => total + song.duration);
  }

  Playlist copyWith({
    String? id,
    String? name,
    String? description,
    String? coverImage,
    List<Song>? songs,
    DateTime? createdAt,
  }) {
    return Playlist(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      coverImage: coverImage ?? this.coverImage,
      songs: songs ?? this.songs,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}

class Genre {
  final String id;
  final String name;
  final String icon;
  final bool isSelected;

  Genre({
    required this.id,
    required this.name,
    required this.icon,
    this.isSelected = false,
  });

  Genre copyWith({
    String? id,
    String? name,
    String? icon,
    bool? isSelected,
  }) {
    return Genre(
      id: id ?? this.id,
      name: name ?? this.name,
      icon: icon ?? this.icon,
      isSelected: isSelected ?? this.isSelected,
    );
  }
}

class OnboardingStep {
  final String title;
  final String subtitle;
  final String? description;
  final int stepNumber;

  OnboardingStep({
    required this.title,
    required this.subtitle,
    this.description,
    required this.stepNumber,
  });
}