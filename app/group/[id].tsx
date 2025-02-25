import HotelCard from "@/components/HotelCard";
import PassengerForm from "@/components/PassengerForm";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import useGroups from "@/hooks/useGroups";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

function GroupDetail() {
  const { id } = useLocalSearchParams();

  const { group, getGroupDetail } = useGroups();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!id) return;

    getGroupDetail(parseInt(id as string));
  }, [id]);

  return (
    <View>
      <Button className="m-4" onPress={() => setModalVisible(true)}>
        <ButtonText>Crear nuevo pasajero</ButtonText>
      </Button>

      <Text className="font-semibold text-xl my-2 text-center ms-3">
        Listado de pasajeros
      </Text>

      <HotelCard />
      <HotelCard />

      <PassengerForm
        visible={modalVisible}
        group={group}
        onClose={() => {
          setModalVisible(false);
        }}
      />
    </View>
  );
}

export default GroupDetail;
