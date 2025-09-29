// CustomDropdown.js
import React from 'react';
import { View, Text } from 'react-native';
import { Controller } from 'react-hook-form';
import {styles} from '../screen/BasicDetails/BasicDetailsStyles';
import GlobalStyles from '../core/GlobalStyles';
import {Dropdown} from 'react-native-element-dropdown';
const CustomDropdown = ({ name, control, placeholder, data, title,rules,valueFields,labelFields,onValueChange }) => {
  const [isFocus, setIsFocus] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
        <View >
            <Text style={[styles.header,{fontSize:14,marginTop:10}]}>{title}</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: GlobalStyles.colorSet.orange },error && { borderColor: 'red' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField= {labelFields}
            valueField= {valueFields}
            placeholder={!isFocus ? placeholder : '...'}
            searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => {
              setIsFocus(false);
              onBlur();
            }}
            onChange={item => {
              const selectedValue = item[valueFields];
              onChange(selectedValue);
              onValueChange && onValueChange(item); // Call the parent's callback
              setIsFocus(false);
            }}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};


export default CustomDropdown;
