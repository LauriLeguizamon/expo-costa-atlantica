import { useState } from "react";

import useRequest from "./useRequest";
import { useRouter } from "expo-router";
import useCustomToast from "./useCustomToast";

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
      (data: any) => {
        const accessToken = data.tokens.access;
        const refreshToken = data.tokens.refresh;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

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
