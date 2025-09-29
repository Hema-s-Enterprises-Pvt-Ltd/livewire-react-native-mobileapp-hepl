import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet,Modal } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {styles} from "../../BasicDetails/BasicDetailsStyles";
import moment from 'moment';
import { Controller } from 'react-hook-form';
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import crashlytics from '@react-native-firebase/crashlytics';

const DatePickerInput = ({ control, name, title, onDateChange,rules,minimumDate,maximumDate , reprotView = false}) => {
  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('SelectDate mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('SelectDate unmounted');
    };
  }, []);
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
    const dateSelected = moment(selectedDate).format('YYYY-MM-DD');
    

     
      onChange(dateSelected); // Update the form value
      if (onDateChange) {
        onDateChange(dateSelected); // Call the parent callback if provided
        setDate(moment(selectedDate).format('DD MMM YYYY'));
        setTextShow(true);
      } 
    
    
    hideDatePicker();
  };

  return (
    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',gap:10}}>
      <Text style={[styles.header, { fontSize: 14 }]}>{title}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TouchableOpacity onPress={showDatePicker}>
            <View style={[styles.dropdown, error && { borderColor: 'red' }]}>
              <Text>{textShow ? date : value || "Select Date"}</Text>
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
