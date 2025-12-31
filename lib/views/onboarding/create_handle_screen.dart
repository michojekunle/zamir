import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../view_models/onboarding_view_model.dart';
import './select_genre_screen.dart';

class CreateHandleScreen extends StatefulWidget {
  const CreateHandleScreen({super.key});

  @override
  State<CreateHandleScreen> createState() => _CreateHandleScreenState();
}

class _CreateHandleScreenState extends State<CreateHandleScreen> {
  final TextEditingController _nameController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final onboardingVM = context.watch<OnboardingViewModel>();

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              const Text(
                'Create your unique\nHandle',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  height: 1.2,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'This is how others will find you on Zamir',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 60),
              TextField(
                controller: _nameController,
                onChanged: (value) {
                  onboardingVM.setUserName(value);
                },
                decoration: const InputDecoration(
                  labelText: 'Handle / Alia',
                  hintText: 'Enter your handle',
                  prefixIcon: Icon(Icons.alternate_email),
                ),
                textInputAction: TextInputAction.done,
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: onboardingVM.canProceedFromUserName
                      ? () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => const SelectGenresScreen(),
                            ),
                          );
                        }
                      : null,
                  child: const Text(
                    'Continue',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}