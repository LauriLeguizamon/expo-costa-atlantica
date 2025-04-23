import HotelCard from "@/components/HotelCard";
import PassengerForm from "@/components/PassengerForm";
import { Text } from "@/components/ui/text";
import useExcursions from "@/hooks/useExcursions";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import EmptyStateCard from "@/components/EmptyStateCard";
import { Feather } from "@expo/vector-icons";

function ExcursionDetail() {
  const { id } = useLocalSearchParams();

  const { excursion, getExcursionById } = useExcursions();

  const [modalVisible, setModalVisible] = useState(false);
  const [passengersByHotel, setPassengersByHotel] = useState([]);
  const [passengerToEdit, setPassengerToEdit] = useState(null);

  useEffect(() => {
    if (!id) return;

    getExcursionById(parseInt(id as string));
  }, []);

  useEffect(() => {
    if (!excursion || !excursion.passengersGroupedByHotels) {
      setPassengersByHotel([]);
      return;
    }

    setPassengersByHotel(excursion.passengersGroupedByHotels);
  }, [excursion]);

  useEffect(() => {
    if (passengerToEdit) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [passengerToEdit]);

  const updateList = () => {
    if (!id) return;
    getExcursionById(parseInt(id as string));
  };

  // Simple local currency formatter
  const formatLocalCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) {
      return "$ 0.00";
    }
    // Basic formatting, adjust as needed (e.g., for locale-specific formats)
    return `$ ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        {/* Main Title */}

        {/* Excursion Information Section */}
        <View className="mt-4 mb-2 px-4 py-3 bg-gray-50 border-y border-gray-200">
          <Text className="font-semibold text-lg mb-2 text-gray-800">
            {excursion?.busExcursion?.excursionType?.name || "Excursión"}
          </Text>
          {excursion?.scheduledExcursion?.day && (
            <Text className="text-base text-gray-600 mb-1">
              Fecha: {excursion.scheduledExcursion.day}
            </Text>
          )}
          {excursion?.scheduledExcursion?.excursionType.name && (
            <Text className="text-base text-gray-600 mb-1">
              Nombre: {excursion.scheduledExcursion.excursionType.name}
            </Text>
          )}
          {excursion?.busExcursion?.bus?.busSelectorName && (
            <Text className="text-base text-gray-600 mb-1">
              Bus: {excursion.busExcursion.bus.busSelectorName}
            </Text>
          )}
          {excursion?.scheduledExcursion?.excursionTypePrices?.priceAdult !==
            undefined && (
            <Text className="text-base text-gray-600 mb-1">
              Precio Adulto:{" "}
              {formatLocalCurrency(
                excursion.scheduledExcursion.excursionTypePrices.priceAdult
              )}
            </Text>
          )}
          {excursion?.scheduledExcursion?.excursionTypePrices?.priceMinor !==
            undefined && (
            <Text className="text-base text-gray-600 mb-1">
              Precio Menor:{" "}
              {formatLocalCurrency(
                excursion.scheduledExcursion.excursionTypePrices.priceMinor
              )}
            </Text>
          )}
        </View>

        {/* Payment Resume Section */}
        {excursion?.paymentResume && (
          <View className="mb-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
            <Text className="font-semibold text-lg mb-2 text-gray-800">
              Resumen de Pagos
            </Text>
            <Text className="text-base text-gray-600 mb-1">
              Pasajeros Pagados: {excursion.paymentResume.passengersPaid}
            </Text>
            <Text className="text-base text-gray-600 mb-1">
              Pasajeros por Pagar: {excursion.paymentResume.passengersToPay}
            </Text>
            <Text className="text-base text-gray-600 mb-1">
              Total Pagos (efectivo):{" "}
              {formatLocalCurrency(excursion.paymentResume.totalPaymentsAmount)}
            </Text>
            <Text className="text-base text-gray-600 mb-1">
              Total Gastos:{" "}
              {formatLocalCurrency(
                excursion.paymentResume.totalExpensesIncomeAmount
              )}
            </Text>
            <Text className="text-base font-medium text-gray-700 mt-1">
              Monto Final:{" "}
              {formatLocalCurrency(excursion.paymentResume.finalAmount)}
            </Text>
          </View>
        )}

        <Text className="font-semibold text-xl mt-4 text-center mb-2">
          Listado de pasajeros por Hotel
        </Text>

        {passengersByHotel.length > 0 ? (
          passengersByHotel.map((hotelGroup: any) => (
            <View
              key={hotelGroup.hotel.id}
              className="mb-4 px-3 bg-white py-2 rounded-md shadow-sm mx-2"
            >
              <Text className="font-semibold text-lg mb-1">
                {hotelGroup.hotel.name} ({hotelGroup.seats} asientos)
              </Text>
              {(hotelGroup.hotel.zones || hotelGroup.hotel.street) && (
                <Text className="text-sm text-gray-500 mb-2">
                  {hotelGroup.hotel.zones
                    ? `Zona: ${hotelGroup.hotel.zones}`
                    : ""}
                  {hotelGroup.hotel.zones && hotelGroup.hotel.street
                    ? " - "
                    : ""}
                  {hotelGroup.hotel.street
                    ? `Dirección: ${hotelGroup.hotel.street}`
                    : ""}
                </Text>
              )}
              {hotelGroup.passengers.map((passenger: any) => (
                <View
                  key={passenger.id}
                  className="flex-row justify-between items-center p-2 border-b border-gray-200"
                >
                  <View>
                    <Text className="text-base">{passenger.name}</Text>
                    <Text className="text-sm text-gray-500">
                      {passenger.quantitySimple}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setPassengerToEdit(passenger)}
                  >
                    <Feather name="edit" size={20} color="gray" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))
        ) : (
          <EmptyStateCard
            title="No hay pasajeros registrados"
            message="Esta excursión no tiene pasajeros asignados."
          />
        )}

        <PassengerForm
          visible={modalVisible}
          excursion={excursion}
          group={excursion?.scheduledExcursion?.group}
          passengerToEdit={passengerToEdit}
          isReadOnly={true}
          onClose={(refreshNeeded?: boolean) => {
            if (refreshNeeded) {
              updateList();
            }
            setPassengerToEdit(null);
          }}
        />
      </ScrollView>
    </View>
  );
}

export default ExcursionDetail;
