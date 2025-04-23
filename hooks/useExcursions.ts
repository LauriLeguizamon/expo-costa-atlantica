import { useState } from "react";

import useRequest from "./useRequest";
import useCustomToast from "./useCustomToast";
import { PaymentData } from "../types/payment"; // Import the interface
import AsyncStorage from "@react-native-async-storage/async-storage";

const useExcursions = () => {
  const { request } = useRequest();
  const { errorToast, successToast } = useCustomToast(); // Add successToast if available

  const [loading, setLoading] = useState({
    get: false,
    post: false,
    put: false,
    delete: false,
  });

  const [excursions, setExcursions] = useState([]);
  const [excursion, setExcursion]: any = useState(null);

  const getExcursions = async (params: object = {}) => {
    setLoading((prev) => ({ ...prev, get: true }));
    return await request(
      "get",
      "scheduled-excursions-buses/",
      (data: any) => {
        setLoading((prev) => ({ ...prev, get: false }));
        setExcursions(data.results || data);
      },
      (error: any) => {
        console.error("Error fetching excursions:", error);
        errorToast(
          "Error obteniendo las excursiones, contactase con el soporte"
        );
        setLoading((prev) => ({ ...prev, get: false }));
      },
      null,
      params
    );
  };

  const getExcursionById = async (id: string | number) => {
    setLoading((prev) => ({ ...prev, get: true }));
    return await request(
      "get",
      `scheduled-excursions-buses/${id}/`,
      (data: any) => {
        setLoading((prev) => ({ ...prev, get: false }));
        setExcursion(data);
      },
      (error: any) => {
        console.error(`Error fetching excursion ${id}:`, error);
        errorToast("Error obteniendo la excursión, contactase con el soporte");
        setLoading((prev) => ({ ...prev, get: false }));
      }
    );
  };

  const addPayment = async (
    paymentData: any,
    onSuccess?: () => void, // Optional success callback
    onError?: () => void // Optional error callback
  ) => {
    const user = JSON.parse((await AsyncStorage.getItem("user")) || "");

    const payload = {
      ...paymentData, // Should contain { amount, passenger }
      user: user.id,
    };

    setLoading((prev) => ({ ...prev, post: true }));
    return await request(
      "post",
      "passengers/payments/",
      (data: any) => {
        setLoading((prev) => ({ ...prev, post: false }));
        console.log("Payment added successfully:", data);
        if (onSuccess) onSuccess(); // Call success callback
      },
      (error: any) => {
        console.error("Error adding payment:", error);
        const errorMessage =
          error?.response?.data?.detail ||
          "Error registrando el pago, contactase con el soporte";
        errorToast(errorMessage);
        setLoading((prev) => ({ ...prev, post: false }));
        if (onError) onError(); // Call error callback
      },
      payload // Pass the constructed payload
    );
  };

  return {
    getExcursions,
    excursions,
    getExcursionById,
    excursion,
    addPayment, // Export the new function

    loading,
    setLoading,
  };
};

export default useExcursions;
