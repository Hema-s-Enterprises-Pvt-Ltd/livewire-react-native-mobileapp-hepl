import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import GlobalStyles from '../../../core/GlobalStyles';

const CardView = props => {
  return (
    <View style={styles.flatContainer}>
      <View
        style={{
          flexDirection: 'row',
          height: 'auto',
          flexWrap: 'wrap',
        }}>
        <View style={{width: props.isProfile ? '20%' : '10%'}}>
          <Image
            source={props.startImage}
            resizeMode="contain"
            style={props.isProfile ? styles.Image : styles.IconImage}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: props.isProfile ? '80%' : '90%',
          }}>
          <View
            style={{
              flexDirection: 'column',
              // width: '100%',
              // height: 'auto',
            }}>
            <Text style={props.isProfile ? styles.header : styles.titleheader}>
              {props.name}
            </Text>
            {props.hideDescription ? (
              <View />
            ) : (
              <Text style={styles.subHeader}>{props.jobDescription}</Text>
            )}
          </View>
          <View
            style={{
              width: '20%',
              alignItems: 'flex-end',
              paddingRight: 10,
              justifyContent: 'center',
            }}>
            <Image
              source={props.endImage}
              resizeMode="contain"
              style={props.isProfile?styles.logoutImg:styles.rightArrowImg}
            />
          </View>
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
  },
  titleheader: {
    fontSize: RFPercentage(2.0),
    fontWeight: '500',
    textAlign: 'left',
    //  marginTop: 10,
    color: '#4E4E4E',
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
    resizeMode: 'contain',
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 50,
    borderWidth: 2,
  },
  IconImage: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
    marginRight: 10,
    alignContent: 'flex-start',
  },
  logoutImg: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
    marginRight: 10,
    alignContent: 'flex-end',
  },
  rightArrowImg: {
    resizeMode: 'contain',
    width: 10,
    height: 10,
    marginRight: 10,
    alignContent: 'flex-end',
  },
  flatContainer: {
    backgroundColor: GlobalStyles.colorSet.app_bg,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
  },
});
export default CardView;
