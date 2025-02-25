import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import useCustomToast from "./useCustomToast";

const useRequest = (endpoint?: string, method = "GET", body = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { errorToast } = useCustomToast();

  const router = useRouter();

  const isTokenExpired = (token: string | null) => {
    if (!token) return true;
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;

    return decoded.exp * 1000 < Date.now();
  };

  const refreshAccessToken = async () => {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!baseUrl) {
      throw new Error("EXPO_PUBLIC_API_URL is not defined");
    }

    try {
      console.log(await AsyncStorage.getItem("refreshToken"), "refreshToken");
      console.log(await AsyncStorage.getItem("accessToken"), "accessToken");
      const response = await axios.post(`${baseUrl}users/refresh/`, {
        refresh: await AsyncStorage.getItem("refreshToken"),
      });
      await AsyncStorage.setItem("accessToken", response.data.access);
      return response.data.access;
    } catch (err) {
      await AsyncStorage.clear();
      router.replace("/login");
    }
  };

  const noAuthEndpoints = ["login"]; // Add your no-auth endpoints here

  const request = async (
    method = "GET",
    endpoint: string,
    successHandler?: any,
    errorHandler?: any,
    body = null,
    params = {}
  ) => {
    try {
      setLoading(true);
      let headers: any = {
        // "Content-Type": "application/json",
        // Accept: "application/json",
        "User-Agent": "MyApp/1.0 (Expo)",
      };

      if (
        !noAuthEndpoints.some((noAuth: string) => endpoint.includes(noAuth))
      ) {
        let accessToken = await AsyncStorage.getItem("accessToken");
        let refreshToken = await AsyncStorage.getItem("refreshToken");

        console.log(accessToken, "accessToken");
        console.log(refreshToken, "refreshToken");

        if (!(await AsyncStorage.getItem("refreshToken"))) {
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
          errorToast("Debes volver a iniciar sesión");
          router.replace("/login");
          return;
        }

        if (isTokenExpired(accessToken)) {
          accessToken = await refreshAccessToken();
        }

        headers.Authorization = `Bearer ${accessToken}`;
      }

      const baseUrl = process.env.EXPO_PUBLIC_API_URL;
      if (!baseUrl) {
        throw new Error("EXPO_PUBLIC_API_URL is not defined");
      }

      const response = await axios({
        url: `${baseUrl}${endpoint}`,
        method,
        data: body,
        headers,
        params,
      });

      successHandler(response?.data);
      return response?.data;
    } catch (error: any) {
      // await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      // errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endpoint && method && body) request(method, endpoint, body);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, method, body]);

  return { data, loading, error, request };
};

export default useRequest;
