import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";

const useRequest = (endpoint?: string, method = "GET", body = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const isTokenExpired = (token: string | null) => {
    if (!token) return true;
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;

    return decoded.exp * 1000 < Date.now();
  };

  const refreshAccessToken = async () => {
    const baseUrl = process.env.REACT_APP_API_URL;
    if (!baseUrl) {
      throw new Error("REACT_APP_BASE_URL is not defined");
    }

    try {
      const response = await axios.post(`${baseUrl}users/refresh/`, {
        refresh: localStorage.getItem("refreshToken"),
      });
      localStorage.setItem("accessToken", response.data.access);
      return response.data.access;
    } catch (err) {
      localStorage.clear();
      router.push("/login");
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
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (
        !noAuthEndpoints.some((noAuth: string) => endpoint.includes(noAuth))
      ) {
        let accessToken = localStorage.getItem("accessToken");

        if (!localStorage.getItem("refreshToken")) {
          localStorage.clear();
          // message.error("Debes volver a iniciar sesión");
          router.push("/login");
          return;
        }

        if (isTokenExpired(accessToken)) {
          accessToken = await refreshAccessToken();
        }

        headers.Authorization = `Bearer ${accessToken}`;
      }

      const baseUrl = process.env.EXPO_PUBLIC_API_URL;
      console.log(baseUrl);
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

      successHandler(response.data);
      return response.data; // Return the response data
    } catch (error: any) {
      errorHandler(error.response);
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
