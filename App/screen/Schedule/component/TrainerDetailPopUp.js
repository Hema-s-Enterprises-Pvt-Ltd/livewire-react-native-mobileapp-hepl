import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  ToastAndroid,
} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Fa from 'react-native-vector-icons/FontAwesome';
import Maticons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons';
import {resendInvite, withdrawInvite} from '../../../networkClient/apifunction';
import { Images, Languages } from '../../../common';
import LoadingIndicator from '../../../utils/LoadingIndicator';
import GlobalStyles from '../../../core/GlobalStyles';

const TrainerDetailPopUp = ({
  visible,
  onClose,
  trainerDetails,
  InviteId,
  showButton
}) => {

  const EmptyListMessage = ({item}) => {
    return (
      // Flat List Item
      <Text
        style={{
          fontSize: RFValue(14),
          fontWeight: '500',
          marginLeft: 5,
          marginRight: 10,
          color: 'grey',
          alignSelf: 'left',
          margin: 5,
        }}>
        --
      </Text>
    );
  };
  const renderServiceItem = ({item}) => (
    <View
      style={{
        width: 'auto',
        height: 'auto',
        alignItems: 'center',
        backgroundColor: '#00AEEF1A',
        borderRadius: 20,
        marginBottom: 10,
        flex: 1,
        flexShrink: 1,
        marginRight:5
      }}>
      <Text
        style={{
          color: '#919EAB',
          fontSize: 12,
          padding: 5,
        }}>
        {item.name}
      </Text>
    </View>
  );
  function notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      Alert.alert(msg);
    }
  }
  const WithDrawClick = async () => {
    withdrawInvite(InviteId)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          notifyMessage(Languages.Invite_withdrawn_successfully)
        } else {
          Alert.alert(Languages.Alert, response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.response.data.message);
      });
  };
  const ResendClick = async () => {
    resendInvite(InviteId)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          notifyMessage(Languages.Invite_sent_successfully)
        } else {
          Alert.alert(Languages.Alert, response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.response.data.message);
      });
  };
  return (
    <Modal
      animationType="slide"
      isVisible={visible}
      swipeDirection={['down', 'left', 'right', 'up']}
      onSwipeComplete={onClose}
      propagateSwipe={true}
      onBackdropPress={onClose}>
      <View style={styles.centeredView}>
        {trainerDetails ? (
          <View style={styles.modalView}>
            <View style={{borderRadius: 10, width: '100%', height: 'auto'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 57,
                    height: 57,
                    marginBottom: 16,
                  }}>
                  {trainerDetails?.profileUrl ? (
                    <Image
                      source={{uri: trainerDetails?.profileUrl}}
                      resizeMode="stretch"
                      style={{
                        borderWidth: 2,
                        borderColor: 'white',
                        width: 50,
                        height: 50,
                        marginRight: 10,
                        borderRadius: 50,
                      }}
                    />
                  ) : (
                    <Image
                      source={Images.Person}
                      resizeMode={'stretch'}
                      style={{
                        borderWidth: 2,
                        borderColor: 'white',
                        width: 50,
                        height: 50,
                        marginRight: 10,
                        borderRadius: 50,
                      }}
                    />
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                  }}>
                  <AntIcon name="star" size={30} color="#FEC84B" />
                  <Text
                    style={{
                      color: '#454F5B',
                      fontWeight: 'semibold',
                      fontSize: 14,
                      marginBottom: 10,
                      alignItems: 'center',
                      textAlign: 'center',
                    }}>
                    {trainerDetails?.averageRatings}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  color: '#454F5B',
                  fontSize: 16,
                  marginBottom: 10,
                }}>
                {trainerDetails?.firstName} {trainerDetails?.lastName} -{' '}
                {trainerDetails?.age}
              </Text>
              <Text
                style={{
                  color: '#919EAB',
                  fontSize: 12,
                  marginBottom: 10,
                }}>
                {trainerDetails?.gender}
              </Text>
              
              <View
                style={{
                  height: 1,
                  borderColor: '#C4CDD5',
                  marginBottom: 10,
                  borderStyle: 'dashed',
                  borderWidth: 1,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: 3,
                    alignItems: 'center',
                  }}>
                  <Octicons name="device-mobile" size={20} color="#919EAB" />
                  <Text
                    style={{
                      color: '#919EAB',
                      fontSize: 12,
                    }}>
                    {trainerDetails?.mobileNo}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: 3,
                    alignItems: 'center',
                  }}>
                  <Maticons
                    name="briefcase-variant-outline"
                    size={25}
                    color="#919EAB"
                  />

                  <Text
                    style={{
                      color: '#919EAB',
                      fontSize: 12,
                    }}>
                    {trainerDetails?.experience}{' '}
                    {trainerDetails?.experience == 1 ? 'Year' : 'Years'}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginVertical: 10,
                }}>
                <Maticons name="crosshairs-gps" size={25} color="#919EAB" />
                <Text
                  style={{
                    color: '#919EAB',
                    fontSize: 12,
                  }}>
                  {trainerDetails?.address}
                </Text>
              </View>
              
              <View
                style={{
                  height: 1,
                  borderColor: '#C4CDD5',
                  marginBottom: 10,
                  borderStyle: 'dashed',
                  borderWidth: 1,
                }}/>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 12,
                  marginBottom: 10,
                }}>
                {Languages.Brand}
              </Text>
              <View>
                
                <View style={styles.additionalTextinput}>
                  {trainerDetails?.brandList &&
                  trainerDetails.brandList.length > 0 ? (
                    trainerDetails.brandList.map((item, index) => (
                      <Text
                        key={item.id || index}
                        style={{
                          fontSize: 12,
                          fontWeight: '600', // Changed 'semibold' to '600'
                          textAlign: 'left',
                          color: '#919EAB',
                          backgroundColor: '#00AEEF1A',
                          marginLeft: 10,
                          padding: 8,
                          borderRadius: 10,
                          marginBottom: 10,
                        }}>
                        {item.brandName}
                      </Text>
                    ))
                  ) : (
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#919EAB',
                        textAlign: 'left',
                        marginLeft: 10,
                        marginBottom: 10,
                      }}>
                      --
                    </Text>
                  )}
                </View>
              </View>

              <View
                style={{
                  height: 1,
                  borderColor: '#C4CDD5',
                  marginBottom: 10,
                  borderStyle: 'dashed',
                  borderWidth: 1,
                }}
              />
              <Text
                style={{
                  color: '#000000',
                  fontSize: 12,
                  marginBottom: 10,
                }}>
                {Languages.ServiceCategory}
              </Text>
              <View>
              
                <View style={styles.additionalTextinput}>
                  {trainerDetails?.serviceTypeList &&
                  trainerDetails.serviceTypeList.length > 0 ? (
                    trainerDetails.serviceTypeList.map((item, index) => (
                      <Text
                        key={item.id || index}
                        style={{
                          fontSize: 12,
                          fontWeight: '600', // Use numeric value for semi-bold
                          textAlign: 'left',
                          color: '#919EAB',
                          backgroundColor: '#00AEEF1A',
                          marginLeft: 10,
                          padding: 8,
                          borderRadius: 10,
                          marginBottom: 10,
                        }}>
                        {item.name}
                      </Text>
                    ))
                  ) : (
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#919EAB',
                        textAlign: 'left',
                        marginLeft: 10,
                        marginBottom:10
                      }}>
                      --
                    </Text>
                  )}
                </View>
              </View>

              {showButton && (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#F78104',
                      textAlign: 'center',
                      padding: 5,
                      borderRadius: 5,
                      width: '100%',
                    }}>
                    <TouchableOpacity
                      onPress={ResendClick}
                      style={{
                        flex: 1,
                        margin: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#FFFFFF',
                          textAlign: 'center',
                        }}>
                        {Languages.Resend_Invite}
                      </Text>
                      <Image
                        source={Images.SendSqaure}
                        resizeMode="contain"
                        style={{width: 20, height: 20, marginLeft: '5%'}}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      textAlign: 'center',
                      padding: 10,
                      backgroundColor: '#E6F2E6',
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: '#F78104',
                      marginVertical: 10,
                    }}>
                    <TouchableOpacity onPress={WithDrawClick}>
                      <Text
                        style={{
                          color: '#F78104',
                          textAlign: 'center',
                        }}>
                        {Languages.Withdraw_Invite}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        ) : (
          <LoadingIndicator />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    width: '90%',
    height: 'auto',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: RFPercentage(2.0),
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: 10,
    color: 'black',
  },
  gridContainer: {
    marginRight: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  serviceItem: {
    backgroundColor: '#d8f9ff',
    margin: 5,
    borderRadius: 10,
    textAlign: 'center',
    alignItems: 'center',
    width: '48%', // Adjust width to fit two columns without extra line
  },
  serviceText: {
    color: '#000',
    fontSize: 14,
  },
  additionalTextinput:{
    //marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    width:"100%",
   // height:50,
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'flex-start', 
  },
});

export default TrainerDetailPopUp;
