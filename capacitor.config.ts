import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.nepalranks.app",
  appName: "Nepal Ranks",
  webDir: "out",
  server: {
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://nepalranks.com",
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0A0A0A",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      iosSpinnerStyle: "small",
      spinnerColor: "#DC143C",
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0A0A0A",
      overlaysWebView: false,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  ios: {
    contentInset: "automatic",
    scrollEnabled: true,
  },
};

export default config;
