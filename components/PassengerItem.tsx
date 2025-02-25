import { View } from "react-native";
import { Box } from "./ui/box";
import { Text } from "./ui/text";
import { FontAwesome } from "@expo/vector-icons";

function PassengerItem({ passenger }: any) {
  return (
    <Box className="border-b mb-1 py-2 flex items-center justify-between flex-row">
      <View className="flex flex-col">
        <Text className="">Laureano Leguizamon</Text>
        <Text className="text-sm text-typography-500">
          m: 2 M:2 u:0 L:0 1/2 L: 0
        </Text>
      </View>

      <View className="flex flex-row space-x-2 items-center">
        <FontAwesome name="edit" size={22} color="blue" className="me-3" />
        <FontAwesome name="trash" size={22} color="red" />
      </View>
    </Box>
  );
}

export default PassengerItem;
