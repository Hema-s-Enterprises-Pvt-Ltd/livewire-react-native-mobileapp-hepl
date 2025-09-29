import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  Text,
  FlatList,
  Alert,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './GetStartStyles';
import CustomButton from '../../component/CustomButton';
import { getDetails } from '../../networkClient/apifunction';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomAppBar from '../../component/CustomAppBar';
import Octicons from 'react-native-vector-icons/Octicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { Images, Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const EditPreviewScreen = (props) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serviceList, setServiceList] = useState([]);
  const [serviceType, setServiceType] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [brandList, setBrandList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [isFirstLogin,setFirstLogin]=useState(true);
  const navigation = useNavigation(); // Use the useNavigation hook

  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('EditPreviewScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('EditPreviewScreen unmounted');
    };
  }, []);

useEffect(()=>{
  var val=props.route.params.isFirstLogin;
  if(val!=undefined){
    setFirstLogin(props.route.params.isFirstLogin)
  }else{
    setFirstLogin(true)
  }
},[])
  useFocusEffect(
    React.useCallback(()=>{
      getList();
      getRoleName();
    },[])
  )
  const getRoleName = async () => {
    const name = await AsyncStorage.getItem('roleName');
    setRoleName(name);
  };

  const getList = async () => {
    const id = await AsyncStorage.getItem('userId');
    const Id = parseInt(id, 10);
    try {
      const response = await getDetails(Id);
      if (response.data.statusCode === 200) {
        setData(response.data.data);
        setServiceList(response.data.data.brandList);
        setServiceType(response.data.data.serviceTypeList);
        setBrandList(response.data.data.brandList);
        setDistrictList(response.data.data.districtList);
      } else {
        Alert.alert(Languages.Alert, response.data.data);
      }
    } catch (error) {
      Alert.alert(Languages.Alert, error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderServiceItems = ({ item }) =>
    item ? (
      <View style={styles.serviceValue}>
        <Text style={styles.serviceType}>{item.name}</Text>
      </View>
    ) : null;

  const renderBrandList = ({ item }) =>
    item ? (
      <View style={{
        marginTop: 5,
        margin: 5,
        padding: 5,
        width: 'auto',
        backgroundColor: '#d8f9ff',
        borderRadius: 10,
        flex: 1,
        flexShrink: 1,
        justifyContent: 'center',
          alignItems: 'center',
      }}>
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
      }}>
        <Text style={styles.brandName}>{item.brandName}</Text>
      </View>
      </View>
    ) : null;

  const renderStateList = ({ item }) =>
    item ? (
      <View style={styles.stateItem}>
        <Text style={styles.stateText}>{item.name}</Text>
      </View>
    ) : null;

  const EmptyListMessage = ({ item }) => {
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

  return (
    <SafeAreaView style={styles.viewContainer}>
      <View style={{ flex: 1, padding: 10, backgroundColor: '#FFFFFF' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {
            !isFirstLogin&&(
              <CustomAppBar title="Profile" navigation={props.navigation}/>
            )
          }
         
        {
          isFirstLogin&&(
            <View>
                <Image
            source={Images.WireLogo}
            style={{ width: '40%', resizeMode: 'contain',height:50 }}
          />
          <View style={{ height: 20 }} />
          <Text style={[styles.header, { alignItems: 'center', textAlign: 'center', }]}>
           {Languages.Welcome_To_Raaga}
          </Text>
            </View>
          )
        }
          <View style={{ height: 20 }} />
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius:12,
              padding: 10,
              margin:5,
              elevation:1,
              borderColor:"white",
              borderWidth:1 
            }}
          >
            {loading ? (
              <Text>{Languages.Loading}</Text>
            ) : (
              data && (
                <View style={{ borderRadius: 10, width: '100%', height: 'auto'}}>
                  <View  style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View
                      style={{
                        width: 57,
                        height: 57,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }}>
                      {data?.profileUrl ? (
                        <Image
                          source={{ uri: data?.profileUrl }}
                          resizeMode={'stretch'}
                          style={{
                            borderRadius: 29,
                            height: 57,
                            width: 57,
                          }}
                        />
                      ) : (
                        <Image
                          source={Images.Person}
                          resizeMode="contain"
                          style={{ width: 57, height: 57 }}
                        />
                      )}
                    </View>
                    {
                      !isFirstLogin&&(
                        <TouchableOpacity onPress={()=>{ navigation.navigate('EditBasicDetails');}}>
                      <Image
                        source={Images.EditBlue}
                        resizeMode={"stretch"}
                        style={{
                          width: 20,
                          height: 20,
                          marginTop: 6,
                          marginRight:'5%'
                        }}
                      />
                    </TouchableOpacity>
                      )
                    }
                  </View>

                  {roleName && roleName ==='Trainer'?(
                    <>
                    <View>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 16,
                        marginBottom: 10,
                        marginHorizontal: 5,
                        justifyContent:'flex-start'
                      }}>
                      {data.firstName} {data.lastName} - {data.age}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 12,
                        marginBottom: 10,
                        marginRight: '20%',
                        marginStart: 4,
                        justifyContent:'flex-start'
                      }}>
                      {data.gender}
                    </Text>

                    <View
                    style={{
                      height: 1,
                      borderColor: '#C4CDD5',
                      marginBottom: 17,
                      borderWidth: 1,
                      borderStyle: 'dashed',
                    }}
                  />
                      <View
                          style={{
                            justifyContent:'flex-start',                       
                            flexDirection: "row",
                            alignItems: "center",
                              }} >
                          <View style={{flexDirection:'row',width:'50%',alignItems:'center',justifyContent:'flex-start'}}>
                            <Octicons name ='device-mobile' size={20} color="#919EAB" />
                            <Text  style={{
                                fontSize: RFValue(12),
                                fontWeight: '500',
                                textAlign: 'left',
                                color: '#919EAB',
                                marginLeft:10
                              }}>{data.mobileNo}</Text>
                          </View>
                         <View style={{flexDirection:'row',width:'50%',marginRight:0,alignItems:'center',justifyContent:'flex-start'}}>
                            <Icons name ='briefcase-variant-outline' size={25} color="#919EAB" />
                            <Text  style={{
                                fontSize: RFValue(12),
                                fontWeight: '500',
                                textAlign: 'left',
                                color: '#919EAB',
                                marginLeft:10,
                              }}>{`${data.experience} ${data.experience ? " years" : null}`}</Text>
                          </View> 
                          
                        </View>
                  <View style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'flex-start',marginVertical:10,paddingRight:10,}}>
                            <Octicons name ='location' size={25} color="#919EAB" />
                            <Text  style={{
                                fontSize: RFValue(12),
                                fontWeight: '500',
                                textAlign: 'left',
                                color: '#919EAB',
                                marginLeft:10,
                              }}>{data.address}</Text>
                          </View>
                  <View
                    style={{
                      height: 1,
                      borderColor: '#C4CDD5',
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      marginVertical: 10
                    }}
                  />

                       <Text
                        style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'flex-start',marginVertical:10,color:'#000',
                          fontWeight:'500',fontSize:16
                        }}>
                       {Languages.Preferred_Location}
                      </Text>
                      <View style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'flex-start',marginVertical:10,}}>
                        <Octicons name='location' size={25} color="#919EAB"/>
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
                      marginBottom: 10,
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      marginVertical: 10
                    }}
                  />
                      <Text
                        style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'flex-start',marginVertical:10,color:'#000',
                          fontWeight:'500',fontSize:16
                        }}>
                        {Languages.Brand}
                      </Text>
                      
                      <View>
              <View style={styles.additionalTextinput}>
                {brandList&&
                brandList.map((item, index) => (
                  <Text
                  key={item.id || index}
                    style={{
                      fontSize: 14,
                      fontWeight: 'semibold',
                      textAlign: 'left',
                      //  marginTop: 10,
                      color: 'black',
                      backgroundColor: '#00AEEF1A',
                      marginLeft: 10,
                      padding: 5,
                      borderRadius: 10,
                      marginBottom:10
                    }}>
                    {item.brandName}
                  </Text>
                ))}
              </View>
            </View>
                    
                      <Text
                        style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'flex-start',marginVertical:10,color:'#000',
                          fontWeight:'500',fontSize:16                         
                        }}>
                        {Languages.ServiceCategory}
                      </Text>
                     
<View>
              <View style={styles.additionalTextinput}>
                {serviceType&&
                serviceType.map((item, index) => (
                  <Text
                  key={item.id || index}
                    style={{
                      fontSize: 14,
                      fontWeight: 'semibold',
                      textAlign: 'left',
                      //  marginTop: 10,
                      color: 'black',
                      backgroundColor: '#00AEEF1A',
                      marginLeft: 10,
                      padding: 5,
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
                  ):null}


                  {roleName && roleName ==='ASM'?(
                    <>
                     <View>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 16,
                        marginBottom: 10,
                        marginHorizontal: 5,
                        justifyContent:'flex-start'
                      }}>
                      {data.firstName} {data.lastName} - {data.age}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 12,
                        marginBottom: 10,
                        marginRight: '20%',
                        marginStart: 4,
                        justifyContent:'flex-start'
                      }}>
                      {data.gender}
                    </Text>

                    <View
                    style={{
                      height: 1,
                      borderColor: '#C4CDD5',
                      marginBottom: 17,
                      borderWidth: 1,
                      borderStyle: 'dashed',
                    }}
                  />
                       <View
                          style={{
                            justifyContent:'flex-start',                       
                            flexDirection: "row",
                            alignItems: "center",
                              }} >
                          <View style={{flexDirection:'row',width:'50%',alignItems:'center',justifyContent:'flex-start'}}>
                            <Octicons name ='device-mobile' size={20} color="#919EAB" />
                            <Text  style={{
                                fontSize: RFValue(12),
                                fontWeight: '500',
                                textAlign: 'left',
                                color: '#919EAB',
                                marginLeft:10
                              }}>{data.mobileNo}</Text>
                          </View>
                         <View style={{flexDirection:'row',width:'50%',marginRight:0,alignItems:'center',justifyContent:'flex-start'}}>
                            <Icons name ='briefcase-variant-outline' size={25} color="#919EAB" />
                            <Text  style={{
                                fontSize: RFValue(12),
                                fontWeight: '500',
                                textAlign: 'left',
                                color: '#919EAB',
                                marginLeft:10,
                              }}>{`${data.experience} ${data.experience ? " years" : null}`}</Text>
                          </View> 
                          
                        </View>
                  <View style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'flex-start',marginVertical:10,paddingRight:10,}}>
                            <Octicons name ='location' size={25} color="#919EAB" />
                            <Text  style={{
                                fontSize: RFValue(12),
                                fontWeight: '500',
                                textAlign: 'left',
                                color: '#919EAB',
                                marginLeft:10,
                              }}>{data.address}</Text>
                          </View>
                           </View>
                    </>
                  ):null}

                  {roleName && roleName ==='RSM'?(
                    <>
                              <View>
                    <Text
                      style={{
                        flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'flex-start',marginVertical:10,
                        }}>
                      {data.firstName} {data.lastName} - {data.age}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 12,
                        marginBottom: 10,
                        marginRight: '20%',
                        marginStart: 4,
                        justifyContent:'flex-start'
                      }}>
                      {data.gender}
                    </Text>

                    <View
                    style={{
                      height: 1,
                      borderColor: '#C4CDD5',
                      marginBottom: 17,
                      borderWidth: 1,
                      borderStyle: 'dashed',
                    }}
                  />
                      <View
                          style={{
                            justifyContent:'flex-start',                       
                            flexDirection: "row",
                            alignItems: "center",
                              }} >
                          <View style={{flexDirection:'row',width:'50%',alignItems:'center',justifyContent:'flex-start'}}>
                            <Octicons name ='device-mobile' size={20} color="#919EAB" />
                            <Text  style={{
                                fontSize: RFValue(12),
                                fontWeight: '500',
                                textAlign: 'left',
                                color: '#919EAB',
                                marginLeft:10
                              }}>{data.mobileNo}</Text>
                          </View>
                         <View style={{flexDirection:'row',width:'50%',marginRight:0,alignItems:'center',justifyContent:'flex-start'}}>
                            <Icons name ='briefcase-variant-outline' size={25} color="#919EAB" />
                            <Text  style={{
                                fontSize: RFValue(12),
                                fontWeight: '500',
                                textAlign: 'left',
                                color: '#919EAB',
                                marginLeft:10,
                              }}>{`${data.experience} ${data.experience ? Languages.years : null}`}</Text>
                          </View> 
                          
                        </View>
                  <View style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'flex-start',marginVertical:10,paddingRight:10,}}>
                            <Octicons name ='location' size={25} color="#919EAB" />
                            <Text  style={{
                                fontSize: RFValue(12),
                                fontWeight: '500',
                                textAlign: 'left',
                                color: '#919EAB',
                                marginLeft:10,
                              }}>{data.address}</Text>
                          </View>
                           </View>
                    </>
                  ):null}

                  {roleName && roleName === 'Salesman' ?(
                    <>

                    <View>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 16,
                        marginBottom: 10,
                        marginHorizontal: 5,
                       justifyContent:'flex-start'
                      }}>
                      {data.firstName} {data.lastName} - {data.age}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 12,
                        marginBottom: 10,
                        marginRight: '20%',
                        marginStart: 4,
                        justifyContent:'flex-start'
                      }}>
                      {data.gender}
                    </Text>
                    
                    <View
                   style={{
                     height: 1,
                     borderColor: '#C4CDD5',
                     marginBottom: 17,
                     borderWidth: 1,
                     borderStyle: 'dashed',
                     marginVertical:10
                   }}
                 />
                 
                 <View
                          style={{
                            justifyContent:'flex-start',                       
                            flexDirection: "row",
                            alignItems: "center",
                              }} >
                          <View style={{flexDirection:'row',width:'50%',alignItems:'center',justifyContent:'flex-start'}}>
                            <Octicons name ='device-mobile' size={20} color="#919EAB" />
                            <Text  style={{
                                fontSize: RFValue(12),
                                fontWeight: '500',
                                textAlign: 'left',
                                color: '#919EAB',
                                marginLeft:10
                              }}>{data.mobileNo}</Text>
                          </View>
                         <View style={{flexDirection:'row',width:'50%',marginRight:0,alignItems:'center',justifyContent:'flex-start'}}>
                            <Icons name ='briefcase-variant-outline' size={25} color="#919EAB" />
                            <Text  style={{
                                fontSize: RFValue(12),
                                fontWeight: '500',
                                textAlign: 'left',
                                color: '#919EAB',
                                marginLeft:10,
                              }}>{`${data.experience} ${data.experience ? Languages.years : null}`}</Text>
                          </View> 
                          
                        </View>
                  <View style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'flex-start',marginVertical:10,
                  fontSize:16,fontWeight:'500',color:'#000',paddingRight:10,}}>
                            <Octicons name ='location' size={25} color="#919EAB" />
                            <Text  style={{
                                fontSize: RFValue(12),
                                fontWeight: '500',
                                textAlign: 'left',
                                color: '#919EAB',
                                marginLeft:10,
                              }}>{data.address}</Text>
                          </View>
                  <View
                    style={{
                      height: 1,
                      borderColor: '#C4CDD5',
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      marginVertical: 10
                    }}
                  />

<Text
                       style={{ flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'flex-start',marginVertical:10,
                        fontSize:16,fontWeight:'500',color:'#000' }}>
                        {Languages.Locations_handled}
                      </Text>
                      <View style={{ flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'flex-start',marginVertical:10,
                  fontSize:16,fontWeight:'500',color:'#000'}}>
                        <Octicons name='location' size={25} color="#919EAB" />
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
                      marginBottom: 10,
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      marginVertical: 10
                    }}
                  />
                    
                    <Text style={{ flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'flex-start',marginVertical:10,
                  fontSize:16,fontWeight:'500',color:'#000'}}>
                        {Languages.Brand}
                      </Text>
                      <View>
              <View style={styles.additionalTextinput}>
                {brandList&&
                brandList.map((item, index) => (
                  <Text
                  key={item.id || index}
                    style={{
                      fontSize: 14,
                      fontWeight: 'semibold',
                      textAlign: 'left',
                      //  marginTop: 10,
                      color: 'black',
                      backgroundColor: '#00AEEF1A',
                      marginLeft: 10,
                      padding: 5,
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
                  ):null}
                 
                </View>
              )
            )}
          </View>
         
        </ScrollView>
      </View>
      <View style={{ flex: 0.2, justifyContent: 'flex-end',paddingLeft:10,paddingRight:10 }}>
      <View style={{ height: 20 }} />
          <View
            style={{
              backgroundColor: '#FEF2F3',
              width:"100%",
              height: 50,
              borderRadius: 5,
              marginRight: 20,
              alignItems: 'center',
             justifyContent: 'center',
             borderWidth: 1,
             borderColor:'#FEF2F3'  
            }}>
            <View style={{ padding:10}}>
              <View
                style={{
                
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={Images.Info}
                  resizeMode="contain"
                  style={{ width: 15, height: 15, tintColor: '#666687' }}
                />
                <Text
                  style={{
                    fontSize: RFValue(11),
                    fontWeight: '500',
                    textAlign: 'left',
                    color: '#666687',
                    marginLeft: 10,
                    
                  }}>
                  {Languages.You_can_also_change_these_details_on_your_Profile}
                </Text>
              </View>
            </View>
          </View>
        <CustomButton
          text={isFirstLogin?Languages.Lets_get_Started:Languages.Save}
          onPress={() => {
            navigation.navigate('SalesBottomTabs'); 
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditPreviewScreen;
