import React, { useEffect, useState,useRef } from 'react';
import { View, Text, Image, FlatList, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { FAB } from 'react-native-paper';
import GlobalStyles from '../../core/GlobalStyles';
import AddNotesModal from './component/AddNotesModal';
import { getNotesList } from '../../networkClient/apifunction';
import crashlytics from '@react-native-firebase/crashlytics';
import moment from 'moment';
import { styles } from './NotesStyles';
import CustomSearchInput from '../../component/CustomSearchInput';
import { Languages, Icons, Images } from '../../common';

const NotesScreen = (props) => {
  const clientID = props.clientId;
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const searchInputRef = useRef(null);
  
  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('NotesScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('NotesScreen unmounted');
    };
  }, []);

  useEffect(() => {
    const parameter = `clientId=${encodeURIComponent(clientID)}`;
    getList(parameter);
  }, []);

  useEffect(() => {
    filterData();
  }, [search, data]);

  const getList = async (parameter) => {
    try {
      const response = await getNotesList(clientID);
      if (response.data.statusCode === 200) {
        setData(response.data.data);
      } else {
        Alert.alert('Alert', response.data.statusMessage);
      }
    } catch (error) {
      Alert.alert('Alert', error.response.data.message);
    }
  };

  const filterData = () => {
    if (search === '') {
    if(data!=null){
      setFilteredData(data);
    }else{
      setFilteredData([]);
    }
    } else {
      if(data!=null){
        const lowercasedSearch = search.toLowerCase();
      const filtered = data.filter(item =>
        (item.notes && item.notes.toLowerCase().includes(lowercasedSearch)) ||
        (item.demo && item.demo.generatedDemoId.toLowerCase().includes(lowercasedSearch))
      );
      setFilteredData(filtered);
      }else{
        setFilteredData([])
      }
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    const parameter = `clientId=${encodeURIComponent(clientID)}`;
    getList(parameter);
  };

  const renderItem = ({ item }) => (
    <View>
      <View
        style={{
          padding: 10,
          backgroundColor: '#ffffff',
          borderColor: '#323B47',
          borderRadius: 5,
          marginTop: 5,
          marginBottom: 5
        }}
      >
        <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between' }}>
          <View style={{ width: "60%" }}>
            <Text style={styles.header}>{item.notes ? item.notes : "--"}</Text>
          </View>
          <View style={{ width: "40%" }}>
            <Text
              style={{
                backgroundColor: '#E6F2E6',
                borderRadius: 15,
                textAlign: 'center',
                padding: 5,
              }}
            >
              {item.demo ? item.demo.generatedDemoId : "--"}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={Images.Clock}
            style={{ width: 20, height: 20, resizeMode: 'contain', marginStart: 4 }}
          />
          <Text style={{
            fontWeight: 'semibold',
            textAlign: 'left',
            fontSize: 12,
            color: 'black', marginLeft: 4
          }}>
            {item.remindAt ? moment(item.remindAt).format("hh:mm:ss a") : "--"}
          </Text>
        </View>
      </View>
    </View>
  );

  const EmptyListMessage = () => (
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
      }}
    >
      No data available
    </Text>
  );

  return (
    <View style={{ backgroundColor: GlobalStyles.colorSet.app_bg, width: "100%",height:Dimensions.get('window').height }}>
      <CustomSearchInput
            placeholder={Languages.Search}
            value={search}
            onChangeText={text => {
              setSearch(text);
            }}
           
            ref={searchInputRef} // Pass the ref
          />
      <View style={{ height: props.showDetail ? "40%" : "60%" }}>
      
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={filteredData}
          ListEmptyComponent={EmptyListMessage}
          renderItem={renderItem}
        />
        <FAB
          style={styles.fab}
          icon="pencil"
          onPress={() => setModalVisible(true)}
        />
      </View>
      <AddNotesModal visible={modalVisible} onClose={handleCloseModal} clientID={clientID} />
    </View>
  );
};

export default NotesScreen;
