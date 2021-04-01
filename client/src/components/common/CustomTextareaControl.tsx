import React, { FC } from "react";
import { FormLabel, Textarea } from "@chakra-ui/react";
import CustomFormControl, { ICustomFormControl } from "./CustomFormControl";
import CustomFormError from "./CustomFormError";
import { useField } from "react-final-form";

export interface ICustomTextareaControl extends ICustomFormControl {
  label: string;
  placeholder?: string;
}
const CustomTextareaControl: FC<ICustomTextareaControl> = ({ name, label, placeholder }) => {
  const { input, meta } = useField(name);
  return (
    <CustomFormControl name={name}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Textarea 
        {...input} 
        placeholder={placeholder ? placeholder : label}
        isInvalid={meta.error && meta.touched} />
      <CustomFormError name={name} />
    </CustomFormControl>
  );
};

export default CustomTextareaControl;
