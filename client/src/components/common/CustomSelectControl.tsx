import React, { FC } from "react";
import { FormLabel, Select } from "@chakra-ui/react";
import CustomFormControl, { ICustomFormControl } from "./CustomFormControl";
import CustomFormError from "./CustomFormError";
import { useField } from "react-final-form";

export interface IOptionObject {
  name: string;
  value: string;
}

export interface ICustomSelectControl extends ICustomFormControl {
  label: string;
  options: any[] | IOptionObject[];
  emptyCase?: any | IOptionObject;
  placeholder?: string;
}
const CustomSelectControl: FC<ICustomSelectControl> = ({
  name,
  label,
  options, 
  emptyCase,
  //handleChange,
  placeholder,
}) => {
  const { input, meta } = useField(name);
  return (
    <CustomFormControl name={name}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Select
        {...input}
        isInvalid={meta.error && meta.touched}
        id={name}
        placeholder={placeholder? placeholder : label}
        //onChange={handleChange}
      >
        {emptyCase && typeof emptyCase === "object" && (
          <option key={emptyCase.name} value={emptyCase.value}>{emptyCase.name}</option>
        )}
        {emptyCase && typeof emptyCase === "string" && (
          <option value={emptyCase}>{emptyCase}</option>
        )}

        {options.map((option: string | IOptionObject) => {
          if (typeof option === "object") {
            return (
              <option key={option.name} value={option.value}>
                {option.name}
              </option>
            );
          } else if (typeof option === "string") {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          } else {
            return null
          }
        })}
      </Select>
      <CustomFormError name={name} />
    </CustomFormControl>
  );
};

export default (CustomSelectControl);
