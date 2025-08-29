import React, { useState } from "react";

import { VStack } from "@/components/ui/vstack";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Box } from "@/components/ui/box";
import useAuth from "@/hooks/useAuth";

function LoginScreen() {
  const { login, loading } = useAuth();

  const [isInvalid, setIsInvalid] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (inputValue.length < 6) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);

      login({
        email: email.toLowerCase(),
        password: inputValue,
      });
    }
  };

  return (
    <Box className="h-full w-full items-center mt-[10vh] px-5">
      <VStack className="w-full md:w-[400px] rounded-md border border-background-200 p-4">
        <FormControl
          isInvalid={isInvalid}
          size="lg"
          isDisabled={false}
          isReadOnly={false}
          isRequired={true}
        >
          <FormControlLabel>
            <FormControlLabelText>Correo Electrónico</FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1" size="lg">
            <InputField
              placeholder="ejemplo@gmail.com"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </Input>
          <FormControlLabel>
            <FormControlLabelText>Contraseña</FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1" size="lg">
            <InputField
              type="password"
              placeholder="Contraseña"
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
            />
          </Input>
          <FormControlHelper>
            <FormControlHelperText>
              Debe tener al menos 6 caracteres.
            </FormControlHelperText>
          </FormControlHelper>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>
              Se requieren al menos 6 caracteres.
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <Button
          className="w-full mt-4"
          size="sm"
          onPress={handleSubmit}
          disabled={loading.post && isInvalid}
        >
          <ButtonText>Iniciar Sesión</ButtonText>
          {loading.post && <ButtonSpinner></ButtonSpinner>}
        </Button>
      </VStack>
    </Box>
  );
}

export default LoginScreen;
