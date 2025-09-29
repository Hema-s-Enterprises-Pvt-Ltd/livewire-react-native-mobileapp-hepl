import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {styles} from './ActionStyles';
import PropTypes from 'prop-types';
import CustomInput from '../../component/CustomInput';
import {Images, Languages} from '../../common';

const StepThreeScreen = ({
  demoId,
  clientName,
  stepNo,
  header,
  onHeaderClicked,
  control,
  editInputText,
}) => {
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
      <View style={{height: 10}} />
      {stepNo === 11 && (
        <View>
          <Text style={styles.textinput_txt}>{Languages.Demo_ID}</Text>
          <View style={styles.textinput}>
            <Text style={styles.textinput_txt}>{demoId}</Text>
          </View>
          <View style={{height: 10}} />
          <Text style={styles.textinput_txt}>{Languages.Client}</Text>
          <View style={styles.textinput}>
            <Text style={styles.textinput_txt}>{clientName}</Text>
          </View>
          <View style={{height: 10}} />

          <CustomInput
            title={Languages.Enter_Name}
            name="name"
            control={control}
            placeholder={Languages.Enter_Name}
            isEditable={editInputText}
            rules={{
              required: Languages.Name_is_required,
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: Languages.Only_Alphabets_are_Allowed,
              },
            }}
          />

          <View style={{height: 10}} />

          <CustomInput
            title={Languages.Enter_Mobile_Number}
            name="mobileNo"
            control={control}
            placeholder={Languages.Enter_Mobile_Number}
            keyboardType="numeric"
            maxLength={10}
            isEditable={editInputText}
            rules={{
              required: Languages.Mobile_No_is_required,
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: Languages.Mobile_is_not_valid,
              },
            }}
          />
        </View>
      )}
    </View>
  );
};

export default StepThreeScreen;

StepThreeScreen.propTypes = {
  header: PropTypes.string,
  stepNo: PropTypes.number,
  demoId: PropTypes.string,
  clientName: PropTypes.string,
  onChangeTextName: PropTypes.func,
  onChangeTextMobileNo: PropTypes.func,
};
