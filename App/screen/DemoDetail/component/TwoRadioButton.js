import React from 'react';
import { View,Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import GlobalStyles from '../../../core/GlobalStyles';
import { RFValue } from 'react-native-responsive-fontsize';
const TwoRadioButton=(props)=>{
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
        <View style={{width: '100%', flexDirection: 'row'}}>
          <View style={styles.radioGroup}>
            <View style={styles.radioButton}>
              <RadioButton.Android
                value={'Yes'}
                status={props.selectedValue === 'Yes' ? 'checked' : 'unchecked'}
                color={GlobalStyles.colorSet.orange}
                disabled={props.selectedValue === 'Yes' ? false : true}
              />
              <Text style={styles.radioLabel}>{'Yes'}</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton.Android
                value={'No'}
                status={props.selectedValue === 'No' ? 'checked' : 'unchecked'}
                color={GlobalStyles.colorSet.orange}
                disabled={props.selectedValue === 'No' ? false : true}
              />
              <Text style={styles.radioLabel}>{'No'}</Text>
            </View>
          </View>
        </View>
        {props.selectedValue === 'Yes' && (
          <View style={styles.textinput}>
            <Text style={styles.textinput_txt}>{props.comments}</Text>
          </View>
        )}
      </View>
    );
}
const styles=StyleSheet.create({
    textinput: {
        backgroundColor: 'white',
        borderColor: '#E4E5E73D',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 50,
      },
      textinput_txt: {
        fontSize: RFValue(12),
        fontWeight: 'semibold',
        textAlign: 'left',
        //  marginTop: 10,
        color: GlobalStyles.colorSet.light_grey,
      },
    radioButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginLeft:5,
        backgroundColor:'#F781041A',
        width:"50%",
        borderRadius:5,
        padding:5
    }, 
    radioLabel: { 
        marginLeft: 8, 
        fontSize: 14,
        fontWeight:"500", 
        color: '#161C24', 
    }, 
    radioGroup: { 
      flexDirection: 'row', 
      width:"100%",
      justifyContent:'space-between', 
      marginTop: 20, 
      borderRadius: 8, 
      padding: 5, 
    }, 
})
export default TwoRadioButton;