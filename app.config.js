const config = {
  expo: {
    name: "expo-costa-atlantica",
    slug: "expo-costa-atlantica",
    owner: "laureanoleguizamon-org",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-file-system",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      theme: "./nativewind.config.js",
      eas: {
        projectId: "e8c51359-2fc4-40bc-a968-558d43e00323",
      },
    },
  },
};

module.exports = config;
