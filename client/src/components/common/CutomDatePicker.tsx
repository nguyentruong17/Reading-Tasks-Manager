import React, { FC } from 'react';
// import DatePicker from 'react-datepicker';
// import { FormControl, FormLabel } from '@chakra-ui/react';
// import { Field } from 'react-final-form';

// const DATE_FORMAT = "MM/DD/YYYY"

// export interface ICustomizedDatePickerComponentProps {
//     fieldname: string,
//     title: string
// }
// const CustomizedDatePickerComponent = props => {
//   const {
//     fieldname,
//     value,
//     minDate,
//     maxDate,
//     placeholderText,
//     input,
//     ...rest
//   } = props;

//   const handleChange = (value) => {
//       if (fieldname) {
//         const { onChange } = input
//         if (value) {
//             onChange(value)
//         }
//       } else {
//         const { handleChange } = props;
//         if (value) {
//             handleChange(value)
//         }
//       }
//   }

 
//   return (
//     <DatePicker
//       autoComplete="off"
//       showClearButton={false}
//       value={value}
//       minDate={minDate}
//       maxDate={maxDate}
//       {...rest}
//       {...input}
//       onChange={handleChange}
//       placeholderText={placeholderText} //not working
//       dateFormat={DATE_FORMAT}
      
//     />
//   );
// };

// export interface ICustomDatePickerProps {
//     fieldname: string,
//     title: string
// }
// const CustomDatePicker: FC<ICustomDatePickerProps> = props => {
//   const { fieldname, title } = props;

//   return (
//     <FormControl>
//       <FormLabel>{title}</FormLabel>
//       {fieldname ? (
//         <Field
//           name={fieldname}
//           component={CustomizedDatePickerComponent}
//           {...props}
//         />
//       ) : (
//         <CustomizedDatePickerComponent {...props} />
//       )}
//     </FormControl>
//   );
// };

// export default CustomDatePicker;