import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screen/Login/LoginScreen';
import RegisterScreen from '../screen/Login/RegisterScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
     
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
     
     <Stack.Screen
       name="RegisterScreen"
       component={RegisterScreen}
     />
    </Stack.Navigator>
  );
};

export default AuthStack;
