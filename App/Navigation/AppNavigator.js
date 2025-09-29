import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FirstLoginScreen from './FirstLoginStack';
import MainStack from './MainStack';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

const AppNavigator = ({ loginState }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {loginState.userToken != null ? (
        !loginState.enable ? (
          <Stack.Screen
            name="FirstLogin"
            component={FirstLoginScreen}
          />
        ) : (
          <Stack.Screen
            name="MainStack"
            component={MainStack}
          />
        )
      ) : (
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
