import React, { FC } from "react";
//date-picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; //required!
//chakra-ui
import { FormLabel } from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
//custom-components
import CustomFormControl, { ICustomFormControl } from "./CustomFormControl";
import CustomFormError from "./CustomFormError";
//react-final-form
import { useField } from "react-final-form";

const DATE_FORMAT = "MM/dd/yyyy";

const ChakraDatepicker = chakra(DatePicker);

const isValidDate = (dateString: string): boolean => {
  const parsedValue = Date.parse(dateString);
  return !Number.isNaN(parsedValue);
};
export interface ICusomDatePickerControl extends ICustomFormControl {
  label: string;
  placeholder?: string;
  //handleChange?: ChangeEventHandler<HTMLInputElement>
}
const CustomDatePickerControl: FC<ICusomDatePickerControl> = ({
  name,
  label,
  placeholder,
}) => {
  const { input, meta } = useField(name);
  const { value, onChange } = input;
  const { initial, pristine } = meta;
  return (
    <CustomFormControl name={name}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <ChakraDatepicker
        name={name}
        placeholderText={placeholder ? placeholder : label}
        dateFormat={DATE_FORMAT}
        selected={
          pristine
            ? initial && isValidDate(initial)
              ? new Date(initial)
              : null
            : value && isValidDate(value)
            ? new Date(value)
            : null
        }
        value={value && isValidDate(value) ? value : undefined}
        onChange={(date) => {
          onChange(date);
        }}
        disabledKeyboardNavigation
      />
      <CustomFormError name={name} />
    </CustomFormControl>
  );
};

export default CustomDatePickerControl;
