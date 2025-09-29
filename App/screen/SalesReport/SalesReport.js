import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Image, FlatList,TouchableOpacity, SafeAreaView, Alert} from 'react-native';
import GlobalStyles from '../../core/GlobalStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomAppBar from '../../component/CustomAppBar';
import Icon from 'react-native-vector-icons/AntDesign';
import CalendarModal from '../Schedule/component/CalendarModal';
import { styles } from '../Client/ClientStyles';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import { getDetails, getSalesReport, getSalesSearchReport } from '../../networkClient/apifunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Chips from '../../component/ChipComponent';
import CustomSearchInput from '../../component/CustomSearchInput';
import { Images, Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const SalesReport = props => {
  const [search, setsearch] = useState('');
  const [data, setData] = useState('');
  const [roleName, setRoleName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [isAllSelected,setIsAllSelected] = useState(true);
  const [isTrainer,setTrainer]= useState(false);
  const [isDate,setselectedDate]= useState(false);
  const [isClient,setClient] = useState(false);
  const searchInputRef = useRef(null);
   // Refs to track previous state
   const isAllSelectedRef = useRef(isAllSelected);
   const isTrainerRef = useRef(isTrainer);
   const isDateRef = useRef(isDate);
   const isClientRef = useRef(isClient);

   useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('SalesReport mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('SalesReport unmounted');
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
       sortParams = ['date','desc', 'trainer','desc', 'client','desc'];
     } else {
       if (isDate){
        sortParams.push('date');
        sortParams.push('desc');
       } 
       if (isTrainer){
        sortParams.push('trainer');
        sortParams.push('desc');
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
     getRecentSalesSearchList(params)
}

  useFocusEffect(
    React.useCallback(() => {
      getUserName()
      getRecentSalesList()
    }, []),
  );
  const getUserName = async () => {
    const id = await AsyncStorage.getItem("userId");
    let Id = parseInt(id, 10);
    try {
      const response = await getDetails(Id);
      if (response.data.statusCode === 200) {
        setRoleName(response.data.data.role.name)
        getRecentSalesList(response.data.data.role.name)
      } else {
        Alert.alert(Languages.Alert, response.data.data);
      }
    } catch (error) {
      Alert.alert(Languages.Alert, error.message);
    }
  };

  const getRecentSalesSearchList=async(params)=>{
    var isRSM=null;
    if(roleName==="RSM"){
      isRSM=true
    }else{
      isRSM=false
    }
    await getSalesSearchReport(isRSM,params).then(function (response) {
      if (response.data.statusCode == 200) {
        setData(response.data.data)
      } else {
        Alert.alert(Languages.Alert, response.data.statusMessage);
      }
    }).catch(function (error) {
      Alert.alert(Languages.Alert, error.response.data.message);
    });
  }
  const getRecentSalesList=async(role)=>{
    var isRSM=null;
    if(role==="RSM"){
      isRSM=true
    }else{
      isRSM=false
    }
    await getSalesReport(isRSM,false).then(function (response) {
      if (response.data.statusCode == 200) {
        setData(response.data.data)
      } else {
        Alert.alert(Languages.Alert, response.data.statusMessage);
      }
    }).catch(function (error) {
      Alert.alert(Languages.Alert, error.response.data.message);
    });
  }
  const handleToggleDetail = (id) => {
    setExpandedItemId((prevId) => (prevId === id ? null : id));
  };
 
  const EmptyListMessage = ({item}) => {
    return (
      // Flat List Item
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
  const Item = ({ item, onToggleDetail, showDetail }) => {
    return (
        <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 6,
              alignItems: 'center',
            }}>
            <View style={styles.Icons}>
              <Image
                source={Images.Shampoo}
                style={{width: 15, height: 15}}
              />
            </View>
            <View>
              <View style={{flexDirection: 'row', gap: 6}}>
                <Text
                  style={{color: '#161C24', fontSize: 12, fontWeight: '700'}}>
                 {item.demo?item.demo.generatedDemoId:"--"}
                </Text>
                <Text
                  style={{
                    color: '#042628',
                    fontSize: 10,
                    fontWeight: '500',
                    backgroundColor: '#ccf1ff',
                    borderRadius: 20,
                    padding: 5,
                  }}>
                  {item.soldDate?moment(item.soldDate).format("MMM,DD"):"--"}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '500',
                  color: '#042628',
                  marginTop: 5,
                }}>
                 {item.product?item.product.name:"--"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
           onPress={() => onToggleDetail(item.id)}
           >
            <Icon
              name={showDetail ? 'up-square-o' : 'down-square-o'}
              size={20}
              color={GlobalStyles.colorSet.orange}
            />
          </TouchableOpacity>
        </View>
        {showDetail && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#ccf1ff',
              padding: 10,
              borderRadius: 5,
            }}>
            <Text style={{color: '#161C24', fontSize: 16, fontWeight: '500'}}>
            {item.qtySold?item.qtySold:"--"}Pcs
            </Text>
            <Text style={{color: '#161C24', fontSize: 16, fontWeight: '500'}}>
              ₹{item.amount?item.amount:"--"}
            </Text>
          </View>
        )}
      </View>
    );
  };
  const renderItem = item => {
    return (
        <Item
        item={item}
        onToggleDetail={handleToggleDetail}
        showDetail={expandedItemId === item.id}
      />
    );
  };
  const handleDateSelect = (date) => {
    setModalVisible(false);
    if(date){
    
      // Perform additional actions with the selected date
    }
  
  };
  
  return (
    <SafeAreaView style={{backgroundColor: GlobalStyles.colorSet.app_bg, flex: 1}}>
      <View style={styles.container}>
       <CustomAppBar title={Languages.Sales_Report} showImage={true} navigation={props.navigation}/>
        <View style={{height: 30}} />
        <CustomSearchInput
            placeholder={Languages.Search_items}
            value={search}
            onChangeText={text => {
              setsearch(text);
            }}
           
            ref={searchInputRef} // Pass the ref
          />
      </View>
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
        label={Languages.Trainer}
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
        <View style={{padding:10,height:'auto',flex:1}}>
        <FlatList
        showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => renderItem(item)}
         keyExtractor={(item) => item.id}
          data={data}
          ListEmptyComponent={EmptyListMessage}
          contentContainerStyle={{ paddingBottom: 30 }}
          />
        </View>
       <CalendarModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onDateSelect={handleDateSelect} 
      />
    </SafeAreaView>
  );
};
export default SalesReport;
