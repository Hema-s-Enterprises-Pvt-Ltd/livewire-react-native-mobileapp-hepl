import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DetailItem from '../screen/DemoDetail/component/DetailItem';
import PropTypes from 'prop-types';
import { Images, Languages } from '../common';
import moment from 'moment';

const DeclinePopUp = ({ visible, onClose, details }) => {
  const detailsExist = details !== undefined;
  const trainerExist = detailsExist && details?.trainer !== null;
  let cancelNotes = "";
  if (detailsExist) {
    cancelNotes = details?.cancelNotes === "" ? "--" : details?.cancelNotes || "";
  }

  return (
    <Modal
      animationType="slide"
      isVisible={visible}
      swipeDirection={['down', 'left', 'right', 'up']}
      onSwipeComplete={onClose}
      propagateSwipe={true}
      onBackdropPress={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{ borderRadius: 10, width: '100%', height: 'auto' }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FEF2F1",
                paddingVertical: 15,
                paddingHorizontal: 20,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "#D92C20",
                  fontSize: 16,
                  marginRight: 4,
                  flex: 1,
                }}
              >
                {Languages.Cancelled}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close" size={20} color="#000" />
              </TouchableOpacity>
            </View>

            {trainerExist ? (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#E6F2E6",
                    padding: 10,
                    marginBottom:10
                  }}
                >
                  <View
                    style={{
                      borderRadius: 215,
                      width: 61, // Width + 2 * borderWidth
                      height: 62, // Height + 2 * borderWidth
                      marginRight: 10,
                      borderStyle: "solid",
                      borderColor: "#fff",
                      borderWidth: 3,
                      overflow: "hidden", // Ensure the image stays within the border
                    }}
                  >
                            { details?.trainer?.profilePic!==null ? <Image
              source={{uri:details?.trainer?.profilePic}}
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
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#000000",
                        fontSize: 16,
                        marginBottom: 7,
                        fontWeight: "bold",
                      }}
                    >
                      {`${details?.trainer.firstName} ${details?.trainer.lastName}`}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Text style={{ color: '#737973', fontSize: 12 }}>
                        {details?.services.name} .
                      </Text>
                      {/* <Entypo name="dot-single" size={14} color="#737973" style={{ marginBottom: -2 }} /> */}
                      <Text style={{ color: '#737973', fontSize: 12 }}>
                       {  moment(details?.scheduleTime, ['HH:mm']).format(
                      'h:mm a',
                    ) }
                      </Text>
                    </View>
                  </View>
                </View>
               
              </View>
            ) : (
              <View />
            )}

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
                  title={detailsExist ?  moment(details?.scheduleDate).format('MMMM-DD') +
                    ' ' +
                    '( ' +
                    moment(details?.scheduleTime, ['HH:mm']).format(
                      'h:mm a',
                    ) +
                    ' )' : ""}
                  isheader={true}
                />
                <DetailItem
                  image={'Ionicon'}
                  title={detailsExist ? details?.clientLocation.location : ""}
                  isheader={false}
                />
                <DetailItem
                  image={'SimpleIcon'}
                  title={detailsExist ? details?.services.name : ""}
                  isheader={false}
                />
              </View>
            </View>
            <View style={{ margin: 10 }}>
              <Text style={styles.header}>Reason</Text>
              <Text style={[styles.addressText, { paddingLeft: 10 }]}>
              <Text>{cancelNotes}</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    backgroundColor: "#F2F4F7",
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
    alignItems: 'center',
  },
  header: {
    fontSize: RFPercentage(2.0),
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: 10,
    color: 'black',
  },
  logoBg: {
    backgroundColor: "#F2F4F7",
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  logoImg: {
    width: "100%",
    height: 70,
    resizeMode: 'stretch',
  },
});

DeclinePopUp.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  details: PropTypes.object,
};

export default DeclinePopUp;
