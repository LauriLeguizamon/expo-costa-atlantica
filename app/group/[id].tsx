import HotelCard from "@/components/HotelCard";
import PassengerForm from "@/components/PassengerForm";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import useGroups from "@/hooks/useGroups";
import usePassengers from "@/hooks/usePassengers";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";

function GroupDetail() {
  const { id } = useLocalSearchParams();

  const { group, getGroupDetail, getGroupFromDB, groupFromDB } = useGroups();
  const { groupPassengersByHotelAndExcursion, createPassengers } =
    usePassengers();

  const [modalVisible, setModalVisible] = useState(false);
  const [passengers, setPassengers] = useState([]);
  const [passengerToEdit, setPassengerToEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    <View className="flex-1">
      <ScrollView className="flex-1 pb-20">
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
      </ScrollView>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              ¿Seguro que quieres enviar este listado de pasajeros?
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text size="sm" className="text-typography-500">
              La única forma de corregir esta información es contactando con la
              oficina.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                createPassengers(id as string);
                setShowModal(false);
              }}
            >
              <ButtonText>Confirmar envío</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <View className="absolute bottom-0 w-full p-4 bg-white border-t border-gray-300">
        <Button className="w-full" onPress={() => setShowModal(true)}>
          <ButtonText>Confirmar carga de pasajeros</ButtonText>
        </Button>
      </View>
    </View>
  );
}

export default GroupDetail;
