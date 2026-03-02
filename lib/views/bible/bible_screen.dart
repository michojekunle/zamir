import 'package:flutter/material.dart';

// Static Books Data (Mocked from PWA's bible-nt.ts equivalent)
class BibleBook {
  final String id;
  final String name;
  final int chapters;
  BibleBook(this.id, this.name, this.chapters);
}

final List<BibleBook> newTestament = [
  BibleBook("MAT", "Matthew", 28),
  BibleBook("MRK", "Mark", 16),
  BibleBook("LUK", "Luke", 24),
  BibleBook("JHN", "John", 21),
  BibleBook("ACT", "Acts", 28),
  BibleBook("ROM", "Romans", 16),
  BibleBook("1CO", "1 Corinthians", 16),
  BibleBook("2CO", "2 Corinthians", 13),
  BibleBook("GAL", "Galatians", 6),
  BibleBook("EPH", "Ephesians", 6),
  BibleBook("PHP", "Philippians", 4),
  BibleBook("COL", "Colossians", 4),
  BibleBook("1TH", "1 Thessalonians", 5),
  BibleBook("2TH", "2 Thessalonians", 3),
  BibleBook("1TI", "1 Timothy", 6),
  BibleBook("2TI", "2 Timothy", 4),
  BibleBook("TIT", "Titus", 3),
  BibleBook("PHM", "Philemon", 1),
  BibleBook("HEB", "Hebrews", 13),
  BibleBook("JAS", "James", 5),
  BibleBook("1PE", "1 Peter", 5),
  BibleBook("2PE", "2 Peter", 3),
  BibleBook("1JN", "1 John", 5),
  BibleBook("2JN", "2 John", 1),
  BibleBook("3JN", "3 John", 1),
  BibleBook("JUD", "Jude", 1),
  BibleBook("REV", "Revelation", 22),
];

class BibleScreen extends StatefulWidget {
  const BibleScreen({super.key});

  @override
  State<BibleScreen> createState() => _BibleScreenState();
}

enum ViewState { books, chapters, verses }

class _BibleScreenState extends State<BibleScreen> {
  ViewState _view = ViewState.books;
  BibleBook? _selectedBook;
  int? _selectedChapter;
  String _searchQuery = "";

  List<BibleBook> get _filteredBooks {
    if (_searchQuery.isEmpty) return newTestament;
    return newTestament
        .where((b) => b.name.toLowerCase().contains(_searchQuery.toLowerCase()))
        .toList();
  }

  void _goBack() {
    setState(() {
      if (_view == ViewState.verses) {
        _view = ViewState.chapters;
      } else if (_view == ViewState.chapters) {
        _view = ViewState.books;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                    color: Colors.white.withValues(alpha: 0.05),
                  ),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      if (_view != ViewState.books)
                        IconButton(
                          icon: const Icon(
                            Icons.arrow_back_ios_new,
                            size: 20,
                            color: Colors.white54,
                          ),
                          onPressed: _goBack,
                        ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _view == ViewState.books
                                  ? 'SCRIPTURE'
                                  : _selectedBook?.name.toUpperCase() ?? '',
                              style: TextStyle(
                                color: Theme.of(context).primaryColor, // Gold
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 4.0,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _view == ViewState.books
                                  ? 'The Holy Bible'
                                  : _view == ViewState.chapters
                                  ? 'Select Chapter'
                                  : 'Chapter $_selectedChapter',
                              style: Theme.of(
                                context,
                              ).textTheme.displayMedium?.copyWith(fontSize: 24),
                            ),
                          ],
                        ),
                      ),
                      // Mock Version Selector
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'NIV',
                          style: TextStyle(
                            color: Color(0xFFC9A042),
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  if (_view == ViewState.books) ...[
                    const SizedBox(height: 16),
                    TextField(
                      decoration: InputDecoration(
                        hintText: 'Search chapters or verses...',
                        prefixIcon: const Icon(
                          Icons.search,
                          color: Colors.white54,
                        ),
                        filled: true,
                        fillColor: Theme.of(context).cardTheme.color,
                        contentPadding: const EdgeInsets.symmetric(
                          vertical: 12,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      style: const TextStyle(color: Colors.white),
                      onChanged: (val) {
                        setState(() {
                          _searchQuery = val;
                        });
                      },
                    ),
                  ],
                ],
              ),
            ),

            // Content
            Expanded(child: _buildContent()),
          ],
        ),
      ),
    );
  }

  Widget _buildContent() {
    if (_view == ViewState.books) {
      return ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: _filteredBooks.length + 1, // +1 for the Daily Bread banner
        itemBuilder: (context, index) {
          if (index == 0) {
            return _buildDailyBreadBanner();
          }
          final book = _filteredBooks[index - 1];
          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedBook = book;
                _view = ViewState.chapters;
              });
            },
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.03),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: Theme.of(
                        context,
                      ).primaryColor.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Center(
                      child: Text('📖', style: TextStyle(fontSize: 20)),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          book.name,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${book.chapters} Chapters · NT',
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 10,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right, color: Colors.white24),
                ],
              ),
            ),
          );
        },
      );
    } else if (_view == ViewState.chapters) {
      return GridView.builder(
        padding: const EdgeInsets.all(20),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 4,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
        ),
        itemCount: _selectedBook!.chapters,
        itemBuilder: (context, index) {
          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedChapter = index + 1;
                _view = ViewState.verses;
              });
            },
            child: Container(
              decoration: BoxDecoration(
                color: Theme.of(context).cardTheme.color,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
              ),
              child: Center(
                child: Text(
                  '${index + 1}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          );
        },
      );
    } else {
      // Mocked Verses View
      return ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: 10, // Mock number of verses
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 20),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${index + 1}',
                  style: TextStyle(
                    color: Theme.of(context).primaryColor,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    'This is a sample verse text to demonstrate the concordance with the web design layout. Every word is flawless... (Placeholder due to unlinked API)',
                    style: TextStyle(
                      fontFamily: 'DM Serif Display',
                      color: Colors.white.withValues(alpha: 0.9),
                      fontSize: 18,
                      height: 1.5,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      );
    }
  }

  Widget _buildDailyBreadBanner() {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: const Color(0xFFC9A042).withValues(alpha: 0.2),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.star, color: Color(0xFFC9A042), size: 14),
              const SizedBox(width: 8),
              Text(
                'DAILY BREAD',
                style: TextStyle(
                  color: const Color(0xFFC9A042),
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 3.0,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            '"Every word of God is flawless; he is a shield to those who take refuge in him."',
            style: TextStyle(
              fontFamily: 'DM Serif Display',
              fontSize: 22,
              color: Colors.white,
              fontStyle: FontStyle.italic,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'PROVERBS 30:5 · NIV',
            style: TextStyle(
              color: Colors.white54,
              fontSize: 10,
              fontWeight: FontWeight.bold,
              letterSpacing: 4.0,
            ),
          ),
        ],
      ),
    );
  }
}
