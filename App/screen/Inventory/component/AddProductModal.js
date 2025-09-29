import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Anticon from 'react-native-vector-icons/AntDesign';
import CustomButton from '../../../component/CustomButton';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  getQtyInHand,
  products,
  updateStock,
} from '../../../networkClient/apifunction';
import CustomInput from '../../../component/CustomInput';
import {useForm} from 'react-hook-form';
import CustomDropdown from '../../../component/CustomDropdown';
import { Languages } from '../../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const AddProductModal = ({visible, onClose, itemData}) => {
  const [product, setProduct] = useState();
  const [unitQty, setUnitQty] = useState('');
  const [isLoading, setLoading] = useState(false);
  const[QtyInHand,setQtyInHand]=useState('')
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
      product: '',
      matcode: '',
      quantity: '',
    },
  });

  useEffect(() => {
    crashlytics().log('AddProductModalScreen mounted');
    return () => {
      crashlytics().log('AddProductModalScreen unmounted');
    };
  }, []);
  // useEffect(() => {
  //   setValue('product', '', {
  //     shouldValidate: true,
  //     shouldDirty: true,
  //     shouldTouch: true,
  //   });
  //   setValue('matcode', '', {
  //     shouldValidate: true,
  //     shouldDirty: true,
  //     shouldTouch: true,
  //   });
  //   setValue('quantity', '', {
  //     shouldValidate: true,
  //     shouldDirty: true,
  //     shouldTouch: true,
  //   });
  //   setValue('QtyInHand', '', {
  //     shouldValidate: true,
  //     shouldDirty: true,
  //     shouldTouch: true,
  //   });
  //   getProductList();
  // }, []);
  useEffect(()=>{
    getProductList()
  },[])
  const getProductList = async () => {
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
  const submitClicked = async () => {
    const data = {
      productId: getValues().product,
      stock: getValues().quantity,
    };
    setLoading(true)
    if (data.productId && data.stock) {
      updateStock(data)
        .then(function (response) {
          if (response.data.statusCode == 200) {
            reset();
            onClose();
            setLoading(false)
          } else {
            Alert.alert(Languages.Alert, response.data.data.statusMessage);
            setLoading(false);
            reset();
          }
        })
        .catch(function (error) {
          Alert.alert(Languages.Alert, error.response.data.message);
          setLoading(false);
          reset();
        });
    } else {
      Alert.alert(Languages.Please_fill_all_the_fields);
      setLoading(false);
      reset();
    }
  };
  const dropDownHandlingProduct = data => {
    getQtyInHandData(data.id);
    setValue('matcode', data.id, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
 
  
  };
  const dropDownHandlingMatCode = data => {
    getQtyInHandData(data.id);
    setValue('product', data.id, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  const getQtyInHandData = async id => {
    getQtyInHand(id)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          setQtyInHand(response.data.data.totalWeight);
          setUnitQty(
            response.data.data.unitWeight + ' ' + response.data.data.unit,
          );
        } else {
          Alert.alert(Languages.Alert, response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.response.data.message);
      });
  };
  return (
    <Modal
      animationType="slide"
      isVisible={visible}
      swipeDirection={['down']}
      onSwipeComplete={onClose}
      propagateSwipe={true}
      onBackdropPress={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 62 : 0} 
        style={styles.bottomView}>
        <View style={styles.modalView}>
          <View style={{height: 20}} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: '10',
              paddingRight: 10,
            }}>
            <Text
              style={{
                color: '#212B36',
                fontSize: 18,
                marginLeft: 10,
                fontWeight: '700',
              }}>
              {Languages.Add_Stock}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={20} color="#212B36" />
            </TouchableOpacity>
          </View>
          <View style={{height: 20}} />
          <View style={{paddingLeft: 10, paddingRight: 10}}>
            <CustomDropdown
              title={Languages.Product_Name}
              name="product"
              control={control}
              placeholder={Languages.Select_Product_Name}
              valueFields="id"
              labelFields="name"
              data={product}
              rules={{required: Languages.Product_Name_required}}
              onValueChange={dropDownHandlingProduct}
            />
            <CustomDropdown
              title={Languages.Mat_Code}
              name="matcode"
              control={control}
              placeholder={Languages.Select_Mat_Code}
              valueFields="id"
              labelFields="code"
              data={product}
              rules={{required: Languages.Mat_Code_is_required}}
              onValueChange={dropDownHandlingMatCode}
            />
          </View>

          <View style={{height: 10}} />
          <View style={{paddingLeft: 10, paddingRight: 10}}>
            <CustomInput
              title={Languages.Quantity}
              name="quantity"
              control={control}
              placeholder={Languages.Enter_Quantity}
              keyboardType="numeric"
              maxLength={5}
              rules={{
                required:Languages.Quantity_required,
                pattern: {
                  value: /^[1-9]\d*(\.\d+)?$/,
                  message: Languages.Quantity_not_valid,
                },
              }}
            />
          </View>
          <View style={{height: 10}} />

          <View style={{paddingLeft: 10, paddingRight: 10}}>
            <Text style={styles.textinput_txt}>{Languages.Quantity_in_Hand}</Text>
            <View style={styles.textinput}>
              <Text style={styles.textinput_txt}>{QtyInHand}</Text>
            </View>
            <View
              style={{flexDirection: 'row', margin: 10, alignItems: 'center'}}>
              <Anticon
                name="exclamationcircleo"
                size={15}
                color="#919EAB"
                style={{marginRight: 10}}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: '#919EAB',
                }}>{`${Languages.Basic_Quantity} ${unitQty}`}</Text>
            </View>
            <View>
              <CustomButton text={Languages.Submit} disabled={!isValid}  loading={isLoading} onPress={submitClicked} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  textinput_txt: {
    fontSize: RFValue(14),
    fontWeight: 'semibold',
    textAlign: 'left',
    //  marginTop: 10,
    color: 'black',
  },
  textinput: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#EDF1F3',
    borderRadius: 5,
    padding: 10,
    height: 50,
    paddingHorizontal: 10,
    marginTop: 10,
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
  dropdown: {
    margin: 10,
    height: 50,
    backgroundColor: 'white',
    borderColor: '#E4E5E73D',
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    //  elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: 'black',
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginHorizontal: -20,
    marginVertical: -24,
  },
  modalView: {
    width: '100%',
    height: 'auto',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // justifyContent: 'space-around',
    marginTop: 20,
    borderRadius: 8,
    //padding: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    // marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
});

export default AddProductModal;
