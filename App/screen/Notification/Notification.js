import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, SafeAreaView, Alert, TouchableOpacity, Platform, ToastAndroid} from 'react-native';
import CustomAppBar from '../../component/CustomAppBar';
import {styles} from './NotificationStyles';
import {RFValue} from 'react-native-responsive-fontsize';
import {clearNotification, getAllNotification} from '../../networkClient/apifunction';
import moment from 'moment';
import {Languages} from '../../common';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GlobalStyles from '../../core/GlobalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';

const NotificationScreen = props => {
  const [data, setData] = useState([]);
  useEffect(() => {
    crashlytics().log('Notification mounted');
    return () => {
      crashlytics().log('Notification unmounted');
    };
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await getAllNotification()
      .then(function (response) {
        if (response.data.status == 200) {
          setData(response.data.data);
          setCount(response.data.data.length)
        } else {
          Alert.alert(Languages.Alert, response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.response.data.message);
      });
  };
const setCount=async(count)=>{
  await AsyncStorage.setItem("prevCount",count.toString())
}
  const EmptyListMessage = ({item}) => {
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

  function notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      Alert.alert(msg);
    }
  }
  const handleClose=async(notifyId)=>{
    await clearNotification(notifyId)
    .then(function (response) {
      if (response.data.statusCode === 200) {
        notifyMessage("Notification removed successfully")
       getData()
      } else {
        Alert.alert(Languages.Alert, response.data.statusMessage);
      }
    })
    .catch(function (error) {
      Alert.alert(Languages.Alert, error.response.data.message);
    });
  }
  const showAlert = () => {
    Alert.alert(
      "Alert",
      "Are you sure you want clear all notification?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            clearAllNotify()
          }
        }
      ]
    );
  };
  const clearAllNotify=async()=>{
    var id=[];
    for(i=0;i<data.length;i++){
     id.push(data[i].id)
    }
    handleClose(id);
  }
  return (
    <SafeAreaView style={styles.parentContainer}>
      <View style={styles.container}>
        <CustomAppBar
          title={Languages.Notifications}
          showImage={true}
          navigation={props.navigation}
        />
         <View style={{height: 10}} />
       {
        data.length!=0 &&(
          <TouchableOpacity onPress={showAlert}>
       <Text style={{color:GlobalStyles.colorSet.decline_color,fontSize:14,textAlign:'right',margin:10}}>
          Clear All
        </Text>
       </TouchableOpacity>
        )
       }
        <View style={{flex:1}} >
          <FlatList
          style={{flex:1}}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            data={data}
            ListEmptyComponent={EmptyListMessage}
            renderItem={({item, index}) => (
              <View style={{backgroundColor: 'white', padding: 10, margin: 5}}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text style={styles.titleText}>
                    {item.title ? item.title : '--'}
                  </Text>
                 <TouchableOpacity onPress={()=>{handleClose([item.id])}}>
                 <Icon name="close" size={20} color={GlobalStyles.colorSet.Grey} />
                 </TouchableOpacity>
                </View>
                <Text style={styles.messageText}>{item.message}</Text>
                <Text style={styles.timeText}>
                  {`${moment(item.date).format('MMMM-DD')}`}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;
