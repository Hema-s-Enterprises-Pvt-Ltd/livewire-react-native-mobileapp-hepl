import React, {useState,useEffect} from 'react';
import {
  SafeAreaView,
  FlatList,
  Alert,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import CustomAppBar from '../../component/CustomAppBar';
import {styles} from './InventoryStyles';
import GlobalStyles from '../../core/GlobalStyles';
import {RFValue} from 'react-native-responsive-fontsize';
import AddProductModal from './component/AddProductModal';
import { useFocusEffect } from '@react-navigation/native';
import { getInventoryList} from '../../networkClient/apifunction';
import { Images, Languages } from '../../common';
import FontAwesomefive from 'react-native-vector-icons/FontAwesome5';
import crashlytics from '@react-native-firebase/crashlytics';
const OpenStockScreen = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [data,setData]=useState()
  const handlePress = () => {
    setModalVisible(true);
  };
  useEffect(() => {
    crashlytics().log('OpenStockScreen mounted');
    return () => {
      crashlytics().log('OpenStockScreen unmounted');
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
              gap: 6,
              flex:0.8
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
      <View style={{padding: 10}}>
        <View style={{height: 10}} />
        <CustomAppBar title={Languages.Opening_Stock} showImage={true} navigation={props.navigation}/>
        <View style={{height: 20}} />
        <TouchableOpacity>
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
              <Text style={styles.buttonText}>{Languages.Add_Product}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{height:"75%"}}>
        <FlatList
        showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          data={data}
          ListEmptyComponent={EmptyListMessage}
          renderItem={({item, index}) => (
           renderItem(item)
          )}
        />
        </View>
        <AddProductModal visible={modalVisible} onClose={() => {
          setModalVisible(false)
          getData()
          }} />
      </View>
    </SafeAreaView>
  );
};
export default OpenStockScreen;
