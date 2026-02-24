export interface BibleBook {
  id: string;
  name: string;
  chapters: number;
  testament: "OT" | "NT";
}

export const NEW_TESTAMENT: BibleBook[] = [
  { id: "MAT", name: "Matthew", chapters: 28, testament: "NT" },
  { id: "MRK", name: "Mark", chapters: 16, testament: "NT" },
  { id: "LUK", name: "Luke", chapters: 24, testament: "NT" },
  { id: "JHN", name: "John", chapters: 21, testament: "NT" },
  { id: "ACT", name: "Acts", chapters: 28, testament: "NT" },
  { id: "ROM", name: "Romans", chapters: 16, testament: "NT" },
  { id: "1CO", name: "1 Corinthians", chapters: 16, testament: "NT" },
  { id: "2CO", name: "2 Corinthians", chapters: 13, testament: "NT" },
  { id: "GAL", name: "Galatians", chapters: 6, testament: "NT" },
  { id: "EPH", name: "Ephesians", chapters: 6, testament: "NT" },
  { id: "PHP", name: "Philippians", chapters: 4, testament: "NT" },
  { id: "COL", name: "Colossians", chapters: 4, testament: "NT" },
  { id: "1TH", name: "1 Thessalonians", chapters: 5, testament: "NT" },
  { id: "2TH", name: "2 Thessalonians", chapters: 3, testament: "NT" },
  { id: "1TI", name: "1 Timothy", chapters: 6, testament: "NT" },
  { id: "2TI", name: "2 Timothy", chapters: 4, testament: "NT" },
  { id: "TIT", name: "Titus", chapters: 3, testament: "NT" },
  { id: "PHM", name: "Philemon", chapters: 1, testament: "NT" },
  { id: "HEB", name: "Hebrews", chapters: 13, testament: "NT" },
  { id: "JAS", name: "James", chapters: 5, testament: "NT" },
  { id: "1PE", name: "1 Peter", chapters: 5, testament: "NT" },
  { id: "2PE", name: "2 Peter", chapters: 3, testament: "NT" },
  { id: "1JN", name: "1 John", chapters: 5, testament: "NT" },
  { id: "2JN", name: "2 John", chapters: 1, testament: "NT" },
  { id: "3JN", name: "3 John", chapters: 1, testament: "NT" },
  { id: "JUD", name: "Jude", chapters: 1, testament: "NT" },
  { id: "REV", name: "Revelation", chapters: 22, testament: "NT" },
];

export const VERSIONS = [
  { id: "niv", name: "NIV", label: "New International Version" },
  { id: "nkjv", name: "NKJV", label: "New King James Version" },
  { id: "tpt", name: "TPT", label: "The Passion Translation" },
];
