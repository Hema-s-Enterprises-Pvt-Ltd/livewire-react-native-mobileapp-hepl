import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GlobalStyles from '../../../core/GlobalStyles';
import CustomButton from '../../../component/CustomButton';
import {RFValue} from 'react-native-responsive-fontsize';
import {products, updateProduct} from '../../../networkClient/apifunction';
import CustomInput from '../../../component/CustomInput';
import {useForm} from 'react-hook-form';
import {Languages} from '../../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const RequestStockModal = ({visible, onClose, itemData}) => {
  const [productvalue, setProductValue] = useState(null);
  const [product, setProduct] = useState();
  const [isLoading, setLoading] = useState(false);
  const {
    handleSubmit: handleSubmit,
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
      quantity: '',
      comments: '',
    },
  });
  useEffect(() => {
    crashlytics().log('RequestStockModalScreen mounted');
    return () => {
      crashlytics().log('RequestStockModalScreen unmounted');
    };
  }, []);

  useEffect(() => {
    setProduct();
    setProductValue();
    setValue('quantity', '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('comments', '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    getProductList();
  }, []);
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
      //productId: productvalue,
      productId: itemData.product.id,
      requestedQuantity: getValues().quantity,
      comments: getValues().comments,
    };
    setLoading(true);
    if (data.requestedQuantity && data.comments) {
      updateProduct(data)
        .then(function (response) {
          if (response.data.statusCode == 200) {
            setLoading(false);
            onClose();
            reset({
              quantity: '',
              comments: '',
            });
            
          } else {
            Alert.alert(Languages.Alert, response.data.data.statusMessage);
            setLoading(false);
            reset({
              quantity: '',
              comments: '',
            });
          }
        })
        .catch(function (error) {
          Alert.alert(Languages.Alert, error.response.data.message);
          setLoading(false);
          reset({
            quantity: '',
            comments: '',
          });
        });
    } else {
      Alert.alert(Languages.Please_fill_all_the_fields);
      setLoading(false);
      reset({
        quantity: '',
        comments: '',
      });
    }
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
              {Languages.Request_stock}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={20} color="#212B36" />
            </TouchableOpacity>
          </View>
          <View style={{height: 20}} />
          <Text
            style={{
              color: '#212B36',
              fontSize: 12,
              marginLeft: 10,
              fontWeight: 'semibold',
            }}>
            {Languages.Stock_request_instruction}
          </Text>
          <View style={{height: 20}} />
          <View style={{paddingLeft: 10, paddingRight: 10}}>
            <CustomInput
              title={Languages.Product_Name}
              isEditable={false}
              name="product"
              control={control}
              placeholder={itemData.product.name}
              keyboardType="name"
            />
          </View>
          <View style={{height: 10}} />
          <View style={{paddingLeft: 10, paddingRight: 10}}>
            <CustomInput
              title={Languages.Quantity_Needed}
              name="quantity"
              control={control}
              placeholder={Languages.Enter_Quantity}
              keyboardType="numeric"
              maxLength={5}
              rules={{
                required: Languages.Quantity_required,
                pattern: {
                  value: /^[1-9]\d*(\.\d+)?$/,
                  message: Languages.Quantity_not_valid,
                },
              }}
            />
          </View>
          <View style={{height: 10}} />
          <View style={{paddingLeft: 10, paddingRight: 10}}>
            <CustomInput
              title={Languages.Comments}
              name="comments"
              control={control}
              placeholder={Languages.Enter_comments}
              keyboardType="name"
              rules={{
                required: Languages.Comments_required,
              }}
            />

            <View>
              <CustomButton text={Languages.Submit} disabled = {!isValid} loading={isLoading} onPress={handleSubmit(submitClicked)} />
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
    borderWidth: 1,
    borderColor: GlobalStyles.colorSet.light_grey,
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    // elevation: 3
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

export default RequestStockModal;
