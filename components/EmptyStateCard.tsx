import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { FontAwesome } from "@expo/vector-icons";

const EmptyStateCard = ({
  title,
  message,
  icon = "user",
  actionLabel,
  onAction,
}: any) => {
  return (
    <View className="bg-white rounded-xl p-6 min-mx-4 my-6 items-center shadow-sm border border-gray-200 sm:max-w-[50%] mx-auto">
      <View className="bg-gray-100 p-4 rounded-full mb-4">
        <FontAwesome name={icon} size={32} color="#3b82f6" />
      </View>

      <Heading size="md" className="text-typography-900 mb-2 text-center">
        {title}
      </Heading>

      <Text className="text-typography-500 text-center mb-6">{message}</Text>

      {actionLabel && onAction && (
        <Button onPress={onAction} className="mt-2">
          <ButtonText>{actionLabel}</ButtonText>
        </Button>
      )}
    </View>
  );
};

export default EmptyStateCard;
