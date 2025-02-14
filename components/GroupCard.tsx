import dayjs from "dayjs";
import { Card } from "./ui/card";
import { Text } from "./ui/text";

import WhatsappButton from "./WhatsappButton";

function GroupCard({ group }: any) {
  return (
    <Card className="p-4 rounded-lg mx-2 my-1">
      <div className="flex justify-between items-center mb-1">
        <Text className="text-lg font-semibold">{group.company.name}</Text>
        <Text className="font-normal text-typography-700">
          {`${dayjs(group.checkOutDate).format("DD/MM")} - ${dayjs(
            group.checkOutDate
          ).diff(dayjs(group.checkInDate), "day")} noches`}
        </Text>
      </div>

      {group.coordinator && (
        <>
          <Text className="mt-1 text-typography-400 text-xs">Coordinador</Text>
          <div className={`flex items-center  justify-between`}>
            <Text
              className={`me-2`}
            >{`${group.coordinator.firstName} ${group.coordinator.lastName}`}</Text>

            <WhatsappButton phoneNumber={group.coordinator.phoneNumber} />
          </div>
        </>
      )}

      {group.entryCoordinatorName && (
        <>
          <Text className="mt-2 text-typography-400 text-xs">Rebotero</Text>
          <div className={`flex items-center  justify-between`}>
            <Text className={`me-2`}>{group.entryCoordinatorName}</Text>

            <WhatsappButton phoneNumber={group.entryNumber} />
          </div>
        </>
      )}

      <Text className="mt-1 text-typography-400 text-xs">Observaciones</Text>
      {group.observation && <Text>{group.observation}</Text>}
      {!group.observation && <Text>Sin observaciones</Text>}
    </Card>
  );
}

export default GroupCard;
