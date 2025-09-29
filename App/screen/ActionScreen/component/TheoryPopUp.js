import React from 'react';
import {View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import { RFPercentage,RFValue } from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image'
import DetailItem from '../../DemoDetail/component/DetailItem';
import GlobalStyles from '../../../core/GlobalStyles';
import { Images, Languages } from '../../../common';

const TheoryPopUp = ({visible, onClose}) => {
  return (
    <Modal
      animationType="slide"
      isVisible={visible}
      onBackdropPress={onClose}
      >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{borderRadius: 10, width: '100%', height: 'auto'}}>
            <View style={{height:300,width:'auto'}}>
            <FastImage source={Images.TheoryPopUp} style={{resizeMode:'stretch',width:'auto',height:300}}/>
            </View>
            <DetailItem
            title={Languages.Theory_should_be_explained_before_procedure}
            image={'Maticon-Info'}
            />
              <View style={{flexDirection:'row',width:"100%",justifyContent:'space-between'}}>
              <TouchableOpacity  onPress={onClose} style={{width:"45%", alignItems: 'center', marginLeft: 10, marginRight: 10, }}>
        <View style={[styles.button,{backgroundColor:'#F2F4F7'}]}>
            <Text style={[styles.buttonText,{color:'#042628'}]}>
             {Languages.Cancel}
            </Text>
        </View>
    </TouchableOpacity>
              <TouchableOpacity  onPress={onClose} style={{width:"45%", alignItems: 'center', marginLeft: 10, marginRight: 10, }}>
        <View style={styles.button}>
            <Text style={styles.buttonText}>
           {Languages.Confirm}
            </Text>
        </View>
    </TouchableOpacity>
              </View>
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
    width: '100%',
    height: 'auto',
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
  button:{
    width:'100%',
    height:50,
    backgroundColor:GlobalStyles.colorSet.orange,
    borderRadius:5,
    marginLeft:20,
    marginRight:20,
    marginBottom:10,
    marginTop:10,
    alignItems:'center',
    justifyContent:'center'
},
buttonText:{
   fontSize:16,
   fontWeight:'bold',
   color:'white' 
}
});

export default TheoryPopUp;
