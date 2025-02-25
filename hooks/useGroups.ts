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
  const [group, setGroup] = useState([]);

  const getGroups = async (params: object) => {
    setLoading((prev) => ({ ...prev, get: true }));
    return await request(
      "get",
      "groups/",
      (data: any) => {
        setLoading((prev) => ({ ...prev, get: false }));
        setGroups(data.results);
      },
      (error: any) => {
        errorToast("Error obteniendo los grupos, contactase con el soporte");
        console.log(error);

        setLoading((prev) => ({ ...prev, get: false }));
      },
      null,
      params
    );
  };

  const getGroupDetail = async (id: number) => {
    setLoading((prev) => ({ ...prev, get: true }));
    return await request(
      "get",
      `groups/${id}`,
      (data: any) => {
        setLoading((prev) => ({ ...prev, get: false }));
        setGroup(data);
      },
      (error: any) => {
        console.log(error);
        errorToast("Error obteniendo los grupos, contactase con el soporte");

        setLoading((prev) => ({ ...prev, get: false }));
      },
      null,
      {}
    );
  };
  return {
    // groups
    getGroups,
    getGroupDetail,
    groups,
    group,

    loading,
    setLoading,
  };
};

export default useGroups;
