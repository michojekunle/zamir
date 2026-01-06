import 'package:mockito/annotations.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'package:zamir_app/services/auth_service.dart';
import 'package:zamir_app/services/user_service.dart';
import 'package:zamir_app/services/suno_service.dart';

@GenerateMocks([
  AuthService,
  UserService,
  SunoService,
  FirebaseAuth,
  User,
  UserCredential,
  GoogleSignIn,
  GoogleSignInAccount,
  GoogleSignInAuthentication,
  http.Client,
])
void main() {}
