import React, { FC } from "react";
import { FormLabel, Input } from "@chakra-ui/react";
import CustomFormControl, { ICustomFormControl } from "./CustomFormControl";
import CustomFormError from "./CustomFormError";
import { useField } from "react-final-form";

export interface ICustomInputControl extends ICustomFormControl {
  label: string,
  placeholder?: string
}
const CustomInputControl: FC<ICustomInputControl> = ({ name, label, placeholder }) => {
  const { input, meta } = useField(name);
  return (
    <CustomFormControl name={name}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        {...input}
        isInvalid={meta.error && meta.touched}
        id={name}
        placeholder={placeholder ? placeholder : label}
      />
      <CustomFormError name={name} />
    </CustomFormControl>
  );
};

export default (CustomInputControl)