# Android build notes

The shared Capacitor app is configured for Android.

## Prerequisites
- Java 17 JDK
- Android SDK with platform-tools and build-tools
- Gradle available on PATH, or use the Android Studio Gradle wrapper flow

## Verified status
- Frontend build: working
- Capacitor sync: working
- Android project generation: working

## Build command
From the frontend folder:

```powershell
npm run cap:android:build
```

If Gradle is not available on PATH, install Gradle or run the build from Android Studio.
