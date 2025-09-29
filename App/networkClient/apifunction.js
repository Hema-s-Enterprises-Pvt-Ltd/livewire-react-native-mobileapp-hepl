import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "react-native-axios";
import {authinstance, instance, multipartInstance} from './api';
import {
  BASE_URL,
  BRAND_LIST,
  CLIENT_LIST,
  CLIENT_LOCATIONS,
  DEMO_CREATE,
  DEMO_SERVICE_TYPE_LIST,
  GET_ALL_BRANDS,
  GET_ALL_PENDING,
  GET_ALL_SERVICE,
  GET_ALL_SERVICE_BY_ID,
  GET_ALL_STATE,
  GET_CITY_BY_STATE,
  PRODUCT_LIST,
  REFRESH,
  RESEND_OTP,
  SALES_MAN_LIST,
  SEND_OTP,
  SERVICE_TYPE_LIST,
  UPCOMING_LIST,
  USER_UPDATE,
  VERIFY_OTP,
  WEEKLY_LIST,
  USER_PROFILE,
  DEMO_HISTORY,
  DECLINED_DEMO,
  OPEN_STOCK,
  GET_AVAILABLE_TRAINER,
  CALENDAR_MARK,
  TRAINER_GETbY_ID,
  GETALL_FOR_MONTH_YEAR,
  SEND_INVITE,
  AUDIT_UPDATE,
  DEMO_GET_BY_ID,
  INVITE_ACCEPT,
  INVITE_DECLINE,
  PROFILE_PIC,
  DEMO_CANCEL,
  INVITE_WITHDRAW,
  INVITE_RESEND,
  WEATHER,
  GET_USER_SETTING,
  SETTING_UPDATE,
  GET_ALL_NOTIFICATION,
  POLL_FEEDBACK,
  GET_DOCUMENTS,
  LOG_OUT,
  INVITE_HISTORY,
  ALL_CLIENTLIST,
  FEEDBACK_DETAIL,
  GETAllASM,
  GETAllRSM,
  RECENT_LIST,
  PINNED_LIST,
  DEMO_CLIENT,
  TOGGLE_PIN,
  CLIENT_DEMO_HISTORY,
  CLIENT_SALES_HISTORY,
  SALES_SAVE,
  SALES_DEMO_ID_LIST,
  NOTES_LIST,
  NOTES_SAVE,
  PROFILE_SALES_HISTORY,
  RSM_SALES,
  ASM_SALES,
  ASM_LIST,
  ASM_SALESMAN_LIST,
  RSM_SALESMAN_LIST,
  RSM_TRAINER_LIST,
  ASM_TRAINER_LIST,
  SEARCH_LIST,
  INVENTORY_SEARCH,
  STOCK_LIST,
  PRODUCT_REQUEST,
  GET_QTY_IN_HAND,
  STOCK_UPDATE,
  SALES_CONVERSION_BRAND,
  SALES_CONVERSION_TRAINER,
  DEMO_ASSIGNMENT_BRAND,
  SALES_REPORT_BRAND,
  GET_ALL_TRAINER,
  TOP_SELLING_PRODUCT,
  TOP_SELLING_BRAND,
  DEMO_COUNT_BRAND,
  WEEKLY_DEMO_REPORT,
  TRAINER_CALENDAR_REPORT,
  DEMO_FEEDBACK_REPORT,
  TOTAL_DEMO_COUNT,
  DEMO_STATUS_REPORT,
  COMPLETED_DROPPED,
  TOP_SALES_REPORT,
  TOP_SALES_RECORD,
  GET_ALL_TRAINER_RSM,
  GET_ALL_ASM,
  IN_ACTIVE_NOTIFICATION,
  REGISTER,
  DEMO_PRODUCT_LIST,
  GET_VERSION,
  SAVE_APP_DOWNLOADS,
  GET_SERVICE_TYPE,
  ADDITIONAL_SERVICES,
  SALES_SERVICE_TYPES,
} from './apiconstant';
import { Constants } from '../common';

export const sendOtp = async (phoneNo, deviceId) => {
  const parameter = `mobileNumber=${encodeURIComponent(
    phoneNo,
  )}&platform=mobile&deviceId=${encodeURIComponent(deviceId)}`;
  let url = `${BASE_URL}${SEND_OTP}${parameter}`;
  const response = await authinstance.get(url);
  return response;
};

export const resendOtp = async (phoneNo, deviceId) => {
  const parameter = `mobileNumber=${encodeURIComponent(
    phoneNo,
  )}&platform=mobile&deviceId=${encodeURIComponent(deviceId)}`;
  let url = `${BASE_URL}${RESEND_OTP}${parameter}`;
  const response = await authinstance.post(url);
  return response;
};

export const verifyOtp = async (phoneNo, Otp, deviceId,token) => {
  const parameter = `mobileNumber=${encodeURIComponent(
    phoneNo,
  )}&otp=${encodeURIComponent(Otp)}&fcmToken=${encodeURIComponent(token)}&deviceId=${encodeURIComponent(
    deviceId,
  )}`;
  let url = `${BASE_URL}${VERIFY_OTP}${parameter}`;
  const response = await authinstance.post(url);
  return response;
};

export const refreshToken = async () => {
  var RefreshToken = await AsyncStorage.getItem('refreshToken');
  var Id = await AsyncStorage.getItem('userId');
  const params = {
    refreshToken: RefreshToken,
    userId: parseInt(Id, 10),
  };
  let url = `${BASE_URL}${REFRESH}`;
  const response = await authinstance.post(url, params);
  return response;
};

export const getUpcomingList = async () => {
  let url = `${BASE_URL}${UPCOMING_LIST}`;
  const response = await instance.get(url);
  return response;
};

export const getPendingList = async () => {
  let url = `${BASE_URL}${GET_ALL_PENDING}`;
  const response = await instance.get(url);
  return response;
};

export const getUpcomingListbyDate = async date => {
  let params = `?date=${date}`;
  let url = `${BASE_URL}${UPCOMING_LIST}${params}`;
  const response = await instance.get(url);
  return response;
};

export const getPendingListbyDate = async date => {
  let params = `?date=${date}`;
  let url = `${BASE_URL}${GET_ALL_PENDING}${params}`;
  const response = await instance.get(url);
  return response;
};
export const getALLServiceList = async (brandIds) => {
  const queryParams = brandIds.map(id => `brandIds=${id}`).join('&');
  let url = `${BASE_URL}${SALES_SERVICE_TYPES}?${queryParams}`;
  const response = await instance.get(url);
  return response;
};
export const getAdditionalServiceList = async () => {
  let url = `${BASE_URL}${ADDITIONAL_SERVICES}`;
  const response = await instance.get(url);
  return response;
};
export const getServiceType = async id => {
  const parameter = `serviceTypeId=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${SERVICE_TYPE_LIST}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getCity = async id => {
  const parameter = `${id.map((n, index) => `stateId=${n}`).join('&')}`;
  let url = `${BASE_URL}${GET_CITY_BY_STATE}${parameter}`;
  const response = await instance.get(url);
  return response;
};
export const getSalesManList = async (stateid, cityid) => {
  const parameter = `${stateid
    .map((n, index) => `stateId=${n}`)
    .join('&')}&${cityid.map((n, index) => `cityId=${n}`).join('&')}`;
  let url = `${BASE_URL}${SALES_MAN_LIST}${parameter}`;
  const response = await instance.get(url);
  return response;
};
export const getState = async id => {
  let url = `${BASE_URL}${GET_ALL_STATE}`;
  const response = await instance.get(url);
  return response;
};

export const getClientList = async () => {
  let url = `${BASE_URL}${CLIENT_LIST}`;
  const response = await instance.get(url);
  return response;
};

export const getClientName = async () => {
  let url = `${BASE_URL}${ALL_CLIENTLIST}`;
  const response = await instance.get(url);
  return response;
};
export const products = async () => {
  let url = `${BASE_URL}${PRODUCT_LIST}`;
  const response = await instance.get(url);
  return response;
};
export const demoProducts = async () => {
  let url = `${BASE_URL}${DEMO_PRODUCT_LIST}`;
  const response = await instance.get(url);
  return response;
};
export const demoGivenServiceProducts = async (serviceIds) => {
  const queryParams = serviceIds.map(id => `serviceIds=${id}`).join('&');
  let url = `${BASE_URL}${DEMO_PRODUCT_LIST}?${queryParams}`;
  const response = await instance.get(url);
  return response;
};
export const userUpdate = async params => {
  let url = `${BASE_URL}${USER_UPDATE}`;
  const response = await instance.post(url, params);
  return response;
};
export const brandList = async () => {
  let url = `${BASE_URL}${BRAND_LIST}`;
  const response = await instance.get(url);
  return response;
};
export const getAllBrand = async () => {
  let url = `${BASE_URL}${GET_ALL_BRANDS}`;
  const response = await instance.get(url);
  return response;
};

export const serviceTypes = async () => {
  let url = `${BASE_URL}${DEMO_SERVICE_TYPE_LIST}`;
  const response = await instance.get(url);
  return response;
};

export const services = async id => {
  const parameter = `serviceTypeId=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${GET_ALL_SERVICE_BY_ID}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const demoCreate = async formData => {
  let url = `${BASE_URL}${DEMO_CREATE}`;
  const response = await instance.post(url, formData);
  return response;
};

export const getClientLocations = async id => {
  const parameter = `clientId=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${CLIENT_LOCATIONS}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const weeklyLists = async start => {
  const parameter = `start=${encodeURIComponent(
    start,
  )}&end=${encodeURIComponent(start)}`;
  let url = `${BASE_URL}${WEEKLY_LIST}${parameter}`;
  const response = await instance.get(url);
  return response;
};
export const weeklyFilteredLists = async (start,params) => {
  const parameter = `start=${encodeURIComponent(
    start,
  )}&end=${encodeURIComponent(start)}&${params}`;
  let url = `${BASE_URL}${WEEKLY_LIST}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getDemoDetails = async params => {
  const parameter = params ? params : null;
  let url = `${BASE_URL}${DEMO_HISTORY}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getDeclinedDetails = async id => {
  const parameter = `id=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${DECLINED_DEMO}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getDetails = async id => {
  const parameter = `id=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${USER_PROFILE}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getOpenStock = async id => {
  const parameter = `id=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${OPEN_STOCK}${parameter}`;
  const response = await instance.get(url);
  return response;
};
export const getAvailTrainers = async (date, serviceId,demoID) => {
  const parameter = `specificDate=${encodeURIComponent(
    date,
  )}&serviceId=${encodeURIComponent(serviceId)}&demoId=${encodeURIComponent(demoID)}`;
  let url = `${BASE_URL}${GET_AVAILABLE_TRAINER}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const trainerGetById = async id => {
  const parameter = `id=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${TRAINER_GETbY_ID}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getmonthByUserId = async (userId, month, year) => {
  const parameter = `userId=${userId}&month=${month}&year=${year}`;
  let url = `${BASE_URL}${GETALL_FOR_MONTH_YEAR}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const onSubmitCalendarRequest = async params => {
  let url = `${BASE_URL}${CALENDAR_MARK}`;
  const response = await instance.post(url, params);
  return response;
};

export const AcceptInvite = async params => {
  let url = `${BASE_URL}${INVITE_ACCEPT}`;
  const response = await instance.post(url, params);
  return response;
};

export const DeclineInvite = async params => {
  let url = `${BASE_URL}${INVITE_DECLINE}`;
  const response = await instance.post(url, params);
  return response;
};

export const sendInvite = async data => {
  let url = `${BASE_URL}${SEND_INVITE}`;
  const response = await instance.post(url, data);
  return response;
};

export const cancelDemo = async data => {
  let url = `${BASE_URL}${DEMO_CANCEL}`;
  const response = await instance.post(url, data);
  return response;
};

export const auditUpdate = async formData => {
  let url = `${BASE_URL}${AUDIT_UPDATE}`;
  const response = await multipartInstance.post(url, formData);
  return response;
};

export const demoGetbyId = async id => {
  const parameter = `id=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${DEMO_GET_BY_ID}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const uploadProfilePic = async formData => {
  let url = `${BASE_URL}${PROFILE_PIC}`;
  const response = await multipartInstance.post(url, formData);
  return response;
};

export const resendInvite = async id => {
  const parameter = `id=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${INVITE_RESEND}${parameter}`;
  const response = await instance.post(url);
  return response;
};

export const withdrawInvite = async id => {
  const parameter = `id=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${INVITE_WITHDRAW}${parameter}`;
  const response = await instance.post(url);
  return response;
};

export const getWeather = async (lat, lng) => {
  const parameter = `latitude=${encodeURIComponent(lat)}&longitude=${lng}`;
  let url = `${BASE_URL}${WEATHER}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getSettingDetails = async id => {
  const parameter = `userId=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${GET_USER_SETTING}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const updateSetting = async data => {
  let url = `${BASE_URL}${SETTING_UPDATE}`;
  const response = await instance.post(url, data);
  return response;
};

export const getAllNotification = async () => {
  let url = `${BASE_URL}${GET_ALL_NOTIFICATION}`;
  const response = await instance.get(url);
  return response;
};
export const clearNotification = async (id) => {
  var idList={
    notificationId: id
  }
  let url = `${BASE_URL}${IN_ACTIVE_NOTIFICATION}`;
  const response = await instance.post(url,idList);
  return response;
};
export const pollFeedback = async id => {
  const parameter = `id=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${POLL_FEEDBACK}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getDocuments = async () => {
  let url = `${BASE_URL}${GET_DOCUMENTS}`;
  const response = await instance.get(url);
  return response;
};

export const logoutScreen = async deviceId => {
  const parameter = `platform=mobile&deviceId=${encodeURIComponent(deviceId)}`;
  let url = `${BASE_URL}${LOG_OUT}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getInviteHistory = async () => {
  let url = `${BASE_URL}${INVITE_HISTORY}`;
  const response = await instance.get(url);
  return response;
};

export const getFeedbackDetails = async id => {
  const parameter = `id=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${FEEDBACK_DETAIL}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getAllRSM = async () => {
  let url = `${BASE_URL}${GETAllRSM}`;
  const response = await instance.get(url);
  return response;
};

export const getAllASM = async () => {
  let url = `${BASE_URL}${GETAllASM}`;
  const response = await instance.get(url);
  return response;
};

export const getRecentList = async () => {
  let url = `${BASE_URL}${RECENT_LIST}`;
  const response = await instance.get(url);
  return response;
};

export const getPinnedList = async () => {
  let url = `${BASE_URL}${PINNED_LIST}`;
  const response = await instance.get(url);
  return response;
};

export const getClientSearchList = async (value) => {
  const parameter = `search=${encodeURIComponent(value)}`;
  let url = `${BASE_URL}${SEARCH_LIST}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getDemoClientDetails = async id => {
  const parameter = `id=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${DEMO_CLIENT}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const TogglePin = async id => {
  const parameter = `clientId=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${TOGGLE_PIN}${parameter}`;
  const response = await instance.post(url);
  return response;
};

export const clientDemoHistory = async (clientId, parameter) => {
  let url = `${BASE_URL}${CLIENT_DEMO_HISTORY}${parameter}${clientId}`;
  const response = await instance.get(url);
  return response;
};

export const getSalesHistory = async parameter => {
  let url = `${BASE_URL}${CLIENT_SALES_HISTORY}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const updateSales = async data => {
  let url = `${BASE_URL}${SALES_SAVE}`;
  const response = await instance.post(url, data);
  return response;
};

export const updateNotes = async data => {
  let url = `${BASE_URL}${NOTES_SAVE}`;
  const response = await instance.post(url, data);
  return response;
};

export const getSalesDemoIdList = async () => {
  let url = `${BASE_URL}${SALES_DEMO_ID_LIST}`;
  const response = await instance.get(url);
  return response;
};

export const getNotesList = async id => {
  const parameter = `clientId=${encodeURIComponent(id)}`;
  let url = `${BASE_URL}${NOTES_LIST}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getProfileSalesHistory = async (parameter) => {
  let url = `${BASE_URL}${PROFILE_SALES_HISTORY}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getSalesSearchReport = async (isRSM, parameter) => {
  let url = ``;
  if (isRSM) {
    url = `${BASE_URL}${RSM_SALES}?${parameter}`;
  } else {
   
    url = `${BASE_URL}${ASM_SALES}?${parameter}`;
  }
  const response = await instance.get(url);
  return response;
};

export const getSalesReport = async (isRSM, isRecent) => {
  let url = ``;
  if (isRSM) {
    if (isRecent) {
      const parameter = `?count=${encodeURIComponent(10)}`;
      url = `${BASE_URL}${RSM_SALES}${parameter}`;
    } else {
      url = `${BASE_URL}${RSM_SALES}`;
    }
  } else {
    if (isRecent) {
      const parameter = `?count=${encodeURIComponent(10)}`;
      url = `${BASE_URL}${ASM_SALES}${parameter}`;
    } else {
      url = `${BASE_URL}${ASM_SALES}`;
    }
  }
  const response = await instance.get(url);
  return response;
};

export const getASMList = async () => {
  let url = `${BASE_URL}${ASM_LIST}`;
  const response = await instance.get(url);
  return response;
};

export const getASMSearchList = async value => {
  const parameter = `?search=${encodeURIComponent(value)}`;
  let url = `${BASE_URL}${ASM_LIST}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getOtherSegmentSearchList = async (isRSM, roleName, value) => {
  const parameter = `?search=${encodeURIComponent(value)}`;
  let url = ``;
  if (roleName === 'Salesman') {
    if (isRSM) {
      url = `${BASE_URL}${RSM_SALESMAN_LIST}${parameter}`;
    } else {
      url = `${BASE_URL}${ASM_SALESMAN_LIST}${parameter}`;
    }
  } else {
    if (isRSM) {
      url = `${BASE_URL}${RSM_TRAINER_LIST}${parameter}`;
    } else {
      url = `${BASE_URL}${ASM_TRAINER_LIST}${parameter}`;
    }
  }
  const response = await instance.get(url);
  return response;
};

export const getOtherSegmentList = async (isRSM, roleName) => {
  let url = ``;
  if (roleName === 'Salesman') {
    if (isRSM) {
      url = `${BASE_URL}${RSM_SALESMAN_LIST}`;
    } else {
      url = `${BASE_URL}${ASM_SALESMAN_LIST}`;
    }
  } else {
    if (isRSM) {
      url = `${BASE_URL}${RSM_TRAINER_LIST}`;
    } else {
      url = `${BASE_URL}${ASM_TRAINER_LIST}`;
    }
  }
  const response = await instance.get(url);
  return response;
};

export const getInventoryList = async () => {
  let url = `${BASE_URL}${INVENTORY_SEARCH}`;
  const response = await instance.get(url);
  return response;
};

export const getInventorySearchList = async value => {
  const parameter = `?productName=${encodeURIComponent(value)}`;
  let url = `${BASE_URL}${INVENTORY_SEARCH}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getStockList = async (id) => {
  let url=``;
  if(id){
    const parameter = `?productId=${encodeURIComponent(id)}`;
    url = `${BASE_URL}${STOCK_LIST}${parameter}`;
  }else{
    url = `${BASE_URL}${STOCK_LIST}`;
  }
  const response = await instance.get(url);
  return response;
};

export const updateProduct = async data => {
  let url = `${BASE_URL}${PRODUCT_REQUEST}`;
  const response = await instance.post(url, data);
  return response;
};

export const updateStock = async data => {
  let url = `${BASE_URL}${STOCK_UPDATE}`;
  const response = await instance.post(url, data);
  return response;
};

export const getQtyInHand = async (id) => {
  const parameter = `?productId=${encodeURIComponent(id)}`;
  url = `${BASE_URL}${GET_QTY_IN_HAND}${parameter}`;
  const response = await instance.get(url);
  return response;
};

export const getSalesConversion = async (fromDate,toDate) => {
  let params = `fromDate=${fromDate}&toDate=${toDate}`;
  let url = `${BASE_URL}${SALES_CONVERSION_BRAND}${params}`;
  const response = await instance.get(url);
  return response;
};

export const getSalesConversionTrainer= async (fromDate,toDate) => {
  let params = `fromDate=${fromDate}&toDate=${toDate}`;
  let url = `${BASE_URL}${SALES_CONVERSION_TRAINER}${params}`;
  const response = await instance.get(url);
  return response;
};

export const getDemoAssignmentBrand= async (fromDate,toDate) => {
  let params = `fromDate=${fromDate}&toDate=${toDate}`;
  let url = `${BASE_URL}${DEMO_ASSIGNMENT_BRAND}${params}`;
  const response = await instance.get(url);
  return response;
};

export const getSalesReportBrand = async (userId,fromDate, toDate) => {
  var id=parseInt(userId,10)
  let params = `userId=${id}&fromDate=${fromDate}&toDate=${toDate}`;
  let url = `${BASE_URL}${SALES_REPORT_BRAND}${params}`;
  const response = await instance.get(url);
  return response;
};

export const getTopSellingProduct= async (fromDate,toDate) => {
  let params = `fromDate=${fromDate}&toDate=${toDate}`;
  let url = `${BASE_URL}${TOP_SELLING_PRODUCT}${params}`;
  const response = await instance.get(url);
  return response;
};

export const getTopSellingBrand= async (fromDate,toDate) => {
  let params = `fromDate=${fromDate}&toDate=${toDate}`;
  let url = `${BASE_URL}${TOP_SELLING_BRAND}${params}`;
  const response = await instance.get(url);
  return response;
};

export const getDemoCountBrand= async (fromDate,toDate) => {
  let params = `fromDate=${fromDate}&toDate=${toDate}`;
  let url = `${BASE_URL}${DEMO_COUNT_BRAND}${params}`;
  const response = await instance.get(url);
  return response;
};

export const getWeeklyDemo= async (fromDate,toDate) => {
  let params = `fromDate=${fromDate}&toDate=${toDate}`;
  let url = `${BASE_URL}${WEEKLY_DEMO_REPORT}${params}`;
  const response = await instance.get(url);
  return response;
};

export const getDemoFeedback= async (fromDate,toDate) => {
  let params = `fromDate=${fromDate}&toDate=${toDate}`;
  let url = `${BASE_URL}${DEMO_FEEDBACK_REPORT}${params}`;
  const response = await instance.get(url);
  return response;
};

export const getTrainerCalendar= async (fromDate,toDate,id) => {
  let params = `fromDate=${fromDate}&toDate=${toDate}&trainerId=${id}`;
  let url = `${BASE_URL}${TRAINER_CALENDAR_REPORT}${params}`;
  const response = await instance.get(url);
  return response;
};

export const getTotalDemoCount= async (fromDate,toDate) => {
  let params = `fromDate=${fromDate}&toDate=${toDate}`;
  let url = `${BASE_URL}${TOTAL_DEMO_COUNT}${params}`;
  const response = await instance.get(url);
  return response;
};

export const getDemoStatusReport= async (fromDate,toDate) => {
  let params = `fromDate=${fromDate}&toDate=${toDate}`;
  let url = `${BASE_URL}${DEMO_STATUS_REPORT}${params}`;
  const response = await instance.get(url);
  return response;
};

export const getDemoFeedBack = async (trainerId,fromDate, toDate) => {
  let params=trainerId===null?`fromDate=${fromDate}&toDate=${toDate}`:`trainerId=${trainerId}&fromDate=${fromDate}&toDate=${toDate}`;
  let url = `${BASE_URL}${DEMO_FEEDBACK_REPORT}${params}`;
  const response = await instance.get(url);
  return response;
};


export const getAllTrainers = async () => {
  let url = `${BASE_URL}${GET_ALL_TRAINER}`;
  const response = await instance.get(url);
  return response;
};

export const getCompletedDropped = async (userId,fromDate, toDate) => {
  let params = `userId=${userId}&fromDate=${fromDate}&toDate=${toDate}`;
  let url = `${BASE_URL}${COMPLETED_DROPPED}${params}`;
  const response = await instance.get(url);
  return response;s
};

export const getTopSalesRecord= async (fromDate,toDate) => {
  let params = `fromDate=${fromDate}&toDate=${toDate}`;
  let url = `${BASE_URL}${TOP_SALES_RECORD}${params}`;
  const response = await instance.get(url);
  return response;
};

export const getAddressFromLatLng = async (latitude, longitude) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        latlng: `${latitude},${longitude}`,
        key: Constants.GoogleMapAPI,
      },
    });

    if (response.data.status === 'OK') {
      // Extract address from response
      const address = response.data.results[0].formatted_address;
      return address;
    } else {
      throw new Error('Geocoding API error: ' + response.data.status);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getAllTrainerRSM = async () => {
  let url = `${BASE_URL}${GET_ALL_TRAINER_RSM}`;
  const response = await instance.get(url);
  return response;
};

export const getAllAsm= async () => {
  let url = `${BASE_URL}${GET_ALL_ASM}`;
  const response = await instance.get(url);
  return response;
};

export const getRegister = async params => {
  let url = `${BASE_URL}${REGISTER}`;
  const response = await instance.post(url, params);
  return response;
};

export const getAllTrainerListforRSM = async ()=>{
  let url = `${BASE_URL}${RSM_TRAINER_LIST}`;
  const response = await instance.get(url);
  return response;
}

export const getAllsalemanListforRSM = async ()=>{
  let url = `${BASE_URL}${RSM_SALESMAN_LIST}`;
  const response = await instance.get(url);
  return response;
}


export const getAppVersion = async ()=>{
  let params = `appName=LiveWire`;
  let url = `${GET_VERSION}${params}`;
  const response = await authinstance.get(url);
  return response;
}

export const saveAppDownloads = async (data)=>{
  let url = `${SAVE_APP_DOWNLOADS}`;
  const response = await authinstance.post(url,data);
  return response;
}

export const getServiceTypeCall = async (brandId) => {
  const url = `${BASE_URL}${GET_SERVICE_TYPE}/${brandId}`;
  const response = await instance.get(url);
  return response;
};