# Zamir App - Production Setup Guide

## 🚨 Issues to Fix Before Production

### Issue 1: Google Sign-In Not Working

Your Firebase configuration is missing OAuth client settings. Follow these steps:

---

## Step 1: Enable Google Sign-In in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project **"zamir-music-app"**
3. Navigate to **Authentication** → **Sign-in method**
4. Click **Google** and toggle **Enable**
5. Add your **Support email** (your email address)
6. Click **Save**

---

## Step 2: Add SHA Fingerprints (Android)

For Google Sign-In to work on Android, you need to add SHA fingerprints:

### Get Debug SHA-1 Fingerprint:

```bash
# On Mac/Linux (requires Java installed)
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Look for the SHA1 line, example:
# SHA1: DA:39:A3:EE:5E:6B:4B:0D:32:55:BF:EF:95:60:18:90:AF:D8:07:09
```

### Add to Firebase:

1. Go to Firebase Console → Project Settings
2. Under "Your apps", click your Android app
3. Click **Add fingerprint**
4. Paste your SHA-1 fingerprint (remove colons for Firebase)
5. Click **Save**

---

## Step 3: Download Updated Configuration Files

### Android (`google-services.json`):

1. In Firebase Console → Project Settings → General
2. Under "Your apps", find your Android app
3. Click the **google-services.json** download button
4. Replace the file at: `android/app/google-services.json`

### iOS (`GoogleService-Info.plist`):

1. Under "Your apps", find your iOS app
2. Click the **GoogleService-Info.plist** download button
3. Replace the file at: `ios/Runner/GoogleService-Info.plist`

---

## Step 4: Update iOS Info.plist

After downloading the new `GoogleService-Info.plist`, find the `REVERSED_CLIENT_ID` value in it.

Then update `ios/Runner/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <!-- Replace with your actual REVERSED_CLIENT_ID -->
            <string>YOUR_REVERSED_CLIENT_ID_FROM_GOOGLESERVICE_INFO_PLIST</string>
        </array>
    </dict>
</array>
```

The `REVERSED_CLIENT_ID` looks like: `com.googleusercontent.apps.434440546796-xxxxxxxxxxxxx`

---

## Step 5: Clean and Rebuild

```bash
# Clean the project
flutter clean

# Get dependencies
flutter pub get

# Run on iOS (for Google Sign-In)
cd ios && pod install && cd ..
flutter run
```

---

---

### Issue 2: Music Generation (Suno API) Not Working

The Suno API configuration is in `lib/config/api_config.dart`.

## Verify Your API Key

1. Go to [sunoapi.org](https://sunoapi.org) and log in
2. Navigate to Dashboard → API Key
3. Verify your key is correct: `b24eba8b53420d77f30f7af3c286af77`fb334d118f6ac97c0edcae74fdd51604
4. Check your remaining credits

## Test the API

You can test your Suno API directly:

```bash
curl -X POST 'https://api.sunoapi.org/api/v1/generate' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer b24eba8b53420d77f30f7af3c286af77' \
  -d '{
    "prompt": "Create a peaceful worship song about Psalm 23",
    "lyrics": "The Lord is my shepherd, I shall not want",
    "style": "worship, spiritual, peaceful",
    "wait_audio": false
  }'
```

If you get an error:

- **401 Unauthorized**: API key is invalid or expired
- **402 Payment Required**: No credits remaining
- **429 Too Many Requests**: Rate limit exceeded

## Update API Key

If your key is invalid, get a new one from sunoapi.org and update:

```dart
// lib/config/api_config.dart
class ApiConfig {
  static const String sunoApiKey = 'YOUR_NEW_API_KEY_HERE';
  static const bool isSunoConfigured = true;
}
```

---

## Quick Checklist

- [ ] Enabled Google Sign-In in Firebase Authentication
- [ ] Added SHA-1 fingerprint to Firebase (Android)
- [ ] Downloaded new `google-services.json`
- [ ] Downloaded new `GoogleService-Info.plist`
- [ ] Updated `Info.plist` with `REVERSED_CLIENT_ID`
- [ ] Verified Suno API key is valid
- [ ] Verified Suno account has credits
- [ ] Ran `flutter clean && flutter pub get`
- [ ] Ran `pod install` in ios directory
