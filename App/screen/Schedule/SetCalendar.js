import React,{useState,useEffect} from 'react';
import {View, Text, TouchableOpacity,Alert,ToastAndroid,SafeAreaView} from 'react-native';
import CustomAppBar from '../../component/CustomAppBar';
import { styles } from './ScheduleStyles';
import GlobalStyles from '../../core/GlobalStyles';
import {Calendar} from 'react-native-calendars';
import DetailItem from '../DemoDetail/component/DetailItem';
import moment from 'moment';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getmonthByUserId,onSubmitCalendarRequest } from '../../networkClient/apifunction';
import { Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const SetCalendarScreen = (props) => {
    const [userId, setUserId] = useState(null);
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(moment().format('MMMM YYYY'));
    const data = [
        {label: 'Leave', value: 'leave'},
        {label: 'Week Off', value: 'week_off'},
        {label: 'Holiday', value: 'holiday'},
        {label: 'Evaluation', value: 'evaluation_pending'},
      ];
    const [markedDates, setMarkedDates] = useState({});
    const [previousMarkedDates, setPreviousMarkedDates] = useState({});
    const [selectedDate, setSelectedDate] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
  const ColorValue =['#FFF','#9E5FFF','#FFD240','#F04438','#D0D5DD','#F78104','#009933'];
  const markType = ['working_day','leave','week_off','holiday','evaluation_pending','evaluation_approved','evaluation_rejected'];
      const todayString = moment().format('YYYY-MM-DD');
      const firstDateOfCurrentMonth = moment().startOf('month').format('YYYY-MM-DD');
      const handleMonthChange = (month) => {
        setCurrentMonth(moment(month.dateString).format('MMMM YYYY'));
        getMonthandYearDetailsList();
      };

      const handleDayPress = day => {
        const newMarkedDates = {...markedDates};
        const previousMarkDates = {...previousMarkedDates};
        newMarkedDates[day.dateString] = {
          ...newMarkedDates[day.dateString],
          selected: true,
          customStyles: {
            container: {
              backgroundColor: '#222222',
              borderColor: '#222222',
              borderWidth: 2,
            },
            text: {
              color: 'white',
              fontWeight: 'bold',
            },
          },
        };

        Object.keys(previousMarkDates).forEach(dateKey => {
          if (newMarkedDates[dateKey] !== newMarkedDates[day.dateString]) {
            newMarkedDates[dateKey] = {
              ...previousMarkDates[dateKey],
            };
          }
        });
        setIsDisabled(false);
        setMarkedDates(newMarkedDates);
        setSelectedDate(day.dateString);
      };
      useEffect(() => {
        // Log that the component has mounted
        crashlytics().log('SetCalendar mounted');
        return () => {
          // Log that the component is unmounting
          crashlytics().log('SetCalendar unmounted');
        };
      }, []);
      useEffect(() => {
        const fetchUserData = async () => {
          try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId !== null) {
              setUserId(userId);
            }
          } catch (error) {
           
          }
        };
    
        fetchUserData();
        
      }, []);
      function notifyMessage(msg) {
        if (Platform.OS === 'android') {
          ToastAndroid.show(msg, ToastAndroid.SHORT)
        } else {
          Alert.alert(msg);
        }
      }
      useEffect(() => {
        if (userId) {
          getMonthandYearDetailsList();
        }
      }, [userId, currentMonth]);

      const getMonthandYearDetailsList= async () => {
        const monthYear = currentMonth.split(' ');
        getMonthlyDetailByUserId(userId ,monthYear[0].toLowerCase(),monthYear[1]);
      };
      const processingMarkUpdata = (res) => {
        const daysInMonth = moment(currentMonth, 'MMMM YYYY').daysInMonth();
        const newMarkedDates = {};

          for (let day = 1; day <= daysInMonth; day++) {
            const date = moment(`${currentMonth} ${day}`, 'MMMM YYYY D').format('YYYY-MM-DD');
            newMarkedDates[date] = {          
              disableTouchEvent:date===moment().format('YYYY-MM-DD')?false:  moment(date).isBefore(moment()),
              selected: true,
              customStyles: {
                container: {
                  backgroundColor: '#fff',
                  borderColor: '#00AEEF',
                  borderWidth: 2,
                },
                text: {
                  color: 'black',
                  fontWeight: 'bold'
                }
              },
              working_day:true
            };
          }
        if (res && res.length > 0) {
          res.forEach((item) => {
            const index = markType.findIndex((value) => value === item.markType);
            if (index !== -1) {
              newMarkedDates[item.specificDate] = {
                activeOpacity: 0,
                marked: true,
                selected: true,
                disableTouchEvent: item.specificDate===moment().format('YYYY-MM-DD')?false:  moment(item.specificDate).isBefore(moment()),
                customStyles: {
                  container: {
                    backgroundColor: ColorValue[index],
                    borderColor: ColorValue[index],
                    borderWidth: 2,
                  },
                 
                },
                working_day:false
              };
            }
          });
        }
        setMarkedDates(newMarkedDates);
        setPreviousMarkedDates(newMarkedDates)
      };

      getMonthlyDetailByUserId = (userId,month,year)=>{
        getmonthByUserId(userId,month,year).then(function (response) {
          if (response.data.statusCode == 200) {
              const res = response?.data?.data;
              processingMarkUpdata(res)
          } else {
              Alert.alert("Alert", response.data.data.statusMessage);
          }
      }).catch(function (error) {
          Alert.alert("Alert", error.message);
      });
      }

      onSubmit =async () => {
        const postData = {
          userId: userId,
          specificDate: selectedDate,
          markType: value
        }
        onSubmitCalendarRequest(postData).then(function (response) {
          if (response.data.statusCode == 200) {
            notifyMessage('Request Sent successfully')
              props.navigation.navigate("SalesBottomTabs")
          } else {
              Alert.alert("Alert", response.data.data.message);
          }
      }).catch(function (error) {
         // Alert.alert("Alert", error.response.data.message);
      });
      }

      const CustomDay = ({date, state}) => {
        const isStrikethrough = date.dateString === '2024-09-05'; // Example date for strikethrough
        return (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={{
                // textDecorationLine: isStrikethrough ? 'line-through' : 'none',
                color: state === 'disabled' ? 'gray' : 'black',
                padding: 10,
                textAlign: 'center',
                width: 40,
                backgroundColor: 'white',
                    borderColor: '#00AEEF',
                    borderWidth: 2,
                    borderRadius: 50,
                ...(isStrikethrough
                  ? {
                      borderWidth: 1,
                      borderRadius: 50,
                    }
                  : null),
              }}>
              {date.day}
            </Text>
            {isStrikethrough ? <View style={{position: 'absolute',
    top: '30%',
    left: 7,
    // right: 0,
    // height: 1,
    // width: 20,
    // backgroundColor: 'red',
    height: 1,
    width: '65%',
    backgroundColor: 'red',
    transform: [{rotate: '45deg'}],}} /> : null}
          </View>
        );
      };
      
  return (
    <SafeAreaView style={{backgroundColor:GlobalStyles.colorSet.app_bg, flex: 1}}>
      <View style={styles.container}>
        <CustomAppBar title={Languages.Set_your_Calendar} showImage={true} navigation={props.navigation}/>
        <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginTop:10,
              marginBottom:10
            }}>
            <Text style={styles.header}>{currentMonth}</Text>
          </View>
          <Calendar
            current={firstDateOfCurrentMonth}
            minDate={todayString}
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
            markingType={'custom'}
            enableSwipeMonths={true}
            markedDates={markedDates}
            // dayComponent={({date, state}) => {
            //   return <CustomDay date={date} state={state} />;
            // }}
          />
          <View
            style={{
              backgroundColor: '#FEF2F3',
              borderRadius: 5,
              padding: 10,
              alignItems: 'baseline',
            }}>
            <DetailItem
              image={'Maticon-Info'}
              title="Select a date to change the workday status"
            />
          </View>
          <View style={styles.legend}>
            <View style={styles.lengendView}>
              <View
                style={{
                  backgroundColor: 'white',
                  borderColor: '#00AEEF',
                  borderWidth: 1,
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                }}
              />
              <Text allowFontScaling={false} style={styles.legendText}> {Languages.Working_Day}</Text>
            </View>
            <View style={styles.lengendView}>
              <View
                style={{
                  backgroundColor: '#9E5FFF',
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                }}
              />
              <Text allowFontScaling={false} style={styles.legendText}>{Languages.Leave}</Text>
            </View>
            <View style={styles.lengendView}>
              <View
                style={{
                  backgroundColor: '#FFD240',
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                }}
              />
              <Text allowFontScaling={false} style={styles.legendText}>{Languages.Week_Off}</Text>
            </View>
            <View style={styles.lengendView}>
              <View
                style={{
                  backgroundColor: '#F04438',
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                }}
              />
              <Text allowFontScaling={false} style={styles.legendText}>{Languages.Holiday}</Text>
            </View>
            <View style={styles.lengendView}>
              <View
                style={{
                  backgroundColor: '#F78104',
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                }}
              />
              <Text allowFontScaling={false} style={styles.legendText}>{Languages.Evaluation_Approved}</Text>
            </View>
            <View style={styles.lengendView}>
              <View
                style={{
                  backgroundColor: '#E6F2E6',
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                }}
              />
              <Text allowFontScaling={false} style={styles.legendText}>{Languages.Evaluation_Pending}</Text>
            </View>
            <View style={styles.lengendView}>
              <View
                style={{
                  backgroundColor: '#009933',
                  borderWidth: 1,
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                }}
              />
              <Text allowFontScaling={false} style={styles.legendText}>{Languages.Evaluation_Rejected}</Text>
            </View>
          </View>
       
      </View>
      <View style={{ justifyContent:'flex-end',
             flex:3,
             padding:10
            }}>
         <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
        <View style={{width:"60%"}}>
        <Dropdown
            style={[
              styles.dropdown,
              !isDisabled && {borderColor: GlobalStyles.colorSet.orange},
            ]}
            disable={isDisabled}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? Languages.Select_here : '...'}
            searchPlaceholder={Languages.Search}
            value={value}
            
            onChange={item => {
              setValue(item.value);
              setIsFocus(true);
            }}
          />
        </View>
        <View style={{width:"40%"}}>
        <TouchableOpacity  disabled={!isFocus} onPress={onSubmit} 
        style={[{ alignItems: 'center', marginLeft: 10, marginRight: 10, opacity:'0.6'},!isFocus && styles.disabled]}>
        <View style={styles.button}> 
            <Text style={styles.buttonText}>
               {value && value == 'evaluation_pending' ? Languages.Send_Request : Languages.Set}
            </Text>
        </View>
    </TouchableOpacity>
        </View>
          </View>
         </View>
    </SafeAreaView>
  );
};
export default SetCalendarScreen;
