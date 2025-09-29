import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Alert,
  ToastAndroid,
  SafeAreaView,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {styles} from './BasicDetailsStyles';
import GlobalStyles from '../../core/GlobalStyles';
import CustomButton from '../../component/CustomButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MultiSelect from '../../component/CustomMultiSelect/MultiSelect';
import {
  getALLServiceList,
  getCity,
  getState,
  userUpdate,
  uploadProfilePic,
  getAllASM,
  getAllRSM,
  getAllBrand,
  brandList,
} from '../../networkClient/apifunction';
import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import {getDetails} from '../../networkClient/apifunction';
import {useForm} from 'react-hook-form';
import CustomInput from '../../component/CustomInput';
import CustomDropdown from '../../component/CustomDropdown';
import DateOfBirthInput from '../../component/DatePicker';
import {Images, Languages} from '../../common';
import { useFocusEffect } from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';

const EditBasicDetails = props => {
  const {userId} = useState();
  const [currentPosition, setcurrentPosition] = useState(0);
  const [buttonText, setbuttonText] = useState('Next');
  const [stateSelected, setStateSelected] = useState([]);
  const [citySelected, setCitySelected] = useState([]);
  const [salesManSelected, setsalesManSelected] = useState([]);
  const [data, setData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [brandSelected, setbrandSelected] = useState();
  const [details, setDetails] = useState(false);
  const [roleName, setRoleName] = useState();
  const [profilePic, setProfilePic] = useState();
  const [modalvisible, setmodalvisible] = useState(false);
  const [asm, setAsm] = useState([]);
  const [rsm, setRsm] = useState([]);
  const [serviceListTypes, setServiceListTypes] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New state to handle loading
  const [selectedBrandList, setSelectedbrandList] = useState([]);
  const toggleSelection = itemId => {
    setSelectedItems(prevSelectedItems => {
      const isSelected = prevSelectedItems.includes(itemId);
      const updatedList = isSelected
        ? prevSelectedItems.filter(id => id !== itemId)
        : [...prevSelectedItems, itemId];

      return updatedList;
    });
  };

  const toggleBrandSelection = itemId => {
    setSelectedbrandList(prevSelectedItems => {
      const isSelected = prevSelectedItems.includes(itemId);
      const updatedList = isSelected
        ? prevSelectedItems.filter(id => id !== itemId)
        : [...prevSelectedItems, itemId];
       getAllServiceType(updatedList);
      return updatedList;
    });
  };
  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('EditBasicDetailsScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('EditBasicDetailsScreen unmounted');
    };
  }, []);

 // Log selectedBrandList whenever it changes
 useEffect(() => {
}, [selectedBrandList,selectedItems]);
  const isSelected = itemId => selectedItems.includes(itemId);
  const isBrandSelected = itemId => selectedBrandList.includes(itemId);
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
      firstName: '',
      lastName: '',
      dob: '',
      workExperience: '',
      gender: '',
      mobileNo: '',
      address: '',
    },
  });

  const genderData = [
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
    {label: 'Others', value: 'Others'},
  ];
  const labels = ['Step 1', 'Step 2', 'Step 3'];

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
    labelColor: '#b3e8fa',
    labelSize: 13,
    currentStepLabelColor: GlobalStyles.colorSet.blue,
  };
  // useEffect(() => {
  //   getData();
  //   getRole();
  //   getBrandList();
  //   getAllStates();
  //   getAllServiceType();
  //   Asm_Rsm();
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      getData();
      getRole();
      getBrandList();
      getAllStates();
      Asm_Rsm();
    }, []),
  );
  useEffect(() => {
    const backAction = () => {
      if (!props.route.params.isFirstLogin) {
        props.navigation.navigate("SalesBottomTabs");
        return true;
      }else{
        return false;
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();

  }, [props.route.params.isFirstLogin]);
  
  const getBrandList = async () => {
    getAllBrand()
      .then(function (response) {
        if (response.data.statusCode == 200) {
          const res = response.data.data;
          setData(res);
        } else {
          Alert.alert(Languages.Alert, response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error);
      });
  };
  const getRole = async () => {
    const name = await AsyncStorage.getItem('roleName');
    setRoleName(name);
  };
  const Asm_Rsm = async () => {
    getAllASM()
      .then(function (response) {
        if (response.data.statusCode == 200) {
          const res = response.data.data;
          setAsm(res);
        } else {
          Alert.alert(Languages.Alert, response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error);
      });
    getAllRSM()
      .then(function (response) {
        if (response.data.statusCode == 200) {
          const res = response.data.data;
          setRsm(res);
        } else {
          Alert.alert(Languages.Alert, response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error);
      });
  };
  const getAllServiceType = async (id) => {
  if(id.length!==0){
    getALLServiceList(id)
    .then(function (response) {
      if (response.data.statusCode == 200) {
        const res = response.data.data;
        setServiceListTypes(res);
        if(res.length===0){
          setSelectedItems([]);
        }
      } else {
        Alert.alert(Languages.Alert, response.data.data.statusMessage);
      }
    })
    .catch(function (error) {
      Alert.alert(Languages.Alert, error.response?.data?.data?.message);
    });
  }
  };
  const getData = async () => {
    const id = await AsyncStorage.getItem('userId');
    var Id = parseInt(id, 10);
    try {
      const response = await getDetails(userId ? userId : Id);
      if (response.data.statusCode === 200) {
        setDetails(response.data.data);
        setAllBasicDetail(response.data.data);
        processBrandListData(response.data.data.brandList);
        processServiceTypeListData(response.data.data.serviceTypeList)
        setIsLoading(false);
      } else {
        Alert.alert(Languages.Alert, response.data.data);
      }
    } catch (error) {
      Alert.alert(Languages.Alert, error.message);
    } finally {
      setIsLoading(false); // Set loading to false once the data is fetched
    }
  };

 const processBrandListData = data => {
    const brandSelected = data.map(item => item.id);
    setSelectedbrandList(brandSelected);
    getAllServiceType(brandSelected);
  };
  const processServiceTypeListData = data => {
    const val = data.map(item => item.id);
    setSelectedItems(val);
  };
  setAllBasicDetail = basicDetails => {
    setValue('firstName', basicDetails.firstName ? basicDetails.firstName : '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('lastName', basicDetails.lastName ? basicDetails.lastName : '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('dob', basicDetails.dob ? moment(basicDetails.dob).format('DD-MM-YYYY') : '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('workExperience', basicDetails.experience ? basicDetails.experience.toString() : '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('gender', basicDetails.gender ? basicDetails.gender : '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('mobileNo', basicDetails.mobileNo ? basicDetails.mobileNo: '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('address', basicDetails.address ? basicDetails.address : '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    if (basicDetails.profileUrl) {
      const data = [
        {
          name: 'profile_pic_uploaded',
          uri: basicDetails.profileUrl,
          type: 'image/jpeg',
        },
      ];
      setProfilePic(basicDetails.profileUrl ? data : null);
    }
    const city = [];
    const state = [];
    const salesman = [];
    for (let i = 0; i < basicDetails.stateList.length; i++) {
      state.push(basicDetails.stateList[i].id);
    }
    for (let i = 0; i < basicDetails.districtList.length; i++) {
      city.push(basicDetails.districtList[i].id);
    }
    for (let i = 0; i < basicDetails.salesmanList.length; i++) {
      salesman.push(basicDetails.salesmanList[i].id);
    }
    setStateSelected(state);
    setCitySelected(city);
    setsalesManSelected(salesman);
    CityList(state);
  };

  function notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  }

  const getAllStates = async () => {
    getState()
      .then(function (response) {
        if (response.data.statusCode == 200) {
          const res = response.data.data;
          setStateData(res);
        } else {
          Alert.alert(Languages.Alert, response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.response?.data?.data?.message);
      });
  };
  const onPageChange = async position => {
    if (currentPosition == 0) {
      const values = getValues();
      if (isValid) {
        const getbasicDetailsValues = getValues();
        if (roleName === 'ASM' || roleName === 'RSM') {
          var Id = await AsyncStorage.getItem('userId');
          const originalDate = getbasicDetailsValues.dob;
          const parsedDate = moment(originalDate, 'DD-MM-YYYY');
          const formattedDate = parsedDate.format('YYYY-MM-DD');
          const params = {
            id: Id,
            firstName: getbasicDetailsValues.firstName,
            lastName: getbasicDetailsValues.lastName,
            userName:
              getbasicDetailsValues.firstName +
              '' +
              getbasicDetailsValues.lastName,
            dob: formattedDate,
            experience: getbasicDetailsValues.workExperience,
            gender: getbasicDetailsValues.gender,
            mobileNo: getbasicDetailsValues.mobileNo,
            address: getbasicDetailsValues.address,
          };
          userUpdate(params)
            .then(function (response) {
              if (response.data.statusCode == 200) {
              goToNextScreen()
              } else {
                Alert.alert(Languages.Alert, response.data.data.statusMessage);
              }
            })
            .catch(function (error) {
              Alert.alert(Languages.Alert, error.response.data.message);
            });
        } else {
        setbuttonText(Languages.Next);
        setcurrentPosition(1);
        }
      } else {
        Alert.alert("Please fill valid details");
      }
    } else if (currentPosition == 1) {
      if (roleName === 'Salesman') {
        if (selectedBrandList.length===0) {
          Alert.alert(Languages.Please_fill_all_the_fields);
        } else {
          var val=props.route.params.isFirstLogin
          if(val===true){
            setbuttonText(Languages.Finish);
          setcurrentPosition(2);
          }else{
            setbuttonText(Languages.Update);
            setcurrentPosition(2);
          }
        }
      } else {
        if (selectedBrandList.length===0||selectedItems.length === 0||selectedBrandList===undefined||selectedItems===undefined) {
          Alert.alert(Languages.Please_fill_all_the_fields);
        } else {
          var val=props.route.params.isFirstLogin
          if(val===true){
            setbuttonText(Languages.Finish);
          setcurrentPosition(2);
          }else{
            setbuttonText(Languages.Update);
            setcurrentPosition(2);
          }
        }
      }
    } else {
      if (roleName === 'Salesman') {
        if (citySelected.length === 0) {
          Alert.alert(Languages.Please_fill_all_the_fields);
        } else {
          updateUserDetails();
        }
      } else {
        if (citySelected.length === 0) {
          Alert.alert(Languages.Please_fill_all_the_fields);
        } else {
          updateUserDetails();
        }
      }
    }
  };
  const goToNextScreen=()=>{
    setcurrentPosition(0)
    setbuttonText(Languages.Next)
    var val=props.route.params.isFirstLogin
    if(val===undefined){
      props.navigation.navigate('EditPreviewScreen',{isFirstLogin:true});
    }else{
      props.navigation.navigate('EditPreviewScreen',{isFirstLogin:props.route.params.isFirstLogin});
    }
   
  }
  const removeProfile=async()=>{
    const formData = new FormData();
    const id = formData.append('id', await AsyncStorage.getItem('userId'));
    formData.append('file','' );
    console.log("formdata",formData)
      uploadProfilePic(formData)
        .then(function (response) {
          if (response.data.statusCode == 200) {
            notifyMessage(Languages.Upload_Successfully);
          } else {
            Alert.alert(Languages.Alert, response.data.data.statusMessage);
          }
        })
        .catch(function (error) {
          console.log("error",error)
        //  Alert.alert(Languages.Alert, error.message);
        });
  }
  const pickFileProfile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      console.log("image res",res)
      const fileSizeInBytes = res[0].size;
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
      console.log("image res",fileSizeInMB)
      if(fileSizeInMB.toFixed(2)>2){
        Alert.alert(Languages.Image_size_should_be_less_than_2MB);
      }else{
        setProfilePic(res);
        const formData = new FormData();
        const id = formData.append('id', await AsyncStorage.getItem('userId'));
        formData.append('file', {
          name: res[0]?.name,
          type: res[0]?.type,
          uri: res[0]?.uri,
        });
        uploadProfilePic(formData)
          .then(function (response) {
            if (response.data.statusCode == 200) {
              notifyMessage(Languages.Upload_Successfully);
            } else {
              Alert.alert(Languages.Alert, response.data.data.statusMessage);
            }
          })
          .catch(function (error) {
            Alert.alert(Languages.Alert, error.message);
          });
      }
    
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        // Error handling
      }
    }
  };
  const renderChip = name =>
    name ? (
      <View style={styles.selectedStyle}>
        <Text style={styles.textSelectedStyle}>{name}</Text>
      </View>
    ) : null;

  const updateUserDetails = async () => {
    var Id = await AsyncStorage.getItem('userId');
    const getbasicDetailsValues = getValues();
    const originalDate = getbasicDetailsValues.dob;
    const parsedDate = moment(originalDate, 'DD-MM-YYYY');
    const formattedDate = parsedDate.format('YYYY-MM-DD');
    if (roleName == 'Salesman') {
      const params = {
        id: Id,
        firstName: getbasicDetailsValues.firstName,
        lastName: getbasicDetailsValues.lastName,
        userName:
          getbasicDetailsValues.firstName + '' + getbasicDetailsValues.lastName,
        dob: formattedDate,
        experience: getbasicDetailsValues.workExperience,
        gender: getbasicDetailsValues.gender,
        mobileNo: getbasicDetailsValues.mobileNo,
        address: getbasicDetailsValues.address,
        stateList: stateSelected,
        districtList: citySelected,
        brandList: selectedBrandList,
      };

      userUpdate(params)
        .then(function (response) {
          if (response.data.statusCode == 200) {
           goToNextScreen()
          } else {
            Alert.alert(Languages.Alert, response.data.data.statusMessage);
          }
        })
        .catch(function (error) {
          Alert.alert(Languages.Alert, error.message);
        });
    } else {
      const params = {
        id: Id,
        firstName: getbasicDetailsValues.firstName,
        lastName: getbasicDetailsValues.lastName,
        userName:
          getbasicDetailsValues.firstName + '' + getbasicDetailsValues.lastName,
        dob: formattedDate,
        experience: getbasicDetailsValues.workExperience,
        gender: getbasicDetailsValues.gender,
        mobileNo: getbasicDetailsValues.mobileNo,
        address: getbasicDetailsValues.address,
        serviceTypeList: selectedItems,
        stateList: stateSelected,
        districtList: citySelected,
        salesmanList: salesManSelected,
        brandList: selectedBrandList,
      };
      userUpdate(params)
        .then(function (response) {
          if (response.data.statusCode == 200) {
            goToNextScreen()
          } else {
            Alert.alert(Languages.Alert, response.data.data.statusMessage);
          }
        })
        .catch(function (error) {
          Alert.alert(Languages.Alert, error.response.data.message);
        });
    }
  };
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item}</Text>
        {/* <Icon style={styles.icon} color="black" name="delete" size={20} /> */}
      </View>
    );
  };

  const handleDateChange = date => {
    // You can process the date here or update the form state as needed
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

  const CityList = async item => {
    if (item.length !== 0) {
      getCity(item)
        .then(function (response) {
          if (response.data.statusCode == 200) {
            const res = response.data.data;
            setCityData(res);
          } else {
            Alert.alert(Languages.Alert, response.data.data.statusMessage);
          }
        })
        .catch(function (error) {
          Alert.alert(Languages.Alert, error.message);
        });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
      <ActivityIndicator color={GlobalStyles.colorSet.orange} size={'large'}/>
      </View>
    );
  }
const BackArrowClicked=()=>{
  if (!props.route.params.isFirstLogin) {
    props.navigation.navigate("SalesBottomTabs");
  }
}
  return (
    <>
      {!isLoading && (
        <SafeAreaView style={styles.viewContainer}>
      {
       props.route.params.isFirstLogin?
        <Image
        source={Images.RaagaCardNew}
        style={{
          width: '100%',
          height: '10%',
          resizeMode: 'stretch',
        }}
      />
      :
      <View style={{flexDirection: 'row', alignItems: 'center',marginTop:10}}>
      <TouchableOpacity style={{marginRight:3, padding: 5}} onPress={BackArrowClicked}>
      <Icon color="black" name="arrow-back" size={22} style={{alignItems:'center'}}/>
      </TouchableOpacity>
          <Text style={styles.header} numberOfLines={1}>My Profile</Text>
  </View>
      }
         
          <View style={{height: 20}} />
          {roleName != 'ASM' && roleName != 'RSM' ? (
            <StepIndicator
              stepCount={3}
              customStyles={customStyles}
              currentPosition={currentPosition}
              labels={labels}
            />
          ) : null}
          <View style={{flex: 1, padding: 10}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{height: 5}} />
              {currentPosition == 0 ? (
                <Text style={styles.header}>
                  {Languages.Please_fill_out_the_Basic_Details}
                </Text>
              ) : currentPosition == 1 ? (
                <Text style={styles.header}>
                  {Languages.Select_the_Brand_you_prefer}
                </Text>
              ) : (
                <Text style={styles.header}>
                  {Languages.Select_the_Location_Handled}
                </Text>
              )}
              <View style={{height: 10}} />
              {currentPosition == 0 ? (
                <Text style={styles.subHeader}>
                  {Languages.These_details_will_be_shown_to_your_salesman}
                </Text>
              ) : (
                <Text style={styles.subHeader}>
                  {Languages.Select_all_that_applies}
                </Text>
              )}
              <View style={{height: 10}} />
              {currentPosition == 0 && (
                <View>
                  <CustomInput
                    title={Languages.First_Name}
                    name="firstName"
                    control={control}
                    placeholder={Languages.Name}
                    rules={{
                      required: Languages.First_name_is_required,
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: Languages.Only_Alphabets_are_Allowed,
                      },
                    }}
                  />

                  <CustomInput
                    title={Languages.Last_Name}
                    name="lastName"
                    control={control}
                    placeholder={Languages.Name}
                    rules={{
                      required: Languages.Last_name_is_required,
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: Languages.Only_Alphabets_are_Allowed,
                      },
                    }}
                  />

                  <DateOfBirthInput
                    title={Languages.Date_of_Birth}
                    name="dob"
                    control={control}
                    minimumDate={new Date(1900, 0, 1)}
                    maximumDate={new Date()}
                    onDateChange={handleDateChange} // Pass the callback function
                    rules={{
                      required: Languages.Date_of_Birth_is_required,
                      validate: value => {
                        const age = moment().diff(
                          moment(value, 'DD-MM-YYYY'),
                          Languages.years,
                        );
                        return (
                          age >= 18 || Languages.Age_should_be_greater_than_18
                        );
                      },
                    }}
                  />

                  <CustomInput
                    title={Languages.Work_Experience}
                    name="workExperience"
                    control={control}
                    placeholder={Languages.Enter_Experience}
                    keyboardType="numeric"
                    maxLength={3}
                    rules={{
                      required: Languages.Experience_is_required,
                      validate: value => (parseFloat(value) < 100 || 'Value must be less than 100') 
                    }}
                  />
                  <CustomDropdown
                    title={Languages.Gender}
                    name="gender"
                    control={control}
                    placeholder={Languages.Select_Gender}
                    data={genderData}
                    rules={{required: Languages.Gender_Required}}
                    valueFields="value"
                    labelFields="label"
                  />

                  <CustomInput
                    title={Languages.Address}
                    name="address"
                    control={control}
                    placeholder={Languages.Enter_Address}
                    keyboardType="default"
                    maxLength={500}
                    rules={{
                      required: Languages.Address_is_required,
                    }}
                  />

                  <CustomInput
                    title={Languages.Mobile_Number}
                    name="mobileNo"
                    isEditable={false}
                    control={control}
                    placeholder={Languages.Enter_Mobile_Number}
                    keyboardType="numeric"
                    maxLength={10}
                    rules={{
                      required: Languages.Mobile_No_is_required,
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: Languages.Mobile_is_not_valid,
                      },
                    }}
                  />
                  <Text style={[styles.header, {fontSize: 14, marginTop: 10}]}>
                    {Languages.Upload_Profile_Picture}
                  </Text>
                  <View style={styles.textinput}>
                    {profilePic ? (
                      <Pressable
                        onPress={() => {
                          setProfilePic();
                        }}>
                        <View style={[styles.selectedStyle, {marginTop: 0}]}>
                          <Text style={styles.textSelectedStyle}>
                            {profilePic[0]?.name}
                          </Text>
                          <Icon color="black" name="close" size={14} />
                        </View>
                      </Pressable>
                    ) : (
                      <Text>{Languages.Upload_Image}</Text>
                    )}
                    <TouchableOpacity onPress={pickFileProfile}>
                      <Image
                        source={Images.PaperClip}
                        style={{
                          width: 15,
                          height: 15,
                          resizeMode: 'contain',
                          marginRight: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {currentPosition == 1 && (
                <View>
                   <FlatList
                        style={{marginTop: 10}}
                        numColumns={3}
                        scrollEnabled={false}
                        keyExtractor={(item, index) => index.toString()}
                        data={data}
                        ListEmptyComponent={EmptyListMessage}
                        renderItem={({item}) => (
                          <Pressable
                            style={{
                              marginTop: 5,
                              margin: 5,
                              padding: 5,
                              width: 'auto',
                              backgroundColor: isBrandSelected(item.id)
                                ? GlobalStyles.colorSet.blue
                                : 'white',
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: isBrandSelected(item.id)
                                ? GlobalStyles.colorSet.blue
                                : GlobalStyles.colorSet.Grey,
                              flex: 1,
                              flexShrink: 1,
                              justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={() => toggleBrandSelection(item.id)}>
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 5,
                              }}>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: isBrandSelected(item.id)
                                    ? 'white'
                                    : GlobalStyles.colorSet.Grey,
                                  fontWeight: '350',
                                }}>
                                {item.brandName}
                              </Text>
                            </View>
                          </Pressable>
                        )}
                      />
                
                  <View style={{height: 10}} />
                  {roleName == 'Salesman' ? (
                    <View>
                      <View style={{paddingBottom: 10}}>
                        <Text style={styles.Subheader_black}>{Languages.RSM}</Text>
                        <View style={{paddingBottom: 10}}>
                          {/* <FlatList
                            numColumns={4}
                            scrollEnabled={false}
                            keyExtractor={(item, index) => index}
                            data={rsm}
                            ListEmptyComponent={EmptyListMessage}
                            renderItem={({item, index}) => (
                              <View style={styles.selectedStyle}>
                                <Text style={styles.textSelectedStyle}>
                                  {item.salesmanName}
                                </Text>
                              </View>
                            )}
                          /> */}
                           <View style={styles.additionalTextinput}>
                {rsm&& 
                rsm.map((item, index) => (
                  <Text
                  key={item.id || index}
                    style={{
                      fontSize: 14,
                      fontWeight: 'semibold',
                      textAlign: 'left',
                      //  marginTop: 10,
                      color: 'black',
                      backgroundColor: GlobalStyles.colorSet.light_blue,
                      marginLeft: 10,
                      padding: 8,
                      borderRadius: 10,
                      marginBottom:10
                    }}>
                    {item.salesmanName}
                  </Text>
                ))}
              </View>
                        </View>
                      </View>
                      <View style={{marginTop: 10}}>
                        <Text style={styles.Subheader_black}>
                          {Languages.ASM}
                        </Text>
                        <View style={{paddingBottom: 10}}>
                          {/* <FlatList
                            numColumns={4}
                            scrollEnabled={false}
                            keyExtractor={(item, index) => index}
                            data={asm}
                            ListEmptyComponent={EmptyListMessage}
                            renderItem={({item, index}) => (
                              <View style={styles.selectedStyle}>
                                <Text style={styles.textSelectedStyle}>
                                  {item.salesmanName}
                                </Text>
                              </View>
                            )}
                          /> */}
                           <View style={styles.additionalTextinput}>
                {asm&&
                asm.map((item, index) => (
                  <Text
                  key={item.id || index}
                    style={{
                      fontSize: 14,
                      fontWeight: 'semibold',
                      textAlign: 'left',
                      //  marginTop: 10,
                      color: 'black',
                      backgroundColor: GlobalStyles.colorSet.light_blue,
                      marginLeft: 10,
                      padding: 8,
                      borderRadius: 10,
                      marginBottom:10
                    }}>
                    {item.salesmanName}
                  </Text>
                ))}
              </View>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View style={{marginTop: 30}}>
                      <Text style={styles.header}>
                        {Languages.Select_Service_category_you_prefer}
                      </Text>
                      <Text style={[styles.subHeader, {marginTop: 15}]}>
                        {Languages.Select_all_that_applies}
                      </Text>

                      <FlatList
                        style={{marginTop: 20}}
                        numColumns={3}
                        scrollEnabled={false}
                        keyExtractor={(item, index) => index.toString()}
                        data={serviceListTypes}
                        ListEmptyComponent={EmptyListMessage}
                        renderItem={({item}) => (
                          <Pressable
                            style={{
                              marginTop: 5,
                              margin: 5,
                              padding: 5,
                              width: 'auto',
                              backgroundColor: isSelected(item.id)
                                ? GlobalStyles.colorSet.blue
                                : 'white',
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: isSelected(item.id)
                                ? GlobalStyles.colorSet.blue
                                : GlobalStyles.colorSet.Grey,
                              flex: 1,
                              flexShrink: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={() => toggleSelection(item.id)}>
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 5,
                              }}>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: isSelected(item.id)
                                    ? 'white'
                                    : GlobalStyles.colorSet.Grey,
                                  fontWeight: '350',
                                }}>
                                {item.name}
                              </Text>
                            </View>
                          </Pressable>
                        )}
                      />
                    </View>
                  )}
                </View>
              )}
              {currentPosition == 2 && (
                <View>
                  <View style={{height: 10}} />
                  <Text style={styles.header}>{Languages.State}</Text>
                  <View style={{height: 10}} />
                  
                   <View style={styles.additionalTextinput}>
                {details.stateList&&
                details.stateList.map((item, index) => (
                  <Text
                  key={item.id || index}
                    style={{
                      fontSize: 14,
                      fontWeight: 'semibold',
                      textAlign: 'left',
                      //  marginTop: 10,
                      color: 'black',
                      backgroundColor: GlobalStyles.colorSet.light_blue,
                      marginLeft: 10,
                      padding: 8,
                      borderRadius: 10,
                      marginBottom:10
                    }}>
                    {item.name}
                  </Text>
                ))}
              </View>
                  <View style={{height: 10}} />
                  <Text style={styles.header}>{Languages.City}</Text>
                  <View style={{height: 10}} />
                  <View>
                    <MultiSelect
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={cityData}
                      labelField="name"
                      valueField="id"
                      placeholder={Languages.Select_City}
                      value={citySelected}
                      search
                      searchPlaceholder={Languages.Search}
                      onChange={item => {
                        setCitySelected(item);
                      }}
                      renderItem={item => renderItem(item.name)}
                      renderSelectedItem={(item, unSelect) => (
                        <Pressable onPress={() => unSelect && unSelect(item)}>
                          <View style={styles.selectedStyle}>
                            <Text style={styles.textSelectedStyle}>
                              {item.name}
                            </Text>
                            <Icon color="black" name="close" size={14} />
                          </View>
                        </Pressable>
                      )}
                    />
                  </View>
                  {roleName != 'Salesman' && (
                    <View>
                      <View style={{height: 10}} />
                      <Text style={styles.header}>{Languages.Salesman}</Text>
                      <View style={{height: 10}} />
                      <View style={{paddingBottom: 10}}>
                           <View style={styles.additionalTextinput}>
                {details.salesmanList&&
                details.salesmanList.map((item, index) => (
                  <Text
                  key={item.id || index}
                    style={{
                      fontSize: 14,
                      fontWeight: 'semibold',
                      textAlign: 'left',
                      //  marginTop: 10,
                      color: 'black',
                      backgroundColor: GlobalStyles.colorSet.light_blue,
                      marginLeft: 10,
                      padding: 8,
                      borderRadius: 10,
                      marginBottom:10
                    }}>
                    {item.firstName+" "+item.lastName}
                  </Text>
                ))}
              </View>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
          <View style={{flex: 0.1, justifyContent: 'flex-end'}}>
            <CustomButton text={buttonText} onPress={() => onPageChange(1)} />
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default EditBasicDetails;
