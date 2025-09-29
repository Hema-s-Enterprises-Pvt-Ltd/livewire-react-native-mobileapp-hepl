import React from 'react';
import {Text, View, Image,ImageBackground} from 'react-native';
import {Dimensions, StyleSheet} from 'react-native';
import GlobalStyles from '../../../core/GlobalStyles';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Anticon from 'react-native-vector-icons/AntDesign';
import { Images } from '../../../common';

const ClientListName = (props) => {
  const buttonBackground = '#e6f8ff';
  const buttonText = "#333";

  return (
    <View style={[styles.flatContainer, { backgroundColor: buttonBackground }]}>
      <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
        {props.item.clientImage ? (
          <Image
            source={{ uri: props.item.clientImage }}
            resizeMode="stretch"
            style={styles.Image}
          />
        ) : (
          <Image
            source={Images.Person}
            resizeMode="stretch"
            style={[styles.Image, { tintColor: "white" }]}
          />
        )}
        <View style={{flex:0.9}}>
            <Text style={[styles.header, { color: buttonText }]}>
              {props.item.name}
            </Text>
            <Text style={[styles.subHeader, { color: buttonText }]}>
              {props.item.location}
            </Text>
          </View>
        </View>

          <View style={{alignItems:'center'}}>
            <Anticon name='exclamationcircleo' size={20} color='#000000'></Anticon>
          </View>
        
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    fontSize: RFPercentage(2.0),
    fontWeight: 'bold',
    textAlign: 'left',
    //  marginTop: 10,
    color: 'black',
    fontWeight: '500',
  },
  subHeader: {
    fontSize: RFPercentage(1.5),
    
    textAlign: 'left',
    color: GlobalStyles.colorSet.Grey,
    marginTop: 5,
  },
  Image: {
    borderWidth: 2,
    borderColor: 'white',
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 50,
    borderWidth: 2,
  },
  flatContainer: {
    flexDirection: 'column',
    backgroundColor: GlobalStyles.colorSet.blue,
    paddingVertical:10,
    paddingHorizontal:10,
    borderRadius: 5,
    marginVertical:5,
    marginHorizontal:10,
    elevation: 3,
    
  },
});

export default ClientListName;
