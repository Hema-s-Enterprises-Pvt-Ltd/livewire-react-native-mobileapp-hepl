import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet } from 'react-native';
import GlobalStyles from '../core/GlobalStyles';
import HomeScreen from '../screen/Home/HomeScreen';
import ScheduleScreen from '../screen/Schedule/ScheduleScreen';
import ClientListScreen from '../screen/Client/ClientListScreen';
import ProfileScreen from '../screen/Profile/ProfileScreen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import InventoryScreen from '../screen/Inventory/InventoryScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SalesReport from '../screen/SalesReport/SalesReport';
import {parseJwt} from '../utils/JWTDecode'
import { Images } from '../common';

const Tab = createBottomTabNavigator();

const SalesBottomTab = (props) => {
  const [roleName, setRoleName] = useState('');

  useEffect(() => {
    getRoleName();
  }, []);

  const getRoleName = async () => {
    let token = await AsyncStorage.getItem("accessToken");
    let decode = parseJwt(token);
    setRoleName(decode.payload.roleName);
  };

  return (
    <Tab.Navigator
      initialRouteName={HomeScreen}
      screenOptions={({route})=>({
        tabBarIcon: ({ focused, color, size }) => {
          let img;
          if (route.name === 'Home') {
            img =Images.HomeNew
          } else if (route.name === 'Schedule') {
            img = Images.CalendarNew
          } else if (route.name === 'Client') {
            img = Images.PeopleNew
          } else if (route.name === 'Inventory') {
            img = Images.BoxNew
          } else if (route.name === 'SalesReport') {
            img = Images.Note
          } else if (route.name === 'Profile') {
            img = Images.MenuIconPersonNew
          }

          return(
            <View style={styles.tabBarIconView}>
              <Image 
                source={img}
                style={[styles.tabBarIcon, {tintColor: focused ? GlobalStyles.colorSet.orange : GlobalStyles.colorSet.Grey}]}/>
            </View>
          )
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBarStyle,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          
        }}
      />
      {roleName === "Salesman" && (
        <Tab.Screen
          name="Client"
          component={ClientListScreen}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            
          }}
        />
      )}
      {roleName === "Trainer" && (
        <Tab.Screen
          name="Inventory"
          component={InventoryScreen}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            
          }}
        />
      )}
      {["ASM", "RSM"].includes(roleName) && (
        <Tab.Screen
          name="SalesReport"
          component={SalesReport}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            
          }}
        />
      )}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
    height: 60, // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5, // Adjust as needed for iOS
  },
  tabBarIconView: {
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100%'
  },
  tabBarIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  }
})

export default SalesBottomTab;
