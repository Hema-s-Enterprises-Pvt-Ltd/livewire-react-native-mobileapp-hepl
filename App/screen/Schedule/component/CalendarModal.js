import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import {Calendar} from 'react-native-calendars';
import GlobalStyles from '../../../core/GlobalStyles';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
const CalendarModal = ({visible, onClose,onDateSelect,}) => {
  const todayString = moment().format('YYYY-MM-DD');
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(moment().format('MMMM YYYY'));


  const handleMonthChange = (month) => {
    setCurrentMonth(moment(month.dateString).format('MMMM YYYY'));
  };
  const handleDayPress = (day) => {
    const newMarkedDates = { ...markedDates };

    if (selectedDate && newMarkedDates[selectedDate]) {
      delete newMarkedDates[selectedDate].selected;
      delete newMarkedDates[selectedDate].selectedColor;
      delete newMarkedDates[selectedDate];
    }
    // Set the new selected date
    newMarkedDates[day.dateString] = {
      ...newMarkedDates[day.dateString],
      selected: true,
      selectedColor: '#222222',
      selectedTextColor: 'yellow',
    };
    setMarkedDates(newMarkedDates);
    setSelectedDate(day.dateString);
    onDateSelect(day.dateString)
  };

  return (
    <Modal
      animationType="slide"
      isVisible={visible}
      swipeDirection={['down', 'left', 'right', 'up']}
      onSwipeComplete={onClose}
      propagateSwipe={true}
      onBackdropPress={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginTop:10,
              paddingBottom:10
            }}>
            <TouchableOpacity onPress={onClose}>
            <Icon color="black" name="arrow-back" size={25} />
            </TouchableOpacity>
            <Text style={styles.header}>{currentMonth}</Text>
          </View>
          <Calendar
            current={todayString}
           // minDate={todayString}
            // maxDate={'2024-06-30'}
            onDayPress={handleDayPress}
            monthFormat={'MMMM yyyy'}
            onMonthChange={handleMonthChange}
            hideArrows={false}
            hideExtraDays={true}
            disableMonthChange={true}
            hideDayNames={false}
            showWeekNumbers={false}
            onPressArrowLeft={subtractMonth => subtractMonth()}
            onPressArrowRight={addMonth => addMonth()}
            disableArrowLeft={false}
            disableArrowRight={false}
            disableAllTouchEventsForDisabledDays={true}
            renderHeader={date => {
              /*Return JSX*/
            }}
            enableSwipeMonths={true}
            markedDates={markedDates}
          />
          
          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  addressText: {
    fontSize: RFValue(12),
    fontWeight: '500',
    textAlign: 'left',
    color: '#666687',
  },
  locationImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 5,
  },
  detailChildContainer: {
    flexDirection: 'column',
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalView: {
    width: '100%',
    height: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    margin:10,
    padding: 10,
   // alignItems: 'center',
    // justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '90%',
  },
  header: {
    fontSize: RFPercentage(2.0),
    fontWeight: 'bold',
    textAlign: 'left',
    //  marginTop: 10,
    paddingLeft: 10,
    color: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
//   header: {
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//     alignItems: 'center',
//   },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  legend: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  legendText: {
    fontSize: RFValue(12),
    color: '#637381',
    margin: 5,
  },
  lengendView: {flexDirection: 'row', alignItems: 'baseline'},
  eclipseView: {
    backgroundColor: 'white',
    borderColor: GlobalStyles.colorSet.blue,
    borderWidth: 1,
    width: 10,
    height: 10,
    borderRadius: 10,
  },
});

export default CalendarModal;
