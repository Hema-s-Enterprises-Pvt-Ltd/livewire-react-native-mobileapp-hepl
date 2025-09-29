import React, { useEffect,useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
//import { AuthContext } from '../../../core/AuthContext';
import { RFValue } from 'react-native-responsive-fontsize';
import { logoutScreen } from '../../../networkClient/apifunction';
import DeviceInfo from 'react-native-device-info';
import { Languages } from '../../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const LogoutPopup = ({ visible, onClose, logout }) => {
  //const { signOut } = React.useContext(AuthContext);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('LogoutPopup mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('LogoutPopup unmounted');
    };
  }, []);
  useEffect(() => {
    getDeviceInfo();
  }, []);
  const getDeviceInfo = async () => {
    try {
      const uniqueId = await DeviceInfo.getUniqueId();
      setDeviceId(uniqueId);
    } catch (error) {

    }
  };
  const handleLogout = async () => {
    try {
      await onClose()
      const response = await logoutScreen(deviceId);
      if (response.data.statusCode === 200) {
        logout()
      } else {
        Alert.alert(Languages.Alert, response.data.statusMessage);
      }
    } catch (error) {

      Alert.alert(Languages.Alert, error.response.data.message );
    }
  };
  
  return (
    <View>
    <Modal
      animationType="slide"
      isVisible={visible}
      swipeDirection={['down', 'left', 'right', 'up']}
      onSwipeComplete={onClose}
      propagateSwipe={true}
      onBackdropPress={onClose}
    >
      <View style={styles.modalContent}>
        <Text style={styles.title}>{Languages.Do_you_want_to_Logout}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>{Languages.Cancel}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>{Languages.Logout}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding:10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius:10 
  },
  title: {
    fontWeight: '500',
    fontSize: RFValue(14),
    textAlign: 'center',
    color: '#000',
    marginBottom:' 10%',
    marginTop:10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    width:"100%"
  },
  cancelButton: {
    width:"45%"
    // marginLeft: '20%',
    // marginStart:'50%'
  },
  cancelButtonText: {
    color: '#F78104',
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
    marginLeft:'40%',
    marginRight:'auto',
    textAlign:'center',
    fontSize: RFValue(16)
  },
  logoutButton: {
    backgroundColor: '#F78104',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    width:"45%"
  },
  logoutButtonText: {
    color: '#FFFFFF',
    textAlign:'center',
    fontSize:RFValue(16),
    marginLeft:10
  },
});

export default LogoutPopup;
