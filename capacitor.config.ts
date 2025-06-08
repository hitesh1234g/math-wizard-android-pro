
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.259a78e716ab415e9d106576bc61072f',
  appName: 'math-wizard-android-pro',
  webDir: 'dist',
  server: {
    url: 'https://259a78e7-16ab-415e-9d10-6576bc61072f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
