import { useState } from "react";

import useRequest from "./useRequest";
import { useRouter } from "expo-router";
import useCustomToast from "./useCustomToast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuth = () => {
  const { request } = useRequest(); // Destructure request from useRequest

  const { errorToast, warningToast } = useCustomToast();

  const router = useRouter();

  const [loading, setLoading] = useState({
    get: false,
    post: false,
    put: false,
    delete: false,
  });

  const login = async (data: any) => {
    setLoading((prev) => ({ ...prev, post: true }));
    return await request(
      "post",
      "users/login/",
      async (data: any) => {
        const accessToken = data.tokens.access;
        const refreshToken = data.tokens.refresh;

        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("refreshToken", refreshToken);

        router.replace("/");
        setLoading((prev) => ({ ...prev, post: false }));
      },
      (error: any) => {
        error.status === 400 && error.data.messageError
          ? warningToast(error.data.messageError)
          : errorToast("Error iniciando sesión, contáctate con el soporte");

        setLoading((prev) => ({ ...prev, post: false }));
      },
      { ...data, clientType: "APP" }
    );
  };

  return {
    login,
    loading,
    setLoading,
  };
};

export default useAuth;
