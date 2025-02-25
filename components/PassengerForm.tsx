import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet, ScrollView } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-element-dropdown";

import dayjs from "dayjs";

import { Formik } from "formik";
import * as Yup from "yup";

import { FontAwesome } from "@expo/vector-icons";

import { Input, InputField } from "./ui/input";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";
import { HStack } from "./ui/hstack";
import { Box } from "./ui/box";
import { Pressable } from "./ui/pressable";
import { Textarea, TextareaInput } from "./ui/textarea";
import { Spinner } from "./ui/spinner";
import { Button, ButtonText } from "./ui/button";
import useHotels from "@/hooks/useHotels";

const PassengerForm = ({ visible, onClose, group }: any) => {
  const hotelHook = useHotels();
  const [excursions, setExcursions] = useState([]);

  // Fetch hotels based on user input
  useEffect(() => {
    hotelHook.getHotels();
  }, []);

  useEffect(() => {
    if (!group || !group.scheduledExcursions) return;
    console.log("scheduledExcrusions", group.scheduledExcursions);
    group.scheduledExcursions?.forEach((excursion: any) => {
      excursion.name = `${excursion.excursionType.name} (${dayjs(
        excursion.day
      ).format("ddd DD/MM")})`;
    });

    setExcursions(group.scheduledExcursions);
  }, [group]);

  useEffect(() => {
    console.log("excursions", excursions);
  }, [excursions]);

  // Form validation schema
  const validationSchema = Yup.object({
    hotel: Yup.string().required("El hotel es obligatorio"),
    name: Yup.string().required("El nombre es obligatorio"),
    excursion: Yup.string().required("La excursión es obligatoria"),
  });

  const renderHotel = (item: any) => {
    return (
      <View className="h-auto flex py-2 px-4 border-b border-gray-100">
        <Text className="text-black">{item.name}</Text>
        <Text className="text-typography-400 text-sm">{`${item.street} ${item.streetNumber}`}</Text>
      </View>
    );
  };

  const renderExcursion = (item: any) => {
    return (
      <View className="h-auto flex py-2 px-4 border-b border-gray-100">
        <Text className="text-black">{item.name}</Text>
      </View>
    );
  };

  const onSubmit = (values: any) => {
    console.log("Formulario completo con éxito", values);

    onClose();
  };

  return (
    <Modal
      visible={visible}
      style={styles.modal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ScrollView>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <Box className="bg-white p-6 rounded-lg w-full shadow-lg h-auto min-h-full">
            <HStack className="justify-between">
              <Text className="text-xl font-bold">Carga de pasajero</Text>
              <Pressable
                onPress={onClose}
                className="text-typography-600 font-semibold bg-gray-200 px-4 py-1 web:py-3 rounded-full flex flex-row items-center"
              >
                <Text>Cerrar</Text>
                <FontAwesome
                  name="chevron-down"
                  className="ms-3 text-typography-600"
                />
              </Pressable>
            </HStack>
            <Formik
              initialValues={{
                hotel: "",
                name: "",
                excursion: "",
                adult: "",
                minor: "",
                baby: "",
                free: "",
                halfFree: "",
                observationOffice: "",
                observationGuide: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => onSubmit(values)}
            >
              {({
                handleChange,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => (
                <VStack className="space-y-4 mt-4">
                  {hotelHook.loading.get && <Spinner />}

                  <Text>Hotel</Text>
                  <Dropdown
                    data={hotelHook.hotels.results}
                    search
                    style={styles.dropdown}
                    maxHeight={300}
                    labelField="name"
                    valueField="id"
                    placeholder="Seleccionar Hotel"
                    searchPlaceholder="Buscar hotel..."
                    value={values.hotel}
                    onChange={(value) => console.log(value)}
                    renderItem={renderHotel}
                  />

                  <Text>Excursión</Text>
                  <Dropdown
                    data={excursions}
                    search
                    style={styles.dropdown}
                    maxHeight={300}
                    labelField="name"
                    valueField="id"
                    placeholder="Seleccionar Excursion"
                    searchPlaceholder="Buscar Excursion..."
                    value={values.excursion}
                    onChange={(value) => console.log(value)}
                    renderItem={renderExcursion}
                  />

                  {/* <Text>Excursión</Text>
                  <Dropdown
                    data={group.scheduledExcursions}
                    search
                    style={styles.dropdown}
                    maxHeight={300}
                    labelField={"day"}
                    valueField="id"
                    placeholder="Seleccionar excursion"
                    searchPlaceholder="Buscar excursion..."
                    value={values.excursion}
                    onChange={(value) => console.log(value)}
                    renderItem={renderExcursion}
                  />
                  {touched.excursion && errors.excursion && (
                    <Text className="text-red-500">{errors.excursion}</Text>
                  )} */}

                  <Text>Nombre</Text>
                  <Input>
                    <InputField
                      placeholder="Ej: Juan Pérez"
                      value={values.name}
                      onChangeText={handleChange("name")}
                      className="h-12" // Added height class
                    />
                  </Input>
                  {touched.name && errors.name && (
                    <Text className="text-red-500">{errors.name}</Text>
                  )}

                  <HStack className="space-x-4 gap-3">
                    <VStack className="flex-1">
                      <Text>Adultos</Text>
                      <Input>
                        <InputField
                          keyboardType="numeric"
                          placeholder="0"
                          value={values.adult}
                          onChangeText={handleChange("adult")}
                          className="h-12" // Added height class
                        />
                      </Input>

                      <Text>Menores</Text>
                      <Input>
                        <InputField
                          keyboardType="numeric"
                          placeholder="0"
                          value={values.minor}
                          onChangeText={handleChange("minor")}
                          className="h-12" // Added height class
                        />
                      </Input>

                      <Text>Bebés</Text>
                      <Input>
                        <InputField
                          keyboardType="numeric"
                          placeholder="0"
                          value={values.baby}
                          onChangeText={handleChange("baby")}
                          className="h-12" // Added height class
                        />
                      </Input>
                    </VStack>

                    <VStack className="flex-1">
                      <Text>Gratis</Text>
                      <Input>
                        <InputField
                          keyboardType="numeric"
                          placeholder="0"
                          value={values.free}
                          onChangeText={handleChange("free")}
                          className="h-12" // Added height class
                        />
                      </Input>

                      <Text>Medio Gratis</Text>
                      <Input>
                        <InputField
                          placeholder="0"
                          value={values.halfFree}
                          onChangeText={handleChange("halfFree")}
                          className="h-12" // Added height class
                        />
                      </Input>
                    </VStack>
                  </HStack>

                  <Text>Observación Oficina</Text>
                  <Textarea className="h-20">
                    <TextareaInput
                      placeholder="Ej: Cliente solicitó atención especial"
                      value={values.observationOffice}
                      onChangeText={handleChange("observationOffice")}
                    />
                  </Textarea>

                  <Text>Observación Guía</Text>
                  <Textarea className="h-20">
                    <TextareaInput
                      placeholder="Ej: Cliente necesita silla de ruedas"
                      value={values.observationGuide}
                      onChangeText={handleChange("observationGuide")}
                    />
                  </Textarea>

                  <Button onPress={() => handleSubmit()} className="mt-2">
                    <ButtonText>Enviar</ButtonText>
                  </Button>
                </VStack>
              )}
            </Formik>
          </Box>
        </KeyboardAwareScrollView>
      </ScrollView>
    </Modal>
  );
};

export default PassengerForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 32,
    borderColor: "gray",
    fontSize: 12,
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  modal: {
    minHeight: 10000,
  },
});
