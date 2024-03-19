import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'RÉPERTOIRE DES ORGANISMES',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
