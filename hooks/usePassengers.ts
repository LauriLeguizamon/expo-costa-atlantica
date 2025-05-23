import { useState } from "react";

import useRequest from "./useRequest";
import { useRouter } from "expo-router";
import useCustomToast from "./useCustomToast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const usePassengers = () => {
  const { request } = useRequest(); // Destructure request from useRequest

  const { errorToast, warningToast, successToast } = useCustomToast();

  const router = useRouter();

  const [loading, setLoading] = useState({
    get: false,
    post: false,
    put: false,
    delete: false,
  });

  const createPassengers = async (groupId: string) => {
    const groupString: any = await AsyncStorage.getItem(`group_${groupId}`);

    if (!groupString) return;

    const group = JSON.parse(groupString);

    group.passengers.forEach((passenger: any) => {
      passenger.hotel = passenger.hotel.id;
      passenger.scheduledExcursion = passenger.scheduledExcursion.id;
      delete passenger["id"];
      delete passenger["paymentAmount"];
    });

    setLoading((prev) => ({ ...prev, post: true }));
    return await request(
      "post",
      "passengers/list/",
      async (data: any) => {
        setLoading((prev) => ({ ...prev, post: false }));
        successToast("Pasajero agregado correctamente");
      },
      (error: any) => {
        errorToast(error);
        setLoading((prev) => ({ ...prev, post: false }));
      },
      group.passengers
    );
  };

  const groupPassengersByHotelAndExcursion = (data: any) => {
    const grouped: any = [];

    data.passengers.forEach((passenger: any) => {
      const hotelName = passenger.hotel.name;
      const excursionName = passenger.scheduledExcursion.name;

      // Find or create hotel group
      let hotelGroup = grouped.find((h: any) => h.hotelName === hotelName);
      if (!hotelGroup) {
        hotelGroup = { hotelName, excursions: [] };
        grouped.push(hotelGroup);
      }

      // Find or create excursion group within the hotel
      let excursionGroup = hotelGroup.excursions.find(
        (e: any) => e.excursionName === excursionName
      );
      if (!excursionGroup) {
        excursionGroup = { excursionName, passengers: [] };
        hotelGroup.excursions.push(excursionGroup);
      }

      // Add passenger to the excursion group
      excursionGroup.passengers.push(passenger);
    });

    return grouped;
  };

  return {
    // passengers
    createPassengers,
    groupPassengersByHotelAndExcursion,

    loading,
    setLoading,
  };
};

export default usePassengers;
