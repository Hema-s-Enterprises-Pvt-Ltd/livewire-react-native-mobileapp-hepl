import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import TrainerReportScreen from './Employer/TrainReportScreen';
import {getDetails} from '../../../networkClient/apifunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../../../core/GlobalStyles'
import CustomAppBar from '../../../component/CustomAppBar';
import SalesReportScreen from './Employer/SalesManReportScreen';
import AsmRsmReportScreen from './Employer/AsmRsmReportScreen';
import crashlytics from '@react-native-firebase/crashlytics';

const ReportMainScreen = props => {
  const [roleName, setRoleName] = useState('');
  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('ReportMainScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('ReportMainScreen unmounted');
    };
  }, []);

  useEffect(() => {
    getUserDetail();
  }, []);
  const getUserDetail = async () => {
    const id = await AsyncStorage.getItem('userId');
    var Id = parseInt(id, 10);
    try {
      const response = await getDetails(Id);
      if (response.data.statusCode === 200) {
        setRoleName(response.data.data.role.name);
      } else {
        Alert.alert("Alert", response.data.data);
      }
    } catch (error) {
      Alert.alert("Alert", error.message);
    }
  };
  return (
    <SafeAreaView style={{backgroundColor: GlobalStyles.colorSet.app_bg, flex: 1}}>
        <View style={{height: 10}} />
         <CustomAppBar title=" Reports" showImage={true} navigation={props.navigation}/>
         
      <ScrollView>
        {roleName === 'Trainer' && <TrainerReportScreen />}
        {roleName === 'Salesman' && <SalesReportScreen />}

        {( roleName === 'RSM'||roleName === 'ASM') && <AsmRsmReportScreen />}
    
      </ScrollView>
    </SafeAreaView>
  );
};
export default ReportMainScreen;
