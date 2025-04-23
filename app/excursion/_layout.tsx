import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GroupLayout() {
  const router = useRouter();

  const handleGoBack = () => {
    // If we can go back, do so, otherwise go to home
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: "Detalle de excursión",
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={handleGoBack} style={{ marginLeft: 10 }}>
              <Ionicons
                name="arrow-back"
                className="me-10"
                size={24}
                color="black"
              />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
