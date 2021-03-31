import React, { ChangeEventHandler, FC } from "react";
import { FormLabel, Textarea } from "@chakra-ui/react";
import CustomFormControl, { ICustomFormControl } from "./CustomFormControl";
import CustomFormError from "./CustomFormError";
import { useField, Field, FieldRenderProps } from "react-final-form";

export interface ITextareaAdapter extends FieldRenderProps<string, any> {
  handleChange?: ChangeEventHandler<HTMLTextAreaElement>
}
const TextareAdapter: FC<ITextareaAdapter> = ({ input, meta, handleChange, ...rest }) => (
  <Textarea 
    {...input} 
    {...rest}
    onChange={handleChange} 
    isInvalid={meta.error && meta.touched} />
);

export interface ICustomTextareaControl extends ICustomFormControl {
  label: string;
}
const CustomTextareaControl: FC<ICustomTextareaControl> = ({ name, label }) => {
  // const { input, meta } = useField(name);
  return (
    <CustomFormControl name={name}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Field
        name={name}
        component={TextareAdapter}
        placeholder={label}
        id={name}
      />
      <CustomFormError name={name} />
    </CustomFormControl>
  );
};

export default CustomTextareaControl;
