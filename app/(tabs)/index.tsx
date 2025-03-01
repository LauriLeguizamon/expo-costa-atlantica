import useGroups from "@/hooks/useGroups";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";

import dayjs from "dayjs";
import GroupCard from "@/components/GroupCard";
import { Button, ButtonText } from "@/components/ui/button";
import DatePicker from "@/components/DatePicker";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen(props: any) {
  const { getGroups, groups } = useGroups();
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));

  useFocusEffect(
    useCallback(() => {
      getGroups({ check_in_date: dayjs(date).format("YYYY-MM-DD") });
    }, [])
  );

  const changeDate = (newDate: string) => {
    console.log(newDate);
    setDate(newDate);
    getGroups({ check_in_date: newDate });
  };

  return (
    <View>
      <Button
        className="m-2"
        onPress={() =>
          getGroups({ check_in_date: dayjs().format("YYYY-MM-DD") })
        }
      >
        <ButtonText>Recargar</ButtonText>
      </Button>

      <DatePicker
        initialDate={date}
        onConfirm={(newDate: string) => changeDate(newDate)}
      ></DatePicker>

      {groups?.map((group: any) => (
        <GroupCard key={group.id} group={group}></GroupCard>
      ))}
    </View>
  );
}
