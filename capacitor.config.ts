import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.corbeaunews.cnc',
  appName: 'Corbeau News CNC',
  server: {
    url: 'https://cnc-app-lyart.vercel.app',
    cleartext: false
  }
};

export default config;
