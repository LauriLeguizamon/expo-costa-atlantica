import React, { useState } from "react";

import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
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

function LoginScreen(props: any) {
  const [isInvalid, setIsInvalid] = useState(false);
  const [inputValue, setInputValue] = useState("12345");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (inputValue.length < 6) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  };

  return (
    <Box className="h-full w-full justify-center items-center">
      <VStack className="w-full max-w-[300px] rounded-md border border-background-200 p-4">
        <FormControl
          isInvalid={isInvalid}
          size="lg"
          isDisabled={false}
          isReadOnly={false}
          isRequired={true}
        >
          <FormControlLabel>
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1" size="lg">
            <InputField
              placeholder="example@gmail.com"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </Input>
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1" size="lg">
            <InputField
              type="password"
              placeholder="password"
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
            />
          </Input>
          <FormControlHelper>
            <FormControlHelperText>
              Must be at least 6 characters.
            </FormControlHelperText>
          </FormControlHelper>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>
              At least 6 characters are required.
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <Button
          className="w-fit self-end mt-4"
          size="sm"
          onPress={handleSubmit}
        >
          <ButtonText>Submit</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}

export default LoginScreen;
