import { useState } from "react";

import useRequest from "./useRequest";
import { useRouter } from "expo-router";
import useCustomToast from "./useCustomToast";

const useAuth = () => {
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

  return {
    // passengers
    createPassengers,

    loading,
    setLoading,
  };
};

export default useAuth;
