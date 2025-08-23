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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import EmptyStateCard from "@/components/EmptyStateCard";

function GroupDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

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

        {passengers.length > 0 ? (
          passengers.map((hotel: any) => (
            <HotelCard
              hotel={hotel}
              key={hotel.hotelName}
              updateList={updateList}
              updatePassenger={(passenger: any) => {
                setPassengerToEdit(passenger);
              }}
            />
          ))
        ) : (
          <EmptyStateCard
            title="No hay pasajeros registrados"
            message="Añade pasajeros a este grupo para comenzar la gestión."
            actionLabel="Crear pasajero"
            onAction={() => setModalVisible(true)}
          />
        )}

        <PassengerForm
          visible={modalVisible}
          group={group}
          passengerToEdit={passengerToEdit}
          onClose={(refreshNeeded?: boolean) => {
            if (refreshNeeded) {
              getGroupFromDB(id as string);
            }
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
              onPress={async () => {
                createPassengers(id as string);
                await AsyncStorage.removeItem(`group_${id}`);
                router.push("/");

                setShowModal(false);
              }}
            >
              <ButtonText>Confirmar envío</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <View className="absolute bottom-0 w-full p-4 bg-white border-t border-gray-300">
        <Button
          className="w-full"
          onPress={() => setShowModal(true)}
          isDisabled={passengers.length === 0}
        >
          <ButtonText>Confirmar carga de pasajeros</ButtonText>
        </Button>
      </View>
    </View>
  );
}

export default GroupDetail;
