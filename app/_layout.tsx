import "@/global.css";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "react-native-reanimated";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { PaperProvider } from "react-native-paper";
import { useEffect } from "react";

import { es, registerTranslation } from "react-native-paper-dates";
registerTranslation("es", es);

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // router.replace("/login");
  });

  return (
    <GluestackUIProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ title: "Costa Atlantica APP" }}
          />
          <Stack.Screen name="login" options={{ title: "Inicio de sesión" }} />
          <Stack.Screen name="group" options={{ headerShown: false }} />
          <Stack.Screen
            name="+not-found"
            options={{ title: "Página no encontrada" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </GluestackUIProvider>
  );
}
