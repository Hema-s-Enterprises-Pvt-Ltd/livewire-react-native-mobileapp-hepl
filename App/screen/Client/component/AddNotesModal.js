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
import {RFValue} from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GlobalStyles from '../../../core/GlobalStyles';
import CustomButton from '../../../component/CustomButton';
import {
  getSalesDemoIdList,
  updateNotes,
} from '../../../networkClient/apifunction';
import {useForm} from 'react-hook-form';
import CustomInput from '../../../component/CustomInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';
import {Languages} from '../../../common';
import CustomDropdown from '../../../component/CustomDropdown';

const AddNotesModal = ({visible, onClose, clientID}) => {
  const [data, setData] = useState([]);
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
      notes: '',
      demovalue: '',
    },
  });
  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('AddNotesModalScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('AddNotesModalScreen unmounted');
    };
  }, []);

  useEffect(() => {
    getDemoList();
  }, []);

  const getDemoList = async () => {
    getSalesDemoIdList()
      .then(function (response) {
        if (response.data.statusCode == 200) {
          const res = response.data.data;
          if (res != null) {
            setData(res);
          } else {
            setData([]);
          }
        } else {
          Alert.alert('Alert', response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert('Alert', error.message);
      });
  };

  const submitClicked = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const updatedNotes = getValues().notes;
    const DemoId = getValues().demovalue;
    const data = {
      id: 0,
      clientId: clientID,
      demoId: DemoId,
      notes: updatedNotes,
      salesmanId: userId,
    };

    if (DemoId && updatedNotes != '') {
      updateNotes(data)
        .then(function (response) {
          if (response.data.statusCode == 200) {
            reset();
            onClose();
          } else {
            Alert.alert('Alert', response.data.data.statusMessage);
          }
        })
        .catch(function (error) {
          Alert.alert('Alert', error.response.data.message);
        });
    } else {
      Alert.alert('Please fill all the field');
    }
  };

  return (
    <Modal
      animationType="slide"
      isVisible={visible}
      swipeDirection={['down']}
      onSwipeComplete={()=>{
        reset()
        onClose()
      }}
      propagateSwipe={true}
      onBackdropPress={()=>{
        reset()
        onClose()
      }}
      >
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
              Add Notes
            </Text>
            <TouchableOpacity
              onPress={() => {
                reset();
                onClose();
              }}>
              <Icon name="close" size={20} color="#212B36" />
            </TouchableOpacity>
          </View>

          <View style={{height: 10}} />
          <View style={{marginLeft: 10, marginRight: 10}}>
            <CustomDropdown
              title={'Demo ID'}
              name="demovalue"
              control={control}
              placeholder={Languages.Select_Demo}
              data={data}
              rules={{required: 'Demo required'}}
              valueFields="id"
              labelFields="generatedDemoId"
            />
          </View>
          <View style={{height: 10}} />
          <View style={{paddingLeft: 10, paddingRight: 10}}>
            <CustomInput
              title="Enter Notes"
              name="notes"
              control={control}
              placeholder="Enter Notes"
              keyboardType="name"
              rules={{
                required: 'Notes is required',
              }}
            />
          </View>
          <View style={{height: 10}} />
          <View style={{paddingLeft: 10, paddingRight: 10}}>
            <View>
              <CustomButton text="Submit" onPress={submitClicked} />
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

export default AddNotesModal;
