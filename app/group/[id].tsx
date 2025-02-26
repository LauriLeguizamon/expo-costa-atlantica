import HotelCard from "@/components/HotelCard";
import PassengerForm from "@/components/PassengerForm";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import useGroups from "@/hooks/useGroups";
import usePassengers from "@/hooks/usePassengers";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

function GroupDetail() {
  const { id } = useLocalSearchParams();

  const { group, getGroupDetail, getGroupFromDB, groupFromDB } = useGroups();
  const { groupPassengersByHotelAndExcursion } = usePassengers();

  const [modalVisible, setModalVisible] = useState(false);
  const [passengers, setPassengers] = useState([]);
  const [passengerToEdit, setPassengerToEdit] = useState(null);

  useEffect(() => {
    if (!id) return;

    getGroupFromDB(id as string);

    getGroupDetail(parseInt(id as string));
  }, [id]);

  useEffect(() => {
    if (!groupFromDB) return;

    setPassengers(groupPassengersByHotelAndExcursion(groupFromDB));
  }, [groupFromDB]);

  useEffect(() => {
    if (!passengerToEdit) return;

    setModalVisible(true);
  }, [passengerToEdit]);

  const updateList = () => {
    getGroupFromDB(id as string);
  };

  return (
    <View>
      <Button className="m-4" onPress={() => setModalVisible(true)}>
        <ButtonText>Crear nuevo pasajero</ButtonText>
      </Button>

      <Text className="font-semibold text-xl my-2 text-center ms-3">
        Listado de pasajeros
      </Text>

      {passengers.map((hotel: any) => (
        <HotelCard
          hotel={hotel}
          key={hotel.hotelName}
          updateList={updateList}
          updatePassenger={(passenger: any) => {
            setPassengerToEdit(passenger);
          }}
        />
      ))}

      <PassengerForm
        visible={modalVisible}
        group={group}
        passengerToEdit={passengerToEdit}
        onClose={() => {
          getGroupFromDB(id as string);
          setPassengerToEdit(null);
          setModalVisible(false);
        }}
      />
    </View>
  );
}

export default GroupDetail;
