import React from 'react';
import {View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import { RFPercentage,RFValue } from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import DetailItem from '../../DemoDetail/component/DetailItem';
import GlobalStyles from '../../../core/GlobalStyles';
import FastImage from 'react-native-fast-image'
import { Images, Languages } from '../../../common';
import Icon from 'react-native-vector-icons/MaterialIcons';
const LocationPopUp = ({visible, onClose,onConfirm}) => {
  return (
    <Modal
      animationType="slide"
      isVisible={visible}
      onBackdropPress={onClose}
      >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{borderRadius: 10, width: '100%', height: 'auto'}}>
          <TouchableOpacity onPress={onClose} style={{alignItems:'flex-end'}}>
                <Icon name="close" size={20} color="#666687" />
              </TouchableOpacity>
            <View style={{height:300,width:'auto'}}>
            <FastImage source={Images.Location} style={{resizeMode:'stretch',width:'auto',height:300}}/>
            </View>
            <DetailItem
            title={Languages.You_have_been_geotagged_at_the_demo_client_place}
            image={'Ionicon'}
            />
              <View style={{flexDirection:'row',width:"100%",justifyContent:'space-between'}}>
              <TouchableOpacity  onPress={onClose} style={{width:"45%", alignItems: 'center', marginLeft: 10, marginRight: 10, }}>
        <View style={[styles.button,{backgroundColor:'#F2F4F7'}]}>
            <Text style={[styles.buttonText,{color:'#042628'}]}>
             {Languages.Cancel}
            </Text>
        </View>
    </TouchableOpacity>
              <TouchableOpacity  onPress={onConfirm} style={{width:"45%", alignItems: 'center', marginLeft: 10, marginRight: 10, }}>
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
  subText:{
    fontSize: RFValue(9),
    color:'#666687',
  },
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

export default LocationPopUp;
