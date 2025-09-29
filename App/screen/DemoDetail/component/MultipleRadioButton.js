import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import GlobalStyles from '../../../core/GlobalStyles';
const MultipleRadioButton = props => {
  return (
    <View style={{margin: 10}}>
      <View style={{flexDirection: 'row'}}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'left',
            //  marginTop: 10,
            color: 'black',
          }}>
          {props.questionNumber}.
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'left',
            //  marginTop: 10,
            paddingLeft: 5,
            color: 'black',
          }}>
          {props.title}
        </Text>
      </View>
      <View style={{marginTop: 20}}>
        {props.options.map((item, index) => (
          <View style={{width: '100%'}}>
            <View style={styles.radioGroup}>
              <View style={styles.radioButton}>
                <RadioButton.Android
                  value={item}
                  status={
                    props.selectedValue === item ? 'checked' : 'unchecked'
                  }
                  color={GlobalStyles.colorSet.orange}
                  disabled={props.selectedValue === item ? false : true}
                />
                <Text style={styles.radioLabel}>{item}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    backgroundColor: '#F781041A',
    width: '100%',
    borderRadius: 5,
    padding: 5,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#161C24',
  },
  radioGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 5,
  },
});
export default MultipleRadioButton;
