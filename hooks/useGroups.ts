import { useState } from "react";

import useRequest from "./useRequest";
import useCustomToast from "./useCustomToast";

const useGroups = () => {
  const { request } = useRequest(); // Destructure request from useRequest

  const { errorToast } = useCustomToast();

  const [loading, setLoading] = useState({
    get: false,
    post: false,
    put: false,
    delete: false,
  });

  const [groups, setGroups] = useState([]);

  const getGroupsByDate = async (params: object) => {
    setLoading((prev) => ({ ...prev, post: true }));
    return await request(
      "get",
      "groups/",
      (data: any) => {
        setLoading((prev) => ({ ...prev, post: false }));
        console.log("data", data);
        setGroups(data.results);
      },
      (error: any) => {
        errorToast("Error obteniendo los grupos, contactase con el soporte");
        console.log(error);

        setLoading((prev) => ({ ...prev, post: false }));
      },
      null,
      params
    );
  };

  return {
    // groups
    getGroupsByDate,
    groups,

    loading,
    setLoading,
  };
};

export default useGroups;
