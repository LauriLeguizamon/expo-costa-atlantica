import React from "react";

import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";

function useCustomToast() {
  const toast = useToast();
  const [toastId, setToastId] = React.useState("0");

  const warningToast = (message = "No se pudo ejecutar la acción") => {
    const newId = `${Math.random()}`;
    setToastId(newId);
    toast.show({
      id: newId,
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;

        return (
          <Toast nativeID={uniqueToastId} action="warning" variant="outline">
            <ToastTitle>Advertencia</ToastTitle>
            <ToastDescription>{message}</ToastDescription>
          </Toast>
        );
      },
    });
  };

  const errorToast = (message = "No se pudo ejecutar la acción") => {
    const newId = `${Math.random()}`;
    setToastId(newId);
    toast.show({
      id: newId,
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;

        return (
          <Toast nativeID={uniqueToastId} action="error" variant="outline">
            <ToastTitle>Algo salio mal</ToastTitle>
            <ToastDescription>{message}</ToastDescription>
          </Toast>
        );
      },
    });
  };

  const successToast = (message = "Se ejecuto la acción") => {
    const newId = `${Math.random()}`;
    setToastId(newId);

    toast.show({
      id: newId,
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;

        return (
          <Toast nativeID={uniqueToastId} action="success" variant="outline">
            <ToastTitle>Acción Exitosa</ToastTitle>
            <ToastDescription>{message}</ToastDescription>
          </Toast>
        );
      },
    });
  };

  return { successToast, errorToast, warningToast };
}

export default useCustomToast;
