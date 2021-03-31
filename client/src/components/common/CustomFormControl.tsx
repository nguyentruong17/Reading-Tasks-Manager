import React, { FC } from "react";
import { FormControl } from "@chakra-ui/react";
import { useField } from "react-final-form";

export interface ICustomFormControl {
  name: string;
}
const CustomFormControl: FC<ICustomFormControl> = ({ name, ...rest }) => {
  const {
    meta: { error, touched },
  } = useField(name, { subscription: { touched: true, error: true } });
  return <FormControl isInvalid={error && touched} {...rest} />;
};

export default CustomFormControl;
