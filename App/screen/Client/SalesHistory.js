import React, {useEffect, useState, useRef} from 'react';
import { View, Text, Image, FlatList, Pressable, TouchableOpacity, Alert, Dimensions } from 'react-native';
import GlobalStyles from '../../core/GlobalStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/AntDesign';
import { styles } from './ClientStyles';
import AddSalesModal from './component/AddSalesModal';
import { getSalesHistory } from '../../networkClient/apifunction';
import moment from 'moment';
import CustomSearchInput from '../../component/CustomSearchInput';
import { Images, Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const SalesHistory = props => {

  const clientID = props.clientId;
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('SalesHistoryScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('SalesHistoryScreen unmounted');
    };
  }, []);
  
  useEffect(() => {
    const parameter = `clientId=${encodeURIComponent(clientID)}`;
    getList(parameter);
  }, []);

  useEffect(() => {
    filterData();
  }, [search, data]);

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
        item.demo.generatedDemoId.toLowerCase().includes(lowercasedSearch) ||
        item.product.name.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredData(filtered);
      }else{
        setFilteredData([]);
      }
    }
  };

  const handleToggleDetail = id => {
    setExpandedItemId(prevId => (prevId === id ? null : id));
  };

  const handlePress = () => {
    setModalVisible(true);
  };

  const getList = async parameter => {
    try {
      const response = await getSalesHistory(parameter);
      if (response.data.statusCode === 200) {
        setData(response.data.data);
      } else {
        Alert.alert('Alert', response.data.statusMessage);
      }
    } catch (error) {
      Alert.alert('Alert', error.response.data.message);
    }
  };

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

  const renderItem = ({ item }) => (
    <Item
      item={item}
      onToggleDetail={handleToggleDetail}
      showDetail={expandedItemId === item.id}
    />
  );

  const Item = ({ item, onToggleDetail, showDetail }) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 6, alignItems: 'center' }}>
          <View style={styles.Icons}>
            <Image source={Images.Shampoo} style={{ width: 15, height: 15 }} />
          </View>
          <View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <Text style={{ color: '#161C24', fontSize: 12, fontWeight: '700' }}>
                {item.demo.generatedDemoId}
              </Text>
              <Text style={{
                color: '#042628',
                fontSize: 10,
                fontWeight: '500',
                backgroundColor: '#ccf1ff',
                borderRadius: 20,
                padding: 5,
              }}>
                {item.soldDate ? moment(item.soldDate).format("MMM, DD") : "--"}
              </Text>
            </View>
            <Text style={{ fontSize: 10, fontWeight: '500', color: '#042628', marginTop: 5 }}>
              {item.product.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => onToggleDetail(item.id)}>
          <Icon
            name={showDetail ? 'up-square-o' : 'down-square-o'}
            size={20}
            color={GlobalStyles.colorSet.orange}
          />
        </TouchableOpacity>
      </View>
      {showDetail && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#ccf1ff',
          padding: 10,
          borderRadius: 5,
        }}>
          <Text style={{ color: '#161C24', fontSize: 16, fontWeight: '500' }}>
            {item.qtySold} Pcs
          </Text>
          <Text style={{ color: '#161C24', fontSize: 16, fontWeight: '500' }}>
            ₹{item.amount}
          </Text>
        </View>
      )}
    </View>
  );

  const handleCloseModal = () => {
    setModalVisible(false);
    const parameter = `clientId=${encodeURIComponent(clientID)}`;
    getList(parameter);
  };

  return (
    <View style={{ backgroundColor: GlobalStyles.colorSet.app_bg, width: "100%",height:Dimensions.get('window').height}}>
      <CustomSearchInput
            placeholder={Languages.Search}
            value={search}
            onChangeText={text => {
              setSearch(text);
            }}
           
            ref={searchInputRef} // Pass the ref
          />

      <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10 }}>
        <View style={{ flex: 0.8 }}>
          <Text style={styles.header}>Sales History</Text>
        </View>
        <TouchableOpacity
          onPress={handlePress}
          style={[styles.box_style, { backgroundColor: '#81BE8333', borderColor: '#81BE8333' }]}
        >
          <Text style={[styles.subHeader, { alignItems: 'center', color: '#81BE83' }]}>
            Add Sales
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: props.showDetail ? "35%" : "55%",}}>
      <FlatList
      contentContainerStyle={{ paddingBottom:70,height:'auto' }} // Ensure sufficient bottom padding
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      data={filteredData}
      ListEmptyComponent={EmptyListMessage}
      renderItem={renderItem}
      scrollEnabled={true} // Ensure scrolling is enabled
    />
      </View>

      <AddSalesModal visible={modalVisible} onClose={handleCloseModal} clientID={clientID} />
    </View>
  );
};

export default SalesHistory;
