import { useState } from "react";

import useRequest from "./useRequest";
import useCustomToast from "./useCustomToast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useGroups = () => {
  const { request } = useRequest();

  const { errorToast } = useCustomToast();

  const [loading, setLoading] = useState({
    get: false,
    post: false,
    put: false,
    delete: false,
  });

  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState([]);
  const [groupFromDB, setGroupFromDB]: any = useState(undefined);

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
      `groups/${id}/`,
      (data: any) => {
        setLoading((prev) => ({ ...prev, get: false }));
        setGroup(data);
      },
      (error: any) => {
        errorToast("Error obteniendo los grupos, contactase con el soporte");

        setLoading((prev) => ({ ...prev, get: false }));
      },
      null,
      {}
    );
  };

  const getGroupFromDB = async (id: string) => {
    const groupFromDB = await AsyncStorage.getItem(`group_${id}`);

    if (groupFromDB) {
      setGroupFromDB(JSON.parse(groupFromDB));
    }
  };

  return {
    // groups
    getGroups,
    getGroupFromDB,
    getGroupDetail,
    groups,
    group,
    groupFromDB,

    loading,
    setLoading,
  };
};

export default useGroups;
