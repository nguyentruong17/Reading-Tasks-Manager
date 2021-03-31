import React, { FC } from "react";
import { FormErrorMessage } from "@chakra-ui/react";
import { useField } from "react-final-form";

export interface ICustomFormError {
  name: string;
}
const CustomFormError: FC<ICustomFormError> = ({ name }) => {
  const {
    meta: { error },
  } = useField(name, { subscription: { error: true } });
  return <FormErrorMessage>{error}</FormErrorMessage>;
};

export default (CustomFormError);
