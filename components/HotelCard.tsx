import { View } from "react-native";
import PassengerItem from "./PassengerItem";
import { Box } from "./ui/box";
import { Text } from "./ui/text";

function HotelCard() {
  const excursions = [
    {
      key: 1,
      name: "Miramar mar. 13 feb",
      passengers: [
        {
          key: 1,
          name: "Juan Perez",
          minor: 3,
          major: 2,
          free: 0,
          halfFree: 0,
        },
        {
          key: 2,
          name: "Juan Perez",
          minor: 3,
          major: 2,
          free: 0,
          halfFree: 0,
        },
      ],
    },
    {
      key: 2,
      name: "Villa Gessel lun. 12 feb",
      passengers: [
        {
          key: 1,
          name: "Juan Perez",
          minor: 3,
          major: 2,
          free: 0,
          halfFree: 0,
        },
        {
          key: 2,
          name: "Juan Perez",
          minor: 3,
          major: 2,
          free: 0,
          halfFree: 0,
        },
      ],
    },
  ];
  return (
    <Box className="bg-white p-4 my-2">
      <Text className="font-semibold text-xl">Hotel Provincial</Text>
      {excursions.map((excursion: any) => (
        <View className="mt-2" key={excursion.key}>
          <Text className="font-semibold text-lg">{excursion.name}</Text>

          {excursion.passengers.map((passenger: any) => (
            <PassengerItem key={passenger.key} passenger={passenger} />
          ))}
        </View>
      ))}
    </Box>
  );
}

export default HotelCard;
