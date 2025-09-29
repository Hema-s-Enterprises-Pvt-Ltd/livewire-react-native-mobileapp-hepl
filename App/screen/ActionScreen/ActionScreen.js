import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {styles} from './ActionStyles';
import GlobalStyles from '../../core/GlobalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StepOneScreen from './StepOne';
import CustomButton from '../../component/CustomButton';
import StepTwoScreen from './StepTwo';
import StepThreeScreen from './StepThree';
import StepFourScreen from './StepFour';
import FeedbackPopUp from './component/FeedbackPopUp';
import LocationPopUp from './component/LocationPopUp';
import Geolocation from '@react-native-community/geolocation';
import {auditUpdate, demoGetbyId, getDetails, pollFeedback} from '../../networkClient/apifunction';
import ImageCropPicker from 'react-native-image-crop-picker';
import PicUploadModal from '../AddClient/component/PicUploadModal';
import TheoryPopUp from './component/TheoryPopUp';
import { useForm } from 'react-hook-form';
import { Images, Languages } from '../../common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import crashlytics from '@react-native-firebase/crashlytics';

const ActionScreen = props => {
  const DemoDetails = props.route.params.Details;
  const [location, setLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPosition, setcurrentPosition] = useState(0);
  const [buttonText, setbuttonText] = useState('Check In');
  const [stepTwoHeader, setstepTwoHeader] = useState('Grooming Check');
  const [stepTwoStepNo, setstepTwoStepNo] = useState(2);
  const [stepCount, setstepCount] = useState(0);
  const [stepThreeCount, setstepThreeCount] = useState();
  const [stepThreeHeader, setstepThreeHeader] = useState(Languages.Share_Feedback_Link);
  const [selectedValue, setSelectedValue] = useState('Yes');
  const [modalVisible, setModalVisible] = useState(false);
  const [theoryModalVisible, settheoryModalVisible] = useState(false);
  const [picUploadmodalVisible, setPicUploadModalVisible] = useState(false);
  const [locationmodalVisible, setLocationModalVisible] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [imageSelected, setImageSelected] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [givenService,setGivenService]=useState()
  const [additionalService,setAdditionalService]=useState()
  const [participants,setParticipants]=useState()
  const [serviceSelected,setServiceSelected]=useState()
  const [trainerLocation,setTrainerLocation]=useState('');
  const [isEditValue, setEditValue] = useState(true)
  const [image,setImage]=useState();
  const {
    handleSubmit,
    register,
    formState: {errors, isValid},
    control,
    setValue,
    getValues,
    reset,
  } = useForm({
    mode: 'onChange', // Enable validation on change
    defaultValues: {
      name: '',
      mobileNo: '',
      notes:'',
      products:'',
    },
  });
  const handleValueChange = (newValue) => {
    setGivenService(newValue)
  };
  const handleAdditionalValueChange = (newValue) => {
    setAdditionalService(newValue)
  };
  const handleAdditionalServiceSelected=(newValue)=>{
    setServiceSelected(newValue);
  }
  const handleParticipantValueChange = (newValue) => {
    setParticipants(newValue)
  };

  const labels = [
    'Check In',
    'Demo InProgress',
    'Feedback generation',
    'Check Out',
  ];
  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 1,
    currentStepStrokeWidth: 1,
    stepStrokeCurrentColor: '#b3e8fa',
    stepStrokeWidth: 1,
    stepStrokeFinishedColor: GlobalStyles.colorSet.blue,
    stepStrokeUnFinishedColor: '#b3e8fa',
    separatorFinishedColor: GlobalStyles.colorSet.blue,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#b3e8fa',
    stepIndicatorUnFinishedColor: '#b3e8fa',
    stepIndicatorCurrentColor: GlobalStyles.colorSet.blue,
    stepIndicatorLabelFontSize: 12,
    currentStepIndicatorLabelFontSize: 12,
    stepIndicatorLabelCurrentColor: GlobalStyles.colorSet.white,
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: GlobalStyles.colorSet.white,
    labelColor: '#000000',
    labelSize: 13,
    currentStepLabelColor: '#000000',
  };
  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('ActionScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('ActionScreen unmounted');
    };
  }, []);

  useEffect(() => {
    // Listener for when the keyboard is shown
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    // Listener for when the keyboard is hidden
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    // Cleanup listeners on component unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    Geolocation.setRNConfiguration({
      authorizationLevel: "whenInUse", // Request "always" location permission
      skipPermissionRequests: false, // Prompt for permission if not granted
    });
    requestLocationPermission();
    getStage();
  }, []);

  const getStage=()=>{
    var detail=props.route.params.Details;
    var demoAudit=detail.demoAudits;
    if(demoAudit.length>=1){
     for(let i=0;i<=demoAudit.length-1;i++){
      var nextStage=demoAudit[i].stage+1;
      if(nextStage===1){
       setcurrentPosition(0);
      }else if(nextStage===11){
              setcurrentPosition(2);
              setbuttonText(Languages.Share_Feedback_Link);
              setstepThreeCount(11)
              setstepCount(11)
              setstepThreeHeader(Languages.Feedback_Generation)
      
      }else if(nextStage===12){
        pollFeedback(DemoDetails.id)
        .then(function (response) {
          if (response.data.statusCode == 200) {
            if(response.data.data.feedbackCompleted){
              setcurrentPosition(3);
              setbuttonText(Languages.Check_Out);
              setstepCount(12)
            }else{
              setcurrentPosition(2);
              setbuttonText(Languages.Check_For_Response);
              setstepThreeCount(11)
              setstepCount(11)
              setstepThreeHeader(Languages.Feedback_Generation)
            }
          } else {
            Alert.alert(Languages.Alert, response.data.data.statusMessage);
          }
        })
        .catch(function (error) {
          // Alert.alert("Alert", error.data.message);
        });
      }else{
        setcurrentPosition(1);
        SetStepTwoHeader(nextStage);
        setstepTwoStepNo(nextStage)
        setstepCount(nextStage)
        if(nextStage===10){
          setbuttonText(Languages.Demo_Completed);
        }else{
          setbuttonText(Languages.Proceed);
        }
      }
     }
  }
  }

  const requestLocationPermission = async () => {
    if(Platform.OS == 'ios'){
      getLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: Languages.GeolocationPermission,
            message: Languages.AccessLocation,
            buttonNeutral: Languages.AskMeLater,
            buttonNegative: Languages.Cancel,
            buttonPositive: Languages.Ok,
          },
        );
        if (granted === Languages.Granted) {
          getLocation();
        } else {
          setError(Languages.PermissionDenied);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        setIsLoading(false);
        return;
      }
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setIsLoading(false);
      },
      error => {
        setLocation(false);
        setIsLoading(false);
      },
      {enableHighAccuracy: false, timeout: 1500000, maximumAge: 100000},
    );
  };

  const handleShowRequiredFieldsAlert = (header, title) => {
    Alert.alert(header, title ?? '', [{text: 'OK', onPress: () => setDisabled(false)}]);
  }

  const onPageChange = () => {
    setDisabled(true);
    try {
    switch (currentPosition) {
      case 0:
        setLocationModalVisible(true);
        break;
      case 1:
        if (stepTwoStepNo === 5) {
          StepTwoPostCall();
        }else if(stepTwoStepNo === 9){
          if(givenService){
            if(givenService.products.length===parseInt(givenService.productsCount,10)){
              if(serviceSelected){
                // Alert.alert('Additional Services should not be empty')
                if(additionalService){
                  if(additionalService.additionalProducts.length===parseInt(additionalService.additionalProductsCount,10)){
                    for (let i = 0; i < givenService.products.length; i++) {
                      if (givenService.products[i].qtyConsumed === 0 || givenService.products[i].name === '') {
                        handleShowRequiredFieldsAlert(Languages.Please_fill_all_the_products)
                        break;
                      } else {
                        for (let i = 0; i < additionalService.additionalProducts.length; i++) {
                          if (additionalService.additionalProducts[i].qtyConsumed === 0 || additionalService.additionalProducts[i].name === '') {
                            handleShowRequiredFieldsAlert(Languages.Please_fill_all_the_additional_products_details)
                            break;
                          } else {
                            StepNineApiCall();
                          }
                        }
                      }
                    }
                  }else{
                    handleShowRequiredFieldsAlert(Languages.Please_fill_all_the_additional_products_details)
                  }
                }else{
                  handleShowRequiredFieldsAlert(Languages.Add_additional_service_products)
                }
              }else{
                for (let i = 0; i < givenService.products.length; i++) {
                  if (givenService.products[i].qtyConsumed === 0 || givenService.products[i].name === '') {
                    handleShowRequiredFieldsAlert(Languages.Please_fill_all_the_products)
                    break;
                  } else {
                    StepNineApiCall();
                  }
                }
              }
           
            }else{
              handleShowRequiredFieldsAlert(Languages.Please_fill_all_the_products)
            }
          }else{
            handleShowRequiredFieldsAlert(Languages.Services_should_not_be_empty)
          }
         
        }else if(stepTwoStepNo === 10){
          if(participants){
            if(participants.participants.length===parseInt(participants.participantsCount,10)){
              const hasEmptyMobileNumber = participants.participants.some(participant => participant.mobileNumber === ""|| participant.mobileNumber === undefined);
              const hasEmptyRole = participants.participants.some(participant => participant.role === ""|| participant.role === undefined);
              const hasEmptyName = participants.participants.some(participant => participant.name === ""|| participant.name === undefined);
              if(hasEmptyName){
                handleShowRequiredFieldsAlert("Missing Name", "One or more participants have an empty name.",)
              } else if(hasEmptyRole){
                handleShowRequiredFieldsAlert("Missing Role", "One or more participants have an empty role.")
              } else if (hasEmptyMobileNumber) {
                handleShowRequiredFieldsAlert("Missing Mobile Number", "One or more participants have an empty mobile number.")
              } else {
                StepTenApiCall()
              }
            }else{
              handleShowRequiredFieldsAlert(Languages.Please_fill_all_the_participants)
            }
          }else{
            handleShowRequiredFieldsAlert(Languages.Please_select_participants)
          }
         
         } else {
          const notes=getValues().notes
          if (imageSelected.length != 0 && notes != '') {
            StepTwoPostCall();
          } else {
            handleShowRequiredFieldsAlert(Languages.Please_fill_all_the_fields)
          }     
        }
      default:
        if (buttonText == Languages.Share_Feedback_Link) {
          const name=getValues().name;
          const mobileNo=getValues().mobileNo  
          if (name !== '' && mobileNo !== ''&&name!==undefined&&mobileNo!==undefined) {
            StepElevenApiCall();
          } else {
            handleShowRequiredFieldsAlert(Languages.Please_fill_all_the_fields)
          }
        }
        if (buttonText == Languages.Check_For_Response) {
          checkFeedbackResponse()
        }
      
        if (buttonText === Languages.Check_Out) {
          const notes=getValues().notes
          if(notes===undefined||notes===""){
           handleShowRequiredFieldsAlert(Languages.Alert,Languages.Please_fill_notes)
          }else{
            setLocationModalVisible(true);
          }
        }
        break;
    }
    } catch(err) {
      setDisabled(false);
    }
  };
  const StepTenApiCall =async()=>{
    const data = {
      demoId: DemoDetails.id,
      stage: 10,
      latitude: latitude,
      longitude: longitude,
      clientId: DemoDetails.client.id,
    };
  
  const combinedObject = {...data, ...participants};
const formData = new FormData();
formData.append('data', JSON.stringify(combinedObject));
formData.append('images', []);
auditUpdate(formData)
  .then(function (response) {
    if (response.data.statusCode == 200) {
      setcurrentPosition(2);
      setbuttonText(Languages.Share_Feedback_Link);
      setstepThreeCount(11)
      setstepCount(11)
      setstepThreeHeader(Languages.Feedback_Generation)
      setDisabled(false);
    } else {
      handleShowRequiredFieldsAlert(Languages.Alert, response.data.data.statusMessage)
    }
  })
  .catch(function (error) {
  });
  }
  const StepNineApiCall =async()=>{
    const data = {
      demoId: DemoDetails.id,
      stage: 9,
      latitude: latitude,
      longitude: longitude,
      clientId: DemoDetails.client.id,
    };
  
  const combinedObject = {...data, ...givenService, ...additionalService };
  const newObj = { ...combinedObject, additionalServices: serviceSelected!=undefined?serviceSelected:[]};
const formData = new FormData();
formData.append('data', JSON.stringify(newObj));
formData.append('images', []);
auditUpdate(formData)
  .then(function (response) {
    if (response.data.statusCode == 200) {
      setbuttonText(Languages.Demo_Completed);
      setstepCount(10)
      setstepTwoStepNo(10);
      SetStepTwoHeader(10);
      setDisabled(false);
    } else {
      handleShowRequiredFieldsAlert(Languages.Alert, response.data.data.statusMessage)
    }
  })
  .catch(function (error) {
    setDisabled(false);
  });
  }
  const checkFeedbackResponse=async()=>{
    setDisabled(true);
    pollFeedback(DemoDetails.id)
    .then(function (response) {
      if (response.data.statusCode == 200) {
        if(response.data.data.feedbackCompleted){
        setModalVisible(true);
        setTimeout(() => {
          setcurrentPosition(3)
          setModalVisible(false);
          setcurrentPosition(3);
          setbuttonText(Languages.Check_Out);
          setstepCount(12)
              setDisabled(false);
        }, 2500);
        }else{
          handleShowRequiredFieldsAlert(Languages.Alert, Languages.Feedback_is_not_yet_completed)
        }
      } else {
          setDisabled(false);
          handleShowRequiredFieldsAlert(Languages.Alert, response.data.data.statusMessage)
      }
    })
    .catch(function (error) {
      setDisabled(false);
      // Alert.alert("Alert", error.data.message);
    });
  }
  const StepElevenApiCall = () => {
    const name=getValues().name;
    const mobileNo=getValues().mobileNo
    const data = {
      demoId: DemoDetails.id,
      stage: 11,
      latitude: latitude,
      longitude: longitude,
      clientId: DemoDetails.client.id,
      feedbackName: name,
      feedbackMobileNumber: mobileNo,
    };
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('images', []);
    auditUpdate(formData)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          handleShowRequiredFieldsAlert(Languages.Alert,Languages.Feedback_sent_successfully)
          setbuttonText(Languages.Check_For_Response);
          setEditValue(false)
          setDisabled(false);
        } else {
          handleShowRequiredFieldsAlert(Languages.Alert, response.data.data.statusMessage)
          setEditValue(true)
        }
      })
      .catch(function (error) {
        // Alert.alert(Languages.Alert, error.message);
        setDisabled(false);
        setEditValue(true)
      });
  };

  const StepTwoPostCall = () => {
    const length =imageSelected!=undefined? imageSelected.length:0;
    var list = [];
    if (length != 0) {
      for (let i = 0; i < length; i++) {
        var newObject = {
          type: 'image.png',
          uri: imageSelected[i],
        };
        list.push(newObject);
      }
    }
    let data = {};
    const notes=getValues().notes
    if (stepTwoStepNo != 5) {
      data = {
        demoId: DemoDetails.id,
        stage: stepTwoStepNo,
        notes: notes,
        latitude: latitude,
        longitude: longitude,
        clientId: DemoDetails.client.id,
      };
    } else {
      data = {
        demoId: DemoDetails.id,
        stage: stepTwoStepNo,
        notes: notes,
        latitude: latitude,
        longitude: longitude,
        clientId: DemoDetails.client.id,
        theoryExplained: true,
      };
    }
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    list.forEach((image, index) => {
      formData.append(`images-${index + 1}`, {
        name: `image.png`,
        type: `image/png`,
        uri: image.uri,
      });
    });
    auditUpdate(formData)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          var increase = stepTwoStepNo + 1;
          setstepTwoStepNo(increase);
          SetStepTwoHeader(increase);
          setImageSelected([]);
          // setNotes('');
          reset();
          setDisabled(false);
          // notesInput.clear();
        } else {
          handleShowRequiredFieldsAlert(Languages.Alert, response.data.data.statusMessage)
        }
      })
      .catch(function (error) {
        setDisabled(false);
      });
  };
  const SetStepTwoHeader = key => {
    if (key != 11) {
      setstepCount(key);
    }
    switch (key) {
      case 2:
        setstepTwoHeader(Languages.Grooming_Check);
        break;
      case 3:
        setstepTwoHeader(Languages.Product_Picture);
        break;
      case 4:
        setstepTwoHeader(Languages.Client_Place_Picture);
        break;
      case 5:
        setstepTwoHeader(Languages.Theory_explained);
        break;
      case 6:
        setstepTwoHeader(Languages.Before_Picture_of_Model);
        break;
      case 7:
        setstepTwoHeader(Languages.Steps_of_Procedure);
        break;
      case 8:
        setstepTwoHeader(Languages.After_Picture_of_Model);
        setbuttonText(Languages.Proceed);
        break;
        case 9:
          setstepTwoHeader(Languages.Service_and_product_detail);
          setbuttonText(Languages.Proceed);
          break;
          case 10:
            setcurrentPosition(1);
            setstepTwoHeader(Languages.Participants);
            setbuttonText(Languages.Demo_Completed);
            break;
      default:
        setcurrentPosition(2);
        setstepThreeCount(11)
        setbuttonText(Languages.Share_Feedback_Link);
        break;
    }
  };
  function notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      handleShowRequiredFieldsAlert(msg)
    }
  }
  const ConfirmClicked = () => {
    var data={}
    const notes=getValues().notes
    if(buttonText === Languages.Check_Out){
      data = {
        demoId: DemoDetails.id,
        stage: 12,
        notes:notes,
        latitude: latitude,
        longitude: longitude,
        clientId: DemoDetails.client.id,
        trainerLocation:trainerLocation
      };
    }else{
      data = {
        demoId: DemoDetails.id,
        stage: 1,
        latitude: latitude,
        longitude: longitude,
        clientId: DemoDetails.client.id,
        trainerLocation:trainerLocation
      };
    }
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('images', []);
    auditUpdate(formData)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          if (buttonText === Languages.Check_Out) {
            notifyMessage(Languages.Check_Out_successfully_done)
            setLocationModalVisible(false);
            setstepCount(2)
            props.navigation.navigate('SalesBottomTabs');
          } else {
            notifyMessage(Languages.Check_In_successfully_done)
            setLocationModalVisible(false);
            setcurrentPosition(1);
            setstepCount(2)
            setbuttonText(Languages.Proceed);
          }
          setDisabled(false);
        } else {
          handleShowRequiredFieldsAlert(Languages.Alert, response.data.data.statusMessage)
        }
      })
      .catch(function (error) {
       
      });
  };
  const Modalopen = type => {
    setPicUploadModalVisible(!picUploadmodalVisible);
    setImageSelected(type);
  };
  const addItem = image => {
    setImageSelected([...imageSelected, image.path]);
  };
  const removeImage = (index) => {
    setImageSelected((prevPaths) => prevPaths.filter((_, i) => i !== index));
  };
  const launchcamera = async () => {
    setPicUploadModalVisible(false);
    if (Platform.OS === 'android') {
      // Calling the permission function
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: Languages.Livewire_App_Camera_Permission,
          message: Languages.Livewire_App_needs_access_to_your_camera,
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImageCropPicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
          includeBase64:true
        }).then(image => {
          const base64Image = image.data;
          const estimatedSizeInBytes = (base64Image.length * 3) / 4;
          const sizeInMB = estimatedSizeInBytes / (1024 * 1024);
          const {mime} = image;
          const isPNG = mime === 'image/png';
          const isJPEG = mime === 'image/jpeg';
          const isJPG = mime === 'image/jpg';
          if(sizeInMB.toFixed(2)>5){
            Alert.alert(Languages.Image_size_should_be_less_than_5MB);
          }else if(!isPNG&&!isJPEG&&!isJPG){
            Alert.alert(Languages.Image_format_should_be_jpeg_or_png);
          }else{
            addItem(image);
          }
        });
      } else {
        // Permission Denied
        Alert.alert(Languages.Camera_Permission_Denied);
      }
    } else if (Platform.OS === 'ios') {
      const response = await request(
        Platform.select({
          ios: PERMISSIONS.IOS.CAMERA,
          android: PERMISSIONS.ANDROID.CAMERA,
        })
      );
      
      if (response === RESULTS.GRANTED) {
        setTimeout(() => {
        ImageCropPicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
          includeBase64:true
        }).then(image => {
          const base64Image = image.data;
          const estimatedSizeInBytes = (base64Image.length * 3) / 4;
          const sizeInMB = estimatedSizeInBytes / (1024 * 1024);
          const {mime} = image;
          const isPNG = mime === 'image/png';
          const isJPEG = mime === 'image/jpeg';
          const isJPG = mime === 'image/jpg';
          if(sizeInMB.toFixed(2)>5){
            Alert.alert(Languages.Image_size_should_be_less_than_5MB);
          }else if(!isPNG&&!isJPEG&&!isJPG){
            Alert.alert(Languages.Image_format_should_be_jpeg_or_png);
          }else{
            addItem(image);
          }
        })
        .catch(error => {
          Alert.alert('Camera Error', error.message);
        });
      }, 500);
      } else {
        // Permission Denied
        Alert.alert(Languages.Camera_Permission_Denied);
      }
    }
  };
  const opengallery = () => {
    setPicUploadModalVisible(false);
    setTimeout(() => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64:true
    }).then(image => {
      const base64Image = image.data;
      const estimatedSizeInBytes = (base64Image.length * 3) / 4;
      const sizeInMB = estimatedSizeInBytes / (1024 * 1024);
      const {mime} = image;
      const isPNG = mime === 'image/png';
      const isJPEG = mime === 'image/jpeg';
      const isJPG = mime === 'image/jpg';
      if(sizeInMB.toFixed(2)>5){
        Alert.alert(Languages.Image_size_should_be_less_than_5MB);
      }else if(!isPNG&&!isJPEG&&!isJPG){
        Alert.alert(Languages.Image_format_should_be_jpeg_or_png);
      }else{
        addItem(image);
      }
    }).catch(error => {
      console.error(error);
    });
  }, 500);
  };
  const onAddressHandled=(newValue)=>{
   setTrainerLocation(newValue)
  }
  useEffect(()=>{
    getUserImage()
  },[])
  const getUserImage=async()=>{
    const id = await AsyncStorage.getItem("userId");
    let Id = parseInt(id, 10);
    try {
      const response = await getDetails(Id);
      if (response.data.statusCode === 200) {
       setImage(response.data.data.profileUrl)
      } 
    } catch (error) {
      
    }
  }
  const StageBack = () => {
    var decrease = stepCount - 1;
    if (decrease === 1||decrease === 12||decrease === 11||decrease===-1) {
      props.navigation.navigate('DemoDetailScreen', {
        id: DemoDetails.id,
        isDemoHistory: false,
      });
    } else {
      setstepCount(decrease);
      setstepTwoStepNo(decrease);
      SetStepTwoHeader(decrease);
      setcurrentPosition(1);
      getPreviousData(decrease)
    }
  };
  const getPreviousData = async (decrease) => {
    await demoGetbyId(DemoDetails.id)
      .then(function (response) {
        if (response.data.statusCode == 200) {
        var auditList=response.data.data.demoAudits
        if(decrease===auditList[decrease-1].stage){
          if(decrease!=5||decrease!=9||decrease!=10){
            setImageSelected([])
          setImageSelected(auditList[decrease-1].auditData.fileNames)
          // setNotes(auditList[decrease-1].auditData.notes)
          setValue('notes', auditList[decrease-1].auditData.notes, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
          }
        }
         
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        //  Alert.alert('Alert', error.message);
      });
  };
  useEffect(()=>{
    getNextData(stepCount)
   },[stepCount])
   const getNextData = async (step) => {
    await demoGetbyId(DemoDetails.id)
      .then(function (response) {
        if (response.data.statusCode == 200) {
        var auditList=response.data.data.demoAudits
        if(step===auditList[step-1].stage){
          if(step!=5||step!=9||step!=10){
            setImageSelected([])
          setImageSelected(auditList[step-1].auditData.fileNames)
          // setNotes(auditList[decrease-1].auditData.notes)
          setValue('notes', auditList[step-1].auditData.notes, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
          }
        }
         
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        //  Alert.alert('Alert', error.message);
      });
  };
  const AppBar=()=>{
    return(
      <View style={{flexDirection: 'row',alignItems:'center',justifyContent:'space-between',marginTop:10}}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 0.8}}>
          <TouchableOpacity style={{marginRight:3, padding: 5}} onPress={StageBack}>
          <Icon color="black" name="arrow-back" size={22} style={{alignItems:'center'}}/>
          </TouchableOpacity>
              <Text style={styles.header} numberOfLines={1}>{DemoDetails.generatedDemoId}</Text>
      </View>
      
        <TouchableOpacity
        onPress={()=>props.navigation.navigate('Profile')}>
     {
      image?
      <Image
      source={{uri:image}}
      style={{
        resizeMode: 'stretch',
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 50,
        borderColor: GlobalStyles.colorSet.Grey,
        borderWidth: 2,
      }}
      
    />:
    <Image
    source={Images.Person}
    style={styles.Image}
    
  />
     }
      </TouchableOpacity>
  
     </View>
    )
  }
  return (
    <SafeAreaView style={styles.viewContainer}>
        <AppBar/>
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 62 : 0}
          style={{flex: 0.9, padding: 10}}>
        <View style={{height: 20}} />
        <StepIndicator
          stepCount={4}
          customStyles={customStyles}
          currentPosition={currentPosition}
          labels={labels}
        />
        {!isLoading ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {currentPosition == 0 && (
              <StepOneScreen
              onHeaderClicked={()=> props.navigation.navigate('PDFViewer', {uri:DemoDetails.sop})}
                name={DemoDetails.trainerUser.firstName}
                client={DemoDetails.client.clientName}
                Address={onAddressHandled}
              />
            )}
            {currentPosition == 1 && (
              <StepTwoScreen
                onHeaderClicked={()=> props.navigation.navigate('PDFViewer', {uri:DemoDetails.sop})}
                Control={control}
                imagePaths={imageSelected}
                attachClicked={() => {
                  setPicUploadModalVisible(true);
                }}
                header={stepTwoHeader}
                stepNo={stepCount}
                yesStatus={selectedValue === Languages.Yes ? 'checked' : 'unchecked'}
                onYesPress={() => setSelectedValue(Languages.Yes)}
                nostatus={selectedValue === Languages.No ? 'checked' : 'unchecked'}
                onNoPress={() => {
                  setSelectedValue(Languages.No);
                  settheoryModalVisible(true);
                }}
                onGivenValueChange={handleValueChange}
                onAdditionalValueChange={handleAdditionalValueChange}
                onParticipantValueChange={handleParticipantValueChange}
                onAdditionalServiceSelected={handleAdditionalServiceSelected}
                GivenService={DemoDetails.service}
                GivenBrand={DemoDetails.brand}
                GivenServiceType={DemoDetails.serviceType}
                demoId={DemoDetails.id}
                RemoveImage={removeImage}
              />
            )}
            {currentPosition == 2 && (
              <StepThreeScreen
              onHeaderClicked={()=> props.navigation.navigate('PDFViewer', {uri:DemoDetails.sop})}
                header={stepThreeHeader}
                stepNo={stepThreeCount}
                control={control}
                clientName={DemoDetails.client.clientName}
                demoId={DemoDetails.generatedDemoId}
                editInputText = {isEditValue}
              />
            )}
            {currentPosition == 3 && (
              <StepFourScreen
              onHeaderClicked={()=> props.navigation.navigate('PDFViewer', {uri:DemoDetails.sop})}
              name={DemoDetails.trainerUser.firstName}
              Address={onAddressHandled}
             control={control}
              />
            )}
          </ScrollView>
        ) : (
          <ActivityIndicator color={GlobalStyles.colorSet.orange} />
        )}
      </KeyboardAvoidingView>
      <View style={{flex: 0.15}}>
        <View style={{justifyContent: 'flex-end', flex: 1, paddingBottom: 10}}>
          {currentPosition == 2? (
            <View>
             {
              !keyboardVisible&&(
                buttonText === Languages.Check_For_Response && (
                  <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                      {isValid && <TouchableOpacity
                      disabled={disabled}
                    onPress={() => {
                      const name=getValues().name;
                      const mobileNo=getValues().mobileNo
                      if (name != '' && mobileNo != ''&&name!=undefined&&mobileNo!=undefined) {
                        StepElevenApiCall();
                      } else {
                        handleShowRequiredFieldsAlert(Languages.Please_fill_all_the_fields)
                      }
                    }}>
                    <Text
                      style={{
                        color: '#3CB043',
                        alignItems: 'center',
                        textAlign: 'center',
                        margin: 10,
                        fontSize: 16,
                      }}>
                     {Languages.Resend_Feedback}
                    </Text>
                  </TouchableOpacity>}
                   {isValid && <TouchableOpacity
                    onPress={() => {
                      reset();
                      setEditValue(true);
                    }}>
                    <Text
                      style={{
                        color: '#3CB043',
                        alignItems: 'center',
                        textAlign: 'center',
                        margin: 10,
                        fontSize: 16,
                      }}>
                     Reset Form
                    </Text>
                  </TouchableOpacity>}
                  </View>
                 
                )
              )
             }
              <TouchableOpacity
                onPress={onPageChange}
                style={[
                  styles.buttonContainer,
                  buttonText === Languages.Share_Feedback_Link && disabled  ? styles.disabledButtonContainer : null,
                ]}
                disabled={ buttonText===Languages.Share_Feedback_Link ? disabled : buttonText !== Languages.Share_Feedback_Link ? !isValid : true}>
                <View
                  style={[
                    styles.button,
                    {backgroundColor: GlobalStyles.colorSet.orange},
                    disabled && styles.disabledButton,
                  ]}>
                  <Text style={[styles.buttonText, {color: 'white'}]}>
                    {buttonText}
                  </Text>
                 {
                 buttonText===Languages.Share_Feedback_Link&&(
                    <Image
                    source={Images.Share}
                    style={{
                      marginLeft: 5,
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      tintColor: 'white',
                    }}
                  />
                  )
                 }
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <CustomButton disabled={disabled} text={buttonText} onPress={onPageChange} />
          )}
        </View>
      </View>
      <PicUploadModal
        Modalvisible={picUploadmodalVisible}
        modalswipe={() => Modalopen(imageSelected)}
        close_icon_click={() => {
          setPicUploadModalVisible(false);
        }}
        btn_one_press={() => launchcamera()}
        btn_two_press={() => opengallery()}
      />
      <FeedbackPopUp
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <LocationPopUp
        visible={locationmodalVisible}
        onClose={() => { setDisabled(false); setLocationModalVisible(false) }}
        onConfirm={ConfirmClicked}
      />
      <TheoryPopUp
        visible={theoryModalVisible}
        onClose={() => settheoryModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default ActionScreen;
