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
    console.log(date);
  }, [date]);

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = useCallback(
    (params: any) => {
      setOpen(false);

      setDate(params.date);
      console.log(onConfirm);
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
      <Text className="pt-2 font-semibold">Selector de fecha</Text>
      <View className="flex flex-row justify-between items-center">
        <Text>
          {dayjs(date).tz("America/Argentina/Buenos_Aires").format("ddd DD/MM")}
        </Text>

        <Button onPress={() => setOpen(true)} variant="link">
          <ButtonText>Cambiar</ButtonText>
          <ButtonIcon as={ChevronDownIcon} />
        </Button>

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
    </View>
  );
}

export default DatePicker;
