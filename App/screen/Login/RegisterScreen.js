import React, { useState, useContext,useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomInput from '../../component/CustomInput';
import CustomDropdown from '../../component/CustomDropdown';
import { useForm } from 'react-hook-form';
import { Languages } from '../../common';
import { useNavigation } from '@react-navigation/native';
import { getRegister } from '../../networkClient/apifunction';
import CustomButton from '../../component/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import crashlytics from '@react-native-firebase/crashlytics';

const RegisterScreen = (props) => {

    useEffect(() => {
        crashlytics().log('RegisterScreen mounted');
        return () => {
          crashlytics().log('RegisterScreen unmounted');
        };
      }, []);

    const navigation = useNavigation(); 
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); 
    const [isLoading, setLoading] = useState(false);

    const {
        handleSubmit: handleSubmit,
        formState: {errors, isValid},
        control,
        getValues,
        reset
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            id:'',
            name:'',
            userType: '',
            emailId: '',
            mobileNo: '',
            address:'',
            active:''
        },
    });

    const userData = [
        { label: 'Trainer', value: 'Trainer' },
        { label: 'SalesMan', value: 'SalesMan' },
    ];

    const handleCancel = () => {
        navigation.navigate('LoginScreen'); 
    };

    const onSubmit = () => {
        setLoading(true);
    const getRegisterDetialData = getValues();
    
    const data = {
        id:0,
        name:getRegisterDetialData.name,
        userType: getRegisterDetialData.userType,
        emailId:getRegisterDetialData.emailId,
        mobileNo: getRegisterDetialData.mobileNo,
        address:getRegisterDetialData.address,
        active: true
    }
    if (isValid) {
        getRegister(data)
          .then(function (response) {
            
            if (response.data.statusCode == 200) {
              setLoading(false);
              reset();
              setShowSuccessPopup(true);
              setTimeout(() => {
                props.navigation.navigate('LoginScreen' );
                setShowSuccessPopup(false)
              }, 3000);
             
            } else {
              Alert.alert(Languages.Alert, response.data.statusMessage);
              setLoading(false);
            }
          })
          .catch(function (error) {
            Alert.alert(Languages.Alert, error.response.data.message);
            setLoading(false);
          });
      } else {
        Alert.alert(Languages.Please_fill_all_the_mandatory_fields);
        setLoading(false);
      }
    
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 62 : 0}>
                 <ScrollView>
            <View style={{flex:1, height: 'auto', marginTop: 20, marginHorizontal: 10}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>Register</Text>
                    <TouchableOpacity onPress={handleCancel}>
                        <Icon name="close" size={20} color="#212B36" />
                    </TouchableOpacity>
                </View>
                <View style={{}}>
                    <View style={{ height: 20 }} />
                    <CustomDropdown
                        title={Languages.User_Type}
                        name="userType"
                        control={control}
                        placeholder={Languages.Select_UserType}
                        data={userData}
                        rules={{ required: Languages.Select_UserRule }}
                        valueFields="value"
                        labelFields="label"
                    />
                     <View style={{ height: 20 }} />
                    <CustomInput
                        title={Languages.Name}
                        name="name"
                        control={control}
                        placeholder={Languages.Enter_Name}
                        keyboardType="default"
                        maxLength={500}
                        rules={{ required: Languages.Name_is_required }}
                    />
                    <View style={{ height: 20 }} />
                    <CustomInput
                      title={Languages.Email}
                      name="emailId"
                      control={control}
                      placeholder={Languages.EmailID}
                      keyboardType="email-address" // Set appropriate keyboard type for email
                      maxLength={500}
                      rules={{
                          required: Languages.Email_Required, // Required validation message
                          pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: Languages.Invalid_email // Custom error message for invalid email
                          }
                      }}
                  />

                    <View style={{ height: 20 }} />
                    <CustomInput
                        title={Languages.Mobile_Number}
                        name="mobileNo"
                        control={control}
                        placeholder={Languages.Enter_Mobile_Number}
                        keyboardType="numeric"
                        maxLength={10}
                        rules={{
                            required: Languages.Mobile_No_is_required,
                            pattern: {
                                value: /^[6-9]\d{9}$/,
                                message: Languages.Invalid_Mobile_No
                            }
                        }}
                    />
                   
                </View>
                <View style={{ height: 20 }} />
                <View style={{ flexDirection: 'column-reverse',alignContent:'center', justifyContent: 'center', alignItems: 'center',rowGap:10,paddingVertical:20}}>
                    <View style={styles.cancelButtonContainer}>
                        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.addButtonContainer}>
                        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                            <Text style={styles.addButtonText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Success Popup */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={showSuccessPopup}
                onRequestClose={() => setShowSuccessPopup(false)}
            >
                <View style={styles.popupContainer}>
                    <View style={styles.popup}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={styles.popupText}>Registration successful! </Text>
                        <Ionicons name={'checkmark-circle'} size={25} color={'#00e600'} />
                        </View>
                        
                        <Text style={{textAlign:'center',padding:10}}>You can log in once admin approval is complete</Text>
                    </View>
                </View>
            </Modal>
        </ScrollView>
        </KeyboardAvoidingView>
       
    );
};

const styles = StyleSheet.create({
    cancelButtonContainer: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: '#E6F2E6',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E6F2E6',
        width:'100%'
    },
    cancelButton: {
        width: '100%',
        textAlign: 'center',
    },
    cancelButtonText: {
        color: '#F78104',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical:5
    },
    addButtonContainer: {
        textAlign: 'center',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: '#F78104',
        borderColor: '#F78104',
        marginVertical: 10,
        marginHorizontal: 10,
        width:'100%'
    },
    addButton: {
        width: '100%',
        textAlign: 'center',
        
    },
    addButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
        paddingVertical:5
    },
    popupContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popup: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    popupText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign:'center',
        color: '#000000',
    }
});

export default RegisterScreen;
