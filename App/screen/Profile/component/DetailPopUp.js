import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import {RFValue, RFPercentage} from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';
import Octicons from 'react-native-vector-icons/Octicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, {Path} from 'react-native-svg';
import { Images, Languages } from '../../../common';
import GlobalStyles from '../../../core/GlobalStyles';

const DetailPopUp = ({visible, onClose, editClicked, data, roleName}) => {
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
  const renderServiceItems = ({item}) =>
    item ? (
      <View style={styles.serviceItem}>
        <Text style={styles.serviceText}>{item.name}</Text>
      </View>
    ) : null;
  const renderBrandList = ({item}) =>
    item ? (
      <View style={styles.serviceItem}>
        <Text style={styles.serviceText}>{item.brandName}</Text>
      </View>
    ) : null;
  const renderStateList = ({item}) =>
    item ? (
      <View style={styles.stateItem}>
        <Text style={styles.stateText}>{' ' + item.name}</Text>
      </View>
    ) : null;

  return (
    <View>
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginBottom: 10,
                  }}>
                  {!data?.profileUrl && (
                    <Image
                      source={Images.Person}
                      resizeMode={'stretch'}
                      style={{
                        borderRadius: 25,
                        height: 50,
                        width: 50,
                      }}
                    />
                  )}
                  {data?.profileUrl && (
                    <Image
                      source={{uri: data?.profileUrl}}
                      resizeMode={'stretch'}
                      style={{
                        borderRadius: 25,
                        height: 50,
                        width: 50,
                      }}
                    />
                  )}
                </View>
                <TouchableOpacity onPress={editClicked}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20" // Adjusted to match the previous size
                    height="20" // Adjusted to match the previous size
                    viewBox="0 0 24 24"
                    fill="none">
                    <Path
                      d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2"
                      stroke="#00AEEF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Path
                      d="M16.04 3.02L8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0Z"
                      stroke="#00AEEF"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Path
                      d="M14.91 4.15a7.144 7.144 0 0 0 4.94 4.94"
                      stroke="#00AEEF"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
              {roleName && roleName === 'Trainer' ? (
                <>
                  <View>
                    <Text
                      style={{
                        color: '#454F5B',
                        fontSize: 16,
                        marginBottom: 10,
                        fontWeight: 'bold',
                      }}>
                      {`${data.firstName} ${data.lastName} - ${data.age}`}
                    </Text>

                    <Text
                      style={{
                        color: '#919EAB',
                        fontSize: 12,
                        marginBottom: 10,
                      }}>
                      {data.gender}
                    </Text>

                    <View
                      style={{
                        height: 1,
                        borderColor: '#C4CDD5',
                        marginTop: 5,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderStyle: 'dashed',
                        marginVertical: 10,
                      }}
                    />
                    <View
                      style={{
                        justifyContent: 'space-between',

                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '50%',
                          alignItems: 'center',
                        }}>
                        <Octicons
                          name="device-mobile"
                          size={20}
                          color="#919EAB"
                        />
                        <Text
                          style={{
                            fontSize: RFValue(12),
                            fontWeight: '500',
                            textAlign: 'left',
                            color: '#919EAB',
                            marginLeft: 10,
                          }}>
                          {data.mobileNo}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          width: '50%',
                          marginRight: 0,
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}>
                        <Icons
                          name="briefcase-variant-outline"
                          size={25}
                          color="#919EAB"
                        />
                        <Text
                          style={{
                            fontSize: RFValue(12),
                            fontWeight: '500',
                            textAlign: 'left',
                            color: '#919EAB',
                            marginLeft: 10,
                          }}>{`${data.experience} ${
                          data.experience ? Languages.years : null
                        }`}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        paddingRight:10,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginVertical: 10,
                      }}>
                      <Octicons name="location" size={25} color="#919EAB" />
                      <Text
                        style={{
                          fontSize: RFValue(12),
                          fontWeight: '500',
                          textAlign: 'left',
                          color: '#919EAB',
                          marginLeft: 10,
                        }}>
                        {data.address}
                      </Text>
                    </View>

                    <View
                      style={{
                        height: 1,
                        borderColor: '#C4CDD5',
                        marginBottom: 10,
                        borderWidth: 1,
                        borderStyle: 'dashed',
                        marginVertical: 10,
                      }}
                    />
                    <Text
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        color: '#000',
                        fontWeight: '500',
                        fontSize: 16,
                      }}>
                      {Languages.Preferred_Location}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginVertical: 10,
                      }}>
                      <Octicons name="location" size={20} color="#919EAB" />
                      <FlatList
                        ListEmptyComponent={EmptyListMessage}
                        data={data.stateList}
                        scrollEnabled={false}
                        renderItem={renderStateList}
                        keyExtractor={item => item.stateCode.toString()}
                        numColumns={4}
                      />
                    </View>

                    <View
                      style={{
                        height: 1,
                        borderColor: '#C4CDD5',
                        marginTop: 5,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderStyle: 'dashed',
                        marginVertical: 10,
                      }}
                    />

                    <Text
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        color: '#000',
                        fontWeight: '500',
                        fontSize: 16,
                      }}>
                      {Languages.Brand}
                    </Text>
              <View>
              <View style={styles.additionalTextinput}>
                {data.brandList&&
                data.brandList.map((item, index) => (
                  <Text
                  key={item.id || index}
                    style={{
                      fontSize: 14,
                      fontWeight: 'semibold',
                      textAlign: 'left',
                      //  marginTop: 10,
                      color: 'black',
                      backgroundColor:GlobalStyles.colorSet.light_blue,
                      marginLeft: 10,
                      padding: 8,
                      borderRadius: 10,
                      marginBottom:10
                    }}>
                    {item.brandName}
                  </Text>
                ))}
              </View>
            </View>
                    <Text
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginVertical: 10,
                        color: '#000',
                        fontWeight: '500',
                        fontSize: 16,
                      }}>
                      {Languages.ServiceCategory}
                    </Text>
                       <View>
              <View style={styles.additionalTextinput}>
                {data.serviceTypeList&&
                data.serviceTypeList.map((item, index) => (
                  <Text
                  key={item.id || index}
                    style={{
                      fontSize: 14,
                      fontWeight: 'semibold',
                      textAlign: 'left',
                      //  marginTop: 10,
                      color: 'black',
                      backgroundColor: GlobalStyles.colorSet.light_blue,
                      marginLeft: 10,
                      padding: 8,
                      borderRadius: 10,
                      marginBottom:10
                    }}>
                    {item.name}
                  </Text>
                ))}
              </View>
            </View>
                  </View>
                </>
              ) : null}

              {roleName && roleName === 'ASM' ? (
                <>
                  <View>
                    <Text
                      style={{
                        color: '#454F5B',
                        fontSize: 16,
                        marginBottom: 10,
                        fontWeight: 'bold',
                      }}>
                      {`${data.firstName} ${data.lastName} - ${data.age}`}
                    </Text>

                    <Text
                      style={{
                        color: '#919EAB',
                        fontSize: 12,
                        marginBottom: 10,
                      }}>
                      {data.gender}
                    </Text>

                    <View
                      style={{
                        height: 1,
                        borderColor: '#C4CDD5',
                        marginTop: 5,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderStyle: 'dashed',
                        marginVertical: 10,
                      }}
                    />

                    <View
                      style={{
                        justifyContent: 'space-between',

                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '50%',
                          alignItems: 'center',
                        }}>
                        <Octicons
                          name="device-mobile"
                          size={20}
                          color="#919EAB"
                        />
                        <Text
                          style={{
                            fontSize: RFValue(12),
                            fontWeight: '500',
                            textAlign: 'left',
                            color: '#919EAB',
                            marginLeft: 10,
                          }}>
                          {data.mobileNo}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          width: '50%',
                          marginRight: 0,
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}>
                        <Icons
                          name="briefcase-variant-outline"
                          size={25}
                          color="#919EAB"
                        />
                        <Text
                          style={{
                            fontSize: RFValue(12),
                            fontWeight: '500',
                            textAlign: 'left',
                            color: '#919EAB',
                            marginLeft: 10,
                          }}>{`${data.experience} ${
                          data.experience ? ' years' : null
                        }`}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginVertical: 10,
                        paddingRight:10,
                       
                      }}>
                      <Octicons name="location" size={25} color="#919EAB" />
                      <Text
                        style={{
                          fontSize: RFValue(12),
                          fontWeight: '500',
                          textAlign: 'left',
                          color: '#919EAB',
                          marginLeft: 10,
                          

                        }}>
                        {data.address}
                      </Text>
                    </View>
                  </View>
                </>
              ) : null}

              {roleName && roleName === 'RSM' ? (
                <>
                  <View>
                    <Text
                      style={{
                        color: '#454F5B',
                        fontSize: 16,
                        marginBottom: 10,
                        fontWeight: 'bold',
                      }}>
                      {`${data.firstName} ${data.lastName} - ${data.age}`}
                    </Text>

                    <Text
                      style={{
                        color: '#919EAB',
                        fontSize: 12,
                        marginBottom: 10,
                      }}>
                      {data.gender}
                    </Text>

                    <View
                      style={{
                        height: 1,
                        borderColor: '#C4CDD5',
                        marginTop: 5,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderStyle: 'dashed',
                        marginVertical: 10,
                      }}
                    />

                    <View
                      style={{
                        justifyContent: 'space-between',

                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '50%',
                          alignItems: 'center',
                        }}>
                        <Octicons
                          name="device-mobile"
                          size={20}
                          color="#919EAB"
                        />
                        <Text
                          style={{
                            fontSize: RFValue(12),
                            fontWeight: '500',
                            textAlign: 'left',
                            color: '#919EAB',
                            marginLeft: 10,
                          }}>
                          {data.mobileNo}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          width: '50%',
                          marginRight: 0,
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}>
                        <Icons
                          name="briefcase-variant-outline"
                          size={25}
                          color="#919EAB"
                        />
                        <Text
                          style={{
                            fontSize: RFValue(12),
                            fontWeight: '500',
                            textAlign: 'left',
                            color: '#919EAB',
                            marginLeft: 10,
                          }}>{`${data.experience} ${
                          data.experience ? Languages.years : null
                        }`}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        paddingRight:10,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginVertical: 10,
                      }}>
                      <Octicons name="location" size={25} color="#919EAB" />
                      <Text
                        style={{
                          fontSize: RFValue(12),
                          fontWeight: '500',
                          textAlign: 'left',
                          color: '#919EAB',
                          marginLeft: 10,
                         
                        }}>
                        {data.address}
                      </Text>
                    </View>
                  </View>
                </>
              ) : null}

              {roleName && roleName === 'Salesman' ? (
                <>
                  <View>
                    <Text
                      style={{
                        color: '#454F5B',
                        fontSize: 16,
                        marginBottom: 10,
                        fontWeight: 'bold',
                      }}>
                      {`${data.firstName} ${data.lastName} - ${data.age}`}
                    </Text>

                    <Text
                      style={{
                        color: '#919EAB',
                        fontSize: 12,
                        marginBottom: 10,
                      }}>
                      {data.gender}
                    </Text>
                    <View
                      style={{
                        height: 1,
                        borderColor: '#C4CDD5',
                        marginTop: 5,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderStyle: 'dashed',
                        marginVertical: 10,
                      }}
                    />

                    <View
                      style={{
                        justifyContent: 'space-between',

                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '50%',
                          alignItems: 'center',
                        }}>
                        <Octicons
                          name="device-mobile"
                          size={20}
                          color="#919EAB"
                        />
                        <Text
                          style={{
                            fontSize: RFValue(12),
                            fontWeight: '500',
                            textAlign: 'left',
                            color: '#919EAB',
                            marginLeft: 10,
                          }}>
                          {data.mobileNo}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          width: '50%',
                          marginRight: 0,
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}>
                        <Icons
                          name="briefcase-variant-outline"
                          size={25}
                          color="#919EAB"
                        />
                        <Text
                          style={{
                            fontSize: RFValue(12),
                            fontWeight: '500',
                            textAlign: 'left',
                            color: '#919EAB',
                            marginLeft: 10,
                          }}>{`${data.experience} ${
                          data.experience ? ' years' : null
                        }`}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        paddingRight:10,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginVertical: 10,
                      }}>
                      <Octicons name="location" size={25} color="#919EAB" />
                      <Text
                        style={{
                          fontSize: RFValue(12),
                          fontWeight: '500',
                          textAlign: 'left',
                          color: '#919EAB',
                          marginLeft: 10,
                        }}>
                        {data.address}
                      </Text>
                    </View>

                    <View
                      style={{
                        height: 1,
                        borderColor: '#C4CDD5',
                        marginBottom: 17,
                        borderWidth: 1,
                        borderStyle: 'dashed',
                        marginVertical: 10,
                      }}
                    />

                    <Text
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginVertical: 10,
                        color: '#000',
                        fontWeight: '500',
                        fontSize: 16,
                      }}>
                     {Languages.Locations_handled}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginVertical: 10,
                      }}>
                      <Octicons name="location" size={25} color="#919EAB" />
                      <FlatList
                        ListEmptyComponent={EmptyListMessage}
                        data={data.stateList}
                        scrollEnabled={false}
                        renderItem={renderStateList}
                        keyExtractor={item => item.stateCode.toString()}
                        numColumns={4}
                      />
                    </View>

                    <View
                      style={{
                        height: 1,
                        borderColor: '#C4CDD5',
                        marginBottom: 17,
                        borderWidth: 1,
                        borderStyle: 'dashed',
                        marginVertical: 10,
                      }}
                    />

                    <Text
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginVertical: 10,
                        color: '#000',
                        fontWeight: '500',
                        fontSize: 16,
                      }}>
                      {Languages.Brand}
                    </Text>
                    <View>
              <View style={styles.additionalTextinput}>
                {data.brandList&&
                data.brandList.map((item, index) => (
                  <Text
                  key={item.id || index}
                    style={{
                      fontSize: 14,
                      fontWeight: 'semibold',
                      textAlign: 'left',
                      //  marginTop: 10,
                      color: 'black',
                      backgroundColor: GlobalStyles.colorSet.light_blue,
                      marginLeft: 10,
                      padding: 8,
                      borderRadius: 10,
                      marginBottom:10
                    }}>
                    {item.brandName}
                  </Text>
                ))}
              </View>
            </View>
                  </View>
                </>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    width: '100%',
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
    //  alignItems: 'center',
  },
  columnWrapper: {
    marginRight: 10,
    // justifyContent: 'space-between',
  },
  serviceItem: {
    backgroundColor: '#d8f9ff',
    borderRadius: 20,
    textAlign: 'center',
    padding: 2,
    fontSize: 14,
    marginHorizontal: 5,
    marginVertical: 5,
    justifyContent:'center',
    width: '30%', // Adjust this based on numColumns
    flex: 1, // This will make the item flexible within the row
  },
  serviceText: {
    flexDirection: 'row',
    color: '#000',
    fontSize: 14,
    paddingVertical:5,
    paddingHorizontal: 15,
    textAlign:'center',
    flexShrink: 1, // Allow text to wrap
  },
  stateText: {
    marginLeft: '3%',
  },
  additionalTextinput:{
    marginTop: 10,
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
DetailPopUp.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editClicked: PropTypes.func,
};

export default DetailPopUp;
