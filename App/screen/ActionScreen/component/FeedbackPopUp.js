import React from 'react';
import {View, Text,StyleSheet} from 'react-native';
import { RFPercentage,RFValue } from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image'
import { Images, Languages } from '../../../common';
import { Image } from 'react-native-svg';

const FeedbackPopUp = ({visible, onClose}) => {
  return (
    <Modal
      animationType="slide"
      isVisible={visible}
      onBackdropPress={onClose}
      >
       <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{borderRadius: 10, width: '100%', height: 'auto'}}>
            <View style={{height:300,width:"100%"}}>
            <FastImage source={Images.FeedBack} style={{width:"100%",height:300}} resizeMode='cover'/>
            </View>
           <Text style={{alignItems:'center',margin:10,color:'#666687'}}>
         {Languages.FeedbackSubmitted}
           </Text>
            
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  addressText:{
    fontSize: RFValue(12),
    fontWeight: '500',
    textAlign: 'left',
    color: '#666687'
  },
  detailChildContainer:{
    flexDirection: 'column',
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalView: {
    width: '90%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
   // justifyContent: 'center',
  },
  header: {
    fontSize: RFPercentage(2.0),
    fontWeight: 'bold',
    textAlign: 'left',
    //  marginTop: 10,
    paddingLeft:10,
    color: 'black',
  },
});

export default FeedbackPopUp;
