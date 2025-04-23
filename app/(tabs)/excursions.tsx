import useExcursions from "@/hooks/useExcursions";
import { useCallback, useState } from "react";
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity, // Import TouchableOpacity
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Button, ButtonText } from "@/components/ui/button";
import dayjs from "dayjs";
import { useRouter } from "expo-router"; // Import useRouter

// Define an interface for the excursion item based on the provided structure
interface ExcursionItem {
  id: number;
  uuid: string;
  guide: {
    id: number;
    firstName: string;
    lastName: string;
  };
  busExcursion: {
    id: number;
    bus: {
      id: number;
      busSelectorName: string;
    };
    price: number;
  };
  availableSeats: number;
  scheduledExcursion: {
    id: number;
    day: string;
    excursionType: {
      id: number;
      name: string;
    };
    status: string;
  };
  // Add other properties as needed
}

export default function ExcursionsScreen() {
  const { getExcursions, excursions, loading } = useExcursions();
  const router = useRouter(); // Initialize router
  // Add state for filtering if needed, e.g., by date
  // const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));

  useFocusEffect(
    useCallback(() => {
      // Pass any necessary params, e.g., { date: date }
      getExcursions();
    }, []) // Add dependencies like 'date' if filtering is implemented
  );

  const renderItem = ({ item }: { item: ExcursionItem }) => (
    // Wrap item in TouchableOpacity for press handling
    <TouchableOpacity
      onPress={() => router.push(`/excursion/${item.id}`)} // Navigate on press
      className="m-2 p-4 bg-white rounded-lg shadow border border-gray-200"
    >
      <Text className="text-lg font-semibold mb-1">
        {item.scheduledExcursion.excursionType.name}
      </Text>
      <Text className="text-sm text-gray-600">
        Fecha: {dayjs(item.scheduledExcursion.day).format("DD/MM/YYYY")}
      </Text>
      <Text className="text-sm text-gray-600">
        Guía: {item.guide.firstName} {item.guide.lastName}
      </Text>
      <Text className="text-sm text-gray-600">
        Bus: {item.busExcursion.bus.busSelectorName}
      </Text>
      <Text className="text-sm text-gray-600">
        Asientos Disponibles: {item.availableSeats}
      </Text>
      <Text className="text-sm text-gray-600">
        Estado: {item.scheduledExcursion.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Button
        className="m-2"
        onPress={() => getExcursions()} // Add params if needed
        disabled={loading.get}
      >
        <ButtonText>Recargar Excursiones</ButtonText>
      </Button>

      {/* Add DatePicker or other filters if needed */}

      {loading.get && excursions.length === 0 ? (
        <ActivityIndicator size="large" className="mt-4" />
      ) : (
        <FlatList
          data={excursions}
          renderItem={renderItem}
          keyExtractor={(item: ExcursionItem) => item.id.toString()}
          ListEmptyComponent={
            <Text className="text-center mt-4">
              No hay excursiones programadas.
            </Text>
          }
          // Add some padding to the bottom to avoid overlap with potential tab bar
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
