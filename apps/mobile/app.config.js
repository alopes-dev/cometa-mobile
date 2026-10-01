module.exports = {
  expo: {
    name: "Cometa",
    slug: "cometa",
    owner: "anthony.lopez",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    scheme: "cometa",
    ios: {
      supportsTablet: false,
      bundleIdentifier: "so.sof.cometa",
    },
    android: {
      package: "so.sof.cometa",
      adaptiveIcon: {
        backgroundColor: "#FFFFFF",
      },
    },
    web: {
      bundler: "metro",
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-splash-screen",
      "expo-image",
      "expo-dev-client",
      [
        "@rnmapbox/maps",
        {
          // Build-time token used only to download the native Mapbox SDK from
          // their private registry — not the same as the runtime public token.
          // See .env.example for where this comes from.
          RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOADS_TOKEN,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "638c24e1-00a3-4df2-8465-37d85d4ef4c5",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/638c24e1-00a3-4df2-8465-37d85d4ef4c5",
    },
  },
};
