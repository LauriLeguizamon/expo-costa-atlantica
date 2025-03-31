import dayjs from "dayjs";
import { Card } from "./ui/card";
import { Text } from "./ui/text";

import WhatsappButton from "./WhatsappButton";
import { View } from "./ui/view";
import { Pressable } from "./ui/pressable";
import { useRouter } from "expo-router";

function GroupCard({ group }: any) {
  const router = useRouter();

  return (
    <Pressable
      className="p-4 rounded-lg mx-2 my-1 bg-white shadow-sm"
      onPress={() => {
        router.push(`/group/${group.id}`);
      }}
    >
      <View className="flex justify-between items-center mb-1 flex-row">
        <Text className="text-lg font-semibold">{group.company.name}</Text>
        <Text className="font-normal text-typography-700">
          {`Salida: ${dayjs(group.checkOutDate).format("DD/MM")} - ${dayjs(
            group.checkOutDate
          ).diff(dayjs(group.checkInDate), "day")} noches`}
        </Text>
      </View>

      {group.coordinator && (
        <>
          <Text className="mt-1 text-typography-400 text-xs">Coordinador</Text>
          <View className="flex items-center justify-between flex-row">
            <Text className="me-2">{`${group.coordinator.firstName} ${group.coordinator.lastName}`}</Text>

            <WhatsappButton phoneNumber={group.coordinator.phoneNumber} />
          </View>
        </>
      )}

      {group.entryCoordinatorName && (
        <>
          <Text className="mt-2 text-typography-400 text-xs">Rebotero</Text>
          <View className={`flex items-center justify-between flex-row`}>
            <Text className={`me-2`}>{group.entryCoordinatorName}</Text>

            <WhatsappButton phoneNumber={group.entryNumber} />
          </View>
        </>
      )}

      <Text className="mt-1 text-typography-400 text-xs">Observaciones</Text>
      {group.entryGroupObservation && (
        <Text>{group.entryGroupObservation}</Text>
      )}
      {!group.entryGroupObservation && <Text>Sin observaciones</Text>}
    </Pressable>
  );
}

export default GroupCard;
