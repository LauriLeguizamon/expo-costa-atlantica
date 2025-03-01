import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/es"; // Add this line to import the Spanish locale

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("es"); // Set the locale to Spanish

import { Button, ButtonIcon, ButtonText } from "./ui/button";
import { Text } from "./ui/text";
import { ChevronDownIcon } from "./ui/icon";

function DatePicker({ onConfirm, initialDate }: any) {
  const [date, setDate] = useState(
    initialDate
      ? dayjs(initialDate).tz("America/Argentina/Buenos_Aires").toDate()
      : dayjs().tz("America/Argentina/Buenos_Aires").toDate()
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log("initialDate", dayjs(initialDate), dayjs());
  }, [initialDate]);

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = useCallback(
    (params: any) => {
      setOpen(false);

      setDate(params.date);
      if (onConfirm) {
        onConfirm(
          dayjs(params.date)
            .tz("America/Argentina/Buenos_Aires")
            .format("YYYY-MM-DD")
        );
      }
    },
    [setOpen, setDate]
  );

  return (
    <View className="m-2 px-4 py-1 bg-white rounded-lg">
      <View className="flex-row pt-2 justify-between w-full flex">
        <Text className="pt-2 font-semibold">Selector de fecha</Text>

        {dayjs(initialDate).format("YYYY-MM-DD") !==
          dayjs().format("YYYY-MM-DD") && (
          <Text className="px-4 py-1 rounded-lg text-red-500 font-bold">
            Fuera de fecha
          </Text>
        )}
      </View>
      <View className="flex flex-row justify-between items-center">
        <Text>
          {dayjs(date).tz("America/Argentina/Buenos_Aires").format("ddd DD/MM")}
        </Text>

        <Button onPress={() => setOpen(true)} variant="link">
          <ButtonText>Cambiar</ButtonText>
          <ButtonIcon as={ChevronDownIcon} />
        </Button>
      </View>

      {dayjs(initialDate).format("YYYY-MM-DD") !==
        dayjs().format("YYYY-MM-DD") && (
        <Button
          onPress={() => {
            setOpen(false);
            onConfirmSingle({ date: dayjs().toDate() });
          }}
          className="bg-red-200 px-2 my-2 "
        >
          <ButtonText className="text-red-500 font-bold">
            Volver a hoy
          </ButtonText>
        </Button>
      )}

      <DatePickerModal
        locale="es"
        mode="single"
        presentationStyle="pageSheet"
        visible={open}
        onDismiss={onDismissSingle}
        date={date}
        onConfirm={onConfirmSingle}
      />
    </View>
  );
}

export default DatePicker;
