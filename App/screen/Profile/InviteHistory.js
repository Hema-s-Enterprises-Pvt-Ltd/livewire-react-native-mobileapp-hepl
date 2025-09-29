import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ImageBackground,
  Pressable,
  Alert,
  SafeAreaView
} from 'react-native';
import { styles } from './ProfileStyles';
import CustomAppBar from '../../component/CustomAppBar';
import CustomSearchInput from '../../component/CustomSearchInput';
import { RFValue } from 'react-native-responsive-fontsize';
import {getDeclinedDetails, getInviteHistory } from '../../networkClient/apifunction';
import moment from 'moment';
import CancelModal from './component/CancelModal';
import { Images, Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const InviteHistoryScreen = props => {
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [declineData, setDeclineData] = useState(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('InviteHistoryScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('InviteHistoryScreen unmounted');
    };
  }, []);

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    filterData();
  }, [search, data]);

  const getList = async () => {
    await getInviteHistory().then(function (response) {
      if (response.data.statusCode === 200) {
        setData(response.data.data);
      } else {
        Alert.alert(Languages.Alert, response.data.statusMessage);
      }
    }).catch(function (error) {
      Alert.alert(Languages.Alert, error.response.data.message);
    });
  };

  const filterData = () => {
    if (search === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        item.demo.generatedDemoId.toLowerCase().includes(search.toLowerCase()) ||
        item.demo.scheduleDate.toLowerCase().includes(search.toLowerCase()) ||
        item.status.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filtered);
    }
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

  const onClickhandle = item => {
    if (item.status === 'DECLINED') {
      setDeclineData(item);
      setModalVisible(true);
      //decline_getbyId(item.demo.id);
    } else {
      setModalVisible(false);
      props.navigation.navigate("DemoDetailScreen", { id: item.demo.id, isDemoHistory: true });
    }
  };

  const renderItem = item => {
    return (
      <View
        style={
          item.status === 'DECLINED'
            ? styles.declineContainer
            : item.status === 'ACCEPTED'?styles.demoComplete:styles.otherDemo
        }>
        <ImageBackground
          source={Images.BackgroundPattern}
          resizeMode={'cover'}
          style={{
            height: 'auto',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              flexWrap: 'wrap',
              alignItems:'center'
            }}>
           {
            item.profileUrl?
            <Image
            source={{uri:item.profileUrl}}
            resizeMode="contain"
            style={styles.Image}
          />:
          <Image
          source={Images.Person}
          resizeMode="contain"
          style={[styles.Image,{tintColor:"white"}]}
        />
           }

            <View style={{ width: '65%', flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '100%',
                  height: 'auto',
                }}>
                   <Text style={[styles.subHeader, { color: 'white' }]}>
                  {`#demo${item.demo.id}`}
                </Text>
                <Text style={[styles.subHeader, { color: 'white' }]}>
                  {item.demo.generatedDemoId}
                </Text>
                <Text style={[styles.subHeader, { color: 'white' }]}>
                  {moment(item.scheduleDate).format("MMM DD")}
                </Text>
              </View>
              <View
                style={{
                  width: '30%',
                  alignItems: 'flex-end',
                  paddingRight: 10,
                  justifyContent: 'center',
                }}>
                {item.status === 'DECLINED' ? (
                 
                    <Text style={[styles.subfont, { color: 'white' }]}>
                     {Languages.Declined}
                    </Text>
               
                ) : (
                  <Image source={Images.Info} style={{width:20,height:20,tintColor:'white'}}/>
                )}
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.viewContainer}>
      <View style={[styles.container,{flex:1}]}>
        <CustomAppBar title="Invite History" showImage={true} navigation={props.navigation}/>
        <View style={{ height: 30 }} />
        <CustomSearchInput
          placeholder={"Search"}
          value={search}
          onChangeText={text => {
            setSearch(text);
          }}
          
          ref={searchInputRef} // Pass the ref
        />
      
          <FlatList
          style={{flex:1}}
           showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            data={filteredData}
            ListEmptyComponent={EmptyListMessage}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => { onClickhandle(item) }}>
                {renderItem(item)}
              </Pressable>
            )}
          />
       
        <CancelModal visible={modalVisible} onClose={() => setModalVisible(false)} details={declineData} />
      </View>
    </SafeAreaView>
  );
};

export default InviteHistoryScreen;
