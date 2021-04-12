import React, { FC } from "react";
import { FormLabel, Textarea, TextareaProps } from "@chakra-ui/react";
import CustomFormControl, { ICustomFormControl } from "./CustomFormControl";
import CustomFormError from "./CustomFormError";
import { useField } from "react-final-form";

export interface ICustomTextareaControl
  extends ICustomFormControl,
    Omit<TextareaProps, "name"> {
  label: string;
  placeholder?: string;
}
const CustomTextareaControl: FC<ICustomTextareaControl> = ({
  name,
  label,
  placeholder,
  ...rest
}) => {
  const { input, meta } = useField(name, 
    //{ parse: x => x }
  );
  return (
    <CustomFormControl name={name}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Textarea
        {...input}
        placeholder={placeholder ? placeholder : label}
        isInvalid={meta.error && meta.touched}
        {...rest}
      />
      <CustomFormError name={name} />
    </CustomFormControl>
  );
};

export default CustomTextareaControl;
