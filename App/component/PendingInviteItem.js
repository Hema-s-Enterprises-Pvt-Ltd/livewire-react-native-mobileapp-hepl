import React from 'react';
import {Text, View, Image,ImageBackground,StyleSheet} from 'react-native';
import GlobalStyles from '../core/GlobalStyles';
import {RFPercentage} from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';
import { Images } from '../common';

const PendingInviteItem = props => {
  let containerStyle;

  if (props.status === "DECLINED") {
    containerStyle = styles.declineflatContainer;
  } else if (props.status === "ACCEPTED") {
    containerStyle = styles.acceptflatContainer;
  } else {
    containerStyle = styles.pendingflatContainer;
  }
  return (
    <View style={containerStyle}>
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
            <Text style={[styles.header, {color: 'white'}]}>
              {props.name}
            </Text>
            <Text style={[styles.subHeader, {color: 'white'}]}>
              {props.detail}
            </Text>
          </View>
          <View
            style={{
              width: '20%',
              alignItems: 'flex-end',
              paddingRight: 10,
              justifyContent: 'center',
            }}>
          {
            props.status!="DECLINED" &&(
                <Image
          source={props.endImage}
          resizeMode="contain"
          style={{width:20,height:20,resizeMode:'contain',tintColor:'white'}}
        />
            )
          }
          
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
  },
  acceptflatContainer:{
    flexDirection: 'column',
     backgroundColor: "#389E0D",
     borderRadius: 5,
     marginTop: 5,
     marginLeft: 10,
     marginRight: 10,
     marginBottom: 5,
     elevation: 3,
     //borderWidth: 2,
  },
  pendingflatContainer: {
    flexDirection: 'column',
   // borderColor: GlobalStyles.colorSet.blue,
    backgroundColor: "#FDB022",
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    elevation: 3,
    //borderWidth: 2,
  },
  declineflatContainer: {
    flexDirection: 'column',
   // borderColor: GlobalStyles.colorSet.blue,
    backgroundColor: "#F97066",
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    elevation: 3,
    //borderWidth: 2,
  },
});
PendingInviteItem.propTypes = {
  status: PropTypes.string,
  name: PropTypes.string,
  detail: PropTypes.string,
  endImage: PropTypes.string,
};
export default PendingInviteItem;
