import React, {useState,useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {styles} from './ClientStyles';
import CustomAppBar from '../../component/CustomAppBar';
import {
  getClientSearchList,
  getPinnedList,
  getRecentList,
} from '../../networkClient/apifunction';
import {ActivityIndicator} from 'react-native-paper';
import ClientList from './component/ClientList';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Simpleicons from 'react-native-vector-icons/SimpleLineIcons';
import { useFocusEffect } from '@react-navigation/native';
import CustomSearchInput from '../../component/CustomSearchInput';
import { Languages } from '../../common';
const ClientListScreen = props => {
  const [search, setsearch] = useState('');
  const [pinnedArray, setPinnedData] = useState([]);
  const [searchArray, setSearchData] = useState([]);
  const [unpinnedArray, setUnPinnedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  useFocusEffect(
    React.useCallback(() => {
      getPinnedData();
      getUnpinnedData();
    }, []),
  );

  const getSearchList=async(value)=>{
    await getClientSearchList(value)
    .then(function (response) {
      if (response.data.statusCode === 200) {
        setSearchData(response.data.data);
      } else {
        Alert.alert('Alert', response.data.statusMessage);
      }
    })
    .catch(function (error) {
      Alert.alert('Alert', error.response.data.message);
    });
  }
  const getPinnedData = async () => {
    await getPinnedList()
      .then(function (response) {
        if (response.data.statusCode === 200) {
          setPinnedData(response.data.data);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert('Alert', error.response.data.message);
      });
  };
  const getUnpinnedData = async () => {
    await getRecentList()
      .then(function (response) {
        if (response.data.statusCode === 200) {
          setUnPinnedData(response.data.data);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert('Alert', error.response.data.message);
      });
  };

  const EmptyListMessage = ({item}) => {
    return (
      // Flat List Item
      <Text
        style={{
          fontSize: RFPercentage(1.75),
          fontWeight: '500',
          marginLeft: 5,
          marginRight: 10,
          color: 'grey',
          alignSelf: 'center',
          margin: 5,
          textDecorationLine: 'underline',
          textDecorationColor: 'grey',
        }}>
        No data available
      </Text>
    );
  };
  const onClickhandle = ClientId => {
    props.navigation.navigate('ClientDetailScreen', {id: ClientId});
  };
  const Separator = () => {
    return <View style={styles.separator} />;
  };
  return (
    <SafeAreaView style={styles.viewContainer}>
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={{padding: 10}}>
        <View style={{height: 10}} />
        <CustomAppBar title="Clients" showImage={true} navigation={props.navigation}/>
        <View style={{height: 20}} />
        <CustomSearchInput
            placeholder={Languages.Search}
            value={search}
            onChangeText={text => {
              setsearch(text);
              getSearchList(text.trim())
            }}
           
            ref={searchInputRef} // Pass the ref
          />
      </View>
      <ScrollView>
        {search ? (
          <View>
            <FlatList
              keyExtractor={(item, index) => index}
              data={searchArray}
              ListEmptyComponent={EmptyListMessage}
              scrollEnabled={false}
              ItemSeparatorComponent={Separator}
              renderItem={({item, index}) => (
                <Pressable
                  onPress={() => {
                    onClickhandle(item.id);
                  }}>
                  <View style={styles.textContainer}>
            <Text style={[styles.subHeader, { color: "#333",textAlign:'left' }]}>
              {item.name}-{item.clientCode}
            </Text>
          </View>
                </Pressable>
              )}
            />
          </View>
        ) : (
          <View>
            <View style={{width: '100%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  padding: 10,
                  alignItems: 'center',
                }}>
                <Simpleicons name="pin" size={10} color="#333"></Simpleicons>
                <Text
                  style={{
                    textAlign: 'left',
                    color: '#000',
                    fontSize: RFPercentage(1.5),
                    fontWeight: '500',
                  }}>
                  {' '}
                  Pinned Clients{' '}
                </Text>
              </View>

              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <FlatList
                  keyExtractor={(item, index) => index}
                  data={pinnedArray}
                  ListEmptyComponent={EmptyListMessage}
                  scrollEnabled={false}
                  renderItem={({item, index}) => (
                    <Pressable
                      onPress={() => {
                        onClickhandle(item.id);
                      }}>
                      <ClientList item={item} />
                    </Pressable>
                  )}
                />
              )}
            </View>
            <View style={{width: '100%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  padding: 10,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'left',
                    color: '#000',
                    fontSize: RFPercentage(1.5),
                    fontWeight: '500',
                  }}>
                  {' '}
                  Recent Clients{' '}
                </Text>
              </View>
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <FlatList
                  keyExtractor={(item, index) => index}
                  data={unpinnedArray}
                  ListEmptyComponent={EmptyListMessage}
                  scrollEnabled={false}
                  renderItem={({item, index}) => (
                    <Pressable
                      onPress={() => {
                        onClickhandle(item.id);
                      }}>
                      <ClientList item={item} />
                    </Pressable>
                  )}
                />
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};
export default ClientListScreen;
