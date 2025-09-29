import React from 'react';
import {Text, View, Image,ImageBackground} from 'react-native';
import {Dimensions, StyleSheet} from 'react-native';
import GlobalStyles from '../core/GlobalStyles';
import {RFPercentage} from 'react-native-responsive-fontsize';
import { Images } from '../common';

const RenderItem = props => {
  const buttonBackground =
    props.status === 'CANCELLED'
      ? 'white'
      : props.status === 'COMPLETED'
      ? GlobalStyles.colorSet.demo_complete_green
      : GlobalStyles.colorSet.blue;
      const buttonBorder =
      props.status === 'CANCELLED'
        ? GlobalStyles.colorSet.blue
        : props.status === 'COMPLETED'
        ? GlobalStyles.colorSet.demo_complete_green
        : GlobalStyles.colorSet.blue;
  const buttonText =
    props.status === 'CANCELLED' ? GlobalStyles.colorSet.blue : 'white';
  return (
    <View style={[styles.flatContainer,{backgroundColor:buttonBackground,borderColor:buttonBorder}]}>
        <ImageBackground
          source={Images.BackgroundPattern}
          resizeMode={'cover'}
          style={{
            height: 'auto',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,
          }}>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          flexWrap: 'wrap',
        }}>
        {
            props.image!=null&&props.image!=""?
          <Image
          source={{uri:props.image}}
          resizeMode="stretch"
          style={styles.Image}
        />:
        <Image
          source={Images.Person}
          resizeMode="stretch"
          style={[styles.Image,{tintColor:"white"}]}
        />
        }

        <View style={{width: '65%', flexDirection: 'row'}}>
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              height: 'auto',
            }}>
            <Text style={[styles.header, {color: buttonText}]}>
            {props.demoId}  
            </Text>
            <Text style={[styles.subHeader, {color: buttonText}]}>
              {/* --------> Dinesh design changes to display assignee name start <------- */}
            Assigned By :{props.name} • {props.status==="CANCELLED"?"Cancelled":props.detail}
            </Text>
            <Text style={[styles.subHeader, {color: buttonText}]}>
              Assigned To : {props.assignee} 
            </Text>
              {/* --------> Dinesh design changes to display assignee name end <------- */}
          </View>
          <View
            style={{
              width: '20%',
              alignItems: 'flex-end',
              paddingRight: 10,
              justifyContent: 'center',
            }}>
            {/* <Icon name="info" size={20} color="white" /> */}
            <Image source={Images.Info} style={{width:20,height:20,tintColor:'white'}}/>
          </View>
          
        </View>
        
      </View>
      </ImageBackground>
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
  },
  subHeader: {
    fontSize: RFPercentage(1.5),
    fontWeight: '500',
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
    borderColor: GlobalStyles.colorSet.blue,
    backgroundColor: GlobalStyles.colorSet.blue,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    elevation: 3,
    borderWidth: 1,
  },
});

export default RenderItem;
