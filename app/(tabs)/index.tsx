import useGroups from "@/hooks/useGroups";
import { useEffect } from "react";
import { Text, View } from "react-native";

import dayjs from "dayjs";
import GroupCard from "@/components/GroupCard";

export default function HomeScreen(props: any) {
  const { getGroupsByDate, groups } = useGroups();

  useEffect(() => {
    getGroupsByDate({ check_in_date: dayjs().format("YYYY-MM-DD") });
  }, []);

  return (
    <View>
      {groups?.map((group: any) => (
        <GroupCard key={group.id} group={group}></GroupCard>
      ))}
    </View>
  );
}
