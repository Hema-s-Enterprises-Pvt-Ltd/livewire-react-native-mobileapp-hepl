import React from "react";
import { TextInput, View,Image,TouchableOpacity,Platform } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dimensions, StyleSheet } from "react-native";
import GlobalStyles from "../core/GlobalStyles";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Images } from "../common";

const SearchInput = (props) => {
    return (
        <View style={styles.textinput}>
             <Image
            source={Images.Search}
            style={{
              width: 20,
              height: 20,
              marginRight:5,
              resizeMode: 'contain',
            }}
          />
            <KeyboardAwareScrollView >
                <TextInput placeholder={props.placeholder} 
                style={styles.textinput_txt} 
                onChangeText={props.onChangeText} 
                ref={props.Ref} 
                clearButtonMode="always" 
                //keyboardType={props.keyboardType}
                placeholderTextColor={GlobalStyles.colorSet.Grey}/>
            </KeyboardAwareScrollView>
            { Platform.OS === 'android' &&
               props.showClose?
                <TouchableOpacity onPress={props.onClose} style={{marginRight:10}}>
                <Icon name="close" size={20} color={GlobalStyles.colorSet.Grey} />
              </TouchableOpacity>
              :<View/>
            }
        </View>
    )
}
const styles = StyleSheet.create(
    {
        textinput: {
            borderWidth: 1,
            borderColor: 'white',
            backgroundColor: 'white',
            marginTop: 10,
            marginBottom:10,
            borderRadius: 10,
            paddingLeft: 10,
            flexDirection: 'row',
            alignItems: 'center',
            elevation: 3
        },
        textinput_txt: {
            fontSize: 16, color: GlobalStyles.colorSet.Grey,
            height:50
        },
    }
)

export default SearchInput;