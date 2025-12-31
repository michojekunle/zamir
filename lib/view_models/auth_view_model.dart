import 'package:flutter/material.dart';
import '../models/app_models.dart';

class AuthViewModel extends ChangeNotifier {
  User? _currentUser;
  bool _isAuthenticated = false;

  User? get currentUser => _currentUser;
  bool get isAuthenticated => _isAuthenticated;

  Future<void> signIn(String email, String password) async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    
    _currentUser = User(
      id: '1',
      name: 'User',
      email: email,
    );
    _isAuthenticated = true;
    notifyListeners();
  }

  Future<void> signOut() async {
    _currentUser = null;
    _isAuthenticated = false;
    notifyListeners();
  }

  void updateUser(User user) {
    _currentUser = user;
    notifyListeners();
  }
}