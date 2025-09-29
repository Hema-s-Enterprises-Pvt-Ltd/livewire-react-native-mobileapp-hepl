// CustomInput.js
import React,{useState} from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import {styles} from '../screen/BasicDetails/BasicDetailsStyles';

const CustomInput = ({ name, control, placeholder,title,isEditable = true, rules, keyboardType = 'default', maxLength ,onChange}) => {
    const [isFocused, setIsFocused] = useState(false);
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange: hookFormOnChange, onBlur, value }, fieldState: { error } }) => (
        <View >
          {title && <Text style={[styles.header,{fontSize:14,marginTop:10}]}>{title}</Text>}
          <TextInput
            style={[styles.input, isFocused && styles.focusedInput,,error && styles.errorInput, ]}
            placeholder={placeholder}
            onChangeText={(text) => {
              hookFormOnChange(text); // react-hook-form's onChange
              if (onChange) {
                  onChange(text); // Custom onChange handler
              }
          }}
            editable={isEditable}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
            value={value}
            keyboardType={keyboardType}
            maxLength={maxLength}
            showSoftInputOnFocus={true}
            autoCorrect={false}
            contextMenuHidden={true}
          />
          {error && <Text style={[styles.errorText,{marginTop:5}]}>{error.message}</Text>}
        </View>
      )}
    />
  );
};



export default CustomInput;