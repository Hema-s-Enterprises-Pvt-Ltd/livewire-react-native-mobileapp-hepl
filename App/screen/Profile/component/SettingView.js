import React ,{useEffect } from 'react';
import {View, Text} from 'react-native';
import GlobalStyles from '../../../core/GlobalStyles';
import {styles} from '../ProfileStyles';
import {Switch} from 'react-native-paper';
import { RadioButton } from 'react-native-paper'; 
import { Languages } from '../../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const SettingView = props => {
  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('SettingView mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('SettingView unmounted');
    };
  }, []);
  return (
    <View
      style={{
        backgroundColor: 'white',
        margin: 10,
        padding: 10,
        borderRadius: 5,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={[styles.header]}>{props.title}</Text>
        <Switch
          trackColor={{
            true: GlobalStyles.colorSet.orange,
            false: GlobalStyles.colorSet.light_grey,
          }}
          color={GlobalStyles.colorSet.orange}
          value={props.value}
          onValueChange={props.onValueChange}
        />
      </View>
      {props.isDemoRemainder ? 
      <View>
        <View style={{width:"100%"}}>
              <View style={styles.radioGroup}> 
              <View style={styles.radioButton}> 
              <RadioButton.Android 
                        value="1 Day Before"
                        status={props.yesStatus} 
                        onPress={props.onYesPress} 
                        color={GlobalStyles.colorSet.orange}
                    /> 
                    <Text style={styles.radioLabel}> 
                   {Languages.One_Day_Before}
                    </Text> 
                </View> 
  
                <View style={styles.radioButton}> 
                    <RadioButton.Android 
                        value="4 Hrs Before"
                        status={props.nostatus} 
                        onPress={props.onNoPress} 
                        color={GlobalStyles.colorSet.orange}
                    /> 
                    <Text style={styles.radioLabel}> 
                   {Languages.four_Hrs_Before}
                    </Text> 
                </View>
                </View>
                </View>
      </View> : <View />}
    </View>
  );
};

export default SettingView;
