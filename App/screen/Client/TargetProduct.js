import React, {useState, useRef} from 'react';
import {View, Text, Image, FlatList, Pressable,ImageBackground,TouchableOpacity} from 'react-native';
import GlobalStyles from '../../core/GlobalStyles';
import CustomSearchInput from '../../component/CustomSearchInput';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomAppBar from '../../component/CustomAppBar';
import { styles } from './ClientStyles';
import AddSalesModal from './component/AddSalesModal';
import { Images } from '../../common';

const TargetProductScreen = props => {

  const [search, setsearch] = useState('');
  const [input, setinput] = useState('');

  const searchInputRef = useRef(null);
 
  const data = [
    {
        name: 'White Chocolate Wax',
    },
    {
        name: 'White Chocolate Wax',
    },
  ];
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
        No data available
      </Text>
    );
  };
  const renderItem=(item)=>{
    return(
       <TouchableOpacity >
         <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 6,
              alignItems:'baseline'
            }}>
            <View style={styles.Icons}>
            <Image
              source={Images.Shampoo}
              style={{width: 15, height: 15}}
            />
            </View>
           <View>
           <Text style={{fontWeight:'bold',fontSize:14,color:'black'}}>{item.name}</Text>
          </View>
        </View>
        </View>
      </View>
       </TouchableOpacity>
    )
  }
  return (
    <View style={{backgroundColor: GlobalStyles.colorSet.app_bg, flex: 1}}>
      <View style={styles.container}>
       <CustomAppBar title="Target Products" showImage={true} navigation={props.navigation}/>
        <View style={{height: 30}} />
          <CustomSearchInput
            placeholder="Search"
            value={search}
            onChangeText={text => {
              setsearch(text);
            }}
            ref={searchInputRef} // Pass the ref
          />
      </View>
        <View style={{paddingLeft: 10, paddingBottom: 10}}>
        <Text style={styles.header}>Targeted Products</Text>
        </View>
        <FlatList
          keyExtractor={(item, index) => index}
          data={data}
          ListEmptyComponent={EmptyListMessage}
          renderItem={({item, index}) => (
           renderItem(item)
          )}
        />
    </View>
  );
};
export default TargetProductScreen;
