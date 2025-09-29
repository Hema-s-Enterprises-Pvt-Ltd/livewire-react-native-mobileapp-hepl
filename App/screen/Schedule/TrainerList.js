import React, { useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Alert,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  SafeAreaView,
  Pressable
} from 'react-native';
import { styles } from './ScheduleStyles';
import GlobalStyles from '../../core/GlobalStyles';
import CustomSearchInput from '../../component/CustomSearchInput'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import TrainerDetailPopUp from './component/TrainerDetailPopUp';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getAvailTrainers,
  getDetails,
  sendInvite,
  trainerGetById
} from '../../networkClient/apifunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Images, Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const TrainerListScreen = (props) => {

  const { date, serviceId, demoId } = props.route.params;
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [trainerDetails, setTrainerDetails] = useState();
  const [input, setInput] = useState('');
  const [image,setImage]=useState();
  const [status,setStatus]=useState(false);

  const searchInputRef = useRef(null);
  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('TrainerListScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('TrainerListScreen unmounted');
    };
  }, []);
  useEffect(()=>{
    getUserImage()
  })
  const getUserImage=async()=>{
    const id = await AsyncStorage.getItem("userId");
    let Id = parseInt(id, 10);
    try {
      const response = await getDetails(Id);
      if (response.data.statusCode === 200) {
       setImage(response.data.data.profileUrl)
      } else {
        Alert.alert(Languages.Alert, response.data.data);
      }
    } catch (error) {
      Alert.alert(Languages.Alert, error.message);
    }
  }
  useEffect(() => {
    const backAction = () => {
       props.navigation.navigate("SalesBottomTabs")
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
  getTrainers()
  }, []);
const getTrainers=async()=>{
  getAvailTrainers(date, serviceId,demoId)
  .then(response => {
    if (response.data.statusCode === 200) {
      const res = response.data.data?response.data.data:[];
    const newObject=res.map(item => ({
      ...item,
      status: 'OPEN' 
    }))
    setTrainers(newObject);
      setFilteredTrainers(res);
    } else {
      Alert.alert(Languages.Alert, response.data.data.statusMessage);
    }
  })
  .catch(error => {
    Alert.alert(Languages.Alert, error.response.data.message);
  });
}
  useEffect(() => {
    // const filtered = trainers.filter(trainer => 
    //   trainer.userName.toLowerCase().includes(searchQuery!=""?searchQuery.toLowerCase():searchQuery)
    // );
    const filtered = trainers.filter(
      item=>
        (item?.firstName &&
          item.firstName
            .toLowerCase()
            .includes(searchQuery!=""?searchQuery.toLowerCase():searchQuery)) ||
        item?.lastName.toLowerCase().includes(searchQuery!=""?searchQuery.toLowerCase():searchQuery) 
    );
    setFilteredTrainers(filtered);
  }, [searchQuery, trainers]);

  const getTrainerDetail = async (id) => {
    trainerGetById(id)
      .then(response => {
        if (response.data.statusCode === 200) {
          const res = response.data.data;
          setTrainerDetails(res);
        } else {
          Alert.alert(Languages.Alert, response.data.data.statusMessage);
        }
      })
      .catch(error => {
        Alert.alert(Languages.Alert, error.message);
      });
  };

  const inviteClicked = async (trainerID) => {
    const data = {
      demoId: demoId,
      trainerId: trainerID,
    };

    await sendInvite(data)
      .then(response => {
        if (response.data.statusCode === 200) {
          const newObject=  trainers.map(item => {
            if (item.id ===trainerID) {
              return {
                ...item,
                status: "PENDING"  
              };
            }else{

            }
      
            return item;  
          })
          setTrainers(newObject);
            setFilteredTrainers(newObject);
        } else {
          Alert.alert(Languages.Alert, response.data.statusMessage);
        }
      })
      .catch(error => {
        Alert.alert(Languages.Alert, error.response.data.message);
      });
  };

  const EmptyListMessage = () => {
    return (
      <Text
        style={{
          fontSize: RFValue(14),
          fontWeight: '500',
          marginLeft: 5,
          marginRight: 10,
          color: 'grey',
          alignSelf: 'center',
          margin: 5,
          textDecorationLine: 'underline',
          textDecorationColor: 'grey',
        }}>
       {Languages.No_data_available}
      </Text>
    );
  };

  const showPopUp = async (id,status) => {
    if(status==="PENDING"){
      setStatus(true)
    }else{
      setStatus(false)
    }
    setModalVisible(true);
    getTrainerDetail(id);
  };

  const renderItem = ({ item }) => {
    if (item.status === "PENDING") {
      containerStyle = styles.pendingflatContainer;
    } else {
      containerStyle=styles.flatContainer
    }
    return (
      <Pressable onPress={() => showPopUp(item.id,item.status)}>
      <View style={containerStyle}>
        <ImageBackground
          source={Images.BackgroundPattern}
          resizeMode={'cover'}
          style={{
            height: 'auto',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,
          }}>
          <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
          
            {
        item.profilePic?
          <Image
          source={{uri:item.profilePic}}
          resizeMode="stretch"
          style={styles.Image}
        />:
        <Image
          source={Images.Person}
          resizeMode="stretch"
          style={styles.Image}
        />
        }

           
        
            <View style={{ width: '60%', flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '100%',
                  height: 'auto',
                  justifyContent: 'center',
                }}>
                <Text style={{ color: 'white',
                   fontSize: RFPercentage(2),
                   fontWeight: 'bold',
                   textAlign: 'left',
                 }}>
                  {item.firstName+" "+item.lastName}
                </Text>
                {
            item.status==="PENDING"&&(
              <Text style={{color: 'white',  fontSize: RFPercentage(1.4),
                textAlign: 'left',
                fontWeight:'semibold'}}>
             {Languages.Accept_Invite_Pending}
              </Text>
            )
          }
              </View>
              {
                item.status==="PENDING"?
                <View
                style={{
                  width: '40%',
                  alignItems: 'flex-end',
                  paddingRight: 10,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                    source={Images.Timer}
                    resizeMode="contain"
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      marginLeft: 5,
                    }}
                  />
                  </View>
                  :
                  <View
                  style={{
                    width: '40%',
                    alignItems: 'flex-end',
                    paddingRight: 10,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text onPress={() => inviteClicked(item.id)}
                    style={[
                      styles.subHeader,
                      { color: 'white', fontSize: RFValue(10) },
                    ]}>
                    {Languages.Send_Invite}
                  </Text>
                  <TouchableOpacity onPress={() => inviteClicked(item.id)}>
                    <Image
                      source={Images.SendSqaure}
                      resizeMode="contain"
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        marginLeft: 5,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              }
            
            </View>
          </View>
        </ImageBackground>
      </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor:GlobalStyles.colorSet.app_bg, flex: 1 }}>
      <View style={styles.container}>
      <View style={{flexDirection: 'row',alignItems:'center',justifyContent:'space-between'}}>
    <View style={{flexDirection:'row'}}>
   <TouchableOpacity style={{marginTop:5,marginRight:3}} onPress={() => props.navigation.navigate("SalesBottomTabs")}>
   <Icon color="black" name="arrow-back" size={20} />
   </TouchableOpacity>
      <Text style={styles.header}>{Languages.Schedule}</Text>
    </View>
    
      <View style={{flex: 0.2, alignItems: 'flex-end'}}>
      {
    image?
    <Image
    source={{uri:image}}
    style={styles.Image}
  />:
  <Image
  source={Images.Person}
  style={styles.Image}
/>
   }
    </View>
   </View>
        <View style={{ height: 30 }} />
        <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
          <Text style={styles.header}>Available Trainer</Text>
        </View>
        <CustomSearchInput
            placeholder={Languages.Search_for_Trainers}
            value={searchQuery}
            onChangeText={text => {
              setSearchQuery(text);
            }}
           
            ref={searchInputRef} // Pass the ref
          />
        {/* <SearchInput
          placeholder={Languages.Search_for_Trainers}
          onChangeText={(text) => setSearchQuery(text)}
          maxLength={10}
          Ref={input => {
            setInput(input);
          }}
          showClose={searchQuery?true:false}
          onClose={()=>{
            input.clear();
            getTrainers();
          }}
        /> */}
      </View>
      <View style={{ flex: 1, marginBottom: 65 }}>
        <FlatList
          data={filteredTrainers}
          ListEmptyComponent={EmptyListMessage}
          renderItem={renderItem}
        />
        <TrainerDetailPopUp
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          trainerDetails={trainerDetails}
          InviteId={demoId}
          showButton={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default TrainerListScreen;
