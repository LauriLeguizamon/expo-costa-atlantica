import { View } from "react-native";
import { Box } from "./ui/box";
import { Text } from "./ui/text";
import { FontAwesome } from "@expo/vector-icons";
import useGroups from "@/hooks/useGroups";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

function PassengerItem({ passenger, updateList, updatePassenger }: any) {
  const { getGroupFromDB, groupFromDB } = useGroups();

  const deletePassenger = () => {
    getGroupFromDB(passenger.group);
    console.log("delete passenger");
  };

  useEffect(() => {
    if (!groupFromDB) return;

    const passengerList = groupFromDB.passengers.filter(
      (p: any) => p.id !== passenger.id
    );

    const newGroup = { ...groupFromDB, passengers: passengerList };

    AsyncStorage.setItem(`group_${passenger.group}`, JSON.stringify(newGroup));

    updateList();
  }, [groupFromDB]);

  return (
    <Box className="border-b mb-1 py-2 flex items-center justify-between flex-row">
      <View className="flex flex-col">
        <Text className="">{passenger.name}</Text>
        <Text className="text-sm text-typography-500">
          {`M: ${passenger.adultsCount} m: ${passenger.minorsCount} u: ${passenger.babyCount} L: ${passenger.freeCount} 1/2 L: ${passenger.halfPriceAdultsCount}`}
        </Text>
      </View>

      <View className="flex flex-row space-x-2 items-center">
        <FontAwesome
          name="edit"
          size={22}
          color="blue"
          className="me-3"
          onPress={() => {
            updatePassenger(passenger);
          }}
        />
        <FontAwesome
          name="trash"
          size={22}
          color="red"
          onPress={() => deletePassenger()}
        />
      </View>
    </Box>
  );
}

export default PassengerItem;
