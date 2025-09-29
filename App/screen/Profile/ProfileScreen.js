import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import CustomAppBar from '../../component/CustomAppBar';
import {styles} from './ProfileStyles';
import CardView from './component/CardView';
import DetailPopUp from './component/DetailPopUp';
import LogoutPopup from './component/LogoutPopup';
import GlobalStyles from '../../core/GlobalStyles'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDetails, logoutScreen} from '../../networkClient/apifunction';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../core/AuthContext';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import { Images, Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const ProfileScreen = props => {
  const { signOut } = React.useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [userName, setUserName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [profileUri, setprofileUri] = useState('');
  const [detailData, setdetailData] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('profileScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('profileScreen unmounted');
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getDeviceInfo();
      getUserDetail();
    }, []),
  );

  const getDeviceInfo = async () => {
    try {
      const uniqueId = await DeviceInfo.getUniqueId();
      setDeviceId(uniqueId);
    } catch (error) {

    }
  };

  const getUserDetail = async () => {
    const id = await AsyncStorage.getItem('userId');
    var Id = parseInt(id, 10);
    try {
      const response = await getDetails(Id);
      if (response.data.statusCode === 200) {
        setUserName(response.data.data.firstName);
        setRoleName(response.data.data.role.name);
        setprofileUri(response.data.data.profileUrl);
        setdetailData(response.data.data);
        setLoading(false)
      } else {
        Alert.alert(Languages.Alert, response.data.data);
      }
    } catch (error) {
      Alert.alert(Languages.Alert, error.message);
    }
  };
  const closeLogoutPopup = () => {
    setShowLogoutPopup(false)
  }

  const logoutHandle = async() => {
    try {
      await closeLogoutPopup()
      const response = await logoutScreen(deviceId);
      if (response.data.statusCode === 200) {
        await AsyncStorage.setItem('isLogoutUser',"true");
        signOut();
      } else {
        Alert.alert(Languages.Alert, response.data.statusMessage);
      }
    } catch (error) {
      Alert.alert(Languages.Alert, error.response.data.message );
    }
  }

  const onLogoutPress = async () => {
    await closeLogoutPopup()
    if(Platform.OS == "ios") {
      setTimeout(()=>{
        logoutHandle();
      }, 2000)
    }else{
      logoutHandle();
    }
  };
  if (loading) {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large" color={GlobalStyles.colorSet.orange} />
      </View>
    );
  }
  return (
    <SafeAreaView style={{backgroundColor: GlobalStyles.colorSet.app_bg, flex: 1}}>
      <View>
        <Modal
          animationType="slide"
          isVisible={showLogoutPopup}
          swipeDirection={['down', 'left', 'right', 'up']}
          onSwipeComplete={closeLogoutPopup}
          propagateSwipe={true}
          onBackdropPress={closeLogoutPopup}
        >
          <View style={styles.modalContent}>
            <Text style={styles.title}>{Languages.Do_you_want_to_Logout}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={closeLogoutPopup} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>{Languages.Cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onLogoutPress} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>{Languages.Logout}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <View style={{padding: 10}}>
        <View style={{height: 10}} />
        <CustomAppBar title={Languages.My_Profile} showImage={false} navigation={props.navigation}/>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: '15%'}}>
            {
              profileUri?
              <Image
              source={{uri: profileUri}}
              style={{
                width: 40,
                height: 40,
                resizeMode: 'stretch',
                marginLeft: 10,
                margin: 20,
                borderRadius: 100,
              }}
            />
            :
            <Image
              source={Images.Person}
              style={{
                width: 40,
                height: 40,
                resizeMode: 'stretch',
                marginLeft: 10,
                margin: 20,
                borderRadius: 100,
              }}
            />
            }
          </View>
          <View style={{flexDirection: 'column', width: '70%'}}>
            <Text style={{fontSize: 16}}>{userName}</Text>
            <Text>{roleName}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setShowLogoutPopup(true);
            }}
            style={{width: '10%'}}>
            <Image
              source={Images.Logout}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                marginLeft: '65%',
                margin: 20,
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.borderLine} />
        <View style={{height: 20}} />
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}>
          <CardView
            isProfile={false}
            startImage={Images.Person}
            name="My Details"
            jobDescription=""
            endImage={Images.RightArrow}
            hideDescription={true}
          />
        </TouchableOpacity>
        <View style={{height: 20}} />
        {
          roleName != "ASM"&&roleName != "RSM"&&(
            roleName != 'Salesman' ? (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('DemoHistory');
                  }}>
                  <CardView
                    isProfile={false}
                    startImage={Images.DemoClock}
                    name="Demo History"
                    jobDescription=""
                    endImage={Images.RightArrow}
                    hideDescription={true}
                  />
                </TouchableOpacity>
                <View style={{height: 20}} />
                <TouchableOpacity
                  onPress={() => {
                    if (roleName != 'Salesman') {
                      props.navigation.navigate('TrainerSettingScreen');
                    } else {
                      props.navigation.navigate('SalesManSettingScreen');
                    }
                  }}>
                  <CardView
                    isProfile={false}
                    startImage={Images.Setting}
                    name={Languages.Settings}
                    jobDescription=""
                    endImage={Images.RightArrow}
                    hideDescription={true}
                  />
                </TouchableOpacity>
                <View style={{height: 20}} />
        <TouchableOpacity
          onPress={() => props.navigation.navigate("InviteHistoryScreen")}>
          <CardView
            isProfile={false}
            startImage={Images.DemoClock}
            name={Languages.Invite_History}
            jobDescription=""
            endImage={Images.RightArrow}
            hideDescription={true}
          />
        </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    if (roleName != 'Salesman') {
                      props.navigation.navigate('TrainerSettingScreen');
                    } else {
                      props.navigation.navigate('SalesManSettingScreen');
                    }
                  }}>
                  <CardView
                    isProfile={false}
                    startImage={Images.Setting}
                    name={Languages.Settings}
                    jobDescription=""
                    endImage={Images.RightArrow}
                    hideDescription={true}
                  />
                </TouchableOpacity>
                <View style={{height: 20}} />
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('DemoHistory');
                  }}>
                  <CardView
                    isProfile={false}
                    startImage={Images.DemoClock}
                    name={Languages.Demo_History}
                    jobDescription=""
                    endImage={Images.RightArrow}
                    hideDescription={true}
                  />
                </TouchableOpacity>
                <View style={{height: 20}} />
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('ProfileSalesHistory');
                  }}>
                  <CardView
                    isProfile={false}
                    startImage={Images.BoxTime}
                    name={Languages.Sales_History}
                    jobDescription=""
                    endImage={Images.RightArrow}
                    hideDescription={true}
                  />
                </TouchableOpacity>
                <View style={{height: 20}} />
        <TouchableOpacity
          onPress={() => props.navigation.navigate("InviteHistoryScreen")}>
          <CardView
            isProfile={false}
            startImage={Images.DemoClock}
            name={Languages.Invite_History}
            jobDescription=""
            endImage={Images.RightArrow}
            hideDescription={true}
          />
        </TouchableOpacity>
              </View>
            )
          )
        }
       {
        roleName==="ASM"&&(
          <View>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('SalesManSettingScreen');
                  }}>
                  <CardView
                    isProfile={false}
                    startImage={Images.Setting}
                    name={Languages.Settings}
                    jobDescription=""
                    endImage={Images.RightArrow}
                    hideDescription={true}
                  />
                </TouchableOpacity>
             <View style={{height: 20}} />
        <TouchableOpacity
          onPress={() => props.navigation.navigate("TeamsScreen",{role:roleName})}>
          <CardView
            isProfile={false}
            startImage={Images.PeopleNew}
            name={Languages.Teams}
            jobDescription=""
            endImage={Images.RightArrow}
            hideDescription={true}
          />
        </TouchableOpacity>
            </View>
        )
       }
        {
        roleName==="RSM"&&(
          <View>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('SalesManSettingScreen');
                  }}>
                  <CardView
                    isProfile={false}
                    startImage={Images.Setting}
                    name={Languages.Settings}
                    jobDescription=""
                    endImage={Images.RightArrow}
                    hideDescription={true}
                  />
                </TouchableOpacity>
             <View style={{height: 20}} />
        <TouchableOpacity
          onPress={() => props.navigation.navigate("TeamsScreen",{role:roleName})}>
          <CardView
            isProfile={false}
            startImage={Images.PeopleNew}
            name={Languages.Teams}
            jobDescription=""
            endImage={Images.RightArrow}
            hideDescription={true}
          />
        </TouchableOpacity>
            </View>
        )
       }
       <View style={{height:20}}/>
       <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('ReportMainScreen',{role:roleName});
                  }}>
                  <CardView
                    isProfile={false}
                    startImage={Images.Note}
                    name={Languages.Reports}
                    jobDescription=""
                    endImage={Images.RightArrow}
                    hideDescription={true}
                  />
                </TouchableOpacity>
      </View>
      {/* <LogoutPopup
        visible={showLogoutPopup}
        onClose={closeLogoutPopup}
        logout={onLogout}
        props={props}
      /> */}

       
      <DetailPopUp
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        props={props}
        editClicked={() => {
          setModalVisible(false);
          props.navigation.navigate('EditBasicDetails',{isFirstLogin:false});
        }}
        data={detailData}
        roleName={roleName}
      />
    </SafeAreaView>
  );
};
export default ProfileScreen;
