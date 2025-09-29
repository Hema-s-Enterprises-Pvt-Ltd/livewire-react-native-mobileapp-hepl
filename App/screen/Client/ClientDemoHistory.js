import React, {useEffect, useState,useRef} from 'react';
import {View, Text, Image, FlatList, Pressable,ImageBackground, Alert, StyleSheet, Dimensions} from 'react-native';
import GlobalStyles from '../../core/GlobalStyles';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { clientDemoHistory } from '../../networkClient/apifunction';
import moment from 'moment';
import Chips from '../../component/ChipComponent';
import CustomSearchInput from '../../component/CustomSearchInput';
import { Images, Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const ClientDemoHistoryScreen = (props) => {
  const clientID=props.clientId
  const [search, setsearch] = useState('');
  const [data,setData]=useState([]);
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
    crashlytics().log('ClientDemoHistoryScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('ClientDemoHistoryScreen unmounted');
    };
  }, []);

      // Update refs whenever state changes
      useEffect(() => {
        isAllSelectedRef.current = isAllSelected;
        isBrandRef.current = isBrand;
        isDateRef.current = isDate;
        isServiceRef.current = isService;
      }, [isAllSelected, isBrand, isDate, isService]);

  const renderItem=(item)=>{
    const buttonBackground=item.status==="CANCELLED"?"white":GlobalStyles.colorSet.blue
  const buttonText=item.status==="CANCELLED"?GlobalStyles.colorSet.blue:"white"
    return(
      <Pressable onPress={()=>props.screenProps.navigation.navigate("DemoDetailScreen", { id: item.demoId, isDemoHistory: true })}>
      <View style={[styles.flatContainer,{backgroundColor:buttonBackground}]}>
      <ImageBackground
        source={Images.BackgroundPattern}
        resizeMode={'cover'}
        style={{
          height: 'auto',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 15,
        }}>
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        flexWrap: 'wrap',
      }}>
      {
          item.profileUrl!=null&&item.profileUrl!=""?
        <Image
        source={{uri:item.profileUrl}}
        resizeMode="stretch"
        style={styles.Image}
      />:
      <Image
        source={Images.Person}
        resizeMode="stretch"
        style={[styles.Image,{tintColor:"white"}]}
      />
      }

      <View style={{width: '65%', flexDirection: 'row'}}>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            height: 'auto',
          }}>
          <Text style={[styles.header, {color: buttonText}]}>
          {item.generatedDemoId}  
          </Text>
          <Text style={[styles.subHeader, {color: buttonText}]}>
          {moment(item.scheduleDate).format("MMM,DD")}
          </Text>
        </View>
        <View
          style={{
            width: '20%',
            alignItems: 'flex-end',
            paddingRight: 10,
            justifyContent: 'center',
          }}>
          {/* <Icon name="info" size={20} color="white" /> */}
          <Image source={Images.Info} style={{width:20,height:20,tintColor:'white'}}/>
        </View>
      </View>
    </View>
    </ImageBackground>
  </View>
  </Pressable>
    )
  }

const getList=async(clientId,params)=>{
  await clientDemoHistory(clientId,params)
      .then(function (response) {
        if (response.data.statusCode === 200) {
          setData(response.data.data);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert('Alert', error.response.data.message);
  })
}

 // UseEffect to wait for state changes before processing query params
 useEffect(() => {
  processQueryParams();
}, [search,isAllSelected, isBrand, isDate, isService]);



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
    
   
     const clientId =(!isService && !isBrand && !isDate && !isAllSelected) ? `&clientId=${encodeURIComponent(clientID)}` : `&clientId=${encodeURIComponent(clientID)}`;
   
     getList(clientId,params)
}
 
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
        No data available
      </Text>
    );
  };

  return (
    <View style={{backgroundColor: GlobalStyles.colorSet.app_bg,width:"100%",height:Dimensions.get('window').height}}>
      <View >
        <CustomSearchInput
            placeholder={Languages.Search}
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
          flex:1,
          flexWrap:'wrap',
        }}>
            <Chips
        label="All"
        selectedColor="#F78104"
        unselectedColor="#fff"
        selected={isAllSelected}
        onPress={allChipPress}
      />
      <Chips
        label="Date"
        selectedColor="#F78104"
        unselectedColor="#fff"
        selected={isDate}
        onPress={dateChipPress}
      />
      <Chips
        label="Brand"
        selectedColor="#F78104"
        unselectedColor="#fff"
        selected={isBrand}
        onPress={brandChipPress}
      />
      <Chips
        label="Service Variant"
        selectedColor="#F78104"
        unselectedColor="#fff"
        selected={isService}
        onPress={serviceChipPress}
        style={{marginTop:10}}
      />
        </View>
        <View>

        </View>
      </View>
     
      <View style={{ height: props.showDetail ? "35%" : "55%" }}>
        <FlatList
        style={{flex:1}}
        showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          data={data}
          ListEmptyComponent={EmptyListMessage}
          renderItem={({item, index}) => (
         renderItem(item)
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: RFPercentage(2.0),
    fontWeight: 'bold',
    textAlign: 'left',
    //  marginTop: 10,
    color: 'black',
  },
  subHeader: {
    fontSize: RFPercentage(1.5),
    fontWeight: '500',
    textAlign: 'left',
    color: GlobalStyles.colorSet.Grey,
    marginTop: 5,
  },
  Image: {
    borderWidth: 2,
    borderColor: 'white',
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 50,
    borderWidth: 2,
  },
  flatContainer: {
    flexDirection: 'column',
    borderColor: GlobalStyles.colorSet.blue,
    backgroundColor: GlobalStyles.colorSet.blue,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    elevation: 3,
    borderWidth: 1,
  },
});
export default ClientDemoHistoryScreen;