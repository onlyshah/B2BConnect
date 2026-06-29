import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.b2bconnect.app',
  appName: 'B2BConnect',
  webDir: 'dist/b2bconnect',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    StatusBar: {
      style: 'dark',
    },
    SplashScreen: {
      launchShowDuration: 1000,
    },
  },
};

export default config;
