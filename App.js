import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useReducer, useMemo,useState} from 'react';
import SplashScreen from './App/screen/Splash/SplashScreen';
import {AuthContext} from './App/core/AuthContext';
import {setData} from './App/utils/DeviceStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, View,Text, Image,ToastAndroid} from 'react-native';
import {verifyOtp, getDetails } from './App/networkClient/apifunction';
import DeviceInfo from 'react-native-device-info';
import { setConnectivityListener } from './App/utils/NetworkService';
import GlobalStyles from './App/core/GlobalStyles';
import {requestUserPermission,} from './App/utils/PushNotification';
import {parseJwt} from './App/utils/JWTDecode'
import AppNavigator from './App/Navigation/AppNavigator';
import { setAuthContext } from './App/networkClient/api';
import { Images } from './App/common';
// import './App/ReactotronConfig';  // Make sure this is imported at the top

const App = props => { 
  const[isConnected,setisConnected]=useState(true)
  const[deviceId,setdeviceId]=useState();
  const [Fcmtoken, setFcmtoken] = useState("");
  const Stack = createNativeStackNavigator();
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    enable: false,
  };

  function notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      Alert.alert(msg);
    }
  }
  const getById=async(id,isFirstLogin,phoneNo,accessToken)=>{
    var response=await getDetails(id);
      if(isFirstLogin){
        dispatch({
          type: 'LOGIN',
          id: phoneNo,
          token:accessToken,
          enable:response.data.data.detailsSaved!=null?response.data.data.detailsSaved:false
        });
      }else{
        dispatch({type: 'RETRIEVE_TOKEN', token: accessToken,enable:response.data.data.detailsSaved!=null?response.data.data.detailsSaved:false});
      }
   }
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          enable:action.enable,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
          enable: action.enable,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
          enable: false,
        };
    }
  };
  const authContext = useMemo(
    () => ({
      signIn: async (phoneNo, Otp) => {
        const  fcmtoken=await AsyncStorage.getItem('fcmToken')
        return new Promise((resolve, reject) => { // Return a promise
          let uniqueDevId = DeviceInfo.getUniqueId()?._j;
          if (phoneNo !== '' && Otp !== '') {
            verifyOtp(phoneNo, Otp,uniqueDevId,fcmtoken)
              .then((response) => {
                if (response.data.statusCode === 200) {
                  setData('accessToken', response.data.data.accessToken);
                  setData('refreshToken', response.data.data.refreshToken);
                  let decode = parseJwt(response.data.data.accessToken);
                  //let decode = jwtDecode(response.data.data.accessToken);
                  let userId = decode.payload.id;
                  getById(userId, true, phoneNo, response.data.data.accessToken);
                  let id = userId.toString();
                  let roleName = decode.payload.roleName;
                  setData('userId', id);
                  setData('roleName', roleName);
                  notifyMessage("Login Successfully Completed")
                  resolve(); // Resolve the promise on successful verification
                } else {
                  reject(new Error(response.data.data.statusMessage)); // Reject the promise with error message
                }
              })
              .catch((error) => {
                reject(new Error(error.message)); // Reject the promise with error message
              });
          } else {
            reject(new Error('Please fill all the fields')); // Reject if fields are not filled
          }
        });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('accessToken');
        } catch (e) {
        }
        dispatch({ type: 'LOGOUT' });
      },
    }),
    [],
  );
  

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);
  useEffect(() => {
    setAuthContext(authContext)
    requestUserPermission();
    //NotificationServices();
    //configure();
    getFcmToken()
  }, [])
  const getFcmToken=async()=>{
    const  fcmtoken=await AsyncStorage.getItem('fcmToken')
    if(fcmtoken){
      setFcmtoken(fcmtoken)
    }
  }
const getDeviceInfo=async()=>{
  let uniqueId = await DeviceInfo.getUniqueId();
  setdeviceId(uniqueId)
}

  useEffect(() => {
    getDeviceInfo();
    setTimeout(async () => {
      let userToken;
      userToken = null;
     
        userToken = await AsyncStorage.getItem('accessToken');
        if(userToken!=null){
          let decode = parseJwt(userToken);
          //let decode = jwtDecode(userToken);
          let userId = decode.payload.id;
          getById(userId,false,"",userToken)
        }else{
          dispatch({type: 'RETRIEVE_TOKEN', token: userToken,enable:false});
        }

     
    }, 3000);
  }, []);
  useEffect(() => {
    const unsubscribe = setConnectivityListener((isConnected) => {
      // You can dispatch an action, update context, or do anything with `isConnected` here
      setisConnected(isConnected);
    });

    // return () => {
    //   unsubscribe();
    // };
  }, []);
  if (loginState.isLoading) {
    return <SplashScreen />
    // ) : (
    //   <View
    //     style={{
    //       backgroundColor: GlobalStyles.colorSet.white,
    //       flex: 1,
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //     }}>
    //     <Image
    //       source={require('./App/assets/noInternet.png')}
    //       resizeMode={'contain'}
    //       style={{
    //         width: '70%',
    //         height: '15%',
    //       }}
    //     />
    //     <Text
    //       style={{
    //         color: GlobalStyles.colorSet.Grey,
    //         fontSize: 16,
    //         marginBottom: 7,
    //         fontWeight: 'bold',
    //         textAlign: 'center',
    //       }}>
    //       Please check your internet connection
    //     </Text>
    //   </View>
    // );
  }
  if (!isConnected) {
    return (
      <View
        style={{
          backgroundColor: GlobalStyles.colorSet.white,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={Images.NoInternet}
          resizeMode={'contain'}
          style={{
            width: '70%',
            height: '15%',
          }}
        />
        <Text
          style={{
            color: GlobalStyles.colorSet.Grey,
            fontSize: 16,
            marginBottom: 7,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Please check your internet connection
        </Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
       <AppNavigator loginState={loginState}/>
      </NavigationContainer> 
    </AuthContext.Provider>
  );
};
export default App;
