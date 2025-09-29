import React, {useState, useEffect, useRef} from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert, Pressable} from 'react-native';
import { styles } from './ClientStyles';
import CustomAppBar from '../../component/CustomAppBar';
import CustomSearchInput from '../../component/CustomSearchInput';
import RenderItem from '../../component/RenderItem';
import { getClientList } from '../../networkClient/apifunction';
import { ActivityIndicator } from 'react-native-paper';
import ClientInfoPopUpModal from './component/ClientInfoPopUp';
import crashlytics from '@react-native-firebase/crashlytics';

const ClientScreen = (props) => {

  const [search, setsearch] = useState('');
  const [input, setinput] = useState('');
  const [modalVisible,setModalVisible]=useState(false);
 // const [data,setData]=useState();
  const [isLoading,setIsLoading]=useState(false)
  const searchInputRef = useRef(null);

 const data = [
  {
    name: 'Sahren',
    detail: '501,Demo at 10:00AM to 11:00 AM',
  },
  {
    name: 'Sahren',
    detail: '502,Demo at 10:00AM to 11:00 AM',
  },
];
useEffect(() => {
  // Log that the component has mounted
  crashlytics().log('ClientScreen mounted');
  return () => {
    // Log that the component is unmounting
    crashlytics().log('ClientScreen unmounted');
  };
}, []);
  useEffect(()=>{
    getList();
   },[])
   const getList=async()=>{
    await getClientList().then(function(response){
       if(response.data.statusCode==200){
         setIsLoading(false)
       }else{
         Alert.alert("Alert", response.data.statusMessage)
       }
      }).catch(function(error){
       Alert.alert("Alert",  error.response.data.message)
      })
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
const onClickAddClient=()=>{
  props.navigation.navigate("AddClient");
}
  return (
    <SafeAreaView style={styles.viewContainer}>
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={{padding: 10}}>
      <View style={{height: 10}} />
      <CustomAppBar title="Clients" showImage={true} navigation={props.navigation}/>
      <View style={{height: 20}} />
      <CustomSearchInput
            placeholder="Search"
            value={search}
            onChangeText={text => {
              setsearch(text);
            }}
           
            ref={searchInputRef} // Pass the ref
          />
          <View style={{height: 20}} />
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.8}}>
            <Text style={styles.header}>Clients</Text>
          </View>
          <TouchableOpacity style={styles.box_style} onPress={onClickAddClient}>
            <Text style={[styles.subHeader, {alignItems: 'center'}]}>
              Add Client
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginBottom:65,flex: 1, width: '100%' }}> 
       {
        isLoading?<ActivityIndicator/>:
        <FlatList
        keyExtractor={(item, index) => index}
        data={data}
        ListEmptyComponent={EmptyListMessage}
        renderItem={({item, index}) => (
        <Pressable onPress={()=>{setModalVisible(true)}}>
           <RenderItem
         item={item}
         />
        </Pressable>
        )}
      />
       }
      </View>
      <ClientInfoPopUpModal visible={modalVisible} onClose={() => setModalVisible(false)} props={props}/>
    </View>
    </SafeAreaView>
  );
};
export default ClientScreen;
