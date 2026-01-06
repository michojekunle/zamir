import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:zamir_app/view_models/generation_view_model.dart';
import 'package:zamir_app/services/suno_service.dart';
import '../helpers/test_helpers.mocks.dart';

void main() {
  late GenerationViewModel viewModel;
  late MockSunoService mockSunoService;
  late MockUserService mockUserService;

  setUp(() {
    mockSunoService = MockSunoService();
    mockUserService = MockUserService();
    viewModel = GenerationViewModel(
      sunoService: mockSunoService,
      userService: mockUserService,
    );
  });

  group('generate', () {
    test('should call sunoService.generateFromScripture', () async {
      // Setup
      viewModel.setScripture('Psalm 23:1');
      viewModel.setVerse('The Lord is my shepherd');

      // Mock response
      when(
        mockSunoService.generateFromScripture(
          scripture: anyNamed('scripture'),
          verse: anyNamed('verse'),
          mood: anyNamed('mood'),
          style: anyNamed('style'),
        ),
      ).thenAnswer((_) async => GenerationResult.pending('task_123'));

      // Mock status check loop to return completed on first check
      when(mockSunoService.checkGenerationStatus('task_123')).thenAnswer(
        (_) async => GenerationResult.success(
          GeneratedSong(
            id: 'task_123',
            title: 'Test',
            audioUrl: 'url',
            lyrics: 'lyrics',
            duration: Duration(minutes: 2),
            createdAt: DateTime.now(),
          ),
        ),
      );

      // Act
      await viewModel.generate();

      // Assert
      verify(
        mockSunoService.generateFromScripture(
          scripture: 'Psalm 23:1',
          verse: 'The Lord is my shepherd',
          mood: anyNamed('mood'),
          style: anyNamed('style'),
        ),
      ).called(1);
    });

    test('should set generating state', () async {
      viewModel.setScripture('Ref');
      viewModel.setVerse('Verse');

      when(
        mockSunoService.generateFromScripture(
          scripture: anyNamed('scripture'),
          verse: anyNamed('verse'),
          mood: anyNamed('mood'),
          style: anyNamed('style'),
        ),
      ).thenAnswer((_) async {
        // Delay to allow checking "generating" state
        await Future.delayed(const Duration(milliseconds: 10));
        return GenerationResult.pending('task_123');
      });

      // Stub check status
      when(mockSunoService.checkGenerationStatus(any)).thenAnswer(
        (_) async => GenerationResult.success(
          GeneratedSong(
            id: '1',
            title: 't',
            audioUrl: 'u',
            lyrics: 'l',
            duration: Duration.zero,
            createdAt: DateTime.now(),
          ),
        ),
      );

      final future = viewModel.generate();

      expect(viewModel.state, GenerationState.generating);
      await future;
    });
  });

  group('Inputs', () {
    test('setScripture updates value', () {
      viewModel.setScripture('John 3:16');
      expect(viewModel.scripture, 'John 3:16');
    });

    test('canGenerate returns true only when valid', () {
      expect(viewModel.canGenerate, false);
      viewModel.setScripture('Ref');
      expect(viewModel.canGenerate, false);
      viewModel.setVerse('Verse');
      expect(viewModel.canGenerate, true);
    });
  });
}
