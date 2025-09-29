import React from "react";
import { TextInput, View,StyleSheet } from 'react-native'
import GlobalStyles from "../core/GlobalStyles";
import PropTypes from 'prop-types';

const Input = (props) => {
    return (
        <View style={styles.textinput}>
            
                <TextInput 
                placeholder={props.placeholder} 
                style={styles.textinput_txt} 
                onChangeText={props.onChangeText} 
                ref={props.Ref} 
                clearButtonMode="always" 
                keyboardType={props.keyboardType}
                maxLength={props.maxLength}
                placeholderTextColor={GlobalStyles.colorSet.Grey}/>
           
        </View>
    )
}
const styles = StyleSheet.create(
    {
        textinput: {
            backgroundColor:'#fff',
  borderWidth: 2,
  borderColor:'#EDF1F3',
  borderRadius:5,
  padding:5,
  height:50,
  paddingHorizontal:10,
  marginTop:10
        },
        textinput_txt: {
            fontSize: 14, color:"#D0D5DD",
            
        },
        input:{
            backgroundColor:'#fff',
            borderWidth: 2,
            borderColor:'#EDF1F3',
            borderRadius:5,
            padding:10,
            height:50,
            
            marginTop:10
            },
    }
)
Input.propTypes = {
    placeholder: PropTypes.string,
  };
  Input.propTypes = {
    placeholder: PropTypes.string,
    onChangeText: PropTypes.func,
    keyboardType: PropTypes.string,
    maxLength: PropTypes.number,
  };

export default Input; 