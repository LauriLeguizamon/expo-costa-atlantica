import React, { useEffect, useState, useRef } from "react";
import { Modal, View, StyleSheet, ScrollView } from "react-native";
import "react-native-get-random-values";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-element-dropdown";
import { FormikProps } from "formik";

import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import { Formik } from "formik";
import * as Yup from "yup";

import { FontAwesome } from "@expo/vector-icons";

import useHotels from "@/hooks/useHotels";

import { Input, InputField } from "./ui/input";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";
import { HStack } from "./ui/hstack";
import { Box } from "./ui/box";
import { Pressable } from "./ui/pressable";
import { Textarea, TextareaInput } from "./ui/textarea";
import { Spinner } from "./ui/spinner";
import { Button, ButtonText } from "./ui/button";

const PassengerForm = ({ visible, onClose, group, passengerToEdit }: any) => {
  const formikRef = useRef<FormikProps<any>>(null);
  const hotelHook = useHotels();
  const [totalAmount, setTotalAmount] = useState(0);

  const [excursions, setExcursions] = useState([]);
  const [initialValues, setInitialValues] = useState({
    hotel: "",
    name: "",
    scheduledExcursion: "",
    adultsCount: undefined,
    minorsCount: undefined,
    babyCount: undefined,
    freeCount: undefined,
    halfPriceAdultsCount: undefined,
    observation: "",
    guideObservation: "",
    paymentAmount: undefined,
  });

  useEffect(() => {
    hotelHook.getHotels();
  }, []);

  useEffect(() => {
    if (!group || !group.scheduledExcursions) return;

    group.scheduledExcursions?.forEach((scheduledExcursion: any) => {
      scheduledExcursion.name = `${
        scheduledExcursion.excursionType.name
      } (${dayjs(scheduledExcursion.day).format("ddd DD/MM")})`;
    });

    setExcursions(group.scheduledExcursions);
  }, [group]);

  useEffect(() => {
    if (visible && passengerToEdit) {
      setInitialValues({
        hotel: passengerToEdit.hotel,
        name: passengerToEdit.name,
        scheduledExcursion: passengerToEdit.scheduledExcursion,
        adultsCount: passengerToEdit.adultsCount,
        minorsCount: passengerToEdit.minorsCount,
        babyCount: passengerToEdit.babyCount,
        freeCount: passengerToEdit.freeCount,
        halfPriceAdultsCount: passengerToEdit.halfPriceAdultsCount,
        observation: passengerToEdit.observation,
        guideObservation: passengerToEdit.guideObservation,
        paymentAmount: passengerToEdit.paymentAmount,
      });

      // Calculate total amount directly for the edited passenger
      if (passengerToEdit.scheduledExcursion) {
        const adultsValue = parseInt(passengerToEdit.adultsCount) || 0;
        const minorsValue = parseInt(passengerToEdit.minorsCount) || 0;
        const halfPriceValue =
          parseInt(passengerToEdit.halfPriceAdultsCount) || 0;

        const adultsPrice =
          passengerToEdit.scheduledExcursion.excursionType.priceAdult;
        const minorsPrice =
          passengerToEdit.scheduledExcursion.excursionType.priceMinor;

        setTotalAmount(
          adultsValue * adultsPrice +
            minorsValue * minorsPrice +
            halfPriceValue * adultsPrice * 0.5
        );
      } else {
        setTotalAmount(0);
      }
    } else {
      setInitialValues({
        hotel: "",
        name: "",
        scheduledExcursion: "",
        adultsCount: undefined,
        minorsCount: undefined,
        babyCount: undefined,
        freeCount: undefined,
        halfPriceAdultsCount: undefined,
        observation: "",
        guideObservation: "",
        paymentAmount: undefined,
      });
      setTotalAmount(0);
    }
  }, [visible, passengerToEdit]);

  // Function to update the total amount based on current formik values
  const updateTotalAmount = () => {
    if (!formikRef.current || !formikRef.current.values.scheduledExcursion)
      return;

    const values = formikRef.current.values;

    const adultsValue = parseInt(values.adultsCount) || 0;
    const minorsValue = parseInt(values.minorsCount) || 0;
    const halfPriceValue = parseInt(values.halfPriceAdultsCount) || 0;

    const adultsPrice = values.scheduledExcursion.excursionType.priceAdult;
    const minorsPrice = values.scheduledExcursion.excursionType.priceMinor;

    setTotalAmount(
      adultsValue * adultsPrice +
        minorsValue * minorsPrice +
        halfPriceValue * adultsPrice * 0.5
    );
  };

  // Function to validate numeric input
  const validateNumericInput = (text: string) => {
    // Only allow digits
    return text.replace(/[^0-9]/g, "");
  };

  // Function to handle numeric input
  const handleNumericInput = async (
    text: string,
    fieldName: string,
    setFieldValue: any,
    updateTotal: boolean = false
  ) => {
    const validatedText = validateNumericInput(text);
    let value = undefined;

    if (validatedText.length > 0) {
      value = parseInt(validatedText);
    }

    await setFieldValue(fieldName, value);

    if (updateTotal) {
      updateTotalAmount();
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es obligatorio"),
    paymentAmount: Yup.string().required("La seña es obligatoria"),
    scheduledExcursion: Yup.object().required("La excursión es obligatoria"),
    hotel: Yup.object().required("El hotel es obligatorio"),
  });

  const renderHotel = (item: any) => {
    return (
      <View className="h-auto flex py-2 px-4 border-b border-gray-100">
        <Text className="text-black">{item.name}</Text>
        <Text className="text-typography-400 text-sm">{`${item.street} ${item.streetNumber}`}</Text>
      </View>
    );
  };

  const renderScheduledExcursion = (item: any) => {
    return (
      <View className="h-auto flex py-2 px-4 border-b border-gray-100">
        <Text className="text-black">{item.name}</Text>
        {item.isScheduleForGroup && (
          <Text className="text-typography-400 text-sm">
            Diagramada para este grupo
          </Text>
        )}
      </View>
    );
  };

  const onSubmit = async (values: any) => {
    const user = JSON.parse((await AsyncStorage.getItem("user")) || "");

    if (!user) return;

    const passengerData = {
      id: passengerToEdit ? passengerToEdit.id : uuid(),
      group: group.id,
      seller: user.id,
      payments: [
        {
          user: user.id,
          amount: parseInt(values.paymentAmount),
        },
      ],
      ...values,
      adultsCount: parseInt(values.adultsCount || 0),
      minorsCount: parseInt(values.minorsCount || 0),
      babyCount: parseInt(values.babyCount || 0),
      freeCount: parseInt(values.freeCount || 0),
      halfPriceAdultsCount: parseInt(values.halfPriceAdultsCount || 0),
      totalAmount: totalAmount,
    };

    passengerToEdit
      ? await updatePassenger(passengerData)
      : await createPassenger(passengerData);

    onClose();
  };

  const createPassenger = async (passengerData: any) => {
    let savedGroupString: any = await AsyncStorage.getItem(`group_${group.id}`);

    let savedGroup: any = savedGroupString
      ? JSON.parse(savedGroupString)
      : undefined;

    if (!savedGroup) {
      savedGroup = {
        id: `${group.id}`,
        passengers: [passengerData],
      };
    } else {
      savedGroup.passengers.push(passengerData);
    }

    await AsyncStorage.setItem(`group_${group.id}`, JSON.stringify(savedGroup));
  };

  const updatePassenger = async (passengerData: any) => {
    let savedGroup: any = JSON.parse(
      (await AsyncStorage.getItem(`group_${group.id}`)) as string
    );

    savedGroup.passengers.forEach((passenger: any) => {
      if (passenger.id === passengerData.id) {
        Object.keys(passengerData).forEach((key) => {
          passenger[key] = passengerData[key];
        });
      }
    });

    await AsyncStorage.setItem(`group_${group.id}`, JSON.stringify(savedGroup));
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
              innerRef={formikRef}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => onSubmit(values)}
              enableReinitialize
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
                    onChange={(item) => setFieldValue("hotel", item)}
                    renderItem={renderHotel}
                  />
                  {touched.hotel && errors.hotel && (
                    <Text className="text-red-500">
                      {typeof errors.hotel === "string" && errors.hotel}
                    </Text>
                  )}

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
                    value={values.scheduledExcursion}
                    onChange={(item) =>
                      setFieldValue("scheduledExcursion", item)
                    }
                    renderItem={renderScheduledExcursion}
                  />
                  {touched.scheduledExcursion && errors.scheduledExcursion && (
                    <Text className="text-red-500">
                      {typeof errors.scheduledExcursion === "string" &&
                        errors.scheduledExcursion}
                    </Text>
                  )}

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
                    <Text className="text-red-500">
                      {typeof errors.name === "string" && errors.name}
                    </Text>
                  )}

                  <HStack className="space-x-4 gap-3">
                    <VStack className="flex-1">
                      <Text>Adultos</Text>
                      <Input>
                        <InputField
                          keyboardType="numeric"
                          placeholder="0"
                          value={values.adultsCount?.toString()}
                          onChangeText={(text) =>
                            handleNumericInput(
                              text,
                              "adultsCount",
                              setFieldValue,
                              true
                            )
                          }
                          className="h-12" // Added height class
                        />
                      </Input>

                      <Text>Menores</Text>
                      <Input>
                        <InputField
                          keyboardType="numeric"
                          placeholder="0"
                          value={values.minorsCount?.toString()}
                          onChangeText={(text) =>
                            handleNumericInput(
                              text,
                              "minorsCount",
                              setFieldValue,
                              true
                            )
                          }
                          className="h-12" // Added height class
                        />
                      </Input>
                    </VStack>

                    <VStack className="flex-1">
                      <Text>Liberado</Text>
                      <Input>
                        <InputField
                          keyboardType="numeric"
                          placeholder="0"
                          value={values.freeCount?.toString()}
                          onChangeText={(text) =>
                            handleNumericInput(text, "freeCount", setFieldValue)
                          }
                          className="h-12" // Added height class
                        />
                      </Input>

                      <Text>Bebés</Text>
                      <Input>
                        <InputField
                          keyboardType="numeric"
                          placeholder="0"
                          value={values.babyCount?.toString()}
                          onChangeText={(text) =>
                            handleNumericInput(
                              text,
                              "babyCount",
                              setFieldValue,
                              true
                            )
                          }
                          className="h-12" // Added height class
                        />
                      </Input>

                      {/* <Text>Medio Liberado</Text>
                      <Input>
                        <InputField
                          keyboardType="numeric"
                          placeholder="0"
                          value={values.halfPriceAdultsCount?.toString()}
                          onChangeText={(text) =>
                            handleNumericInput(
                              text,
                              "halfPriceAdultsCount",
                              setFieldValue,
                              true
                            )
                          }
                          className="h-12" // Added height class
                        />
                      </Input> */}
                    </VStack>
                  </HStack>

                  <Text>Importe Total</Text>
                  <Input>
                    <InputField
                      editable={false}
                      placeholder="$0"
                      value={`$${totalAmount}`}
                      className="h-12 bg-gray-100" // Added height class and background
                    />
                  </Input>

                  <Text>Seña</Text>
                  <Input>
                    <InputField
                      keyboardType="numeric"
                      placeholder="$0"
                      value={`$${values.paymentAmount?.toString() || 0}`}
                      onChangeText={(text) =>
                        handleNumericInput(text, "paymentAmount", setFieldValue)
                      }
                      className="h-12" // Added height class
                    />
                  </Input>
                  {touched.paymentAmount && errors.paymentAmount && (
                    <Text className="text-red-500">
                      {typeof errors.paymentAmount === "string" &&
                        errors.paymentAmount}
                    </Text>
                  )}

                  <Text>Observación Oficina</Text>
                  <Textarea className="h-20">
                    <TextareaInput
                      placeholder="Ej: Cliente solicitó atención especial"
                      value={values.observation}
                      onChangeText={handleChange("observation")}
                    />
                  </Textarea>

                  <Text>Observación Guía</Text>
                  <Textarea className="h-20">
                    <TextareaInput
                      placeholder="Ej: Cliente necesita silla de ruedas"
                      value={values.guideObservation}
                      onChangeText={handleChange("guideObservation")}
                    />
                  </Textarea>

                  <Button
                    onPress={() => {
                      handleSubmit();
                    }}
                    className="mt-2"
                  >
                    {passengerToEdit ? (
                      <ButtonText>Actualizar Pasajero</ButtonText>
                    ) : (
                      <ButtonText>Crear Pasajero</ButtonText>
                    )}
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
