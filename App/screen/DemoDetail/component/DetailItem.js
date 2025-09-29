import React from 'react';
import {View, Text, Image} from 'react-native';
import GlobalStyles from '../../../core/GlobalStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomefive from 'react-native-vector-icons/FontAwesome5';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Maticon from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';

const DetailItem = props => {
  return (
    <View style={{width: '100%', padding: 10, flexDirection: 'row'}}>
      {props.image == 'Ionicon' && <Ionicon name="location-outline" size={20} color="#666687" />}
      {props.image == 'MaterialCommunityIcons' && <Icons name="watch" size={20} color={GlobalStyles.colorSet.blue} />}
      {props.image == 'FontAwesomefive' && <FontAwesomefive name="pump-soap" size={20} color="#666687" />}
      {props.image == 'SimpleIcon' && <FontAwesomefive name="fire-alt" size={20} color="#666687" />}
      {props.image == 'Maticon-Info' && <Maticon name="info-outline" size={20} color="#666687" />}
      {props.image == 'Ionicon-person' && <Ionicon name="person-outline" size={20} color="#666687" />}
      {props.image == 'Octicons-mobile' && <Octicons name="device-mobile" size={20} color="#666687" />}
      {props.image == 'Maticon-gps' && <Maticon name="gps-fixed" size={20} color="#666687" />}
      <Text
        style={{
          fontSize: RFValue(12),
          fontWeight: '500',
          textAlign: 'left',
          color:props.isheader?GlobalStyles.colorSet.blue:"#666687",
          marginLeft:10
        }}>
        {props.title}
      </Text>
    </View>
  );
};
export default DetailItem;
