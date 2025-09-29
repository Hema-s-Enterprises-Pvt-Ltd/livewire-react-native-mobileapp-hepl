import React from 'react';
import {View, Text, Image, StyleSheet,TouchableOpacity} from 'react-native';
import { RFPercentage,RFValue } from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DetailItem from '../../DemoDetail/component/DetailItem';
import moment from 'moment';
import GlobalStyles from '../../../core/GlobalStyles';
import { Images, Languages } from '../../../common';

const DeclineModal = ({visible, onClose,details}) => {
  const formattedDateTime = `${moment(details?.scheduleDate).format("MMMM DD")} (${moment(details?.scheduleTime, 'HH:mm').format('h:mm A')})`;
  
  return (
    <Modal
      animationType="slide"
      isVisible={visible}
     swipeDirection={['down','left','right','up']}
     onSwipeComplete={onClose}
     propagateSwipe={true}
      onBackdropPress={onClose}
      >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{borderRadius: 10, width: '100%', height: 'auto'}}>
          <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FEF2F1",
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderTopLeftRadius:10,
            borderTopRightRadius:10
          }}>
          <Text
            style={{
              color: "#D92C20",
              fontSize: 16,
              marginRight: 4,
              flex: 1,
            }}>
            {Languages.CANCELLED}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#E6F2E6",
            padding:10
          }}>
          <View
            style={{
              borderRadius: 215,
              width: 61,  // Width + 2 * borderWidth
              height: 62,  // Height + 2 * borderWidth
              marginRight: 10,
              borderStyle: "solid",
              borderColor: "#fff",
              borderWidth: 3,
              overflow: 'hidden',  // Ensure the image stays within the border
            }}
          >
          { details?.trainerUser?.profileUrl!==null ? <Image
              source={{uri:details?.trainerUser?.profileUrl}}
              resizeMode={"stretch"}
              style={{
                borderRadius: 215,
                width: 55,
                height: 56,
                marginRight: 10,
              }}
            /> : <Image
              source={Images.Person}
              resizeMode={"stretch"}
              style={{
                borderRadius: 215,
                width: 55,
                height: 56,
                marginRight: 10,
              }}
            />
} 
          </View>
          <View
            style={{
              flex: 1,
            }}>
            <Text
              style={{
                color: "#000000",
                fontSize: 16,
                marginBottom: 7,
                fontWeight: "bold"
              }}>
              {details?.trainerUser?.firstName}  {details?.trainerUser?.lastName}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center',flexWrap:'wrap' }}>
              <Text style={{ color: '#737973', fontSize: 12 }}>
              {details?.serviceType?.name} • 
              </Text>
              <Text style={{ color: '#737973', fontSize: 12 }}>
                {' (' + moment(details?.scheduleTime, ['HH:mm']).format('h:mm A') + ')'}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#00AEEF1A",
            borderRadius: 5,
           padding:10,
           margin:10
          }}>
          <View
            style={{
              borderRadius: 215,
              width: 40,  // Width + 2 * borderWidth
              height: 40,  // Height + 2 * borderWidth
              marginRight: 10,
              borderStyle: "solid",
              borderColor: "#fff",
              borderWidth: 3,
              overflow: 'hidden',  // Ensure the image stays within the border
            }}
          >
            {details?.salesmanUser?.profileUrl ?  <Image
              source={{uri:details?.salesmanUser?.profileUrl}}
              resizeMode={"stretch"}
              style={{
                borderRadius: 215,
                width: 35,
                height: 35,
                marginRight: 10,
              }}
            /> :
          <Image
              source={Images.Person}
              resizeMode={"stretch"}
              style={{
                borderRadius: 215,
                width: 35,
                height: 35,
                marginRight: 10,
              }}
            />
        }
           
          </View>
          <Text
            style={{
              color: "#000000",
              fontSize: 14,
              flex: 1,
              fontWeight: "bold",
            }}>
            {details?.salesmanUser?.firstName}  {details?.salesmanUser?.lastName}
          </Text>
        </View>
        <View style={styles.logoBg}>
        {
              details?.client?.clientImage !=null?
              <Image
              source={{uri: details?.client?.clientImage}}
              resizeMode="contain"
              style={styles.logoImg}
            />
            :
            <Image
            source={Images.ClientImg}
            resizeMode="contain"
            style={styles.logoImg}
          />
             }
        </View>
        <View style={styles.detailContainer}>
          <View style={styles.detailChildContainer}>
            <DetailItem
              image={'MaterialCommunityIcons'}
              title={formattedDateTime}
              isheader={true}
            />
            <DetailItem
              image={'Ionicon'}
              title={details?.location?.location} 
              isheader={false}
            />
            <DetailItem
              image={'SimpleIcon'}
              title={details?.service?.name} 
              isheader={false}
            />
            {/* <DetailItem
              image={'FontAwesomefive'}
              title={details?.service?.name} 
              isheader={false}
            /> */}
          </View>
         
        </View>
        <View style={{margin:10}}>
        <Text  style={{
              color: GlobalStyles.colorSet.black,
              fontSize: 14,
              fontWeight: "bold",
            }}>Reason</Text>
          <View style={styles.textinput}>
          <Text  style={{
              color: GlobalStyles.colorSet.black,
              fontSize: 12,
              fontWeight: "grey",
            }}>{details?.cancelNotes}</Text>
          </View>
          </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  textinput: {
    borderRadius: 5,
    marginTop: 10,
    marginBottom:10,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    height:50,
    backgroundColor:'#fff',
    borderWidth: 1,
    borderColor:'#EDF1F3',
    // marginLeft:5,
    // marginRight:5
},
textinput_txt: {
    fontSize: 14, color:"#D0D5DD",
    
},
    detailContainer:{
        backgroundColor:"#F2F4F7",
        marginTop:10,
        borderRadius:5,
        marginLeft:10,marginRight:10,marginBottom:10
      },
      
      detailChildContainer:{
        flexDirection: 'column',
        padding: 5,
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
    //padding: 10,
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
  logoBg:{
    backgroundColor:"#F2F4F7",
    padding:10,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:5,
    marginLeft:10,
    marginRight:10
  },
  logoImg:{
    width: '100%',
    height: 70,
    resizeMode: 'stretch',
  },
});

export default DeclineModal;
