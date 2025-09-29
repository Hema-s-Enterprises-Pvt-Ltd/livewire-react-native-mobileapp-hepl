import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  Alert,
  Text,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import CustomAppBar from '../../component/CustomAppBar';
import GlobalStyles from '../../core/GlobalStyles';
import {styles} from './InventoryStyles';
import {getStockList} from '../../networkClient/apifunction';
import {RFValue} from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomSearchInput from '../../component/CustomSearchInput';
import moment from 'moment';
import RequestStockModal from './component/RequestStockModal';
import {useFocusEffect} from '@react-navigation/native';
import {Images, Languages} from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const InventoryDetailScreen = props => {
  const ItemData = props.route.params.data;
  const [search, setsearch] = useState('');
  const [input, setinput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState();
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const searchInputRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []),
  );
  useEffect(() => {
    crashlytics().log('InventoryDetailScreen mounted');
    return () => {
      crashlytics().log('InventoryDetailScreen unmounted');
    };
  }, []);

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
    await getStockList(ItemData.product.id)
      .then(function (response) {
        if (response.data.statusCode === 200) {
          if (response.data.data != null) {
            setData(response.data.data);
          } else {
            setData([]);
          }
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
          title={ItemData ? ItemData.product.name : '--'}
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
              //getSearchData(text.trim())
            }}
            ref={searchInputRef} // Pass the ref
          />
        </View>
        <View style={{height: 10}} />
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 6,
                flex: 0.7,
              }}>
              <View style={styles.Icons}>
                <Image
                  source={Images.Shampoo}
                  style={{width: 15, height: 15}}
                />
              </View>
              <View>
                <Text
                  style={{
                    marginLeft: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}>
                  {ItemData ? ItemData.product.name : '--'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}>
              <Image
                source={Images.AddSquare}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            marginBottom: 10,
          }}>
          <View
            style={{
              height: 'auto',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 10,
            }}>
            <View
              style={{
                width: '45%',
                height: 'auto',
                backgroundColor: '#F1F8F1',
                borderColor: 'white',
                borderRadius: 5,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              <View
                style={{
                  backgroundColor: GlobalStyles.colorSet.blue,
                  borderRadius: 100,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {ItemData ? ItemData.demoQuantity : '--'}
                </Text>
              </View>
              <Text
                style={{
                  color: '#042628',
                  fontSize: 12,
                  margin: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {Languages.Products_Availed}
              </Text>
              <Text
                style={{
                  color: '#042628',
                  fontSize: 10,
                  margin: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {ItemData ? `( in ${ItemData.unit} )` : '--'}
              </Text>
            </View>
            <View
              style={{
                width: '45%',
                height: 'auto',
                backgroundColor: 'white',
                borderColor: 'white',
                borderRadius: 5,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              <View
                style={{
                  backgroundColor: GlobalStyles.colorSet.blue,
                  borderRadius: 100,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {ItemData ? ItemData.demosTaken : '--'}
                </Text>
              </View>
              <Text
                style={{
                  color: '#042628',
                  fontSize: 12,
                  margin: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {Languages.Demos_Taken}
              </Text>
              <Text
                style={{
                  color: '#042628',
                  fontSize: 10,
                  margin: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {`( in Nos )`}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 'auto',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 10,
            }}>
            <View
              style={{
                width: '45%',
                height: 'auto',
                backgroundColor: '#00AEEF1A',
                borderColor: 'white',
                borderRadius: 5,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              <View
                style={{
                  backgroundColor: '#18b66b',
                  borderRadius: 100,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 10,
                  }}>
                  {ItemData ? ItemData.consumption : '--'}
                </Text>
              </View>
              <Text
                style={{
                  color: '#667084',
                  fontSize: 12,
                  margin: 5,
                  textAlign: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {Languages.Consumption}
              </Text>
              <Text
                style={{
                  color: '#042628',
                  fontSize: 10,
                  margin: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {ItemData ? `( in ${ItemData.unit} )` : '--'}
              </Text>
            </View>
            <View
              style={{
                width: '45%',
                height: 'auto',
                backgroundColor: '#00AEEF1A',
                borderColor: 'white',
                borderRadius: 5,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              <View
                style={{
                  backgroundColor: '#18b66b',
                  borderRadius: 100,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 10,
                  }}>
                  {ItemData ? ItemData.balance : '--'}
                </Text>
              </View>
              <Text
                style={{
                  color: '#667084',
                  fontSize: 12,
                  margin: 5,
                  textAlign: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {Languages.Balance}
              </Text>
              <Text
                style={{
                  color: '#042628',
                  fontSize: 10,
                  margin: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {ItemData ? `( in ${ItemData.unit} )` : '--'}
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={{
            color: '#212B36',
            fontSize: 18,
            marginLeft: 10,
            fontWeight: '700',
          }}>
          {Languages.Request_History}
        </Text>
        <View style={{height: 10}} />

        <FlatList
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={filteredData}
          ListEmptyComponent={EmptyListMessage}
          renderItem={({item, index}) => renderItem(item)}
        />

        <RequestStockModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            getData();
          }}
          itemData={ItemData}
        />
      </View>
    </SafeAreaView>
  );
};
export default InventoryDetailScreen;
