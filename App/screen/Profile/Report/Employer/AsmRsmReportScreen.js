import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, Alert} from 'react-native';
import {getSalesConversion,getDemoFeedBack,getAllsalemanListforRSM,getSalesReportBrand, getSalesConversionTrainer, getTopSellingBrand, getTopSellingProduct, getCompletedDropped, getTopSalesRecord, getAllASM, getAllAsm, getAllTrainerRSM, getOtherSegmentList} from '../../../../networkClient/apifunction';
import moment from 'moment';
import {Card} from 'react-native-paper';
import DatePickerInput from '../../component/SelectDate';
import { useForm } from 'react-hook-form';
import CustomBarChart from '../component/CustomBarChart';
import CustomStackbarChart from '../component/CustomStackBarChart';
import PieChart from '../../component/PieChart';
import ReportDropDown from '../../component/DropDown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LabelList from '../../component/LabelList';
import crashlytics from '@react-native-firebase/crashlytics';

const  AsmRsmReportScreen = props => {
    const {ToDay} = new Date();
    const [salesConversionData, setSalesConversionData] = useState([]);
    const [trainersList,setTrainsList] = useState([]);
    const[demoFeedBack,setDemoFeedback] = useState([]);
    const [salesReportBrand, setSalesReportBrand] = useState([]);
    const [selectedSlice, setSelectedSlice] = useState(null);
    const [totalSaleReport,settotalSaleReport] = useState(0);
    const [salesmanList,setSalesmanList] = useState([]);
    const [salesConversionTrainer, setSalesConversionTrainer] = useState([]);
    const [completedDropped, setCompletedDropped] = useState([]);
    const[complete,setComplete] = useState(0);
    const [topSellingProduct, setTopSellingProduct] = useState([]);
    const [topSellingBrand, setTopSellingBrand] = useState([]);
    const [topSalesRecord, setTopSalesRecord] = useState([]);
    const [asmList,setAsmList] = useState([]);
    const [salesReportFlatlist,setSaleReportFlatList] = useState([]);
    const [completedFlatList,SetCompletedFlatlist] = useState([]);
    const [toSaleMaxDate,settoSaleMaxDate] = useState(moment(ToDay).subtract(1, 'months').format('YYYY-MM-DD'));
    const [tosalemanWiseMaxDate,setSalesmanwiseMaxDate] = useState(moment(ToDay).subtract(1, 'months').format('YYYY-MM-DD'));
    const [toSalesReportMaxDate,settoSaleReportMaxDate] = useState(moment(ToDay).subtract(1, 'months').format('YYYY-MM-DD'));
    const [tofeedBackMaxDate,settofeedBackMaxDate] = useState(moment(ToDay).subtract(1, 'months').format('YYYY-MM-DD'));
    const [toCompletedMaxDate,settoCompletedMaxDate] = useState(moment(ToDay).subtract(1, 'months').format('YYYY-MM-DD'));
    const [toSellingMaxDate,setSellingMaxDate] = useState(moment(ToDay).subtract(1, 'months').format('YYYY-MM-DD'));
    const [toTopBrandMaxDate,SetToBrandMaxDate] = useState(moment(ToDay).subtract(1, 'months').format('YYYY-MM-DD'));
    const [tosaleRecordMaxDate,setTosaleRecordMaxDate] = useState(moment(ToDay).subtract(1, 'months').format('YYYY-MM-DD'));
    const [salesConversionFlatList,setSalesConversionFatlist] = useState([]);
    const [salesTrainerFlatList,setSalesTrainerFatlist] = useState([]);
    const [roleName, setRoleName] = useState('');


    const {
      handleSubmit: handleSubmitForm,
      register,
      formState: {errors, isValid},
      control,
      setValue,
      getValues,
      reset,
    } = useForm({
      mode: 'onChange', // Enable validation on change
      defaultValues: {
        fromSales: '',
        toSales: '',
        feedbackReportName:'',
        fromDemoReport:'',
        toDemoReport:'',
        salesReport:'',
        fromSalesReport:'',
        toSalesReport:'',
        fromTrainerWise:'',
        toTrainerWise:'',
        fromcompleteDate:'',
        toCompleteDate:'',
        fromTopSelling:'',
        toTopSelling:'',
        fromTopBrand:'',
        toTopBrand:'',
        fromTopSale:'',
        toTopSale:'',
        ASMReport:''
      },
    });
    useEffect(() => {
      // Log that the component has mounted
      crashlytics().log('AsmRsmReportScreen mounted');
      return () => {
        // Log that the component is unmounting
        crashlytics().log('AsmRsmReportScreen unmounted');
      };
    }, []);
    useEffect(()=>{
          setValue('fromSales',moment(ToDay).subtract(1, 'months').format('DD MMM YYYY'));
          setValue('toSales',moment(ToDay).format('DD MMM YYYY'));
          setValue('fromDemoReport',moment(ToDay).subtract(1, 'months').format('DD MMM YYYY'));
          setValue('toDemoReport',moment(ToDay).format('DD MMM YYYY'));
          setValue('fromSalesReport',moment(ToDay).subtract(1, 'months').format('DD MMM YYYY'));
          setValue('toSalesReport',moment(ToDay).format('DD MMM YYYY'));
          setValue('fromTrainerWise',moment(ToDay).subtract(1, 'months').format('DD MMM YYYY'));
          setValue('toTrainerWise',moment(ToDay).format('DD MMM YYYY'));
          setValue('fromcompleteDate',moment(ToDay).subtract(1, 'months').format('DD MMM YYYY'));
          setValue('toCompleteDate',moment(ToDay).format('DD MMM YYYY'));
          setValue('fromTopSelling',moment(ToDay).subtract(1, 'months').format('DD MMM YYYY'));
          setValue('toTopSelling',moment(ToDay).format('DD MMM YYYY'));
          setValue('fromTopBrand',moment(ToDay).subtract(1, 'months').format('DD MMM YYYY'));
          setValue('toTopBrand',moment(ToDay).format('DD MMM YYYY'));
          setValue('fromTopSale',moment(ToDay).subtract(1, 'months').format('DD MMM YYYY'));
          setValue('toTopSale',moment(ToDay).format('DD MMM YYYY'));
   
    },[])

    useEffect(() => {
        getRole();
        getAllSalesManList();
        getSalesData();
        DemoFeedbackReport();
        getSalesReport();
        SalesTrainerWise();
        TopSellingProducts();
        TopSellingBrand();
        TopSaleRecord();
        getCompleteDrop();
    }, []);

    const getRole = async () => {
      const name = await AsyncStorage.getItem('roleName');
      if(name==='ASM'){
        getASMTrainerList();  
        getASMSalesManList();  
      }else{
        getAllDetailtrainer();
        getAllASMList();
      }
      setRoleName(name);
    };
    const getFlatList = (data)=>{
      const mapppedData = data.map((item, index) => {
        return {
          value:item.value,
          name: item.label, 
          color: item.svg.fill,
          backgroundColor: item.svg.fill,
          borderColor: item.svg.fill,
          borderWidth: 2,
        };
      });
      return mapppedData;
    }

      const getFlatListed = (data) => {

        const mappedData = data.map((item, index) => {
          return {
            
            name: item.name, 
            color: item.color, 
            backgroundColor: item.backgroundColor,
            borderColor: item.borderColor, 
            borderWidth: 2, 
          };
          
        });
        return mappedData;
        
      };

const getASMTrainerList=async()=>{
    isRSM=false
    role="Trainer"
  await getOtherSegmentList(isRSM,role)
    .then(function (response) {
      if (response.data.statusCode === 200){
        const apiData = response.data.data;
        setTrainsList(apiData)
    }else {
        Alert.alert('Alert', response.data.statusMessage);
    }
    })
    .catch(function (error) {
      Alert.alert(Languages.Alert, error.response.data.message);
    });
}
const getASMSalesManList=async()=>{
  isRSM=false
  role="Salesman"
await getOtherSegmentList(isRSM,role)
  .then(function (response) {
    if (response.data.statusCode === 200){
      const apiData = response.data.data;
      setAsmList(apiData)
  }else {
      Alert.alert('Alert', response.data.statusMessage);
  }
  })
  .catch(function (error) {
    Alert.alert(Languages.Alert, error.response.data.message);
  });
}
    const getAllDetailtrainer=()=>{
      getAllTrainerRSM().then(response=>{
          if (response.data.statusCode === 200){
              const apiData = response.data.data;
              setTrainsList(apiData)
          }else {
              Alert.alert('Alert', response.data.statusMessage);
          }
      }).catch(error => {
          Alert.alert('Alert', error.response?.data?.message);
      });
    }
   const getAllSalesManList=()=>{
      getAllsalemanListforRSM().then(response=>{
          if (response.data.statusCode === 200){
              const apiData = response.data.data;
              setSalesmanList(apiData)
          }else {
              Alert.alert('Alert', response.data.statusMessage);
          }
      }).catch(error => {
          Alert.alert('Alert', error.response?.data?.message);
      });
    }
       const getSalesData = () => {
        const getDate = getValues();
      if(getDate.fromSales&& getDate.toSales){
        getsaleConvApi(getDate.fromSales,getDate.toSales);
      }
      };

      const getsaleConvApi =(fromDate,toDate) =>{
        const FROM_DATE=checkFormat(fromDate)
        const TO_DATE=checkFormat(toDate)
        getSalesConversion(FROM_DATE, TO_DATE)
        .then(response => {
          if (response.data.statusCode === 200) {
            const apiData = response.data.data;
            const salesConversionData = apiData.map(item => ({
              stacks: [
                {value: item.values[0], color: '#FF6534'},
                {value: item.values[1], color: '#DFE3E8', marginBottom: -3},
              ],
              label: item.name,
            }));
            setSalesConversionData(salesConversionData);
            const data=[{
              name:'No of Demos',
              color:'#DFE3E8',
              backgroundColor:'#DFE3E8',
              borderColor:'#DFE3E8',
              borderWidth:2
              },
              {
              name:'Conversion',
              color:'#FF6534',
              backgroundColor:'#FF6534',
              borderColor:'#FF6534',
              borderWidth:2
              }]
            const getFlatListData = getFlatListed(data);
            setSalesConversionFatlist(getFlatListData);
          } else {
            Alert.alert('Alert', response.data.statusMessage);
          }
        })
        .catch(error => {
          Alert.alert('Alert', error.response?.data?.message);
        });
      }

      const handlefromSalesChange = date=>{
        setValue('toSales','');
        settoSaleMaxDate(date);
      }
      const handletoSalesChange = date=>{
        const getDate = getValues();
        if(getDate.fromSales && getDate.toSales){
          getsaleConvApi(getDate.fromSales,getDate.toSales);
        }
      }

    
      const getSalesReport = async () => {
        const getData = getValues();
        if(getData.fromSalesReport && getData.toSalesReport){
            saleReportApiCall(getData.salesReport ? getData.salesReport : 0, getData.fromSalesReport ,getData.toSalesReport)
        }
      };
     const saleReportApiCall= (salesmanId,fromDate,toDate)=>{
        const defaultColors = ['#DD60F1', '#67D9D2', '#F4CE51', '#00AEEF']; // Default colors
        // Optionally, if you need more colors than provided, you can add more or dynamically generate them.
       const FROM_DATE= checkFormat(fromDate)
       const TO_DATE= checkFormat(toDate)
        getSalesReportBrand(salesmanId, FROM_DATE, TO_DATE)
          .then(response => {
            if (response.data.statusCode === 200) {
              const apiData = response.data.data;
              const salesReportByBrand = apiData.map((item, index) => ({
                value: item.value,
                svg: {fill: defaultColors[index % defaultColors.length]}, // Use API color or default
                arc: {cornerRadius: '15%'},
                key: String(index + 1), // Unique key for each pie slice
                label: item.name,
              }));
              setSalesReportBrand(salesReportByBrand);
              const gettotalSales = apiData.reduce((accumulator, item) => accumulator + item.value, 0);
              settotalSaleReport(gettotalSales)
              const getFlatListData = getFlatList(salesReportByBrand);
              setSaleReportFlatList(getFlatListData)
            } else {
              Alert.alert('Alert', response.data.statusMessage);
            }
          })
          .catch(error => {
            Alert.alert('Alert', error.response?.data?.message);
          });
      }

      const dropDownHandlingSalesman = data=>{
        const getData = getValues();
        if(getData.fromSalesReport && getData.toSalesReport){
            saleReportApiCall(data ? data.id : 0, getData.fromSalesReport ,getData.toSalesReport)
        }
      }
const checkFormat = dateString => {
  const formatToCheck = 'DD MMM YYYY';
  if (dateString === moment(dateString, formatToCheck).format(formatToCheck)) {
    const string = moment(dateString, 'DD MMM YYYY').format('YYYY-MM-DD');
    return string;
  } else {
    return dateString;
  }
};
const handlefromsalesReportChange = date => {
  setValue('toSalesReport', '');
  settoSaleReportMaxDate(date);
};
      const handletoSalesReportChange = date =>{
        const getData = getValues();
        if(getData.fromSalesReport && getData.toSalesReport){
            saleReportApiCall(getData.salesReport ? getData.salesReport : 0, getData.fromSalesReport ,getData.toSalesReport)
        }
      }
      const DemoFeedbackReport = async () => {
        const getdata = getValues();
        if(getdata.fromDemoReport&& getdata.toDemoReport){
            demoFeedBackApi(getdata.feedbackReportName ? getdata.feedbackReportName : null,getdata.fromDemoReport ,getdata.toDemoReport)
        }
      };

      const demoFeedBackApi=(selectedTrainerId,fromDate,toDate)=>{
        const FROM_DATE=checkFormat(fromDate)
        const TO_DATE=checkFormat(toDate)
        getDemoFeedBack(selectedTrainerId, FROM_DATE,TO_DATE)
        .then(response => {
          if (response.data.statusCode === 200) {
            const apiData = response.data.data;
            const demoValues = apiData.map(item => ({
              value: item.value,
              frontColor: '#AEDFAE', // Or any other color logic you want
              label: item.name,
            }));
            setDemoFeedback(demoValues);
          } else {
            Alert.alert('Alert', response.data.statusMessage);
          }
        })
        .catch(error => {
          Alert.alert('Alert', error.response?.data?.message);
        });
      }    

      const  dropDownHandlingDemo = data =>{
        const getData = getValues();
        if(getData.fromDemoReport && getData.toDemoReport){
          demoFeedBackApi(data ? data.trainerId : 0, getData.fromDemoReport ,getData.toDemoReport)
        }
      }

      const handlefromdemoChange = date=>{
        // const getdata = getValues();
        setValue('toDemoReport','');
        settofeedBackMaxDate(date);
      }
     const  handletodemoChange = date =>{
        const getdata = getValues();
        if(getdata.fromDemoReport && getdata.toDemoReport){
          demoFeedBackApi(getdata.feedbackReportName ? getdata.feedbackReportName : null,getdata.fromDemoReport ,getdata.toDemoReport)
        }
      
     }


      const SalesTrainerWise = () => {
        if (getValues().fromTrainerWise && getValues().toTrainerWise) {
          SalesTrainerWiseApi(getValues().fromTrainerWise,getValues().toTrainerWise)
        }
      };
    
      const  SalesTrainerWiseApi =(fromDate,toDate)=>{
        const FROM_DATE=checkFormat(fromDate)
        const TO_DATE=checkFormat(toDate)
        getSalesConversionTrainer(FROM_DATE,TO_DATE)
        .then(response => {
          if (response.data.statusCode === 200) {
            const apiData = response.data.data;
            const salesConversionByUser = apiData.map(item => ({
              stacks: [
                {value: item.values[0], color: '#00AEEF'},
                {value: item.values[1], color: '#00AEEF1A', marginBottom: -3},
              ],
              label: item.name,
            }));
            setSalesConversionTrainer(salesConversionByUser);
            const data=[{
              name:'No of Demos',
              color:'#00AEEF1A',
              backgroundColor:'#00AEEF1A',
              borderColor:'#00AEEF1A',
              borderWidth:2
              },
              {
              name:'Conversion',
              color:'#00AEEF',
              backgroundColor:'#00AEEF',
              borderColor:'#00AEEF',
              borderWidth:2
              }]
            const getFlatListData = getFlatListed(data);
            setSalesTrainerFatlist(getFlatListData);
          } else {
            Alert.alert('Alert', response.data.statusMessage);
          }
        })
        .catch(error => {
          Alert.alert('Alert', error.response?.data?.message);
        });
    
    };
    const handleFromSaleTrainerDateChange = date => {
      setValue('toTrainerWise','');
      setSalesmanwiseMaxDate(date);
    };
    const handletoSaleTrainerDateChange = date => {
      if(getValues().fromTrainerWise && getValues().toTrainerWise){
        SalesTrainerWiseApi(getValues().fromTrainerWise,getValues().toTrainerWise);
      }
    };

    const getAllASMList=()=>{
      getAllAsm().then(response=>{
          if (response.data.statusCode === 200){
              const apiData = response.data.data;
              setAsmList(apiData)
          }else {
              Alert.alert('Alert', response.data.statusMessage);
          }
      }).catch(error => {
          Alert.alert('Alert', error.response?.data?.message);
      });
    }

    const getCompleteDrop = async () => {
      const getData = getValues();
      if(getData.fromcompleteDate && getData.toCompleteDate){
        comletedDropApiCall(getData.ASMReport ? getData.ASMReport : 0,getData.fromcompleteDate,getData.toCompleteDate)
      }
    };
   const comletedDropApiCall= (id,fromDate,toDate)=>{
    const defaultColors = ['#81BE83', '#1B59F8'];
const FROM_DATE=checkFormat(fromDate)
const TO_DATE=checkFormat(toDate)
      getCompletedDropped(id, FROM_DATE, TO_DATE)
        .then(response => {
          if (response.data.statusCode === 200) {
            const apiData = response.data.data;
            const getComplete = apiData.map((item, index) => ({
              value: item.value,
              svg: {fill: defaultColors[index % defaultColors.length]}, // Use API color or default
              arc: {cornerRadius: '15%'},
              key: String(index + 1), // Unique key for each pie slice
              label: item.name,
            }));
            setCompletedDropped(getComplete);
            const gettotalSales = apiData.reduce((accumulator, item) => accumulator + item.value, 0);
            setComplete(gettotalSales)
            const getFlatListData = getFlatList(getComplete);
            SetCompletedFlatlist(getFlatListData);

          } else {
            Alert.alert('Alert', response.data.statusMessage);
          }
        })
        .catch(error => {
          Alert.alert('Alert', error.response?.data?.message);
        });
    }

    const dropDownHandlingASM = data=>{
      const getData = getValues();
      if(getData.fromcompleteDate && getData.toCompleteDate){
          comletedDropApiCall(data ? data.id : 0, getData.fromcompleteDate ,getData.toCompleteDate)
      }
    }

    const handleCompleteFromDateChange = date =>{
      setValue('toCompleteDate','');
      settoCompletedMaxDate(date);
    }
    const handleCompletetoDateChange = date =>{
      const getData = getValues();
      if(getData.fromcompleteDate && getData.toCompleteDate){
          comletedDropApiCall(getData.ASMReport ? getData.ASMReport : 0, getData.fromcompleteDate ,getData.toCompleteDate)
      }
    }

    const TopSellingProducts = () => {
    const FROM_DATE=checkFormat(getValues().fromTopSelling)
    const TO_DATE=checkFormat(getValues().toTopSelling)
      getTopSellingProduct(FROM_DATE,TO_DATE)
        .then(response => {
          if (response.data.statusCode === 200) {
            const apiData = response.data.data;
            const topSellingProducts = apiData.map(item => ({
              value: item.value,
              frontColor: '#AEDFAE', // Or any other color logic you want
              label: item.name,
            }));
            setTopSellingProduct(topSellingProducts);
          } else {
            Alert.alert('Alert', response.data.statusMessage);
          }
        })
        .catch(error => {
          Alert.alert('Alert', error.response?.data?.message);
        });
    };
  
    const handleTopSellingFromDateChange = date =>{
      setValue('toTopSelling','');
      setSellingMaxDate(date);
      // reset({tofeedbackDate:''})
    }
    const handleTopSellingtoDateChange = date=>{
      TopSellingProducts();
    }
   
    const TopSaleRecord= () => {
    const FROM_DATE=checkFormat(getValues().fromTopSale)
    const TO_DATE=checkFormat(getValues().toTopSale)
      getTopSalesRecord(FROM_DATE,TO_DATE)
      .then(response => {
        if (response.data.statusCode === 200) {
          const apiData = response.data.data;
          const topSales = apiData.map(item => ({
            value: item.value,
            frontColor: '#AEDFAE', // Or any other color logic you want
            label: item.name,
          }));
          setTopSalesRecord(topSales);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(error => {
        Alert.alert('Alert', error.response?.data?.message);
      });
  };
  
    const handleTopSaleFromDateChange = date =>{
      setValue('toTopSale','');
      setTosaleRecordMaxDate(date)
      // reset({tofeedbackDate:''})
    }
    const handleTopSaletoDateChange = date=>{
      TopSaleRecord();
    }

    const TopSellingBrand = () => {
      const FROM_DATE=checkFormat(getValues().fromTopBrand)
      const TO_DATE=checkFormat(getValues().toTopBrand)
      getTopSellingBrand(FROM_DATE,TO_DATE)
        .then(response => {
          if (response.data.statusCode === 200) {
            const apiData = response.data.data;
            const topSellingBrands = apiData.map(item => ({
              value: item.value,
              frontColor: '#FF6534', // Or any other color logic you want
              label: item.name,
            }));
            setTopSellingBrand(topSellingBrands);
          } else {
            Alert.alert('Alert', response.data.statusMessage);
          }
        })
        .catch(error => {
          Alert.alert('Alert', error.response?.data?.message);
        });
    };
  
    const handleTopBrandFromDateChange = date =>{
      setValue('toTopBrand','');
      SetToBrandMaxDate(date);
      // reset({tofeedbackDate:''})
    }
    const handleTopBrandtoDateChange = date=>{
      TopSellingBrand();
    }
  

    const getHeaderText = () => {
      if (roleName === 'ASM') {
        return 'Sale Conversion Salesman wise';
      } else if (roleName === 'RSM') {
        return 'Sale Conversion ASM wise';
      }
      return '';
    };

    const getLowerTitle = () => {
      if (roleName === 'RSM') {
          return 'ASM';
      } else if (roleName === 'ASM') {
          return 'SalesMan';
      }
      return ''; 
  };
  const lowerTitle = getLowerTitle(roleName);

      return(
        <ScrollView style = {{paddingHorizontal:15,paddingVertical:15}}>
        
            <Card style ={{backgroundColor:'#fff',marginVertical:10}}>
        <Card.Content>
        <View
          style={{
            marginRight: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <Text
            style={{
              alignItems: 'center',
              fontSize: 16,
              marginVertical: 11,
              color: '#000',
              marginLeft: 10,
              fontWeight: 'bold',
            }}>
            Sales Conversion by Brand
          </Text>
        </View>
        <View style = {{flexDirection:'row',justifyContent:'flex-end',alignItems:'baseline',gap:10}}>
            <View >
            <DatePickerInput
                title={'From'}
                name="fromSales"
                maximumDate={new Date()}
                control={control}
                onDateChange={handlefromSalesChange} // Pass the callback function
              />
            </View>
            <View >
            <DatePickerInput
                title={'To'}
                name="toSales"
                maximumDate={new Date()}
                minimumDate={toSaleMaxDate ? new Date(toSaleMaxDate) : null}
                control={control}
                onDateChange={handletoSalesChange} // Pass the callback function
              />
            </View>     
        </View>
        <View style={{padding: 10}}>
                {salesConversionFlatList && <LabelList data={salesConversionFlatList} />}
              </View>
        <View>
        <CustomStackbarChart 
        yAxisMax={10} 
        barSpacing={1} 
        data={salesConversionData} 
        lowerTitle ={'Brand'}
        yLabel={'Demo Count'}
      />
      
        </View>
        </Card.Content>
            </Card>
            <Card style ={{backgroundColor:'#fff',marginVertical:20}}>
        <Card.Content>
        <View
          style={{
            marginRight: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <Text
            style={{
              alignItems: 'center',
              fontSize: 16,
              marginVertical: 11,
              color: '#000',
              marginLeft: 10,
              fontWeight: 'bold',
            }}>
              {getHeaderText()}
          </Text>
        </View>
        <View style = {{flexDirection:'row',justifyContent:'flex-end',alignItems:'baseline',gap:10}}>
            <View >
            <DatePickerInput
                title={'From'}
                name="fromTrainerWise"
                maximumDate={new Date()}
                control={control}
                onDateChange={handleFromSaleTrainerDateChange} // Pass the callback function
              />
            </View>
            <View >
            <DatePickerInput
                title={'To'}
                name="toTrainerWise"
                maximumDate={new Date()}
                minimumDate={tosalemanWiseMaxDate ? new Date(tosalemanWiseMaxDate) : null}
                control={control}
                onDateChange={handletoSaleTrainerDateChange} // Pass the callback function
              />
            </View>     
        </View>
        <View style={{padding: 10}}>
                {salesTrainerFlatList && <LabelList data={salesTrainerFlatList} />}
              </View>
        <View>
        <CustomStackbarChart 
        yAxisMax={10} 
        barSpacing={1} 
        data={salesConversionTrainer} 
        lowerTitle ={lowerTitle}
        yLabel={'Demo Count'}
        xAxisLabelTextStyle = {{
          transform: [{rotate: '-65deg'}],
          width: 60,
          left: -20,
          fontSize: 10,
        }}
      />
        </View>
        </Card.Content>
            </Card>


            <Card style ={{backgroundColor:'#fff',marginVertical:10}}>
        <Card.Content>
        <View
                style={{
                  marginRight: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    alignItems: 'center',
                    fontSize: 16,
                    marginVertical: 11,
                    color: '#000',
                    marginLeft: 10,
                    fontWeight: 'bold',
                  }}>
                  Sales Report by Brand
                </Text>
                <View
                  style={{
                  width:'40%'
                  }}>
                     <ReportDropDown
                    name="salesReport"
                    control={control}
                    valueFields="id"
                    labelFields={roleName==="ASM"?"salesmanName": "asmName"}
                    data={asmList}
                    onValueChange={dropDownHandlingSalesman}
                  />
                </View>
              </View>
        <View style = {{flexDirection:'row',justifyContent:'flex-end',alignItems:'baseline',gap:10}}>
            <View >
            <DatePickerInput
                title={'From'}
                name="fromSalesReport"
                maximumDate={new Date()}
                control={control}
                
                onDateChange={handlefromsalesReportChange} // Pass the callback function
              />
            </View>
            <View >
            <DatePickerInput
                title={'To'}
                name="toSalesReport"
                maximumDate={new Date()}
                minimumDate={toSalesReportMaxDate ? new Date(toSalesReportMaxDate):null}
                control={control}
                onDateChange={handletoSalesReportChange} // Pass the callback function
              />
            </View>     
        </View>
        <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical:30
                  
                }} 
        >

        <PieChart
                  style={{height: 200, width: 200}}
                  data={salesReportBrand}
                  innerRadius={90}
                  onSlicePress={setSelectedSlice}
                  selectedSlice={selectedSlice}  // Pass selected slice to PieChart
                  outerRadius={'50%'}
                  padAngle={0.07}
                  centerValue = {totalSaleReport}
                />

        </View>
        <View style={{padding: 10}}>
                {salesReportFlatlist && <LabelList data={salesReportFlatlist} />}
              </View>
        </Card.Content>
            </Card>
            <Card style ={{backgroundColor:'#fff',marginVertical:10}}>
        <Card.Content>
        <View
                style={{
                  marginRight: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    alignItems: 'center',
                    fontSize: 16,
                    marginVertical: 11,
                    color: '#000',
                    marginLeft: 10,
                    fontWeight: 'bold',
                  }}>
                  Demo Feedback
                </Text>
                <View
                  style={{
                  width:'40%'
                  }}>
                     <ReportDropDown
                    name="feedbackReportName"
                    control={control}
                    valueFields="trainerId"
                    labelFields="trainerName"
                    data={trainersList}
                    onValueChange={dropDownHandlingDemo}
                  />
                </View>
              </View>
        <View style = {{flexDirection:'row',justifyContent:'flex-end',alignItems:'baseline',gap:10}}>
            <View >
            <DatePickerInput
                title={'From'}
                name="fromDemoReport"
                maximumDate={new Date()}
                control={control}
                
                onDateChange={handlefromdemoChange} // Pass the callback function
              />
            </View>
            <View >
            <DatePickerInput
                title={'To'}
                name="toDemoReport"
                maximumDate={new Date()}
                minimumDate={tofeedBackMaxDate ? new Date(tofeedBackMaxDate): null}
                control={control}
                onDateChange={handletodemoChange} // Pass the callback function
              />
            </View>     
        </View>
        <View>
       
        <CustomBarChart 
        yAxisMax={10} 
        barSpacing={1} 
        data={demoFeedBack} 
        lowerTitle ={'Demos'}
        yLabel={'Rating'}
        
      />
        </View>
        </Card.Content>
            </Card>

            <Card style ={{backgroundColor:'#fff',marginVertical:20}}>
        <Card.Content>
        <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#000',
                    justifyContent: 'flex-start',
                    marginLeft: 10,
                    marginVertical: 10,
                    fontWeight: 'bold',
                  }}>
                     Completed Vs Dropped
                </Text>
                <View
                  style={{
                  width:'40%'
                  }}>
                <ReportDropDown
                    name="ASMReport"
                    control={control}
                    valueFields="id"
                    labelFields={roleName==="ASM"?"salesmanName": "asmName"}
                    data={asmList}
                    onValueChange={dropDownHandlingASM}
                  />
              </View>
              </View>
           
              <View style = {{flexDirection:'row',justifyContent:'flex-end',alignItems:'baseline',gap:10}}>
            <View >
            <DatePickerInput
                title={'From'}
                name="fromcompleteDate"
                maximumDate={new Date()}
                control={control}
                
                onDateChange={handleCompleteFromDateChange} // Pass the callback function
              />
            </View>
            <View >
            <DatePickerInput
                title={'To'}
                name="toCompleteDate"
                maximumDate={new Date()}
                minimumDate={toCompletedMaxDate ? new Date(toCompletedMaxDate): null}
                control={control}
                onDateChange={handleCompletetoDateChange} // Pass the callback function
              />
            </View>  
           
        </View>
             
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical:30
                  
                }}>

                <PieChart
                  style={{height: 200, width: 200}}
                  data={completedDropped}
                  innerRadius={90}
                  onSlicePress={setSelectedSlice}
                  selectedSliced = {selectedSlice}
                  outerRadius={'50%'}
                  padAngle={0.07}
                  centerValue = {complete}

                />

               
              </View>
              <View style={{padding: 10}}>
                {completedFlatList && <LabelList data={completedFlatList} />}
              </View>
            
        </Card.Content>
      </Card>
      
      <Card style ={{backgroundColor:'#fff',marginVertical:20}}>
        <Card.Content>
        <View
          style={{
            marginRight: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <Text
            style={{
              alignItems: 'center',
              fontSize: 16,
              marginVertical: 11,
              color: '#000',
              marginLeft: 10,
              fontWeight: 'bold',
            }}>
           Top 10 Selling Product
          </Text>
        </View>
        <View style = {{flexDirection:'row',justifyContent:'flex-end',alignItems:'baseline',gap:10}}>
            <View >
            <DatePickerInput
                title={'From'}
                name="fromTopSelling"
                maximumDate={new Date()}
                control={control}
                
                onDateChange={handleTopSellingFromDateChange} // Pass the callback function
              />
            </View>
            <View >
            <DatePickerInput
                title={'To'}
                name="toTopSelling"
                maximumDate={new Date()}
                minimumDate={toSellingMaxDate ? new Date(toSellingMaxDate):null}
                control={control}
                onDateChange={handleTopSellingtoDateChange} // Pass the callback function
              />
            </View>     
        </View>
        <View>
        <CustomBarChart 
        yAxisMax={10} 
        barSpacing={1} 
        data={topSellingProduct} 
        lowerTitle ={'Products'}
        yLabel={'Amount'}
        xAxisLabelTextStyle = {{
            transform: [{rotate: '-25deg'}],
            width: 60,
            left: -5,
            fontSize: 10,
          }}
      />
        </View>
        </Card.Content>
      </Card>

      <Card style ={{backgroundColor:'#fff',marginVertical:20}}>
        <Card.Content>
        <View
          style={{
            marginRight: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <Text
            style={{
              alignItems: 'center',
              fontSize: 16,
              marginVertical: 11,
              color: '#000',
              marginLeft: 10,
              fontWeight: 'bold',
            }}>
           Top Selling Brand
          </Text>
        </View>
        <View style = {{flexDirection:'row',justifyContent:'flex-end',alignItems:'baseline',gap:10}}>
            <View >
            <DatePickerInput
                title={'From'}
                name="fromTopBrand"
                maximumDate={new Date()}
                control={control}
                
                onDateChange={handleTopBrandFromDateChange} // Pass the callback function
              />
            </View>
            <View >
            <DatePickerInput
                title={'To'}
                name="toTopBrand"
                maximumDate={new Date()}
                minimumDate={toTopBrandMaxDate ? new Date(toTopBrandMaxDate):null}
                control={control}
                onDateChange={handleTopBrandtoDateChange} // Pass the callback function
              />
            </View>     
        </View>
        <View>
        <CustomBarChart 
        yAxisMax={10} 
        barSpacing={1} 
        data={topSellingBrand} 
        lowerTitle ={'Brand'}
        yLabel={'Sales Count'}
        xAxisLabelTextStyle = {{
           
            width: 60,
          
            fontSize: 10,
          }}
      />
        </View>
        </Card.Content>
      </Card>
      
      <Card style ={{backgroundColor:'#fff',marginVertical:20}}>
        <Card.Content>
        <View
          style={{
            marginRight: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <Text
            style={{
              alignItems: 'center',
              fontSize: 16,
              marginVertical: 11,
              color: '#000',
              marginLeft: 10,
              fontWeight: 'bold',
            }}>
           Top Sale Record
          </Text>
        </View>
        <View style = {{flexDirection:'row',justifyContent:'flex-end',alignItems:'baseline',gap:10}}>
            <View >
            <DatePickerInput
                title={'From'}
                name="fromTopSale"
                maximumDate={new Date()}
                control={control}
                
                onDateChange={handleTopSaleFromDateChange} // Pass the callback function
              />
            </View>
            <View >
            <DatePickerInput
                title={'To'}
                name="toTopSale"
                maximumDate={new Date()}
                minimumDate={tosaleRecordMaxDate ? new Date(tosaleRecordMaxDate): null}
                control={control}
                onDateChange={handleTopSaletoDateChange} // Pass the callback function
              />
            </View>     
        </View>
        <View>
        <CustomBarChart 
        yAxisMax={10} 
        barSpacing={1} 
        data={topSalesRecord} 
        lowerTitle ={lowerTitle}
        yLabel={'Amount'}
        xAxisLabelTextStyle = {{
          transform: [{rotate: '-25deg'}],
          width: 60,
          left: -5,
          fontSize: 10,
        }}
      />
        </View>
        </Card.Content>
      </Card>
        </ScrollView>
      );
}

export default AsmRsmReportScreen;
