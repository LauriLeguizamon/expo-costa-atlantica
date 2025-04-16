import DatePicker from "@/components/DatePicker";
import EmptyStateCard from "@/components/EmptyStateCard";
import PdfViewer from "@/components/PdfViewer";
import dayjs from "dayjs";
import { useFocusEffect } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabTwoScreen() {
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [showPdf, setShowPdf] = useState(true);
  const [sellerId, setSellerId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        setIsLoading(true);
        const userData = await AsyncStorage.getItem("user");

        if (userData) {
          const user = JSON.parse(userData);
          if (user && user.id) {
            setSellerId(user.id);
          } else {
            setError("No se encontró ID de usuario");
          }
        } else {
          setError("No se encontraron datos de usuario");
        }
      } catch (err) {
        setError("Error al obtener datos de usuario");
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getUserFromStorage();
  }, []);

  const changeDate = (date: string) => {
    setDate(date);
    // When date changes, we always want to show the PDF for the new date
    setShowPdf(true);
  };

  // Generate PDF URL based on the selected date and seller ID
  const getPdfUrl = () => {
    return sellerId
      ? `https://caturismo.online/api/passengers/seller-commission-pdf/${sellerId}/${date}/`
      : "";
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Cargando datos...</Text>
      </View>
    );
  }

  if (error || !sellerId) {
    return (
      <ScrollView className="flex-1 bg-[#f5f5f5]">
        <View className="p-4">
          <EmptyStateCard
            title="Error de acceso"
            message={
              error || "No se ha podido obtener tu información de usuario"
            }
            icon="alert-circle"
            onAction={() => {}} // You might want to add a retry function here
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#f5f5f5]">
      <View className="p-4">
        <DatePicker
          initialDate={date}
          onConfirm={(newDate: string) => changeDate(newDate)}
        />

        {/* <EmptyStateCard
          title="No hay historial de grupos en la fecha seleccionada"
          message="Aquí veras el resumen de los grupos que has vendido"
          icon="file"
          onAction={() => setShowPdf(!showPdf)}
        /> */}

        {showPdf && (
          <View className="mt-5 bg-white rounded-lg p-4 shadow-sm sm:mx-auto sm:max-w-[50%] mb-20">
            <Text className="text-lg font-bold mb-4 text-center">
              Reporte de comisiones
            </Text>
            <PdfViewer url={getPdfUrl()} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
