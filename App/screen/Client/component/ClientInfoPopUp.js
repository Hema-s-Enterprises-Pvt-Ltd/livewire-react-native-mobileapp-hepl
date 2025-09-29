import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import DetailItem from '../../DemoDetail/component/DetailItem';
import GlobalStyles from '../../../core/GlobalStyles';
import FontAwesomefive from 'react-native-vector-icons/FontAwesome5';
import { Images } from '../../../common';

const ClientInfoPopUpModal = ({visible, onClose,props}) => {
  return (
    <Modal
      animationType="slide"
      isVisible={visible}
      swipeDirection={['down', 'left', 'right', 'up']}
      onSwipeComplete={onClose}
      propagateSwipe={true}
      onBackdropPress={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{borderRadius: 10, width: '100%', height: 'auto'}}>
            <View style={styles.logoBg}>
              <Image
                source={Images.GreenTrends}
                resizeMode="contain"
                style={styles.logoImg}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
                marginLeft: 10,
                marginRight: 10,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                backgroundColor: '#00AEEF1A',
              }}>
              <Text style={styles.header}>Green Trends</Text>
              <TouchableOpacity onPress={()=>{
                onClose()
                props.navigation.navigate("EditClient")
              }}>
              <Image
                source={Images.EditOrange}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
              />
              </TouchableOpacity>
            </View>
            <View style={styles.detailContainer}>
              <View style={styles.detailChildContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    height: 'auto',
                    flexWrap: 'wrap',
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}>
                  <View style={{width: '5%', alignItems: 'flex-end'}}>
                    <Image
                      source={Images.LocationGrey}
                      resizeMode="contain"
                      style={styles.locationImage}
                    />
                  </View>

                  <View style={{width: '75%', flexDirection: 'row'}}>
                    <View
                      style={{
                        flexDirection: 'column',
                        width: '100%',
                        height: 'auto',
                      }}>
                      <Text style={styles.addressText}>
                        12,Cavinville, Cenotaph Road, {'\n'} Rathna Nagar,
                        Guindy, {'\n'} Chennai-600018.
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '20%',
                      alignItems: 'flex-end',
                      paddingRight: 10,
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={Images.Routing}
                      resizeMode="contain"
                      style={styles.locationImage}
                    />
                  </View>
                </View>
              </View>
            </View>
            <DetailItem
              image={'Ionicon-person'}
              title="POC- Sharen"
              isheader={false}
            />
            <DetailItem
              image={'Octicons-mobile'}
              title="9088765432"
              isheader={false}
            />
            <TouchableOpacity onPress={()=>{
                onClose()
                props.navigation.navigate("TargetProduct")
            }} 
              style={{
                backgroundColor: '#E6F2E680',
                borderRadius: 5,
                paddingLeft: 10,
              }}>
              <View style={{width: '100%', padding: 10, flexDirection: 'row',justifyContent:'space-between'}}>
               <View style={{flexDirection:'row'}}>
               <Image
                  source={Images.Gps}
                  resizeMode="contain"
                  style={{width: 15, height: 15, resizeMode: 'contain'}}
                />
                <Text
                  style={{
                    fontSize: RFValue(12),
                    fontWeight: '500',
                    textAlign: 'left',
                    color: '#666687',
                    marginLeft: 10,
                  }}>
                  Targeted Products
                </Text>
               </View>
               <FontAwesomefive name="external-link-alt" size={20} color="#00AEEF" />
              </View>
            </TouchableOpacity>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <TouchableOpacity onPress={()=>{onClose()
                    props.navigation.navigate("ClientDemoHistory")}} style={{flex:1,margin:10,flexDirection:"row",borderWidth:1,borderRadius:5,padding:10,borderColor:GlobalStyles.colorSet.orange,borderColor:GlobalStyles.colorSet.orange,justifyContent:'center'}}>
                  <Text style={{color:GlobalStyles.colorSet.orange,fontWeight:'semibold'}}>
                    Demo History
                  </Text>
                  <Image source={Images.ClockGrey} style={{width:20,height:20,tintColor:GlobalStyles.colorSet.orange,marginLeft:10}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{onClose()
                    props.navigation.navigate("SalesHistory")}} style={{flex:1,margin:10,flexDirection:"row",borderWidth:1,borderRadius:5,padding:10,borderColor:GlobalStyles.colorSet.orange,borderColor:GlobalStyles.colorSet.orange,justifyContent:'center'}}>
                  <Text style={{color:GlobalStyles.colorSet.orange,fontWeight:'semibold'}}>
                    Sales History
                  </Text>
                  <Image source={Images.ClockGrey} style={{width:20,height:20,tintColor:GlobalStyles.colorSet.orange,marginLeft:10}}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>{onClose()
                    props.navigation.navigate("ScheduleDemo")}} 
                    style={{marginLeft:10,marginRight:10,marginBottom:10,flexDirection:"row",borderWidth:1,borderRadius:5,padding:10,borderColor:GlobalStyles.colorSet.orange,backgroundColor:GlobalStyles.colorSet.orange,borderColor:GlobalStyles.colorSet.orange,justifyContent:'center'}}>
                  <Text style={{color:GlobalStyles.colorSet.white,fontWeight:'semibold'}}>
                  Schedule a Demo
                  </Text>
                  <Image source={Images.CalendarBlueNew} style={{width:20,height:20,tintColor:GlobalStyles.colorSet.white,marginLeft:10}}/>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => props.navigation.navigate('NotesScreen')}
                    style={{marginLeft:10,marginRight:10,flexDirection:"row",borderRadius:5,padding:10,backgroundColor:"#F2F9FF",justifyContent:'center'}}>
                  <Text style={{color:"#9747FF",fontWeight:'semibold'}}>
                 Add Notes
                  </Text>
                  <Image source={Images.NoteEdit} style={{width:20,height:20,tintColor:"#9747FF",marginLeft:10}}/>
                </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    backgroundColor: '#F2F4F7',
    marginTop: 10,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },

  detailChildContainer: {
    flexDirection: 'column',
    padding: 5,
  },
  addressText: {
    fontSize: RFValue(12),
    fontWeight: '500',
    textAlign: 'left',
    color: '#666687',
  },
  detailChildContainer: {
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
    paddingLeft: 10,
    color: 'black',
  },
  logoBg: {
    backgroundColor: '#F2F4F7',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius:5,
    marginLeft: 10,
    marginRight: 10,
  },
  logoImg: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
});

export default ClientInfoPopUpModal;
