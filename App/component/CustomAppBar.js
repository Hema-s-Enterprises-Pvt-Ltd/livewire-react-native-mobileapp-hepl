import React, { useState }  from "react";
import { View,StyleSheet,Text,Image, TouchableOpacity} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import GlobalStyles from "../core/GlobalStyles";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDetails,getAllNotification } from "../networkClient/apifunction";
import { Images } from "../common";


const CustomAppBar=(props)=>{ 
  const navigation = useNavigation();
  const [image,setImage]=useState();
  useFocusEffect(
    React.useCallback(() => {
     getUserImage()
    }, []),
  );
 
const getUserImage=async()=>{
  const id = await AsyncStorage.getItem("userId");
  let Id = parseInt(id, 10);
  try {
    const response = await getDetails(Id);
    if (response.data.statusCode === 200) {
     setImage(response.data.data.profileUrl)
    } else {
      // Alert.alert("Alert", response.data.data);
    }
  } catch (error) {
    // Alert.alert("Alert", error.message);
  }
}
 return(
    <View style={{flexDirection: 'row',alignItems:'center',justifyContent:'space-between',}}>
    <View style={{flexDirection: 'row', alignItems: 'center', flex: 0.8}}>
        <TouchableOpacity style={{marginRight:3, padding: 5}} onPress={() => navigation.goBack()}>
        <Icon color="black" name="arrow-back" size={22} style={{alignItems:'center'}}/>
        </TouchableOpacity>
            <Text style={styles.header} numberOfLines={1}>{props.title}</Text>
    </View>
    <TouchableOpacity onPress={() => props.navigation.navigate("Profile")}>
     {
      props.showImage?
      <TouchableOpacity
      onPress={()=>props.navigation.navigate('Profile')}>
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
    </TouchableOpacity>:
    <View></View>
     }
     </TouchableOpacity>
   </View>
 )
}

const styles = StyleSheet.create(
    {   
             header: {
        fontSize: RFPercentage(2.5),
        fontWeight: 'bold',
        textAlign: 'left',
        color: GlobalStyles.colorSet.dark_blue,
        flexWrap:'wrap'
    },
    subHeader: {
        fontSize: RFPercentage(1.5),
        fontWeight: '500',
        textAlign: 'left',
        color: GlobalStyles.colorSet.Grey,
        marginTop:5
    },
    Image:{
        resizeMode: 'stretch',
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 50,
        borderColor: GlobalStyles.colorSet.Grey,
        borderWidth: 2,
      }
    }
)

CustomAppBar.propTypes = {
  title: PropTypes.string,
  showImage: PropTypes.bool,
};
export default CustomAppBar;


<TouchableOpacity onPress={()=>{onClose()
  props.navigation.navigate("ClientDemoHistory")}} >
</TouchableOpacity>