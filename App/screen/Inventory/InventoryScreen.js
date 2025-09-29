import React, {useState,useRef,useEffect} from 'react';
import {
  SafeAreaView,
  FlatList,
  Alert,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomAppBar from '../../component/CustomAppBar';
import {styles} from './InventoryStyles';
import GlobalStyles from '../../core/GlobalStyles';
import {RFValue} from 'react-native-responsive-fontsize';
import { getInventoryList, getInventorySearchList } from '../../networkClient/apifunction';
import { useFocusEffect } from '@react-navigation/native';
import CustomSearchInput from '../../component/CustomSearchInput';
import { Images, Languages } from '../../common';
import FontAwesomefive from 'react-native-vector-icons/FontAwesome5';
import crashlytics from '@react-native-firebase/crashlytics';

const InventoryScreen = (props) => {
  const [search, setsearch] = useState('');
  const [data,setData]=useState();
  const searchInputRef = useRef(null);
  const handlePress = () => {
   props.navigation.navigate("StockHistory");
  };
  useEffect(() => {
    crashlytics().log('InventoryScreenScreen mounted');
    return () => {
      crashlytics().log('InventoryScreenScreen unmounted');
    };
  }, []);
  useFocusEffect(
    React.useCallback(()=>{
getData()
    },[])
  )
  const getData = async () => {
    await getInventoryList()
      .then(function (response) {
        if (response.data.statusCode === 200) {
          if(response.data.data!=null){
            setData(response.data.data);
          }else{
            setData([]);
          }
        } else {
          Alert.alert(Languages.Alert, response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.response.data.message);
      });
  };


  const getSearchData = async (text) => {
    await getInventorySearchList(text)
      .then(function (response) {
        if (response.data.statusCode === 200) {
          if(response.data.data!=null){
            setData(response.data.data);
          }else{
            setData([]);
          }
        } else {
          Alert.alert(Languages.Alert, response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.response.data.message);
      });
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
  const renderItem=(item)=>{
    return(
       <TouchableOpacity onPress={()=>{props.navigation.navigate("InventoryDetail",{data:item})}}>
         <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems:'center',
              gap: 6,
            }}>
            <View style={styles.Icons}>
            <Image
              source={Images.Shampoo}
              style={{width: 15, height: 15}}
            />
            </View>
            <View style={{width:"80%"}}>
              <Text>{item.product.name}</Text>
              <View
                style={{
                  height: "auto",
                  width: "40%",
                  backgroundColor: '#ccf1ff',
                  marginTop: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  padding:5
                }}>
                <Text style={{fontSize:12}}>Available {item.balance}</Text>
              </View>
            </View>
          </View>
          <View>
            <Image
              source={Images.ArrowSquareRight}
              style={{width: 20, height: 20}}
            />
          </View>
        </View>
      </View>
       </TouchableOpacity>
    )
  }
  return (
    <SafeAreaView
      style={{backgroundColor: GlobalStyles.colorSet.app_bg, flex: 1}}>
      <View style={{padding: 10,flex:1}}>
        <View style={{height: 10}} />
        <CustomAppBar title="Inventory" showImage={true} navigation={props.navigation}/>
        <View style={{height: 10}} />

        <View style={{paddingLeft: 10, paddingRight: 10}}>
          <CustomSearchInput
            placeholder={Languages.Search}
            value={search}
            onChangeText={text => {
              setsearch(text);
              getSearchData(text.trim())
            }}
           
            ref={searchInputRef} // Pass the ref
          />

        </View>
        <View style={{height: 10}} />
        <TouchableOpacity onPress={()=>{props.navigation.navigate("OpenStock")}} >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#00AEEF1A',
            borderRadius: 5,
            paddingVertical: 15,
            paddingHorizontal: 10,
            marginBottom: 12,
            marginHorizontal: 10,
          }}>
          <Image
            source={Images.Flag2}
            resizeMode={'stretch'}
            style={{
              width: 20,
              height: 20,
              marginRight: 8,
            }}
          />
          <Text
            style={{
              color: '#000000',
              fontSize: 14,
            }}>
            {Languages.Opening_Stock}
          </Text>
          <View
            style={{
              flex: 1,
              alignSelf: 'stretch',
            }}></View>
         <FontAwesomefive name="external-link-alt" size={15} color="#B5B5B5" />
        </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            marginHorizontal: 10,
          }}>
          <Text
            style={{
              color: '#212B36',
              fontSize: 16,
              fontWeight: 'semibold',
            }}>
            {Languages.Products}
          </Text>
          <TouchableOpacity onPress={handlePress}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>{Languages.Stock_History}</Text>
              <Ionicons name={Platform.OS === 'android'?"hourglass-outline":'hourglass-sharp'} size={20} color="#F78104" />
            </View>
          </TouchableOpacity>
        </View>
       
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
    </SafeAreaView>
  );
};
export default InventoryScreen;
