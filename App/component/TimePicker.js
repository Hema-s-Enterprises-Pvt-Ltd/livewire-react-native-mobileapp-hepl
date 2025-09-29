import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image,Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { styles } from '../screen/BasicDetails/BasicDetailsStyles';
import moment from 'moment';
import { Controller } from 'react-hook-form';
import { Images } from '../common';

const TimePickerInput = ({ control, name, title, onTimeChange, rules,disabled=false,validateTime = false,selectedDate }) => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleString());
  const [textShow, setTextShow] = useState(false);


  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (selectedTime, onChange) => {

    const today = moment().startOf('day'); // Today's date at 00:00
     
    const parsedDate = moment(selectedDate, 'DD-MM-YYYY');
       const formattedDate = parsedDate.format('YYYY-MM-DD');
    
    const selectedDateMoment = moment(formattedDate).startOf('day'); // Selected date at 00:00
    if (validateTime && selectedDateMoment.isSame(today, 'day')) {
      
      
      const currentTime = moment(); // Current time
      if (moment(selectedTime).isBefore(currentTime)) {
        
        Alert.alert('Invalid Time', 'Given Time should not be in Past');
        hideTimePicker();
        return;
      }
    }

    const timeSelected = moment(selectedTime).format('HH:mm:ss');
    onChange(timeSelected); // Update the form value
    if (onTimeChange) {
      onTimeChange(timeSelected); // Call the parent callback if provided
      setTime(timeSelected);
      setTextShow(true);
    }
    hideTimePicker();
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
            <TouchableOpacity onPress={showTimePicker}
            disabled={disabled} // Disable touch if disabled is true
            style={disabled && { opacity: 0.5 }} // Optionally, change style if disabled
            >
              <View style={[styles.dropdown, { width: '100%', flexDirection: 'row', justifyContent: 'space-between' }, error && { borderColor: 'red' }]}>
                <Text>{textShow ? time : value}</Text>
                <Image source={Images.Clock} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
              </View>
            </TouchableOpacity>
            {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={(selectedTime) => handleConfirm(selectedTime, onChange)}
              onCancel={hideTimePicker}
            />
          </>
        )}
      />
    </View>
  );
};

export default TimePickerInput;