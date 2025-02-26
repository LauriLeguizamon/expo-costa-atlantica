import { View } from "react-native";
import PassengerItem from "./PassengerItem";
import { Box } from "./ui/box";
import { Text } from "./ui/text";

function HotelCard({ hotel, updateList, updatePassenger }: any) {
  return (
    <Box className="bg-white p-4 my-2">
      <Text className="font-semibold text-xl">{hotel.hotelName}</Text>
      {hotel.excursions.map((excursion: any) => (
        <View className="mt-2" key={excursion.excursionName}>
          <Text className="font-semibold text-lg">
            {excursion.excursionName}
          </Text>

          {excursion.passengers.map((passenger: any) => (
            <PassengerItem
              key={passenger.id}
              passenger={passenger}
              updateList={updateList}
              updatePassenger={(passenger: any) => updatePassenger(passenger)}
            />
          ))}
        </View>
      ))}
    </Box>
  );
}

export default HotelCard;
