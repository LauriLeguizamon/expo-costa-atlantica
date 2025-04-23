import "@/global.css";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, TouchableOpacity, Alert } from "react-native";
import "react-native-reanimated";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
  PaperProvider,
  Button,
  Dialog,
  Portal,
  Text,
  IconButton,
} from "react-native-paper";
import { useEffect, useState } from "react";

import { es, registerTranslation } from "react-native-paper-dates";
import AsyncStorage from "@react-native-async-storage/async-storage";
registerTranslation("es", es);

const LogoutButton = () => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleLogout = async () => {
    // Implement your logout logic here
    // For example: clear tokens, reset user state, etc.
    hideDialog();
    await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
    router.replace("/login");
  };

  return (
    <View>
      <IconButton icon="logout" size={24} onPress={showDialog} />
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Cerrar sesión</Dialog.Title>
          <Dialog.Content>
            <Text>¿Está seguro que desea cerrar sesión?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancelar</Button>
            <Button onPress={handleLogout}>Confirmar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   if (pathname === "/") {
  //     router.replace("/app/(tabs)/");
  //   }
  // }, [pathname]);

  return (
    <GluestackUIProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              title: "Costa Atlantica APP",
              headerRight: () => <LogoutButton />,
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              title: "Inicio de sesión",
              headerRight: () => null, // No logout button on login screen
            }}
          />
          <Stack.Screen name="group" options={{ headerShown: false }} />
          <Stack.Screen
            name="excursion"
            options={{
              headerShown: false, // Add this line
            }}
          />
          <Stack.Screen
            name="+not-found"
            options={{
              title: "Página no encontrada",
              headerRight: () => <LogoutButton />,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </GluestackUIProvider>
  );
}
