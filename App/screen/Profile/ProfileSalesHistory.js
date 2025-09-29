import React, {useEffect, useState,useRef} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import GlobalStyles from '../../core/GlobalStyles';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomAppBar from '../../component/CustomAppBar';
import Icon from 'react-native-vector-icons/AntDesign';
import CalendarModal from '../Schedule/component/CalendarModal';
import {styles} from '../Client/ClientStyles';
import moment from 'moment';
import {getProfileSalesHistory} from '../../networkClient/apifunction';
import CustomSearchInput from '../../component/CustomSearchInput';
import { Images, Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const ProfileSalesHistory = props => {
  const [search, setsearch] = useState('');
  const [data, setData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('profileSalesHistoryScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('profileSalesHistoryScreen unmounted');
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
      const filtered = data.filter(item => 
        item.demo.generatedDemoId.toLowerCase().includes(lowercasedSearch) ||
        item.product.name.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredData(filtered);
    }
  };


  const handleToggleDetail = id => {
    setExpandedItemId(prevId => (prevId === id ? null : id));
  };
  useEffect(() => {
    getList();
  }, []);
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

  const getDateList=async(date)=>{
    const parameter = `?fromDate=${encodeURIComponent(date)}&toDate=${encodeURIComponent(date)}`;
    await getProfileSalesHistory(parameter)
      .then(function (response) {
        if (response.data.statusCode === 200) {
          setData(response.data.data);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert('Alert', error.response.data.message);
      });
  }
  const getList = async () => {
    await getProfileSalesHistory('')
      .then(function (response) {
        if (response.data.statusCode === 200) {
          setData(response.data.data);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert('Alert', error.response.data.message);
      });
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
  const Item = ({item, onToggleDetail, showDetail}) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 6,
              alignItems: 'center',
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
                  {item.demo.generatedDemoId}
                </Text>
                <Text
                  style={{
                    color: '#042628',
                    fontSize: 10,
                    fontWeight: '500',
                    backgroundColor: '#ccf1ff',
                    borderRadius: 20,
                    padding: 5,
                  }}>
                  {item.soldDate
                    ? moment(item.soldDate).format('MMM,DD')
                    : '--'}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '500',
                  color: '#042628',
                  marginTop: 5,
                }}>
                {item.product.name}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => onToggleDetail(item.id)}>
            <Icon
              name={showDetail ? 'up-square-o' :'down-square-o' }
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
            <Text style={{color: '#161C24', fontSize: 16, fontWeight: '500'}}>
              {item.qtySold}Pcs
            </Text>
            <Text style={{color: '#161C24', fontSize: 16, fontWeight: '500'}}>
              ₹{item.amount}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const handleDateSelect = date => {
    setModalVisible(false);
    if (date) {
      getDateList(date)
    }
  };
  return (
    <SafeAreaView
      style={{backgroundColor: GlobalStyles.colorSet.app_bg, flex: 1}}>
      <View style={styles.container}>
        <CustomAppBar title="Sales History" showImage={true} navigation={props.navigation}/>
        <View style={{height: 30}} />
        <CustomSearchInput
            placeholder={Languages.Search_items}
            value={search}
            onChangeText={text => {
              setsearch(text);
            }}
           
            ref={searchInputRef} // Pass the ref
          />
      </View>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          justifyContent: 'space-between',
        }}>
        <Text style={styles.header}>{Languages.Sales_History}</Text>

        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
          style={{
            backgroundColor: '#E6F2E633',
            marginRight: 5,
            padding: 5,
            borderRadius: 5,
          }}>
          <View style={{alignItems: 'baseline', flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: RFValue(12),
                fontWeight: '500',
                textAlign: 'left',
                color: GlobalStyles.colorSet.blue,
                marginLeft: 10,
              }}>
              {moment().utcOffset('+05:30').format('MMMM, YYYY')}
            </Text>
            <Image
              source={Images.CalendarBlueNew}
              resizeMode="contain"
              style={{
                width: 15,
                height: 15,
                resizeMode: 'contain',
                marginLeft: 10,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{padding: 10,flex:1}}>
        <FlatList
          keyExtractor={(item, index) => index}
          data={filteredData}
          ListEmptyComponent={EmptyListMessage}
          renderItem={({item, index}) => renderItem(item)}
          contentContainerStyle={{ paddingBottom: 30 }}

        />
      </View>
      <CalendarModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onDateSelect={handleDateSelect}
      />
    </SafeAreaView>
  );
};
export default ProfileSalesHistory;
