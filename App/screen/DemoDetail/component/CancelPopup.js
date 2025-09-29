import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { RFValue } from 'react-native-responsive-fontsize';
import { Languages } from '../../../common';
import CustomInput from '../../../component/CustomInput';
import { useForm } from 'react-hook-form';
import { cancelDemo } from '../../../networkClient/apifunction';
const CancelPopup = ({ visible, onClose,id,onCloseSuccess }) => {

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
      reason: '',
    },
  });
  const onChangeValue =(text)=>{
      
  }
  const CancelDemo = async () => {
      var data = {
        demoId: id,
        notes: getValues().reason,
      };
      await cancelDemo(data)
        .then(function (response) {
          onCloseSuccess(response)
        })
        .catch(function (error) {
          Alert.alert(Languages.Alert, error.response.data.message);
        });
    
  };
  const handleCancelClick = () => {
   
    if (isValid) {
      CancelDemo();  
    }else{
      Alert.alert(Languages.Alert,Languages.Reason_required)
    }
  };
  const onClosePopUp= ()=>{
    reset();
    onClose();
  }

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
        <Text style={styles.title}>{Languages.Do_you_want_to_Cancel_the_demo}</Text>
        <View style={{width:'100%',marginTop:0,paddingVertical:20}}>
        <CustomInput
                    title={''}
                    name="reason"
                    control={control}
                    onChange = {onChangeValue}
                    placeholder={Languages.Enter_reason_here}
                    rules={{
                      required: "Reason is Required",
                    }}
                  />

        </View>
       
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onClosePopUp} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>{Languages.Close}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancelClick} disabled={!isValid} style={[styles.logoutButton,!isValid && {opacity:0.5} ]}>
            <Text style={styles.logoutButtonText}>{Languages.Cancel_Demo}</Text>
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
    marginTop:10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    width:"100%"
  },
  cancelButton: {
    width:"45%"
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

export default CancelPopup;
