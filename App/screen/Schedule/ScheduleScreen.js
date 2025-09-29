import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
  Alert,
  Dimensions,
  SafeAreaView
} from 'react-native';
import CustomAppBar from '../../component/CustomAppBar';
import { styles } from './ScheduleStyles';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import GlobalStyles from '../../core/GlobalStyles';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import CalendarModal from './component/CalendarModal';
import RenderItem from '../../component/RenderItem';
import CustomSearchInput from '../../component/CustomSearchInput'
import { weeklyFilteredLists, weeklyLists } from '../../networkClient/apifunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import CancelPopup from '../../component/CancelPopUp';
import FastImage from 'react-native-fast-image'
import Chips from '../../component/ChipComponent';
import { Images, Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; 
import { useForm } from 'react-hook-form';

const ScheduleScreen = props => {
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [demo, setDemo] = useState([]);
  const [filteredDemo, setFilteredDemo] = useState([]);
  const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [cancelDetail, setCancelDetail] = useState(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const [isAllSelected,setIsAllSelected] = useState(true);
  const [isTrainer,setTrainer]= useState(false);
  const [isDate,setselectedDate]= useState(false);
  const [isClient,setClient] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const searchInputRef = useRef(null);

   // Refs to track previous state
   const isAllSelectedRef = useRef(isAllSelected);
   const isTrainerRef = useRef(isTrainer);
   const isDateRef = useRef(isDate);
   const isClientRef = useRef(isClient);
   const {
    handleSubmit: handleSubmitForm,
    register,
    formState: { errors, isValid },
    control,
    setValue,
    getValues,
    reset,
  } = useForm({
    mode: 'onChange', // Enable validation on change
    defaultValues: {
      date: '',
    },
  });


   useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('ScheduleScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('ScheduleScreen unmounted');
    };
  }, []);

   // UseEffect to wait for state changes before processing query params
 useEffect(() => {
  processQueryParams();
}, [search,isAllSelected, isTrainer, isDate, isClient]);


   // Update refs whenever state changes
   useEffect(() => {
    isAllSelectedRef.current = isAllSelected;
    isTrainerRef.current = isTrainer;
    isDateRef.current = isDate;
    isClientRef.current = isClient;
  }, [isAllSelected, isTrainer, isDate, isClient]);

const allChipPress =()=>{
  setIsAllSelected(prev => !prev);
    if (isDate) setselectedDate(prev => !prev);
    if (isTrainer) setTrainer(prev => !prev);
    if (isClient) setClient(prev => !prev);
}

const clientChipPress =()=>{
  if (isAllSelected) setIsAllSelected(prev => !prev);
    setClient(prev => !prev);
}

const trainerChipPress=()=>{
  if (isAllSelected) setIsAllSelected(prev => !prev);
  setTrainer(prev => !prev);
}
const dateChipPress =()=>{
  if (isAllSelected) setIsAllSelected(prev => !prev);
  setselectedDate(prev => !prev);
}

const processQueryParams = ()=>{
  
     // Now, proceed to construct the query params and send the request
     let sortParams = [];

     if (isAllSelected) {
       if(userRole==="Trainer"){
        sortParams = ['date','desc', 'salesman','desc', 'client','desc'];
       }else{
        sortParams = ['date','desc', 'trainer','desc', 'client','desc'];
       }
     } else {
       if (isDate){
        sortParams.push('date');
        sortParams.push('desc');
       } 
       if (isTrainer){
        if(userRole === "Trainer"){
          sortParams.push('salesman');
          sortParams.push('desc');
        }else{
          sortParams.push('trainer');
          sortParams.push('desc');
        }
       } 
       if (isClient){
        sortParams.push('client');
        sortParams.push('desc');
       } 
     }
     const params = new URLSearchParams();
     if (search) {
      params.append('search', search);
    }
     sortParams.forEach(sort => params.append('sort', sort));
     if(selectedDate){
      handleChipClicked(selectedDate,params)
     }else{
      handleChipClicked(date,params)
     }
}

  useFocusEffect(
    React.useCallback(() => {
      getScheduleDemo(date);
    }, [date])
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const roleName = await AsyncStorage.getItem('roleName');

        if (userId !== null && roleName) {
          setUserRole(roleName);
        }
      } catch (error) {
      
      }
    };

    fetchUserData();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setTimeout(() => {
      setDatePickerVisibility(false); 
    }, 300);
    setDate(moment(date).format('YYYY-MM-DD'));
    getScheduleDemo(moment(date).format('YYYY-MM-DD'));
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const getScheduleDemo = (date) => {
    weeklyLists(date)
      .then(function (response) {
        if (response.data.statusCode === 200) {
          const res = response.data.data;
          setDemo(res);
          setFilteredDemo(res);
        } else {
          Alert.alert(Languages.Alert, response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.data.message);

      });
  };

  const handleChipClicked=(date,params)=>{
    weeklyFilteredLists(date,params)
    .then(function (response) {
      if (response.data.statusCode === 200) {
        const res = response.data.data;
        setDemo(res);
        setFilteredDemo(res);
      } else {
        Alert.alert(Languages.Alert, response.data.data.statusMessage);
      }
    })
    .catch(function (error) {
      Alert.alert(Languages.Alert, error.data.message);
    });
  }


  const EmptyListMessage = ({ item }) => {
    return (
      <View style={{ borderRadius: 10, width: '100%', height: 300, justifyContent: 'center' }}>
        <View style={{ height: screenHeight * 0.2, width: screenWidth * 0.45, alignSelf: 'center' }}>
          <FastImage
            source={Images.Cat}
            style={{
              resizeMode: 'contain',
              width: '100%',
              height: '100%',
              borderRadius: 10,
            }}
          />
        </View>
        <Text style={{ width: "100%", textAlign: 'center', marginTop: 5 }}>
         {Languages.No_Demos_Scheduled_Today}
        </Text>
      </View>
    );
  };

  const onItemClick = (item) => {
    if (item.demoStatus === "CANCELLED") {
      setCancelDetail(item);
      setCancelModalVisible(true);
    } else {
      props.navigation.navigate("DemoDetailScreen", { id: item.id, isDemoHistory: false });
    }
  }
  const handleDateScroll = (date) => {
    const selectedDate = moment(date).format('YYYY-MM-DD');
    setDate(selectedDate);
    getScheduleDemo(selectedDate); 
  };
  return (
    <SafeAreaView
      style={{backgroundColor: GlobalStyles.colorSet.app_bg, flexGrow: 1}}>
      <View style={{padding: 10,flex:1}}>
        <View style={{height: 10}} />
        <CustomAppBar
          title={userRole === 'Trainer' ? 'Calendar' : 'Schedule'}
          showImage={true}
          navigation={props.navigation}
        />
        <View style={{height: 20}} />
        <CustomSearchInput
            placeholder={userRole === "Salesman" ? 'Search for trainers':'Search for demos'}
            value={search}
            onChangeText={text => {
              setSearch(text);
            }}
           
            ref={searchInputRef} // Pass the ref
          />
       
        <View style={{height: 20}} />
        <View style={styles.parentContainer}>
          <View>
            <View
              style={{
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'baseline',
              }}>
              <TouchableOpacity onPress={showDatePicker}>
                <View style={{alignItems: 'baseline', flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      fontWeight: '500',
                      textAlign: 'left',
                      color: GlobalStyles.colorSet.blue,
                      marginLeft: 10,
                    }}>
                    {moment(date).utcOffset('+05:30').format('MMMM, YYYY')}
                  </Text>
                  <Image
                    source={Images.CalendarBlueNew}
                    resizeMode="contain"
                    style={{
                      width: 15,
                      height: 15,
                      resizeMode: 'contain',
                      marginLeft: 10,
                    }}
                  />
                </View>
              </TouchableOpacity>
              <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateSelect}
            onCancel={hideDatePicker}
            // minimumDate={new Date()}
          />
             {
             userRole!="ASM"&&userRole!="RSM"&&(
              <TouchableOpacity
              onPress={() =>
                userRole === 'Trainer'
                  ? props.navigation.navigate('SetCalendar')
                  : props.navigation.navigate('ScheduleDemo')
              }>
              <View
                style={{
                  alignItems: 'baseline',
                  padding: 8,
                  borderRadius: 10,
                  flexDirection: 'row',
                  backgroundColor: GlobalStyles.colorSet.light_orange,
                }}>
                <Text
                  style={{
                    fontSize: RFValue(12),
                    fontWeight: '500',
                    textAlign: 'left',
                    color: GlobalStyles.colorSet.orange,
                    marginLeft: 10,
                  }}>
                  {userRole === 'Trainer'
                    ? Languages.Set_your_Calendar
                    : Languages.Schedule_a_Demo}
                </Text>
                <Image
                  source={Images.CalendarEditNew}
                  resizeMode="contain"
                  style={{
                    width: 15,
                    height: 15,
                    resizeMode: 'contain',
                    marginLeft: 10,
                    marginTop: 3,
                  }}
                />
              </View>
            </TouchableOpacity>
             )
             }
            </View>
            <CalendarStrip
            key={date}
              scrollable
              calendarAnimation={{type: 'sequence', duration: 30}}
              daySelectionAnimation={{
                type: 'border',
                duration: 300,
                highlightColor: GlobalStyles.colorSet.orange,
              }}
              style={{
                height: 100,
                borderRadius: 10,
                marginLeft: 10,
                width: '100%',
              }}
              calendarHeaderStyle={{color: 'white', fontSize: RFPercentage(0)}}
              calendarColor={'white'}
              dateNumberStyle={{color: '#454F5B', padding: 5}}
              dateNameStyle={{color: '#C4CDD5', fontWeight: '500', margin: 5}}
              iconContainer={{flex: 0.1}}
              highlightDateNameStyle={{color: 'white'}}
              highlightDateNumberStyle={{color: 'white'}}
              highlightDateContainerStyle={{
                backgroundColor: GlobalStyles.colorSet.orange,
              }}
              selectedDate={date}
              onDateSelected={day => {
                const selectedDate = moment(day._d).format('YYYY-MM-DD'); 
                setDate(selectedDate); 
                getScheduleDemo(selectedDate); 
              }}
              onWeekScrollEnd={handleDateScroll}
              useIsoWeekday={false}
            />
          </View>

          <CalendarModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onDateSelect={handleDateSelect}
          />
        </View>
        <View style={{height: 10}} />
        <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        paddingHorizontal:10,
        paddingVertical:15
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'baseline',
        }}>
            <Chips
        label={Languages.All}
        selectedColor="#F78104"
        unselectedColor="#fff"
        selected={isAllSelected}
        onPress={allChipPress}
      />
      <Chips
        label={Languages.Date}
        selectedColor="#F78104"
        unselectedColor="#fff"
        selected={isDate}
        onPress={dateChipPress}
      />
      <Chips
        label={userRole === 'Trainer' ? Languages.Salesman: Languages.Trainer}
        selectedColor="#F78104"
        unselectedColor="#fff"
        selected={isTrainer}
        onPress={trainerChipPress}
      />
      <Chips
        label={Languages.Client}
        selectedColor="#F78104"
        unselectedColor="#fff"
        selected={isClient}
        onPress={clientChipPress}
      />
        </View>
        <View>

        </View>
      </View>
      
          <FlatList
          style={{flex:1}}
            // keyExtractor={(item, index) => index.toString()}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            data={filteredDemo}
            ListEmptyComponent={EmptyListMessage}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  onItemClick(item);
                }}>
                <RenderItem
                 image={userRole === "Salesman" ? item.trainer != null ? item.trainer.profilePic : "": item.salesman != null ? item.salesman.profilePic : "" }
                  name={
                    userRole !== 'Trainer' ?   item.trainer != null
                      ? item?.trainer.firstName + ' ' + item?.trainer.lastName
                      : ''
                      :item.salesman != null
                      ? item?.salesman.firstName + ' ' + item?.salesman.lastName
                      : ''
                  }
                  demoId={item.generatedDemoId}
                  detail={moment(item?.scheduleTime, ['HH:mm']).format(
                    'h:mm A',
                  )}
                  assignee={item.trainer.firstName}
                  status={item.demoStatus}
                />
              </Pressable>
            )}
          />
    
      </View>
      <CancelPopup
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        details={cancelDetail}
      />
    </SafeAreaView>
  );
};

export default ScheduleScreen;
