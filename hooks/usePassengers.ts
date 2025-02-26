import { useState } from "react";

import useRequest from "./useRequest";
import { useRouter } from "expo-router";
import useCustomToast from "./useCustomToast";

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

  const createPassengers = async (passengers: any) => {
    setLoading((prev) => ({ ...prev, post: true }));
    return await request(
      "post",
      "passengers",
      async (data: any) => {
        setLoading((prev) => ({ ...prev, post: false }));
        successToast("Pasajero agregado correctamente");
      },
      (error: any) => {
        errorToast(error);
        setLoading((prev) => ({ ...prev, post: false }));
      },
      passengers
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
