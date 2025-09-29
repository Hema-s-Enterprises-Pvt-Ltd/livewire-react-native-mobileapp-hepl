// FirstLoginStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SalesBottomTab from './SalesBottomTab';
import AddClientScreen from '../screen/AddClient/AddClientScreen';
import GetClientDetails from '../screen/AddClient/GetClientDetails';
import DemoDetailScreen from '../screen/DemoDetail/DemoDetailScreen';
import DemoCompletedScreen from '../screen/DemoDetail/DemoCompleted';
import InventoryDetailScreen from '../screen/Inventory/InventoryDetail';
import StockHistoryScreen from '../screen/Inventory/StockHistory';
import OpenStockScreen from '../screen/Inventory/OpenStock';
import ActionScreen from '../screen/ActionScreen/ActionScreen';
import MapViewScreen from '../screen/AddClient/MapScreen';
import DemoHistoryScreen from '../screen/Profile/DemoHistory';
import PDFViewer from '../utils/pdfViewer';
import TrainerSettingScreen from '../screen/Profile/TrainerSettings';
import SalesManSettingScreen from '../screen/Profile/SalesManSetting';
import ScheduleDemoScreen from '../screen/Schedule/ScheduleDemo';
import TrainerListScreen from '../screen/Schedule/TrainerList';
import SetCalendarScreen from '../screen/Schedule/SetCalendar';
import ClientDemoHistoryScreen from '../screen/Client/ClientDemoHistory';
import SalesHistory from '../screen/Client/SalesHistory';
import TargetProductScreen from '../screen/Client/TargetProduct';
import EditClientDetails from '../screen/Client/EditClient';
import SplashScreen from '../screen/Splash/SplashScreen';
import NotesScreen from '../screen/Client/NotesScreen';
import EditPreviewScreen from '../screen/GetStartScreen/EditPreview';
import EditBasicDetails from '../screen/BasicDetails/EditBasicDetails';
import DemoMapViewScreen from '../screen/DemoDetail/DemoMapView';
import NotificationScreen from '../screen/Notification/Notification';
import InviteHistoryScreen from '../screen/Profile/InviteHistory';
import ClientDetailScreen from '../screen/Client/ClientDetail';
import ProfileSalesHistory from '../screen/Profile/ProfileSalesHistory';
import FeedbackDetailScreen from '../screen/DemoDetail/FeedbackDetail';
import TeamsScreen from '../screen/Teams/TeamsScreen';
import ReportMainScreen from '../screen/Profile/Report/ReportMainScreen';
const Stack = createNativeStackNavigator();

const FirstLoginStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="EditBasicDetails"
        component={EditBasicDetails}
        initialParams={{ isFirstLogin: true }} 
      />
      <Stack.Screen
        name="SalesBottomTabs"
        component={SalesBottomTab}
      />
      <Stack.Screen
        name="AddClient"
        component={AddClientScreen}
      />
      <Stack.Screen
        name="GetClientDetails"
        component={GetClientDetails}
      />
      <Stack.Screen
        name="DemoDetailScreen"
        component={DemoDetailScreen}
      />
      <Stack.Screen
        name="DemoCompletedScreen"
        component={DemoCompletedScreen}
      />
      <Stack.Screen
        name="InventoryDetail"
        component={InventoryDetailScreen}
      />
      <Stack.Screen
        name="StockHistory"
        component={StockHistoryScreen}
      />
      <Stack.Screen
        name="OpenStock"
        component={OpenStockScreen}
      />
      <Stack.Screen
        name="ActionScreen"
        component={ActionScreen}
      />
      <Stack.Screen
        name="MapScreen"
        component={MapViewScreen}
      />
      <Stack.Screen
        name="DemoHistory"
        component={DemoHistoryScreen}
      />
      <Stack.Screen
        name="PDFViewer"
        component={PDFViewer}
      />
      <Stack.Screen
        name="TrainerSettingScreen"
        component={TrainerSettingScreen}
      />
      <Stack.Screen
        name="SalesManSettingScreen"
        component={SalesManSettingScreen}
      />
      <Stack.Screen
        name="ScheduleDemo"
        component={ScheduleDemoScreen}
      />
      <Stack.Screen
        name="TrainerList"
        component={TrainerListScreen}
      />
      <Stack.Screen
        name="SetCalendar"
        component={SetCalendarScreen}
      />
      <Stack.Screen
        name="ClientDemoHistory"
        component={ClientDemoHistoryScreen}
      />
      <Stack.Screen
        name="SalesHistory"
        component={SalesHistory}
      />
      <Stack.Screen
        name="TargetProduct"
        component={TargetProductScreen}
      />
      <Stack.Screen
        name="EditClient"
        component={EditClientDetails}
      />
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
      />
      <Stack.Screen
        name="NotesScreen"
        component={NotesScreen}
      />
      <Stack.Screen
        name="EditPreviewScreen"
        component={EditPreviewScreen}
      />
      <Stack.Screen
        name="DemoMapViewScreen"
        component={DemoMapViewScreen}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
      />
      <Stack.Screen
        name="InviteHistoryScreen"
        component={InviteHistoryScreen}
      />
      <Stack.Screen
        name="ClientDetailScreen"
        component={ClientDetailScreen}
      />
      <Stack.Screen
        name="ProfileSalesHistory"
        component={ProfileSalesHistory}
      />
      <Stack.Screen
        name="FeedbackDetailScreen"
        component={FeedbackDetailScreen}
      />
      <Stack.Screen
        name="TeamsScreen"
        component={TeamsScreen}
      />
      <Stack.Screen
        name="ReportMainScreen"
        component={ReportMainScreen}
      />
    </Stack.Navigator>
  );
};

export default FirstLoginStack;
