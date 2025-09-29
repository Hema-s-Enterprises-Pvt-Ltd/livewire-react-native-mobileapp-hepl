import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
  ScrollView,SafeAreaView 
} from 'react-native';
import {styles} from './AddClientStyles';
import CustomAppBar from '../../component/CustomAppBar';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomButton from '../../component/CustomButton';
import { Images } from '../../common';

const AddClientScreen = props => {
  const data = [
    {
      distance: '100M',
    },
    {
      distance: '100M',
    },
    {
      distance: '100M',
    },
    {
      distance: '100M',
    },
    {
        distance: '100M',
      },
      {
        distance: '100M',
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
  const setDataSelectedIndex = id => {
    data.map((item, index) => {
      if (index == id) {
        data[index].selected = true;
      } else {
        data[index].selected = false;
      }
    });
  };
  const handleClick=()=>{
    props.navigation.navigate("GetClientDetails")
  }
  return (
    <SafeAreaView>
        <ScrollView style={styles.viewContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <CustomAppBar title="Add Client" showImage={true} navigation={props.navigation}/>
        <View style={{height: 20}} />
        <Image
          source={Images.Navigation}
          style={{
            width: '100%',
            height: 240,
            resizeMode: 'contain',
          }}
        />
        <View style={{height: 20}} />
        <Text style={styles.header}>Hi, Shiva</Text>
        <View style={{height: 10}} />
        <Text style={styles.subHeader}>
          Click the button to get the information about nearest client.
        </Text>
        <View style={{height: 40}} />
        <View >
        <FlatList
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={(item, index) => index}
          data={data}
          ListEmptyComponent={EmptyListMessage}
          renderItem={({item, index}) => (
            <Pressable
              style={{
                flex: 1,
                marginTop: 5,
                flexDirection: 'column',
                margin: 10,
                padding: 5,
                backgroundColor: item.selected ? '#228B22' : 'white',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: item.selected ? 'white' : '#DCDCE4',
              }}
              onPress={() => {
                setDataSelectedIndex(index);
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: item.selected ? 'white' : 'black',
                    fontWeight: '350',
                  }}>
                  {item.distance}
                </Text>
              </View>
            </Pressable>
          )}
        />
        </View>
        <View style={{height: 10}} />
        <View >
        <TouchableOpacity
          style={{alignItems: 'center', marginLeft: 10, marginRight: 10}}
          onPress={()=>{props.navigation.navigate("MapScreen")}}>
          <View style={styles.button}>
            <Image
              source={Images.LocationGrey} // Replace with your image path
              style={styles.image}
            />
            <Text style={styles.buttonText}>Fetch Location</Text>
          </View>
        </TouchableOpacity>
        <Text style={[styles.header, {fontWeight: 'semibold', color: 'grey'}]}>
          Or
        </Text>
        <CustomButton text="Add Client" onPress={handleClick} />
        </View>
      </View>
    </ScrollView>
    </SafeAreaView> 
    
  );
};
export default AddClientScreen;
