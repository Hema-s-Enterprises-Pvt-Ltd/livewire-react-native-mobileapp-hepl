import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
  ToastAndroid,
  SafeAreaView,
} from 'react-native';
import CustomAppBar from '../../component/CustomAppBar';
import {styles} from './ScheduleStyles';
import CustomButton from '../../component/CustomButton';
import moment from 'moment';
import {
  getClientName,
  products,
  brandList,
  serviceTypes,
  services,
  demoCreate,
  getDocuments,
  getServiceType,
  getServiceTypeCall,
} from '../../networkClient/apifunction';
import {useFocusEffect} from '@react-navigation/native';
import CustomDropdown from '../../component/CustomDropdown';
import DatePickerInput from '../../component/DatePicker';
import TimePicker from '../../component/TimePicker';
import CustomInput from '../../component/CustomInput';
import {useForm} from 'react-hook-form';
import Icon from 'react-native-vector-icons/AntDesign';
import {RFValue} from 'react-native-responsive-fontsize';
import { Images, Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const ScheduleDemoScreen = props => {
  const [clientData, setClientData] = useState([]);
  const [brand, setBrand] = useState([]);
  const [product, setProduct] = useState([]);
  const [serviceType, setServiceType] = useState([]);
  const [service, setService] = useState([]);
  const [location, setLocation] = useState([]);
  const [valueBrand, setValueBrand] = useState(null);
  const [valueServices, setValueServices] = useState(null);
  const [documentdetails, setDocumentDetails] = useState();
  const [isTimePickerEnabled, setTimePickerEnabled] = useState(false);
  const [selectedDate, setValidDate] = useState('');
  const [isLoading, setLoading] = useState(false);
  const {
    handleSubmit: handleSubmitForm,
    register,
    formState: {errors, isValid},
    control,
    setValue,
    getValues,
    reset,
  } = useForm({
    mode: 'onChange', // Enable validation on change
    defaultValues: {
      clientName: '',
      saloonCode: '',
      location: '',
      decisionMaker: '',
      mobileNo: '',
      date: '',
      time: '',
      brand: '',
      serviceType: '',
      service: '',
    },
  });
  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('ScheduleDemo mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('ScheduleDemo unmounted');
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getDropdownData();
      getBrand();
      getDoucumentDetails();
    }, []),
  );
  const getDoucumentDetails = async () => {
    await getDocuments()
      .then(function (response) {
        if (response.data.statusCode == 200) {
          setDocumentDetails(response.data.data);
        } else {
          Alert.alert(Languages.Alert, response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.message);
      });
  };

  const getDropdownData = async () => {
    getClientName()
      .then(function (response) {
        if (response.data.statusCode == 200) {
          const res = response.data.data;
          setClientData(res);
        } else {
          Alert.alert(Languages.Alert, response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.message);
      });

    products()
      .then(function (response) {
        if (response.data.statusCode == 200) {
          const res = response.data.data;
          setProduct(res);
        } else {
          Alert.alert(Languages.Alert, response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.message);
      });
  };
  function notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  }
  const onSubmit = () => {
    setLoading(true);
    const getScheduleDetailsData = getValues();
    const originalDate = getScheduleDetailsData.date;
    const parsedDate = moment(originalDate, 'DD-MM-YYYY');
    const formattedDate = parsedDate.format('YYYY-MM-DD');
    const data = {
      clientId: getScheduleDetailsData.clientName,
      brandId: getScheduleDetailsData.brand,
      serviceTypeId: getScheduleDetailsData.serviceType,
      serviceId: getScheduleDetailsData.service,
      scheduleDate: formattedDate,
      scheduleTime: getScheduleDetailsData.time,
      sopDocumentLink: documentdetails.sop,
      groomingDocumentLink: documentdetails.grooming,
    };
    if (isValid) {
      demoCreate(data)
        .then(function (response) {
          if (response.data.statusCode == 200) {
            notifyMessage('Demo created successfully');
            setLoading(false);
            props.navigation.navigate('TrainerList', {
              date: formattedDate,
              serviceId: valueServices,
              demoId: response.data.data.demoId,
            });
          } else {
            Alert.alert(Languages.Alert, response.data.data.statusMessage);
            setLoading(false);
          }
        })
        .catch(function (error) {
          Alert.alert(Languages.Alert, error.message);
          setLoading(false);
        });
    } else {
      Alert.alert(Languages.Please_fill_all_the_mandatory_fields);
      setLoading(false);
    }
  };

  const getBrand = async () => {
    brandList()
      .then(function (response) {
        if (response.data.statusCode == 200) {
          const res = response.data.data;
          setBrand(res);
        } else {
          Alert.alert(Languages.Alert, response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.message);
      });


  };

  const getServiceType = async (brandId) => {
    getServiceTypeCall(brandId) // Pass the brandId to the API call
      .then(function (response) {
        if (response.data.statusCode == 200) {
          const res = response.data.data;
          setServiceType(res); // Set the service type data based on the selected brand
        } else {
          Alert.alert(Languages.Alert, response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.message);
      });
  };

  const getService = id => {
    services(id)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          const res = response.data.data;
          setService(res);
        } else {
          Alert.alert(Languages.Alert, response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.message);
      });
  };

  const dropDownHandlingClient = data => {
    setValue('saloonCode', data.id, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('decisionMaker', data.decisionMakerName, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('mobileNo', data.decisionMakerNumber, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('location', data.location ? data.location : null, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  const dropDownHandlingSaloonCode = data => {
    setValue('clientName', data.id, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('location', data.location, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('decisionMaker', data.decisionMakerName, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('mobileNo', data.decisionMakerNumber, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleDateChange = date => {
    setTimePickerEnabled(true);
    setValidDate(date);
  };
  const handleTimeChange = date => {};

  const dropDownHandlingbrand = (brand) => {
    setValueBrand(brand.id);
    getServiceType(brand.id); 
  };

  const dropDownHandlingServiceType = serviceType => {
    getService(serviceType.id);
  };
  const dropDownHandlingService = service => {
    setValueServices(service.id);
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={styles.viewContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <CustomAppBar title={Languages.Schedule_a_Demo} showImage={true} navigation={props.navigation}/>
          <View style={{height: 20}} />

          <CustomDropdown
            title={Languages.Client_Name}
            name="clientName"
            control={control}
            placeholder={Languages.Select_Client_Name}
            valueFields="id"
            labelFields="name"
            data={clientData}
            rules={{required: Languages.Client_Name_is_required}}
            onValueChange={dropDownHandlingClient}
          />
          <View style={{height: 10}} />
          <CustomDropdown
            title={Languages.Saloon_Code}
            name="saloonCode"
            control={control}
            placeholder={Languages.Select_Code}
            valueFields="id"
            labelFields="clientCode"
            data={clientData}
            rules={{required:Languages.Saloon_Code_is_required}}
            onValueChange={dropDownHandlingSaloonCode}
          />
          <View style={{height: 10}} />
          <CustomInput
            title={Languages.Location}
            name="location"
            control={control}
            placeholder=""
            labelFields="location"
            isEditable={false}
            data={location}
            rules={{
              required: '',
            }}
          />

          <View style={{height: 10}} />
          <CustomInput
            title={Languages.Decision_Maker}
            name="decisionMaker"
            control={control}
            placeholder=""
            isEditable={false}
            rules={{
              required: Languages.Decision_Maker_is_required,
            }}
          />
          <View style={{height: 10}} />
          <CustomInput
            title={Languages.Mobile_Number}
            name="mobileNo"
            control={control}
            placeholder=""
            keyboardType="numeric"
            maxLength={10}
            isEditable={false}
            rules={{
              required: Languages.Mobile_No_is_required,
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: Languages.Mobile_is_not_valid,
              },
            }}
          />
          <View style={{height: 10}} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 5,
            }}>
            <View style={{width: '50%'}}>
              <DatePickerInput
                title={Languages.Date}
                name="date"
                minimumDate={new Date()}
                control={control}
                onDateChange={handleDateChange} // Pass the callback function
                rules={{
                  required:Languages.Date_of_Birth_is_required,
                }}
              />
            </View>
            <View style={{width: '50%'}}>
              <TimePicker
                title={Languages.Time}
                name="time"
                control={control}
                validateTime={true}
                selectedDate={selectedDate} // Pass the selected date here
                onDateChange={handleTimeChange} // Pass the callback function
                rules={{
                  required: Languages.Time_required,
                }}
                disabled={!isTimePickerEnabled} // Disable TimePicker if date is not selected
              />
            </View>
          </View>
          <View style={{height: 10}} />
          <CustomDropdown
            title={Languages.Brand}
            name="brand"
            control={control}
            placeholder={Languages.Select}
            valueFields="id"
            labelFields="name"
            data={brand}
            rules={{required: Languages.Brand_is_required}}
            onValueChange={dropDownHandlingbrand}
          />
          <View style={{height: 10}} />
          <CustomDropdown
            title={Languages.ServiceCategory}
            name="serviceType"
            control={control}
            placeholder={Languages.Select}
            valueFields="id"
            labelFields="name"
            data={serviceType}
            rules={{required:Languages.Service_category_is_required}}
            onValueChange={dropDownHandlingServiceType}
          />
          <View style={{height: 10}} />
          <CustomDropdown
            title={Languages.ServiceVarient}
            name="service"
            control={control}
            placeholder="Select"
            valueFields="id"
            labelFields="services"
            data={service}
            rules={{required: Languages.Service_is_required}}
            onValueChange={dropDownHandlingService}
          />

          <View style={{height: 10}} />
          <Text
            style={{
              fontWeight: 'bold',
              textAlign: 'left',
              //  marginTop: 10,
              color: 'black',
              fontSize: 14,
              marginTop: 10,
            }}>
          {Languages.SOP_Attachment}
          </Text>
          <View style={{marginTop: 10}}>
            <Pressable
              onPress={() =>
                props.navigation.navigate('PDFViewer', {
                  uri: documentdetails?.sop,
                  name: 'SOP Document',
                })
              }
              style={{
                width: '100%',
                height: 50,
                padding: 10,
                flexDirection: 'row',
                borderRadius: 5,
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#EDF1F3',
              }}>
              <Image
                source={Images.Receipt}
                resizeMode="contain"
                style={{width: 20, height: 20, resizeMode: 'contain'}}
              />
              <Text
                style={{
                  fontSize: RFValue(12),
                  fontWeight: '500',
                  textAlign: 'left',
                  color: '#666687',
                  marginLeft: 10,
                }}>
                {Languages.SOP}
              </Text>
            </Pressable>
            {/* <Text>Attach Document</Text> */}
            <TouchableOpacity
              style={{position: 'absolute', right: 10, top: 15}}
              onPress={() =>
                props.navigation.navigate('PDFViewer', {
                  uri: documentdetails?.sop,
                  name: 'SOP Document',
                })
              }>
              <Icon color="black" name="eyeo" size={15} />
            </TouchableOpacity>
          </View>

          <View style={{height: 10}} />

          <Text
            style={{
              fontWeight: 'bold',
              textAlign: 'left',
              //  marginTop: 10,
              color: 'black',
              fontSize: 14,
              marginTop: 10,
            }}>
           {Languages.Grooming_Pdf_Attachment}
          </Text>
          <View style={{marginTop: 10}}>
            <Pressable
              onPress={() =>
                props.navigation.navigate('PDFViewer', {
                  uri: documentdetails?.grooming,
                  name: 'Grooming Document',
                })
              }
              style={{
                width: '100%',
                height: 50,
                padding: 10,
                flexDirection: 'row',
                borderRadius: 5,
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#EDF1F3',
              }}>
              <Image
                source={Images.Receipt}
                resizeMode="contain"
                style={{width: 20, height: 20, resizeMode: 'contain'}}
              />
              <Text
                style={{
                  fontSize: RFValue(12),
                  fontWeight: '500',
                  textAlign: 'left',
                  color: '#666687',
                  marginLeft: 10,
                }}>
                {Languages.Grooming}
              </Text>
            </Pressable>
            <TouchableOpacity
              style={{position: 'absolute', right: 10, top: 15}}
              onPress={() =>
                props.navigation.navigate('PDFViewer', {
                  uri: documentdetails?.grooming,
                  name: 'Grooming Document',
                })
              }>
              <Icon color="black" name="eyeo" size={14} />
            </TouchableOpacity>
          </View>
          <View style={{height: 10}} />
          <CustomButton
            text={Languages.Check_Available_Trainers}
            loading={isLoading}
            disabled={!isValid}
            onPress={handleSubmitForm(onSubmit)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScheduleDemoScreen;
