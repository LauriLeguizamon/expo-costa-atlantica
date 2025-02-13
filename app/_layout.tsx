import "@/global.css";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "react-native-reanimated";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  });

  return (
    <GluestackUIProvider>
      <Stack>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </GluestackUIProvider>
  );
}
