import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet,Modal } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {styles} from '../screen/BasicDetails/BasicDetailsStyles';
import moment from 'moment';
import { Controller } from 'react-hook-form';
import Icons from "react-native-vector-icons/MaterialCommunityIcons";


const DatePickerInput = ({ control, name, title, onDateChange,rules,minimumDate,maximumDate}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date(1900, 0, 1));
  const [textShow, setTextShow] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate, onChange) => {
    const dateSelected = moment(selectedDate).format('DD-MM-YYYY');
    

     
      onChange(dateSelected); // Update the form value
      if (onDateChange) {
        onDateChange(dateSelected); // Call the parent callback if provided
        setDate(dateSelected);
        setTextShow(true);
      } 
    
    
    hideDatePicker();
  };

  return (
    <View>
      <Text style={[styles.header, { fontSize: 14 }]}>{title}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TouchableOpacity onPress={showDatePicker}>
              <View style={[styles.dropdown, { width: '100%', flexDirection: 'row', justifyContent: 'space-between' },error && { borderColor: 'red' }]}>
                <Text>{textShow ? date : value}</Text>
                <Icons
                    name="calendar-month-outline"
                    size={25}
                    color="#919EAB"
                  />
              </View>
            </TouchableOpacity>
            {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              minimumDate={minimumDate}
              maximumDate={maximumDate} // Set the maximum date to today
              onConfirm={(selectedDate) => handleConfirm(selectedDate, onChange)}
              onCancel={hideDatePicker}
            />
          </>
        )}
        
      />
      
    </View>
  );
};



export default DatePickerInput;
