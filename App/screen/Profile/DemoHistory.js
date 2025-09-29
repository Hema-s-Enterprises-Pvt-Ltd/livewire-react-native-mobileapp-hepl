import React, { useState, useEffect,useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Pressable,
  Alert,
  SafeAreaView,
  Platform
} from 'react-native';
import { styles } from './ProfileStyles';
import CustomAppBar from '../../component/CustomAppBar';
import { RFValue } from 'react-native-responsive-fontsize';
import DeclineModal from './component/DeclineModal';
import { getDemoDetails, getDeclinedDetails } from '../../networkClient/apifunction';
import moment from 'moment';
import Chips from '../../component/ChipComponent';
import CalendarModal from '../Schedule/component/CalendarModal';
import CustomSearchInput from '../../component/CustomSearchInput';
import { Images, Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const DemoHistoryScreen = props => {
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [declineData, setDeclineData] = useState(null);
  const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [modalcalendarVisible, setCalendarModalVisible] = useState(false);
  const [isAllSelected,setIsAllSelected] = useState(true);
  const [isBrand,setBrand]= useState(false);
  const [isDate,setselectedDate]= useState(false);
  const [isService,setService] = useState(false);
  const searchInputRef = useRef(null);
    // Refs to track previous state
    const isAllSelectedRef = useRef(isAllSelected);
    const isBrandRef = useRef(isBrand);
    const isDateRef = useRef(isDate);
    const isServiceRef = useRef(isService);

    useEffect(() => {
      // Log that the component has mounted
      crashlytics().log('DemoHistoryScreen mounted');
      return () => {
        // Log that the component is unmounting
        crashlytics().log('DemoHistoryScreen unmounted');
      };
    }, []);

    // Update refs whenever state changes
  useEffect(() => {
    isAllSelectedRef.current = isAllSelected;
    isBrandRef.current = isBrand;
    isDateRef.current = isDate;
    isServiceRef.current = isService;
  }, [isAllSelected, isBrand, isDate, isService]);

   // UseEffect to wait for state changes before processing query params
   useEffect(() => {
    processQueryParams();
  }, [search,isAllSelected, isBrand, isDate, isService]);


  const getList = async (url) => {
    await getDemoDetails(url).then(function (response) {
      if (response.data.statusCode === 200) {
        setData(response.data.data);
      } else {
        Alert.alert(Languages.Alert, response.data.statusMessage);
      }
    }).catch(function (error) {
      Alert.alert(Languages.Alert, error.response.data.message);
    });
  };

  const decline_getbyId = async (id,demoStatus) => {
    await getDeclinedDetails(id).then(function (response) {
      if (response.data.statusCode === 200) {
        if(demoStatus==="CANCELLED"){
          setDeclineData(response.data.data);
          setModalVisible(true);
        }
     
        if(demoStatus==="INVITE_PENDING"||demoStatus==="CREATED"){
          props.navigation.navigate('TrainerList', {
            date: response.data.data.scheduleDate,
            serviceId: response.data.data.service.id,
            demoId:  response.data.data.id,
          });
        }
      } else {
        Alert.alert(Languages.Alert, response.data.statusMessage);
      }
    }).catch(function (error) {
      Alert.alert(Languages.Alert, error.message);
    });
  };


  const handleDateSelect = (date) => {
    setCalendarModalVisible(false);
    setDate(moment(date).format('YYYY-MM-DD'));
     // Now, proceed to construct the query params and send the request
     let sortParams = [];

     if (isAllSelected) {
       sortParams = ['date','desc', 'brand','desc', 'service','desc'];
     } else {
       if (isDate){
        sortParams.push('date');
        sortParams.push('desc');
       } 
       if (isBrand){
        sortParams.push('brand');
        sortParams.push('desc');
       } 
       if (isService){
        sortParams.push('service');
        sortParams.push('desc');
       } 
     }
     const params = new URLSearchParams();
     if (date!=undefined) {
      params.append('fromDate', date);
    }
    if (date!=undefined) {
      params.append('toDate', date);
    }
     sortParams.forEach(sort => params.append('sort', sort));
     getList(params)
  };

  const EmptyListMessage = () => {
    return (
      <Text
        style={{
          fontSize: RFValue(14),
          fontWeight: '500',
          marginLeft: 5,
          marginRight: 10,
          color: 'grey',
          alignSelf: 'center',
          margin: 5,
          textDecorationLine: 'underline',
          textDecorationColor: 'grey',
        }}>
        {Languages.No_data_available}
      </Text>
    );
  };

  const onClickhandle = item => {
    if (item.demoStatus === 'CANCELLED'||item.demoStatus === 'INVITE_PENDING'||item.demoStatus === 'CREATED') {
      decline_getbyId(item.demoId,item.demoStatus);
    } else {
      setModalVisible(false);
      props.navigation.navigate("DemoDetailScreen", { id: item.demoId, isDemoHistory: true });
    }
  };


const allChipPress =()=>{
  setIsAllSelected(prev => !prev);
    if (isDate) setselectedDate(prev => !prev);
    if (isBrand) setBrand(prev => !prev);
    if (isService) setService(prev => !prev);
  // processQuarryParams();
}

const serviceChipPress =()=>{
  if (isAllSelected) setIsAllSelected(prev => !prev);
    setService(prev => !prev);
  // processQuarryParams();
}

const brandChipPress=()=>{
  if (isAllSelected) setIsAllSelected(prev => !prev);
  setBrand(prev => !prev);
  // processQuarryParams();
}
const dateChipPress =()=>{
  if (isAllSelected) setIsAllSelected(prev => !prev);
  setselectedDate(prev => !prev);
  // processQuarryParams();
}

const processQueryParams = ()=>{
  
     // Now, proceed to construct the query params and send the request
     let sortParams = [];

     if (isAllSelected) {
       sortParams = ['date','desc', 'brand','desc', 'service','desc'];
     } else {
       if (isDate){
        sortParams.push('date');
        sortParams.push('desc');
       } 
       if (isBrand){
        sortParams.push('brand');
        sortParams.push('desc');
       } 
       if (isService){
        sortParams.push('service');
        sortParams.push('desc');
       } 
      }
     const params = new URLSearchParams();
     if (search) {
      params.append('search', search);
    }
     sortParams.forEach(sort => params.append('sort', sort));
     getList(params)
}

  const renderItem = item => {
    return (
      <View
        style={
          item.demoStatus === 'CANCELLED'
            ? styles.declineContainer
            :  item.demoStatus === 'COMPLETED'? styles.demoComplete:styles.otherDemo
        }>
        <ImageBackground
          source={Images.BackgroundPattern}
          resizeMode={'cover'}
          style={{
            height: 'auto',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              flexWrap: 'wrap',
              alignItems:'center'
            }}>
           {
            item.profileUrl?
            <Image
            source={{uri:item.profileUrl}}
            resizeMode="contain"
            style={styles.Image}
          />:
          <Image
          source={Images.Person}
          resizeMode="contain"
          style={[styles.Image,{tintColor:"white"}]}
        />
           }

            <View style={{ width: '65%', flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '100%',
                  height: 'auto',
                }}>
                   <Text style={[styles.subHeader, { color: 'white' }]}>
                  {`#demo${item.demoId}`}
                </Text>
                <Text style={[styles.subHeader, { color: 'white' }]}>
                  {item.generatedDemoId}
                </Text>
                <Text style={[styles.subHeader, { color: 'white' }]}>
                  {moment(item.scheduleDate).format("MMM DD")}
                </Text>
              </View>
              <View
                style={{
                  width: '30%',
                  alignItems: 'flex-end',
                  paddingRight: 10,
                  justifyContent: 'center',
                }}>
                {item.demoStatus === 'CANCELLED' ? (
                  <>
                  <Text style={styles.declineTxt}>Declined</Text>
                    </>
                ) : (
                  <Image source={Images.Info} style={{width:20,height:20,tintColor:'white'}}/>
                )}
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.viewContainer}>
      <View style={[styles.container,{flex:1}]}>
        <CustomAppBar title="Demo History" showImage={true} navigation={props.navigation}/>
        <View style={{ height: 30 }} />

        <CustomSearchInput
            placeholder={Languages.Search_items}
            value={search}
            onChangeText={text => {
              setSearch(text);
            }}
           
            ref={searchInputRef} // Pass the ref
          />
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
       // flex:1,
        flexWrap:'wrap',
        alignItems: 'center',
        paddingHorizontal:10,
        paddingVertical:15,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'baseline',
          flex:0.8,
          flexWrap:'wrap',
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
        label={Languages.Brand}
        selectedColor="#F78104"
        unselectedColor="#fff"
        selected={isBrand}
        onPress={brandChipPress}
      />
      <Chips
        label={Languages.ServiceVarient}
        selectedColor="#F78104"
        unselectedColor="#fff"
        selected={isService}
        onPress={serviceChipPress}
        style={{marginTop:10}}
      />
        </View>
        <View style={{flex:0.25,paddingRight:10}}>
        <TouchableOpacity onPress={() => setCalendarModalVisible(true)}>
                <View style={{alignItems: 'center', flexDirection: Platform.OS === 'android' ? 'row':'column-reverse'}}>
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      fontWeight: '500',
                      textAlign: 'left',
                      color: '#00AEEF',
                      marginLeft: 10,
                    }}>
                    {moment().utcOffset('+05:30').format('MMM, YYYY')}
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
        </View>
      </View>
     
          <FlatList
          style={{flex:1}}
           showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            data={data}
            ListEmptyComponent={EmptyListMessage}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => { onClickhandle(item) }}>
                {renderItem(item)}
              </Pressable>
            )}
          />
       
        <DeclineModal visible={modalVisible} onClose={() => setModalVisible(false)} details={declineData} />
        <CalendarModal
            visible={modalcalendarVisible}
            onClose={() => setCalendarModalVisible(false)}
            onDateSelect={handleDateSelect}
          />
      </View>
    </SafeAreaView>
  );
};

export default DemoHistoryScreen;
