import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs } from "expo-router";
import React, { useState, useEffect } from "react";
import { Platform, View } from "react-native";
import { IoHome, IoPaperPlane, IoWalk } from "react-icons/io5";

import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";

type User = {
  userType: string;
} | null;

export default function TabLayout() {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          setUser(JSON.parse(userString));
        }
      } catch (error) {
        console.error("Failed to fetch user from AsyncStorage", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return <View />;
  }

  if (!user) {
    console.warn("User data not found in AsyncStorage.");
    return <View />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: user.userType === "SELLER" ? undefined : null,
          title: "Home",
          tabBarIcon: ({ color }) => <IoHome size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: user.userType === "GUIDE" ? null : undefined,
          title: "Explore",
          tabBarIcon: ({ color }) => <IoPaperPlane size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="excursions"
        options={{
          href: user.userType === "SELLER" ? null : undefined,
          title: "Excursiones",
          tabBarIcon: ({ color }) => <IoWalk size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
