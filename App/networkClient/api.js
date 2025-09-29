import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import axios from "react-native-axios";
import { BASE_URL } from '../networkClient/apiconstant';
import { refreshToken } from './apifunction';
import React from 'react';
import { AuthContext } from '../core/AuthContext';
// import { useLoading } from '../utils/LoadingProvider';
// A utility to store context actions like signOut


let signOut;

export const setAuthContext = (context) => {
  signOut = context.signOut;
};

export const handleAuthError = async (error,axiosInstance) => {

  if (error.response && error.response.data.message === 'Access token may be missing or expired') {
    try {
      const response = await refreshToken();
      if (response.data.statusCode === 200) {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
        await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
        error.response.config.headers.Authorization = `${response.data.data.accessToken}`;
        return axiosInstance(error.response.config);
      } else {
        if (signOut) signOut();
        Alert.alert('Alert', 'Unauthorized!!');
      }
    } catch (err) {
      if (signOut) signOut();
    }
  } else {
    if(error.message!=="Request failed with status code 504"){
        Alert.alert('Alert', error.response.data.message || 'An error occurred');
    }
   
  }
  return Promise.reject(error);
};

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

const authinstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});
const multipartInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'multipart/form-data',
    },

});
authinstance.interceptors.response.use(
    response => {
        // useLoading().stopLoading();
        return response;
    },
    async error => {
        // useLoading().stopLoading();
        //const originalConfig = error.config;
        if (error) {       
          Alert.alert('Alert', error.response.data.message || 'An error occurred');
        }

        return Promise.reject(error);
    }
);
instance.interceptors.request.use(
  async config => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
          config.headers.Authorization = `${token}`;
      }
      // useLoading().startLoading();
      return config;
  },
  error => {
      // useLoading().stopLoading();
      return Promise.reject(error);
  },
);

instance.interceptors.response.use(
    response => {
        // useLoading().stopLoading();
        return response;
    },
    async error => {
        return handleAuthError(error,instance);
      }
    
);

multipartInstance.interceptors.request.use(
  async config => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
          config.headers.Authorization = `${token}`;
      }
      return config;
  },
  error =>
      Promise.reject(error),
);


multipartInstance.interceptors.response.use(
   
    response => {
        // useLoading().stopLoading();
        return response;
    },
    async error => {
        return handleAuthError(error,multipartInstance);
      }
);


export { instance, authinstance,multipartInstance };