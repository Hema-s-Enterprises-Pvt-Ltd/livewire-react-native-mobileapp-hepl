import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {styles} from './ActionStyles';
import GlobalStyles from '../../core/GlobalStyles';
import {Dropdown} from 'react-native-element-dropdown';
import MultiSelect from '../../component/CustomMultiSelect/MultiSelect';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  demoGetbyId,
  demoProducts,
  services,
  demoGivenServiceProducts,
  getAdditionalServiceList,
} from '../../networkClient/apifunction';
import {Images, Languages} from '../../common';
import {RFValue} from 'react-native-responsive-fontsize';
import {RadioButton} from 'react-native-paper';
import CustomInput from '../../component/CustomInput';
import {useForm} from 'react-hook-form';
import crashlytics from '@react-native-firebase/crashlytics';

const StepTwoScreen = ({
  onHeaderClicked,
  Control,
  imagePaths,
  attachClicked,
  header,
  stepNo,
  yesStatus,
  onYesPress,
  nostatus,
  onNoPress,
  onGivenValueChange,
  onAdditionalValueChange,
  onParticipantValueChange,
  onAdditionalServiceSelected,
  GivenService,
  GivenServiceType,
  GivenBrand,
  demoId,
  RemoveImage,
}) => {
  const [inputValue, setInputValue] = useState();
  const [additionalInputValue, setAdditionalInputValue] = useState();
  const [participantsInputValue, setParticipantsInputValue] = useState();
  const [views, setViews] = useState([]);
  const [additionalviews, setAdditionalViews] = useState([]);
  const [participantsViews, setParticipantsViews] = useState([]);
  const [product, setProduct] = useState([]);
  const [givenServiceProduct, setGivenServiceProduct] = useState([]);
  const [productSelected, setProductSelected] = useState([]);
  const [additionalProductSelected, setAdditionalProductSelected] = useState(
    [],
  );
  const [inputs, setInputs] = useState(['', '']);
  const [nameInputs, setnameInputs] = useState(['', '']);
  const [mobileNoInputs, setMobileNoInputs] = useState(['', '']);
  const [roleInputs, setRoleInputs] = useState(['', '']);
  const [additionalInputs, setadditionalInputs] = useState(['', '']);
  const [GivenServicePdt, setGivenServicePdt] = useState([]);
  const [ParticipantsPdt, setParticipantsPdt] = useState([]);
  const [AdditionalServicePdt, setAdditionalServicePdt] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [serviceSelected, setServiceSelected] = useState([]);
  const [givenServiceSelected, setGivenServiceSelected] = useState([]);
  const [givenServiceObj, setGivenServiceObj] = useState([]);
  const [oldParticipants, setOldParticipants] = useState([]);
  const [service, setService] = useState([]);
  const inputRefs = useRef([]);
  const additionalInputRefs = useRef([]);
  const nameInputRefs = useRef([]);
  const mobileNoInputRefs = useRef([]);
  const roleInputRefs = useRef([]);
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
      productCount: '',
      additionalProductCount: '',
      participantsCount: '',
    },
  });
  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('StepTwoScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('StepTwoScreen unmounted');
    };
  }, []);
  useEffect(() => {
    getProductList();
    getGivenServiceProducts([GivenService.id]);
    getServiceList();
    if (GivenService.id) {
      setGivenServiceSelected([GivenService.id]);
      var value = [GivenService];
      let updatedArray = value.map(item => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      setGivenServiceObj(updatedArray);
    }
    getService();
  }, []);
  useEffect(() => {
    getDetails();
  }, [stepNo]);
  const getDetails = async () => {
    await demoGetbyId(demoId)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          var auditList = response.data.data.demoAudits;
          if (auditList.length >= 8) {
            StepNineCall(auditList);
            if (auditList.length >= 9) {
              StepTenCall(auditList);
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
  const StepTenCall = auditList => {
    setValue(
      'participantsCount',
      auditList[9].auditData.participantsCount.toString(),
      {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      },
    );
    setParticipantsInputValue(auditList[9].auditData.participantsCount);
    handleGenerateParticipantsViews(auditList[9].auditData.participantsCount);
    setOldParticipants(auditList[9].auditData.participants);
    for (i = 0; i < auditList[9].auditData.participants.length; i++) {
      var item = auditList[9].auditData.participants;
      nameInputs.splice(i, 1, item[i].name);
      mobileNoInputs.splice(i, 1, item[i].mobileNumber);
      roleInputs.splice(i, 1, item[i].role);
      setnameInputs(nameInputs);
      setMobileNoInputs(mobileNoInputs);
      setRoleInputs(roleInputs);
      handleRoleChange(item[i].role, i);
      handleNameChange(item[i].name, i);
      handleMobileNoChange(item[i].mobileNumber, i);
    }
  };
  const StepNineCall = auditList => {
    //given service
    var service = [];
    for (let i = 0; i < auditList[8].auditData.givenService.length; i++) {
      service.push(auditList[8].auditData.givenService[i].id);
    }
    setGivenServiceSelected(service);
    setGivenServiceObj(auditList[8].auditData.givenService);
    getGivenServiceProducts(service);
    setInputValue(auditList[8].auditData.productsCount);
    setInputs(auditList[8].auditData.products);
    setValue('productCount', auditList[8].auditData.productsCount.toString(), {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    for (i = 0; i < auditList[8].auditData.products.length; i++) {
      var pdt = auditList[8].auditData.products[i];
      productSelected.splice(i, 1, pdt);
      setProductSelected(productSelected);
      handleGivenProducts(i, productSelected[i].qtyConsumed);
    }
    handleGenerateViews(auditList[8].auditData.productsCount);
    //additional service
    if (auditList[8].auditData.additionalProducts != null) {
      var services = [];
      for (
        let i = 0;
        i < auditList[8].auditData.additionalServices.length;
        i++
      ) {
        services.push(auditList[8].auditData.additionalServices[i].id);
      }
      setServiceSelected(services);
      onAdditionalServiceSelected(auditList[8].auditData.additionalServices);
      setAdditionalInputValue(
        auditList[8].auditData.additionalProductsCount
          ? auditList[8].auditData.additionalProductsCount
          : '',
      );
      setadditionalInputs(
        auditList[8].auditData.additionalProducts
          ? auditList[8].auditData.additionalProducts
          : ['', ''],
      );
      setValue(
        'additionalProductCount',
        auditList[8].auditData.additionalProductsCount
          ? auditList[8].auditData.additionalProductsCount.toString()
          : '',
        {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        },
      );
      for (i = 0; i < auditList[8].auditData.additionalProducts.length; i++) {
        var pdt = auditList[8].auditData.additionalProducts[i];
        additionalProductSelected.splice(i, 1, pdt);
        setAdditionalProductSelected(additionalProductSelected);
        handleAdditionalProducts(i, additionalProductSelected[i].qtyConsumed);
      }
      handleGenerateAdditionalViews(
        auditList[8].auditData.additionalProductsCount
          ? auditList[8].auditData.additionalProductsCount
          : '',
      );
    }
  };
  const renderImage = ({item, index}) => (
    <View
      style={{
        width: 120,
        height: 120,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 10,
      }}>
      <Image
        source={{uri: item}}
        resizeMode="contain"
        style={{width: 100, height: 100, resizeMode: 'stretch'}}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: 15,
          padding: 5,
        }}
        onPress={() => {
          RemoveImage(index);
        }}>
        <Icon name="close" size={10} color="white" />
      </TouchableOpacity>
    </View>
  );

  const getServiceList = async () => {
    getAdditionalServiceList()
      .then(function (response) {
        if (response.data.statusCode == 200) {
          const res = response.data.data;
          setServiceList(res);
        } else {
          Alert.alert('Alert', response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert('Alert', error);
      });
  };
  const getService = () => {
    services(GivenServiceType.id)
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
  const getGivenServiceProducts = async id => {
    demoGivenServiceProducts(id)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          const res = response.data.data;
          const updatedProduct = res.map(item => ({
            id: item.id,
            name: item.name,
            code: item.code,
            unit: item.unit,
            qtyConsumed: 0,
          }));

          setGivenServiceProduct(updatedProduct);
        } else {
          Alert.alert('Alert', response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert('Alert', error.message);
      });
  };
  const getProductList = async () => {
    demoProducts()
      .then(function (response) {
        if (response.data.statusCode == 200) {
          const res = response.data.data;
          const updatedProduct = res.map(item => ({
            id: item.id,
            name: item.name,
            code: item.code,
            unit: item.unit,
            qtyConsumed: 0,
          }));

          setProduct(updatedProduct);
        } else {
          Alert.alert('Alert', response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert('Alert', error.message);
      });
  };
  const handleGenerateViews = val => {
    const count = parseInt(val, 10);
    if (!isNaN(count) && count > 0) {
      setViews(Array(count).fill(null));
    }
  };
  const handleGenerateAdditionalViews = val => {
    const count = parseInt(val, 10);
    if (!isNaN(count) && count > 0) {
      setAdditionalViews(Array(count).fill(null));
    }
  };
  const handleGenerateParticipantsViews = val => {
    const count = parseInt(val, 10);
    if (!isNaN(count) && count > 0) {
      setParticipantsViews(Array(count).fill(null));
    }
  };
  const renderItem = item => {
    return (
      <View style={stepThreeStyle.item}>
        <Text style={stepThreeStyle.selectedTextStyle}>{item}</Text>
        {/* <Icon style={styles.icon} color="black" name="delete" size={20} /> */}
      </View>
    );
  };
  const handleGivenProducts = (index, qty) => {
    var data = {
      id: productSelected[index].id,
      name: productSelected[index].name,
      code: productSelected[index].code,
      qtyConsumed:
        qty > 0 ? parseInt(qty, 10) : productSelected[index].qtyConsumed,
      unit: productSelected[index].unit,
    };
    GivenServicePdt.splice(index, 1, data);
    var finalData = {
      givenService: givenServiceObj,
      productsCount: getValues().productCount,
      products: GivenServicePdt,
    };
    onGivenValueChange(finalData);
  };

  const handleAdditionalProducts = (index, qty) => {
    const data = {
      id: additionalProductSelected[index].id,
      name: additionalProductSelected[index].name,
      code: additionalProductSelected[index].code,
      qtyConsumed:
        qty > 0
          ? parseInt(qty, 10)
          : additionalProductSelected[index].qtyConsumed,
      unit: additionalProductSelected[index].unit,
    };
    AdditionalServicePdt.splice(index, 1, data);
    const finalData = {
      additionalProductsCount: getValues().additionalProductCount,
      additionalProducts: AdditionalServicePdt,
    };
    onAdditionalValueChange(finalData);
  };
  const handleParticipantsProducts = (index, data) => {
    ParticipantsPdt.splice(index, 1, data);
    var finalData = {
      participantsCount: getValues().participantsCount,
      participants: ParticipantsPdt,
    };
    onParticipantValueChange(finalData);
  };
  const handleChange = (text, index) => {
    if (text !== '0') {
      if (productSelected[index]) {
        const newInputs = [...inputs];
        newInputs[index] = text;
        setInputs(newInputs);
        handleGivenProducts(index, newInputs[index]);
      } else {
        clearInput(index);
        Alert.alert(`${Languages.Please_select_product} ${index + 1}`);
      }
    } else {
      Alert.alert(
        'Alert',
        `Demo Capacity for given product ${
          index + 1
        } should be greater than zero`,
      );
    }
  };
  const handleNameChange = (text, index) => {
    const newInputs = [...nameInputs];
    newInputs[index] = text;
    setnameInputs(newInputs);
    const data = {
      name: newInputs[index],
      mobileNumber: mobileNoInputs[index],
      role: roleInputs[index],
    };
    handleParticipantsProducts(index, data);
  };
  const handleMobileNoChange = (text, index) => {
  //  if (nameInputs[index]) {
      const newInputs = [...mobileNoInputs];
      newInputs[index] = text;
      setMobileNoInputs(newInputs);
      const data = {
        name: nameInputs[index],
        mobileNumber: newInputs[index],
        role: roleInputs[index],
      };
      handleParticipantsProducts(index, data);
    // } else {
    //   clearMobileNoInput();
    //   Alert.alert(`${Languages.Please_fill_participant_name} ${index + 1}`);
    // }
  };
  const isValidIndianMobileNumber = number => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(number);
  };

  const handleRoleChange = (text, index) => {
   // if (mobileNoInputs[index]) {
      const newInputs = [...roleInputs];
      newInputs[index] = text;
      setRoleInputs(newInputs);
      const data = {
        name: nameInputs[index],
        mobileNumber: mobileNoInputs[index],
        role: newInputs[index],
      };
      handleParticipantsProducts(index, data);
    // } else {
    //   clearRoleInput();
    //   Alert.alert(
    //     `${Languages.Please_fill_mobile_number_for_participant} ${index + 1}`,
    //   );
    // }
  };
  const handleAdditionalChange = (text, index) => {
    if (text !== '0') {
      if (additionalProductSelected[index]) {
        const newInputs = [...additionalInputs];
        newInputs[index] = text;
        setadditionalInputs(newInputs);
        handleAdditionalProducts(index, newInputs[index]);
      } else {
        clearAdditionalInput(index);
        Alert.alert(
          `${Languages.Please_select_Additional_product} ${index + 1}`,
        );
      }
    } else {
      Alert.alert(
        'Alert',
        `Demo Capacity for additional product ${
          index + 1
        } should be greater than zero`,
      );
    }
  };
  const clearInput = index => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].clear(); // Clear the input field at the specified index
    }
  };

  const clearAdditionalInput = index => {
    if (additionalInputRefs.current[index]) {
      additionalInputRefs.current[index].clear(); // Clear the input field at the specified index
    }
  };
  const clearMobileNoInput = index => {
    if (mobileNoInputRefs.current[index]) {
      mobileNoInputRefs.current[index].clear(); // Clear the input field at the specified index
    }
  };
  const clearRoleInput = index => {
    if (roleInputRefs.current[index]) {
      roleInputRefs.current[index].clear(); // Clear the input field at the specified index
    }
  };
  return (
    <View>
      <View style={{height: 20}} />
      <TouchableOpacity
        style={styles.parentContainer}
        onPress={onHeaderClicked}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 5,
            paddingBottom: 5,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={Images.Receipt}
              resizeMode="contain"
              style={{width: 20, height: 20, resizeMode: 'contain'}}
            />
            <Text style={styles.header}>{header}</Text>
          </View>
          <View
            style={{
              backgroundColor: '#00AEEF26',
              borderRadius: 20,
              padding: 8,
              marginLeft: 10,
              width: 80,
            }}>
            <Text style={styles.stepText}>Step {stepNo}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={{height: 20}} />
      {stepNo == 5 && (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={Images.TheoryImg}
            resizeMode="contain"
            style={{width: '80%', height: 300, resizeMode: 'contain'}}
          />
          <Text
            style={{
              color: '#454F5B',
              fontSize: 14,
              marginLeft: 10,
              fontWeight: '500',
              marginTop: 10,
            }}>
            {Languages.Did_you_Explained_the_Theory}
          </Text>
          <View style={{width: '100%'}}>
            <View style={styles.radioGroup}>
              <View style={styles.radioButton}>
                <RadioButton.Android
                  value="Yes"
                  status={yesStatus}
                  onPress={onYesPress}
                  color="#D9D9D9"
                />
                <Text style={styles.radioLabel}>{Languages.Yes}</Text>
              </View>

              <View style={styles.radioButton}>
                <RadioButton.Android
                  value="No"
                  status={nostatus}
                  onPress={onNoPress}
                  color="#D9D9D9"
                />
                <Text style={styles.radioLabel}>{Languages.No}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
      {stepNo !== 5 && stepNo !== 9 && stepNo !== 10 && (
        <View style={{marginTop: 10}}>
          <Text
            style={{
              color: '#000000',
              fontSize: 14,
              marginLeft: 10,
              fontWeight: '500',
            }}>
            {Languages.Upload_Images}
          </Text>
          <View style={{height: 10}} />
          <View style={styles.textinput}>
            <Text style={{color: GlobalStyles.colorSet.Grey}}>
              {imagePaths != undefined && imagePaths != 0
                ? Languages.Total_Picture_Uploaded + imagePaths.length
                : Languages.Attach}
            </Text>
            <TouchableOpacity onPress={attachClicked}>
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
          <View
            style={{
              width: '100%',
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={Images.Info}
              resizeMode="contain"
              style={{width: 15, height: 15, tintColor: '#666687'}}
            />
            <Text
              style={{
                fontSize: RFValue(10),
                fontWeight: '500',
                textAlign: 'left',
                color: '#666687',
                marginLeft: 10,
              }}>
              {Languages.Accepted_file_formats}
            </Text>
          </View>
          <View style={{height: 30}} />

          {imagePaths ? (
            <FlatList
              horizontal
              // scrollEnabled={false}
              data={imagePaths}
              renderItem={renderImage}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View
              style={{
                backgroundColor: '#d0d0d0',
                width: 100,
                height: 100,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
                marginLeft: 10,
              }}>
              <Image
                source={Images.Gallery}
                resizeMode="contain"
                style={{width: 60, height: 60, resizeMode: 'contain'}}
              />
            </View>
          )}
          <CustomInput
            title={Languages.Notes}
            name="notes"
            control={Control}
            placeholder={Languages.Enter_notes}
            rules={{
              required: Languages.Notes_is_required,
              // pattern: {
              //   value: /^[A-Za-z\s]+$/,
              //   message: Languages.Only_Alphabets_are_Allowed,
              // },
            }}
          />
        </View>
      )}
      {stepNo === 9 && (
        <View>
          <Text style={styles.header}>{Languages.Brand}</Text>
          <View>
            <View style={styles.textinput}>
              <Text style={styles.textinput_txt}>{GivenBrand.name}</Text>
            </View>
          </View>
          <Text style={styles.header}>{Languages.ServiceCategory}</Text>
          <View>
            <View style={styles.textinput}>
              <Text style={styles.textinput_txt}>{GivenServiceType.name}</Text>
            </View>
          </View>
          <Text style={styles.header}>{Languages.Given_Service}</Text>
          <View style={{marginTop: 20}}>
            <MultiSelect
              style={stepThreeStyle.dropdown}
              placeholderStyle={stepThreeStyle.placeholderStyle}
              selectedTextStyle={stepThreeStyle.selectedTextStyle}
              inputSearchStyle={stepThreeStyle.inputSearchStyle}
              iconStyle={stepThreeStyle.iconStyle}
              data={service}
              labelField="services"
              valueField="id"
              placeholder={Languages.Select_here}
              value={givenServiceSelected}
              search
              searchPlaceholder={Languages.Search}
              onChange={item => {
                setGivenServiceSelected(item);
                const value = service.filter(val => item.includes(val.id));

                let updatedArray = value.map(item => {
                  return {
                    id: item.id,
                    name: item.services,
                  };
                });
                setGivenServiceObj(updatedArray);
                getGivenServiceProducts(item);
              }}
              renderItem={item => renderItem(item.services)}
              renderSelectedItem={(item, unSelect) => (
                <Pressable
                  onPress={() => {
                    unSelect(item);
                    setInputValue();
                    setInputs(0);
                    setValue('productCount', '', {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    setProductSelected([]);
                    setGivenServicePdt([]);
                    for (i = 0; i < productSelected.length; i++) {
                      setProductSelected([]);
                      handleGivenProducts(i, 0);
                    }
                    handleGenerateViews(0);
                  }}>
                  <View style={stepThreeStyle.selectedStyle}>
                    <Text style={stepThreeStyle.textSelectedStyle}>
                      {item.services}
                    </Text>
                    <Icon color="black" name="close" size={14} />
                  </View>
                </Pressable>
              )}
            />
          </View>
          <CustomInput
            title={Languages.No_of_Products}
            name="productCount"
            control={control}
            placeholder={''}
            rules={{
              required: 'Products is required',
            }}
            keyboardType="numeric"
            value={inputValue}
            onChange={val => {
              setInputValue(val);
              setInputs(['', '']);
              handleGenerateViews(val);
            }}
            maxLength={2}
          />
          {inputValue > 0 && (
            <View>
              {views.map((value, index) => (
                <View key={index}>
                  <Text style={[styles.header, {marginTop: 20}]}>
                    Product {index + 1}
                  </Text>
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 10,
                      padding: 10,
                    }}>
                    <View
                      style={{
                        backgroundColor: '#00AEEF1A',
                        padding: 10,
                        borderRadius: 10,
                      }}>
                      <Dropdown
                        style={[stepThreeStyle.dropdown]}
                        placeholderStyle={stepThreeStyle.placeholderStyle}
                        selectedTextStyle={stepThreeStyle.selectedTextStyle}
                        inputSearchStyle={stepThreeStyle.inputSearchStyle}
                        iconStyle={stepThreeStyle.iconStyle}
                        data={givenServiceProduct}
                        search
                        maxHeight={300}
                        labelField="name"
                        valueField="id"
                        placeholder={
                          productSelected[index]
                            ? productSelected[index].name
                              ? productSelected[index].name.toString()
                              : Languages.Select_product
                            : Languages.Select_product
                        }
                        searchPlaceholder={Languages.Search}
                        value={productSelected}
                        onChange={item => {
                          //setProductSelected(item);
                          productSelected.splice(index, 1, item);
                          setProductSelected(productSelected);
                          handleGivenProducts(
                            index,
                            productSelected[index].qtyConsumed,
                          );
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: 10,
                        marginTop: 10,
                        borderRadius: 10,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#E6F2E680',
                      }}>
                      <View style={{width: '45%'}}>
                        <Text
                          style={{
                            color: '#666687',
                            fontSize: 14,
                            fontWeight: '500',
                          }}>
                          {Languages.Demo_Capacity}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '20%',
                          borderRadius: 5,

                          alignItems: 'center',
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 1,
                          },
                          shadowOpacity: 0.2,
                          shadowRadius: 1.41,
                          height: 40,
                          backgroundColor: '#81BE8333',
                          borderWidth: 1,
                          borderColor: '#81BE8333',
                        }}>
                        <KeyboardAwareScrollView>
                          <TextInput
                            ref={el => (inputRefs.current[index] = el)}
                            placeholder={
                              productSelected[index]
                                ? productSelected[index].qtyConsumed.toString()
                                : '0'
                            }
                            style={styles.textinput_txt}
                            onChangeText={text => handleChange(text, index)}
                            value={inputs[index]}
                            clearButtonMode="always"
                            keyboardType="numeric"
                            maxLength={4}
                            placeholderTextColor={GlobalStyles.colorSet.Grey}
                          />
                        </KeyboardAwareScrollView>
                      </View>
                      <View
                        style={{
                          width: '20%',
                          borderRadius: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 1,
                          },
                          shadowOpacity: 0.2,
                          shadowRadius: 1.41,
                          height: 40,
                          backgroundColor: '#81BE8333',
                          borderWidth: 1,
                          borderColor: '#81BE8333',
                        }}>
                        <Text>
                          {productSelected[index]
                            ? productSelected[index].unit
                            : ''}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
          <Text style={styles.header}>
            {Languages.Additional_Service_Provided}
          </Text>
          <View style={{marginTop: 20}}>
            <MultiSelect
              style={stepThreeStyle.dropdown}
              placeholderStyle={stepThreeStyle.placeholderStyle}
              selectedTextStyle={stepThreeStyle.selectedTextStyle}
              inputSearchStyle={stepThreeStyle.inputSearchStyle}
              iconStyle={stepThreeStyle.iconStyle}
              data={serviceList}
              labelField="name"
              valueField="id"
              placeholder={Languages.Select_here}
              value={serviceSelected}
              search
              searchPlaceholder={Languages.Search}
              onChange={item => {
                setServiceSelected(item);
                if (item.length === 0) {
                  setAdditionalInputValue(0);
                  setValue('additionalProductCount', '', {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  onAdditionalServiceSelected(undefined);
                } else {
                  const value = serviceList.filter(val =>
                    item.includes(val.id),
                  );
                  onAdditionalServiceSelected(value);
                }
              }}
              renderItem={item => renderItem(item.name)}
              renderSelectedItem={(item, unSelect) => (
                <Pressable onPress={() => unSelect && unSelect(item)}>
                  <View style={stepThreeStyle.selectedStyle}>
                    <Text style={stepThreeStyle.textSelectedStyle}>
                      {item.name}
                    </Text>
                    <Icon color="black" name="close" size={14} />
                  </View>
                </Pressable>
              )}
            />
          </View>
          <View style={{height: 10}} />
          <CustomInput
            title={Languages.No_of_Products}
            name="additionalProductCount"
            control={control}
            placeholder={''}
            rules={{
              required: 'Products is required',
            }}
            keyboardType="numeric"
            value={additionalInputValue}
            onChange={val => {
              setAdditionalInputValue(val);
              setadditionalInputs(['', '']);
              handleGenerateAdditionalViews(val);
            }}
            maxLength={2}
          />
          {additionalInputValue > 0 && (
            <View>
              {additionalviews.map((_, additonalIndex) => (
                <View key={additonalIndex}>
                  <Text style={[styles.header, {marginTop: 20}]}>
                    Product {additonalIndex + 1}
                  </Text>
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 10,
                      padding: 10,
                    }}>
                    <View
                      style={{
                        backgroundColor: '#00AEEF1A',
                        padding: 10,
                        borderRadius: 10,
                      }}>
                      <Dropdown
                        style={[stepThreeStyle.dropdown]}
                        placeholderStyle={stepThreeStyle.placeholderStyle}
                        selectedTextStyle={stepThreeStyle.selectedTextStyle}
                        inputSearchStyle={stepThreeStyle.inputSearchStyle}
                        iconStyle={stepThreeStyle.iconStyle}
                        data={product}
                        search
                        maxHeight={300}
                        labelField="name"
                        valueField="id"
                        placeholder={
                          additionalProductSelected[additonalIndex]
                            ? additionalProductSelected[additonalIndex].name
                              ? additionalProductSelected[
                                  additonalIndex
                                ].name.toString()
                              : Languages.Select_product
                            : Languages.Select_product
                        }
                        searchPlaceholder={Languages.Search}
                        value={additionalProductSelected}
                        onChange={item => {
                          //setProductSelected(item);
                          additionalProductSelected.splice(
                            additonalIndex,
                            1,
                            item,
                          );
                          setAdditionalProductSelected(
                            additionalProductSelected,
                          );
                          handleAdditionalProducts(
                            additonalIndex,
                            additionalProductSelected[additonalIndex],
                          );
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: 10,
                        marginTop: 10,
                        borderRadius: 10,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#E6F2E680',
                      }}>
                      <View style={{width: '45%'}}>
                        <Text
                          style={{
                            color: '#666687',
                            fontSize: 14,
                            fontWeight: '500',
                          }}>
                          {Languages.Demo_Capacity}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '20%',
                          borderRadius: 5,

                          alignItems: 'center',
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 1,
                          },
                          shadowOpacity: 0.2,
                          shadowRadius: 1.41,
                          height: 40,
                          backgroundColor: '#81BE8333',
                          borderWidth: 1,
                          borderColor: '#81BE8333',
                        }}>
                        <KeyboardAwareScrollView>
                          <TextInput
                            ref={el =>
                              (additionalInputRefs.current[additonalIndex] = el)
                            }
                            placeholder={
                              additionalProductSelected[additonalIndex]
                                ? additionalProductSelected[
                                    additonalIndex
                                  ].qtyConsumed.toString()
                                : '0'
                            }
                            style={styles.textinput_txt}
                            onChangeText={text =>
                              handleAdditionalChange(text, additonalIndex)
                            }
                            value={additionalInputs[additonalIndex]}
                            clearButtonMode="always"
                            keyboardType="numeric"
                            maxLength={4}
                            placeholderTextColor={GlobalStyles.colorSet.Grey}
                          />
                        </KeyboardAwareScrollView>
                      </View>
                      <View
                        style={{
                          width: '20%',
                          borderRadius: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 1,
                          },
                          shadowOpacity: 0.2,
                          shadowRadius: 1.41,
                          height: 40,
                          backgroundColor: '#81BE8333',
                          borderWidth: 1,
                          borderColor: '#81BE8333',
                        }}>
                        <Text>
                          {additionalProductSelected[additonalIndex]
                            ? additionalProductSelected[additonalIndex].unit
                            : ''}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
      {stepNo === 10 && (
        <View>
          <CustomInput
            title={Languages.No_of_Participants}
            name="participantsCount"
            control={control}
            placeholder={''}
            rules={{
              required: 'Participants is required',
            }}
            keyboardType="numeric"
            value={participantsInputValue}
            onChange={val => {
              setParticipantsInputValue(val);
              handleGenerateParticipantsViews(val);
            }}
            maxLength={2}
          />
          {participantsInputValue > 0 && (
            <View>
              {participantsViews.map((_, index) => (
                <View key={index}>
                  <Text style={[styles.header, {marginTop: 20}]}>
                    Participants {index + 1}
                  </Text>
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 10,
                      padding: 10,
                    }}>
                    <KeyboardAvoidingView
                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                      keyboardVerticalOffset={Platform.OS === 'ios' ? 62 : 0}
                      style={{
                        flex: 1,
                        borderRadius: 10,
                      }}>
                      <View
                        style={{
                          width: '100%',
                          borderRadius: 5,

                          paddingLeft: 5,
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 1,
                          },
                          shadowOpacity: 0.2,
                          shadowRadius: 1.41,
                          height: 43,
                          backgroundColor: '#00AEEF1A',
                          borderWidth: 1,
                          borderColor: '#00AEEF1A',
                        }}>
                        {/* <KeyboardAwareScrollView
                          showsVerticalScrollIndicator={false}> */}
                        <TextInput
                          ref={el => (nameInputRefs.current[index] = el)}
                          placeholder={
                            oldParticipants[index]
                              ? oldParticipants[index].name
                              : Languages.Name
                          }
                          style={styles.textinput_txt}
                          onChangeText={text => handleNameChange(text, index)}
                          value={nameInputs[index]}
                          clearButtonMode="always"
                          keyboardType="name"
                          placeholderTextColor={'#666687'}
                        />
                        {/* </KeyboardAwareScrollView> */}
                      </View>
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView
                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                      keyboardVerticalOffset={Platform.OS === 'ios' ? 62 : 0}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        // padding: 10,
                        marginTop: 10,
                        borderRadius: 10,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: '48%',
                          borderRadius: 5,

                          paddingLeft: 5,
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 1,
                          },
                          shadowOpacity: 0.2,
                          shadowRadius: 1.41,
                          height: 43,
                          backgroundColor: '#E6F2E680',
                          borderWidth: 1,
                          borderColor: '#E6F2E680',
                        }}>
                        {/* <KeyboardAwareScrollView> */}
                          <TextInput
                            ref={el => (mobileNoInputRefs.current[index] = el)}
                            placeholder={
                              oldParticipants[index]
                                ? oldParticipants[index].mobileNumber
                                : Languages.MobileNo
                            }
                            style={styles.textinput_txt}
                            onChangeText={text => {
                              if (/[^0-9]/.test(text)) {
                                Alert.alert(
                                  'Invalid Input',
                                  'Please enter only numeric characters.',
                                );
                              } else {
                                handleMobileNoChange(text, index);
                              }
                            }}
                            value={mobileNoInputs[index]}
                            clearButtonMode="always"
                            keyboardType="numeric"
                            maxLength={10}
                            placeholderTextColor={'#666687'}
                          />
                        {/* </KeyboardAwareScrollView> */}
                      </View>
                      <View
                        style={{
                          width: '48%',
                          borderRadius: 5,

                          paddingLeft: 5,
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 1,
                          },
                          shadowOpacity: 0.2,
                          shadowRadius: 1.41,
                          height: 43,
                          backgroundColor: '#E6F2E680',
                          borderWidth: 1,
                          borderColor: '#E6F2E680',
                        }}>
                        {/* <KeyboardAwareScrollView> */}
                          <TextInput
                            ref={el => (roleInputRefs.current[index] = el)}
                            placeholder={
                              oldParticipants[index]
                                ? oldParticipants[index].role
                                : Languages.Role
                            }
                            style={styles.textinput_txt}
                            onChangeText={text => handleRoleChange(text, index)}
                            value={roleInputs[index]}
                            clearButtonMode="always"
                            keyboardType="name"
                            placeholderTextColor={'#666687'}
                          />
                        {/* </KeyboardAwareScrollView> */}
                      </View>
                    </KeyboardAvoidingView>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};
const stepThreeStyle = StyleSheet.create({
  listContainer: {
    marginTop: 20,
  },
  item: {
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  dropdown: {
    // height: 50,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderWidth: 2,
    borderColor: '#EDF1F3',
    //  elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    color: GlobalStyles.colorSet.Grey,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: 'black',
  },
  errorText: {
    marginTop: 10,
    color: 'red',
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: GlobalStyles.colorSet.light_blue,
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 14,
  },
});
export default StepTwoScreen;
