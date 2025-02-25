import { useState } from "react";

import useRequest from "./useRequest";
import useCustomToast from "./useCustomToast";

const useHotels = () => {
  const { request } = useRequest(); // Destructure request from useRequest

  const { errorToast } = useCustomToast();

  const [loading, setLoading] = useState({
    get: false,
    post: false,
    put: false,
    delete: false,
  });

  const [hotels, setHotels]: any = useState([]);

  async function getHotels(params = {}) {
    setLoading({ ...loading, get: true });

    return await request(
      "GET",
      "hotels/",
      (data: any) => {
        setHotels(data);
        setLoading({ ...loading, get: false });
        return data;
      },
      (error: any) => {
        errorToast(error);
        setLoading({ ...loading, get: false });
        return error;
      },
      null,
      params
    );
  }

  return {
    // hotels
    getHotels,
    hotels,

    loading,
    setLoading,
  };
};

export default useHotels;
