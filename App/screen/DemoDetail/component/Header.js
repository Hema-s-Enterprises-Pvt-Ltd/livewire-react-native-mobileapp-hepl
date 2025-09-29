import React from 'react';
import {View,Text} from 'react-native';
import { styles } from '../DemoDetailStyles';

const Header=(props)=>{
    return(
        <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
        <Text style={styles.header}>{props.title}</Text>
        <View
          style={{
            backgroundColor: '#00AEEF26',
            borderRadius: 20,
            padding: 8,
            marginLeft: 10,
          }}>
          <Text style={styles.stepText}>Step {props.stepNo}</Text>
        </View>
      </View>
    )
}
export default Header;
