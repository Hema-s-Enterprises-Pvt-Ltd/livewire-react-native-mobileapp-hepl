import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, Image, TouchableOpacity, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Dropdown} from 'react-native-element-dropdown';
import GlobalStyles from '../../../core/GlobalStyles';
import CustomButton from '../../../component/CustomButton';
import { RadioButton } from 'react-native-paper'; 
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { getSalesDemoIdList, products, updateSales } from '../../../networkClient/apifunction';
import { useForm } from 'react-hook-form';
import CustomInput from '../../../component/CustomInput';
import { Languages } from '../../../common';
import CustomDropdown from '../../../component/CustomDropdown';
import DatePickerInput from '../../../component/DatePicker';
import crashlytics from '@react-native-firebase/crashlytics';

const AddSalesModal = ({visible, onClose,clientID}) => {
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
 
  const [valueProduct, setValueProduct] = useState(null);
  const [isFocusProduct, setIsFocusProduct] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [textshow, settextshow] = useState(false);
  const [product, setProduct] = useState([]);
  const [data, setData] = useState([]);
  const [loading,setLoading] = useState(false)
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
     quantity:'',
     amount:'',
     productName:'',
     demoId:'',
     date:''

    },
  });
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (selectedDate) => {
    setDate(moment(selectedDate).format('YYYY-MM-DD'));
    settextshow(true)
    hideDatePicker();
  };
  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('AddSalesModalScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('AddSalesModalScreen unmounted');
    };
  }, []);
  useEffect(() => {
    if (visible) {
      // Reset values when the modal opens
      setSelectedValue('');
      setProduct([]); 
      settextshow(false);
      
  
      // Fetch data
      getProductList();
      getDemoList();
    }else{
      reset()
    }
  }, [visible]);
  const getProductList=async()=>{
    products().then(function (response) {
      if (response.data.statusCode == 200) {
          const res = response.data.data;
          setProduct(res === null ? [] : res);
      } else {
          Alert.alert("Alert", response.data.data.statusMessage);
      }
  }).catch(function (error) {
      Alert.alert("Alert", error.message);
  });
  }
  const   getDemoList=async()=>{
    getSalesDemoIdList().then(function (response) {
      if (response.data.statusCode == 200) {
          const res = response.data.data;
          setData(res === null ? [] : res);
      } else {
          Alert.alert("Alert", response.data.data.statusMessage);
      }
  }).catch(function (error) {
      Alert.alert("Alert", error.message);
  });
  }
const onSelectProduct = data =>{
  setValueProduct(data.id);
}
const onSelectDemoId = data =>{
  // setvalue(data.id);
}

const handleDateChange = date => {

};
  const submitClicked=async()=>{

    const originalDate = getValues().date;
    const parsedDate = moment(originalDate, 'DD-MM-YYYY');
    const formattedDate = parsedDate.format('YYYY-MM-DD');
    const data={
      salesType: selectedValue,
      clientId: clientID,
      demoId: getValues().demoId,
      productId: getValues().productName,
      qtySold: getValues().quantity,
      amount: getValues().amount,
      soldDate: formattedDate
    }
    setLoading(true);
   if(selectedValue&&isValid){
    updateSales(data).then(function (response) {
      if (response.data.statusCode == 200) {
        onClose();  
        setLoading(false)   
      } else {
          Alert.alert("Alert", response.data.data.statusMessage);
          setLoading(false)
      }
  }).catch(function (error) {
    setLoading(false)   
      Alert.alert("Alert", error.response.data.message);
  });
   }else{
    setLoading(false)   
    Alert.alert("Please fill all the field")
   }
  }

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
            Add Sales
            </Text>
         <TouchableOpacity onPress={onClose}>
         <Icon name="close" size={20} color="#212B36"/>
         </TouchableOpacity>
          </View>
          <View style={{width:"100%"}}>
              <View style={styles.radioGroup}> 
              <View style={styles.radioButton}> 
              <Text style={styles.radioLabel}> 
                    Up-sell
                    </Text> 
              <RadioButton.Android 
                        value="UP_SELL"
                        status={selectedValue === 'UP_SELL' ? 'checked' : 'unchecked'} 
                        onPress={() => setSelectedValue('UP_SELL')} 
                        color={GlobalStyles.colorSet.orange}
                    /> 
                  
                </View> 
  
                <View style={styles.radioButton}> 
                <Text style={styles.radioLabel}> 
                    Cross-sell
                    </Text> 
                    <RadioButton.Android 
                        value="CROSS_SELL"
                        status={selectedValue === 'CROSS_SELL' ? 'checked' : 'unchecked'} 
                        onPress={() => setSelectedValue('CROSS_SELL')} 
                        color={GlobalStyles.colorSet.orange}
                    /> 
                   
                </View>
                <View style={styles.radioButton}> 
                <Text style={styles.radioLabel}> 
                    Direct-sale
                    </Text> 
                    <RadioButton.Android 
                        value="DIRECT_SALE"
                        status={selectedValue === 'DIRECT_SALE' ? 'checked' : 'unchecked'} 
                        onPress={() => setSelectedValue('DIRECT_SALE')} 
                        color={GlobalStyles.colorSet.orange}
                    /> 
                  
                </View>
                </View>
                </View>
          <View style={{height: 10}} />
          
        
          <View style={{paddingHorizontal:10}}>
          <CustomDropdown
            title={"Demo ID"}
            name="demoId"
            control={control}
            placeholder={'Select Demo'}
            valueFields="id"
            labelFields="generatedDemoId"
            data={data}
            rules={{required:"Demo-Id is Required"}}
            onValueChange={onSelectDemoId}
          />
           
         
          <CustomDropdown
            title={"Product Name"}
            name="productName"
            control={control}
            placeholder={Languages.Select_Product_Name}
            valueFields="id"
            labelFields="name"
            data={product}
            rules={{required:"Product is Required"}}
            onValueChange={onSelectProduct}
          />
          </View>
         
          <View style={{height: 10}} />
          <View style={{paddingLeft:10,paddingRight:10}}>
          <CustomInput
                title="Quantity Sold"
                name="quantity"
                control={control}
                placeholder="Enter  Quantity Sold"
                keyboardType="numeric"
                maxLength={5}
                rules={{
                  required: ' Quantity Sold is required',
                  pattern: {
                    value: /^\d+$/,
                    message: ' Quantity Sold is not valid',
                  },
                }}
              />
          </View>
          <View style={{height: 10}} />
         <View style={{paddingLeft:10,paddingRight:10}}>
         <CustomInput
                title="Amount"
                name="amount"
                control={control}
                placeholder="Enter Amount"
                keyboardType="numeric"
                rules={{
                  required: 'Amount is required',
                  pattern: {
                    value: /^\d+$/,
                    message: 'Amount is not valid',
                  },
                }}
              />
             
     <View>
     <View style={{height:10}}/>
     <View style = {{paddingHorizontal:5}}>
     <DatePickerInput
                title={Languages.SaleDate}
                name="date"
                maximumDate={new Date()}
                control={control}
                onDateChange={handleDateChange} // Pass the callback function
                rules={{
                  required: "Date is required",
                }}
              />
     </View>
        
  
     <CustomButton text="Submit" disabled={!isValid} loading={loading} onPress={submitClicked}/>
     </View>
         </View>
         
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
    textinput_txt:{
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
   marginLeft: 8, 
    fontSize: 16, 
    color: '#333', 
}, 
});

export default AddSalesModal;
