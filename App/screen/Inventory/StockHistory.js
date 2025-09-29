import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  Alert,
  Text,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import CustomSearchInput from '../../component/CustomSearchInput';
import CustomAppBar from '../../component/CustomAppBar';
import GlobalStyles from '../../core/GlobalStyles';
import {styles} from './InventoryStyles';
import {RFValue} from 'react-native-responsive-fontsize';
import {getStockList} from '../../networkClient/apifunction';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {Images, Languages} from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const StockHistoryScreen = props => {
  const [search, setsearch] = useState('');
  const [input, setinput] = useState('');
  const [data, setData] = useState();
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const searchInputRef = useRef(null);

  useEffect(() => {
    crashlytics().log('StockHistoryScreen mounted');
    return () => {
      crashlytics().log('StockHistoryScreen unmounted');
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []),
  );
  useEffect(() => {
    filterData();
  }, [search, data]);
  const filterData = () => {
    if (search === '') {
      setFilteredData(data);
    } else {
      const lowercasedSearch = search.toLowerCase();
      const filtered = data.filter(
        item =>
          item.status.toLowerCase().includes(lowercasedSearch) ||
          item.product.name.toLowerCase().includes(lowercasedSearch),
      );
      setFilteredData(filtered);
    }
  };
  const getData = async () => {
    await getStockList('')
      .then(function (response) {
        if (response.data.statusCode === 200) {
          if (response.data.data != null) {
            setData(response.data.data);
          } else {
            setData([]);
          }
        } else {
          Alert.alert(Languages.Alert, response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.response.data.message);
      });
  };
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
          alignSelf: 'center',
          margin: 5,
          textDecorationLine: 'underline',
          textDecorationColor: 'grey',
        }}>
        {Languages.No_data_available}
      </Text>
    );
  };
  const handleToggleDetail = id => {
    setExpandedItemId(prevId => (prevId === id ? null : id));
  };

  const Item = ({item, onToggleDetail, showDetail}) => {
    return (
      <View style={[styles.cardContainer, {height: 'auto'}]}>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 6,
              alignItems: 'center',
              flex: 0.8,
            }}>
            <View style={styles.Icons}>
              <Image
                source={Images.Shampoo}
                style={{width: 15, height: 15}}
              />
            </View>
            <View>
              <View style={{flexDirection: 'row', gap: 6}}>
                <Text
                  style={{color: '#161C24', fontSize: 12, fontWeight: '700'}}>
                  {item.product ? item.product.name : '--'}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '500',
                  color:
                    item.status === 'ACCEPTED'
                      ? 'green'
                      : item.status === 'REQUESTED'
                      ? '#FEC84B'
                      : item.status === 'REJECTED'
                      ? '#F97066'
                      : '#042628',
                  marginTop: 5,
                }}>
                {item.status
                  ? item.status === 'REQUESTED'
                    ? 'PENDING'
                    : item.status === 'ACCEPTED'
                    ? 'APPROVED'
                    : item.status
                  : '--'}{' '}
                •
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#ccf1ff',
              padding: 10,
              borderRadius: 5,
            }}>
            <View style={{flexDirection: 'column'}}>
              <Text
                style={{
                  color: '#505A67',
                  fontSize: 10,
                  fontWeight: '500',
                  textAlign: 'center',
                }}>
                {Languages.Requested_Date}
              </Text>
              <Text
                style={{
                  color: '#042628',
                  fontSize: 10,
                  fontWeight: '500',
                  marginTop: 10,
                  textAlign: 'center',
                }}>
                {item.reqDate ? moment(item.reqDate).format('MMM DD') : '--'}
              </Text>
            </View>
            <View style={{flexDirection: 'column'}}>
              <Text
                style={{
                  color: '#505A67',
                  fontSize: 10,
                  fontWeight: '500',
                  textAlign: 'center',
                }}>
                {Languages.Requested_Qty}
              </Text>
              <Text
                style={{
                  color: '#042628',
                  fontSize: 10,
                  fontWeight: '500',
                  marginTop: 10,
                  textAlign: 'center',
                }}>
                {item.requestedQuantity ? item.requestedQuantity : '--'}
              </Text>
            </View>
            {item.status != 'REQUESTED' && (
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#505A67',
                    fontSize: 10,
                    fontWeight: '500',
                    textAlign: 'center',
                  }}>
                  {item.status
                    ? item.status === 'ACCEPTED'
                      ? Languages.Approved_Date
                      : Languages.Rejected_Date
                    : '--'}
                </Text>
                <Text
                  style={{
                    color: '#042628',
                    fontSize: 10,
                    fontWeight: '500',
                    marginTop: 10,
                    textAlign: 'center',
                  }}>
                  {item.processedDate
                    ? moment(item.processedDate).format('MMM DD')
                    : '--'}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };
  const renderItem = item => {
    return (
      <Item
        item={item}
        onToggleDetail={handleToggleDetail}
        showDetail={expandedItemId === item.id}
      />
    );
  };
  return (
    <SafeAreaView
      style={{backgroundColor: GlobalStyles.colorSet.app_bg, flex: 1}}>
      <View style={{flex: 1, padding: 10}}>
        <View style={{height: 10}} />
        <CustomAppBar
          title="Stock Request History"
          showImage={true}
          navigation={props.navigation}
        />
        <View style={{height: 10}} />
        <View style={{paddingLeft: 10, paddingRight: 10}}>
          <CustomSearchInput
            placeholder={Languages.Search_Inventory}
            value={search}
            onChangeText={text => {
              setsearch(text);
            }}
            ref={searchInputRef} // Pass the ref
          />
        </View>
        <View style={{height: 10}} />

        <FlatList
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          data={filteredData}
          ListEmptyComponent={EmptyListMessage}
          renderItem={({item, index}) => renderItem(item)}
        />
      </View>
    </SafeAreaView>
  );
};
export default StockHistoryScreen;
