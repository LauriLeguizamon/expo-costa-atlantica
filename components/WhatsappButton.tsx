import { FaWhatsapp } from "react-icons/fa";
import { Text } from "./ui/text";
import { useEffect, useState } from "react";
import { View } from "react-native";

function WhatsappButton({ phoneNumber }: any) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gim;
    setIsValid(phoneRegex.test(phoneNumber));
  }, [phoneNumber]);

  return (
    <>
      {isValid && (
        <View
          className={`flex items-center text-emerald-500 bg-emerald-50 px-4 py-1 rounded-full active:bg-emerald-100 active:scale-95 transition-all flex-row
      }`}
        >
          <Text className="text-emerald-500 me-2 text-sm">Enviar Mensaje</Text>
          <FaWhatsapp className="" />
        </View>
      )}
    </>
  );
}

export default WhatsappButton;
