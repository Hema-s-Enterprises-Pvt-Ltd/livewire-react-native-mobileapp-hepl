import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Linking,
  Platform,
} from 'react-native';
import {styles} from './LoginStyles';
import GlobalStyles from '../../core/GlobalStyles';
import CustomButton from '../../component/CustomButton';
import OTPTextView from 'react-native-otp-textinput';
import {
  getAppVersion,
  resendOtp,
  saveAppDownloads,
  sendOtp,
} from '../../networkClient/apifunction';
import {AuthContext} from '../../core/AuthContext';
import DeviceInfo from 'react-native-device-info';
import {Images, Languages} from '../../common';
import {useForm} from 'react-hook-form';
import CustomInput from '../../component/CustomInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';

const LoginScreen = props => {
  const [otp, setOtp] = useState('');
  const [buttonText, setButtonText] = useState(Languages.SendOTP);
  const [registerButton, setRegisterButton] = useState(Languages.Register);

  const [showOtp, setShowOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [deviceId, setdeviceId] = useState();
  const {signIn} = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const {
    handleSubmit: handleSubmitForm,
    register,
    formState: {errors, isValid},
    control,
    getValues,
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      mobileNo: '',
    },
  });

  useEffect(() => {
    crashlytics().log('LoginScreen mounted');
    getApplicationVersion();
    return () => {
      crashlytics().log('LoginScreen unmounted');
    };
  }, []);

  useEffect(() => {
    getDeviceInfo();
    let timer;
    if (showOtp) {
      setIsResendEnabled(false);
      timer = setTimeout(() => {
        setIsResendEnabled(true);
      }, 120000);
    }
    return () => clearTimeout(timer);
  }, [showOtp]);
  useEffect(()=>{
    getApplicationVersion()
    },[])
    const getApplicationVersion=async()=>{
      await getAppVersion()
      .then(function (response) {
        if (response.data.statusCode === 200) {
        checkVersion(response)
        }
      })
      .catch(function (error) {
       
      });
    }
    const checkVersion=async(response)=>{
      let currentVersion = DeviceInfo.getVersion();
      var mosaic = response.data.data.mosaic;
       var store = response.data.data.store;
       const latestVersion =
         Platform.OS === 'ios' ? store.iosVersion : store.androidVersion;
         var loginUser=await AsyncStorage.getItem('isLogoutUser');
         if (parseFloat(latestVersion) === parseFloat(currentVersion)) {
           if(loginUser!=="true"){
            saveApp(currentVersion)
           }
         }else if (parseFloat(latestVersion) > parseFloat(currentVersion)) {
         showAlert(response.data.data,currentVersion,latestVersion);
       }
    }
    const showAlert = (data, version, latestVersion) => {
      const appLink =
        Platform.OS === 'ios'
          ? data.store.iosAppLink
          : data.store.androidAppLink;
  //     const appLink = 'market://details?id=com.citpl.raaga';
  // const fallbackUrl = 'https://play.google.com/store/apps/details?id=com.citpl.raaga';
        //const appLink = 'market://details?id=com.citpl.raaga';
      //  const fallbackUrl = 'https://play.google.com/store/apps/details?id=com.citpl.raaga';
      Alert.alert(
        data.title,
        data.description,
        [
          {
            text: 'Update Now',
            onPress: async () => {
              try {
                const supported = await Linking.canOpenURL(appLink);
                if (supported) {
                  await Linking.openURL(appLink)
                    .then(async () => {
                      await getAppVersion()
                        .then(function (response) {
                          if (response.data.statusCode === 200) {
                            let currentVersion = DeviceInfo.getVersion();
                            var mosaic = response.data.data.mosaic;
                            var store = response.data.data.store;
                            const latestVersion =
                              Platform.OS === 'ios'
                                ? store.iosVersion
                                : store.androidVersion;

                            if (
                              parseFloat(latestVersion) ===
                              parseFloat(currentVersion)
                            ) {
                              saveApp(currentVersion);
                            }
                          }
                        })
                        .catch(function (error) {});
                    })
                    .catch(err =>
                      Alert.alert('Failed to open URL', err.message),
                    );
                } else {
                  
                  // await Linking.openURL(fallbackUrl);
                  
                  Alert.alert('App not installed', `Cannot open URL: ${appLink}`);
                }
              } catch (error) {
                console.error('An error occurred', error);
                Alert.alert('Error', `An error occurred while trying to open the app: ${error.message || 'Unknown error'}`);
              }
            },
          },
        ],
        {
          cancelable: !data.store.mandatoryUpdate,
        },
      );
    };

    const saveApp = async version => {
      const body = {
        appName: 'LiveWire',
        deviceId: 'string',
        emailId: 'string',
        isStoreEnable: false,
        source: 'store', //store
        liveAndroidVersion: version, //current version
        liveIOSVersion: version, //current version
      };
      await saveAppDownloads(body)
        .then(function (response) {})
        .catch(function (error) {});
    };
    const getDeviceInfo = async () => {
      let uniqueId = await DeviceInfo.getUniqueId();
      setdeviceId(uniqueId);
    };

    function notifyMessage(msg) {
      if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      } else {
        Alert.alert(msg);
      }
    }

    const handleClick = () => {
      setLoading(true);
      Keyboard.dismiss();
      const formValues = getValues();

      if (buttonText === Languages.SendOTP) {
        sendOtp(formValues?.mobileNo, deviceId)
          .then(response => {
            if (response.data.statusCode === 200) {
              setButtonText(Languages.VerifyOTP);
              setShowOtp(true);
              setLoading(false);
              notifyMessage(Languages.OTPSentSuccess);
            } else {
              Alert.alert('Alert', response.data.statusMessage);
              setLoading(false);
            }
          })
          .catch(error => {
            setLoading(false);
           // Alert.alert('Alert', error.response.data.message);
            reset();
          });
      } else if (buttonText === Languages.VerifyOTP) {
        setErrorMessage('');
        signIn(formValues?.mobileNo, otp)
          .then(data => {
            setLoading(false);
          })
          .catch(error => {
            setErrorMessage(Languages.InvalidOTP);
            setLoading(false);
          });
      }
    };

    const ResendOtp = () => {
      setErrorMessage('');
      const formValues = getValues();
      if (!isResendEnabled) return;
      resendOtp(formValues.mobileNo, deviceId)
        .then(response => {
          if (response.data.statusCode === 200) {
            notifyMessage(Languages.OTPSentSuccess);
            setIsResendEnabled(false);
            setTimeout(() => {
              setIsResendEnabled(true);
            }, 120000);
          } else {
            Alert.alert('Alert', response.data.statusMessage);
          }
        })
        .catch(error => {
       //   Alert.alert('Alert', error.response.data.message);
        });
    };

  return (
    <SafeAreaView
      style={{backgroundColor: GlobalStyles.colorSet.app_bg, flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 62 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={{height: 420}}>
              <Image source={Images.Login} style={styles.imageStyle} />
            </View>
            <View style={{paddingHorizontal: 15, flex: 1}}>
              <Text style={styles.header}>{Languages.Login}</Text>
              <Text style={styles.subHeader}>
                {Languages.EnterMobiOTPToVerify}
              </Text>

              {/* Disable input when Register Button is clicked */}
              <CustomInput
                title="Mobile Number"
                name="mobileNo"
                control={control}
                placeholder=""
                keyboardType="numeric"
                maxLength={10}
                isEditable={buttonText !== Languages.Register} // Disable for Register Button
                rules={{
                  required: 'Please Enter the Mobile Number',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Mobile is not valid',
                  },
                }}
              />

              {showOtp && (
                <View style={{flexDirection: 'column', paddingBottom: 10}}>
                  <Text style={styles.textinput_txt}>{Languages.OTP}</Text>
                  <OTPTextView
                    tintColor={
                      errorMessage !== '' ? 'red' : GlobalStyles.colorSet.orange
                    }
                    offTintColor={errorMessage !== '' ? 'red' : '#DCDCDC'}
                    containerStyle={styles.otpContainer}
                    textInputStyle={styles.otpTxtStyle}
                    inputCount={6}
                    handleTextChange={text => {
                      setErrorMessage('');
                      if (text.length === 6) {
                        setOtp(text);
                      } else {
                       
                        setOtp(text);
                      }
                    }}
                    keyboardType="numeric"
                    autoFocus={true}
                    defaultValue={otp}
                  />

                  {errorMessage ? (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                  ) : null}
                </View>
              )}
            </View>

            <View style={{flex: 0.3}}>
              <View style={styles.bottom}>
                {showOtp && (
                  <View style={styles.otpView}>
                    <Text
                      style={[
                        styles.ResendText,
                        {color: GlobalStyles.colorSet.Grey},
                      ]}>
                      {Languages.DontReceiveOTP}
                    </Text>
                    <TouchableOpacity
                      onPress={ResendOtp}
                      disabled={!isResendEnabled}>
                      <Text
                        style={[
                          styles.ResendText,
                          {
                            color: isResendEnabled ? 'green' : 'grey',
                            marginLeft: 5,
                          },
                        ]}>
                        {Languages.Resend}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <CustomButton
                  onPress={handleClick}
                  loading={isLoading}
                  text={buttonText}
                  disabled={
                    buttonText === Languages.SendOTP
                      ? !isValid
                      : otp.length !== 6
                  }
                />
                <Text style={{textAlign: 'center'}}>OR</Text>
                <CustomButton
                  onPress={() => {
                    props.navigation.navigate('RegisterScreen');
                  }}
                  text={registerButton}
                  disabled={isValid}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
