import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions, ScrollView, Alert} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import {getDemoCountBrand,getWeeklyDemo,getDemoFeedback,getTrainerCalendar,getTotalDemoCount,getDemoStatusReport} from '../../../../networkClient/apifunction';
import moment from 'moment';
import {Card} from 'react-native-paper';
import DatePickerInput from '../../../Profile/component/SelectDate';
import { useForm } from 'react-hook-form';
import CustomBarChart from '../component/CustomBarChart';
import CustomStackbarChart from '../component/CustomStackBarChart';
import PieChart from '../../component/PieChart';
import Legend from '../../component/LegendSlices';
import LabelList from '../../component/LabelList';
import crashlytics from '@react-native-firebase/crashlytics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TrainerReportScreen = props => {
const ToDay = moment();
  const [demoCount, setDemoCount] = useState([]);
  const [weeklyReport,setWeeklyDemoReport] = useState([]);
  const [ demoFeedBackReport,setDemoFeedbackReport] = useState([]);
  const [trainerCalenderReport, setTrainerCalenderReport] = useState([]);
  const [selectedSlice, setSelectedSlice] = useState(null);
  const[totaltrainDays,settrainTotalDays] = useState(0);
  const [totalDemoCount, setTotalDemoCount] = useState([]);
  const [selectedTotalDemo, setSelectedTotalDemo] = useState(null);
  const[totalDemoValue,getTotalDemo] = useState(0);
  const [selectedDemoReport, setSelectedDemoReport] = useState(null);
  const[totalDemoReportValue,getDemoReport] = useState(0);
  const [demoStatusReport,setDemoStatusReport] =  useState([]);
  const [trainerFlatList,settrainerFlatlist] = useState([]);
  const [demostatusFlatList,setDemoStatusFlatlist] = useState([]);
  const [demoCountFlatlist,setDemoCountFlatlist] = useState([]);
  const [toMaxdate,setToMaxDate] = useState(moment(ToDay).subtract(1, 'months').format('YYYY-MM-DD'));
  const [toweeklyMaxDate,settoweeklyMaxDate] = useState(moment(ToDay).subtract(1, 'months').format('YYYY-MM-DD'));
  const [tofeedbackmaxDate,settofeedbackmaxDate] =  useState(moment(ToDay).subtract(1, 'months').format('YYYY-MM-DD'));
  const [totrainerMaxDate,settrainerMaxDate] =  useState(moment(ToDay).subtract(1, 'months').format('YYYY-MM-DD'));
  const [toDemoMaxDate,setDemoMaxDate] =  useState(moment(ToDay).subtract(1, 'months').format('YYYY-MM-DD'));
  const [toStatusMaxDate,setStatusMaxDate] =  useState(moment(ToDay).subtract(1, 'months').format('YYYY-MM-DD'));
  // const maxValue = Math.max(...data.map(item => item.value));
  const minValue = 0;
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
      fromDemoCount: '',
      toDemoCount: '',
      fromWeekly:'',
      toWeekly:'',
      fromfeedbackDate:'',
      tofeedbackDate:'',
      fromTrainerCalendarDate:'',
      toTrainerCalendarDate:'',
      fromTotalDemo:'',
      toTotalDemo:'',
      fromDemoReport:'',
      toDemoReport:''
    },
  });
  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('TrainerReportScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('TrainerReportScreen unmounted');
    };
  }, []);

  useEffect(()=>{
        setValue('fromDemoCount',moment(ToDay).subtract(1, 'months').format('DD MMM YYYY'));
        setValue('toDemoCount',moment(ToDay).format('DD MMM YYYY'));
        setValue('fromWeekly',moment(ToDay).subtract(1, 'months').format('DD MMM YYYY'));
        setValue('toWeekly',moment(ToDay).format('DD MMM YYYY'));
        setValue('fromfeedbackDate',moment(ToDay).subtract(1, 'months').format('DD MMM YYYY'));
        setValue('tofeedbackDate',moment(ToDay).format('DD MMM YYYY'));
        setValue('fromTrainerCalendarDate',moment(ToDay).subtract(1, 'months').format('DD MMM YYYY'));
        setValue('toTrainerCalendarDate',moment(ToDay).format('DD MMM YYYY'));
        setValue('fromTotalDemo',moment(ToDay).subtract(1, 'months').format('DD MMM YYYY'));
        setValue('toTotalDemo',moment(ToDay).format('DD MMM YYYY'));
        setValue('fromDemoReport',moment(ToDay).subtract(1, 'months').format('DD MMM YYYY'));
        setValue('toDemoReport',moment(ToDay).format('DD MMM YYYY'));
  },[])
  useEffect(() => {
    DemoCountBrand();
    WeeklyDemoReport();
    TrainerCalendar();
    TotalDemoCount();
    DemoStatusReport();
    DemoFeedBack();
  }, []);
  const DemoCountBrand = () => {
    
    const fromdate = moment(getValues().fromDemoCount,'DD MMM YYYY').format('YYYY-MM-DD');
    const todate = moment(getValues().toDemoCount,'DD MMM YYYY').format('YYYY-MM-DD');
    if(fromdate && todate){
      DemoCountApi(fromdate,todate);
    }
  };
    const getYMaxValue = (data) =>{
    const maxValue = Math.max(...data.map(item => item.value));
    return maxValue
    }

    const getFlatList = (data)=>{
      const mapppedData = data.map((item, index) => {
        return {
          value:item.value,
          name: item.label, // Use item.label as the name value
          color: item.svg.fill,
          backgroundColor: item.svg.fill,
          borderColor: item.svg.fill,
          borderWidth: 2, // Default borderWidth if not provided
        };
      });
      return mapppedData;
    }
  const DemoCountApi=(fromDate,toDate)=>{
    const colors = ['#F78104', '#00AEEF', '#81BE83']; // Define colors array

    getDemoCountBrand(fromDate, toDate)
      .then(response => {
        if (response.data.statusCode === 200) {
          const apiData = response.data.data;

          const demoCount = apiData.map((item, index) => ({
            value: item.value,
            frontColor: colors[index % colors.length], // Cycle through colors
            label: item.name,
          }));
          setDemoCount(demoCount);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(error => {
       
      });
  }
  const handleFromDateChange = date => {
    setValue('toDemoCount','');
    setToMaxDate(date)
  };
  const handletoDateChange = date => {
    if(getValues().fromDemoCount && getValues().toDemoCount){
        DemoCountApi(getValues().fromDemoCount,getValues().toDemoCount);
    }
  };

  const WeeklyDemoReport = () => {
    const fromDate = moment(getValues().fromWeekly,'DD MMM YYYY').format('YYYY-MM-DD');
    const toDate = moment(getValues().toWeekly,'DD MMM YYYY').format('YYYY-MM-DD');
    if (fromDate && toDate) {
      // Ensure both dates are set
      weeklyDemoApi(fromDate,toDate)
    }
  };


 const  weeklyDemoApi =(fromDate,toDate)=>{
    getWeeklyDemo(fromDate, toDate)
    .then(response => {
      if (response.data.statusCode === 200) {
        const apiData = response.data.data;
        const weeklyReport = apiData.map(item => ({
          stacks: [
            {value: item.value[0], color: '#00AEEF'},
            {value: item.values[1], color: '#00AEEF1A', marginBottom: -3},
          ],
          label: item.name,
        }));
        setWeeklyDemoReport(weeklyReport);
      } else {
        Alert.alert('Alert', response.data.statusMessage);
      }
    })
    .catch(error => {
    
    });
  }

  const handleFromWeeklyDateChange = date => {
    setValue('toWeekly','');
    settoweeklyMaxDate(date);
  };
  const handletoWeeklyDateChange = date => {
    if(getValues().fromWeekly && getValues().toWeekly){
      weeklyDemoApi(getValues().fromWeekly,getValues().toWeekly);
    }
  };

  const DemoFeedBack = () => {
    const fromDate = moment(getValues().fromfeedbackDate,'DD MMM YYYY').format('YYYY-MM-DD');
    const toDate = moment(getValues().tofeedbackDate,'DD MMM YYYY').format('YYYY-MM-DD');

    if(fromDate && toDate){
      demoFeedBackApi(fromDate,toDate)
    }
  };

  const demoFeedBackApi = (fromDate,toDate)=>{
    getDemoFeedback(fromDate, toDate)
    .then(response => {
      if (response.data.statusCode === 200) {
        const apiData = response.data.data;
        const demoFeedback = apiData.map(item => ({
          value: item.value,
          frontColor: '#AEDFAE',
          label: item.name,
        }));
        setDemoFeedbackReport(demoFeedback);
      } else {
        Alert.alert('Alert', response.data.statusMessage);
      }
    })
    .catch(error => {
     
    });
  }
  const handleFeedbackFromDateChange = date =>{
    setValue('tofeedbackDate','');
    settofeedbackmaxDate(date)
    
  }
  const handlefeedBacktoDateChange = date=>{
    if(getValues().fromfeedbackDate && getValues().tofeedbackDate){
      demoFeedBackApi(getValues().fromfeedbackDate, getValues().tofeedbackDate)
    }
  }

  const TrainerCalendar = async () => {
    // const fromdate = moment(getValues().fromTrainerCalendarDate).format('YYYY-MM-DD');
    // const todate = moment(getValues().toTrainerCalendarDate).format('YYYY-MM-DD');

    const fromDate = moment(getValues().fromTrainerCalendarDate,'DD MMM YYYY').format('YYYY-MM-DD');
    const toDate = moment(getValues().toTrainerCalendarDate,'DD MMM YYYY').format('YYYY-MM-DD');

    if(fromDate && toDate){
      trainerCalendarApi(fromDate,toDate);
    }
   
  };

  const trainerCalendarApi =async (fromDate,toDate)=>{
    const defaultColors = [
      '#00AEEF',
      '#9E5FFF',
      '#FFD240',
      '#F04438',
      '#F78104',
    ];
    const id = await AsyncStorage.getItem("userId");
    getTrainerCalendar(fromDate, toDate,id)
      .then(response => {
        if (response.data.statusCode === 200) {
          const apiData = response.data.data;
          const trainerCalendar = apiData.map((item, index) => ({
            value: item.value,
            svg: {fill: defaultColors[index % defaultColors.length]}, // Use API color or default
            arc: {cornerRadius: '15%'},
            key: String(index + 1), // Unique key for each pie slice 
            label: item.name,
          }));
          const getTrainDay = apiData.reduce((accumulator, item) => accumulator + item.value, 0);
          settrainTotalDays(getTrainDay)
          const flatistData = getFlatList(trainerCalendar);
          settrainerFlatlist(flatistData);
          setTrainerCalenderReport(trainerCalendar);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(error => {
       
      });
  }

  const handletrainerCalendarFromDateChange = date => {
    // reset({toTrainerCalendarDate:''});
    setValue('toTrainerCalendarDate','');
    settrainerMaxDate(date)
  };
  const handletrainerCalendartoDateChange = date => {
    // TrainerCalendar()
    trainerCalendarApi(getValues().fromTrainerCalendarDate,getValues().toTrainerCalendarDate)
  };

  const TotalDemoCount = async () => {
    const getDate = getValues()

    const fromDate = moment(getDate.fromTotalDemo,'DD MMM YYYY').format('YYYY-MM-DD');
    const toDate = moment(getDate.toTotalDemo,'DD MMM YYYY').format('YYYY-MM-DD');

    if(fromDate && toDate){
      totalDemoCountApi(fromDate,toDate);
    }
  };

  const totalDemoCountApi = (fromDate,toDate)=>{
    const defaultColors = ['#12B76A', '#FFD240', '#F04438'];
    getTotalDemoCount(fromDate, toDate)
      .then(response => {
        if (response.data.statusCode === 200) {
          const apiData = response.data.data;
          const totalDemoCount = apiData.map((item, index) => ({
            value: item.value,
            svg: {fill: defaultColors[index % defaultColors.length]}, // Use API color or default
            arc: {cornerRadius: '15%'},
            key: String(index + 1), // Unique key for each pie slice
            label: item.name,
          }));
          const gettotalDemo = apiData.reduce((accumulator, item) => accumulator + item.value, 0);
          getTotalDemo(gettotalDemo)
          setTotalDemoCount(totalDemoCount);
          const getFlatListData = getFlatList(totalDemoCount);
          setDemoCountFlatlist(getFlatListData);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(error => {
       
      });
  }

  const handleTotalDemoFromDateChange = date => {
    // reset({toTrainerCalendarDate:''});
    setValue('toTotalDemo','');
    setDemoMaxDate(date);
  };
  const handleTotalDemotoDateChange = date => {
    const getDate = getValues();
    if(getDate.fromTotalDemo && getDate.toTotalDemo){
      totalDemoCountApi(getDate.fromTotalDemo,getDate.toTotalDemo);
    }
  };

  const DemoStatusReport = async () => {

    const getDate = getValues();
    const fromDate = moment(getDate.fromDemoReport,'DD MMM YYYY').format('YYYY-MM-DD');
    const toDate = moment(getDate.toDemoReport,'DD MMM YYYY').format('YYYY-MM-DD');
    if(fromDate && toDate){
      demoStatus(fromDate,toDate);
    }
   
  };

  const demoStatus = (fromDate,toDate)=>{
    const defaultColors = ['#12B76A', '#FFD240', '#F04438'];
    getDemoStatusReport(fromDate, toDate)
      .then(response => {
        if (response.data.statusCode === 200) {
          const apiData = response.data.data;
          const demoStatus = apiData.map((item, index) => ({
            value: item.value,
            svg: {fill: defaultColors[index % defaultColors.length]}, // Use API color or default
            arc: {cornerRadius: '15%'},
            key: String(index + 1), // Unique key for each pie slice
            label: item.name,
          }));
          const gettotalDemoReport = apiData.reduce((accumulator, item) => accumulator + item.value, 0);
          setDemoStatusReport(demoStatus);
          getDemoReport(gettotalDemoReport)
          const getFlatListData = getFlatList(demoStatus);
          setDemoStatusFlatlist(getFlatListData);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(error => {
       
      });
  }
  const handleDemoReportFromDateChange = date => {
    // reset({toTrainerCalendarDate:''});
    setValue('toDemoReport','');
    setStatusMaxDate(date);
  };
  const handleDemoReporttoDateChange = date => {
    const getDate = getValues();
    if(getDate.fromDemoReport && getDate.toDemoReport){
      demoStatus(getDate.fromDemoReport,getDate.toDemoReport);
    }
  
  };
  return (
    <ScrollView style = {{paddingHorizontal:15,paddingVertical:15}}>
      <Card style ={{backgroundColor:'#fff'}}>
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
            Demo Count by Brand
          </Text>
        </View>
        <View style = {{flexDirection:'row',justifyContent:'flex-end',alignItems:'baseline',gap:10}}>
            <View >
            <DatePickerInput
                title={'From'}
                name="fromDemoCount"
                maximumDate={new Date()}
                control={control}
                onDateChange={handleFromDateChange} // Pass the callback function
              />
            </View>
            <View >
            <DatePickerInput
                title={'- To'}
                name="toDemoCount"
                maximumDate={new Date()}
                minimumDate={toMaxdate ? new Date(toMaxdate) : null}
                control={control}
                onDateChange={handletoDateChange} // Pass the callback function
              />
            </View>     
        </View>
        <View>
        <CustomBarChart 
        yAxisMax={10} 
        barSpacing={1} 
        data={demoCount} 
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
            Weekly Demo Report - Service Variant
          </Text>
        </View>
        <View style = {{flexDirection:'row',justifyContent:'flex-end',alignItems:'baseline',gap:10}}>
            <View >
            <DatePickerInput
                title={'From'}
                name="fromWeekly"
                maximumDate={new Date()}
                control={control}
                onDateChange={handleFromWeeklyDateChange} // Pass the callback function
              />
            </View>
            <View >
            <DatePickerInput
                title={'- To'}
                name="toWeekly"
                maximumDate={new Date()}
                minimumDate={toweeklyMaxDate ? new Date(toweeklyMaxDate) : null}
                control={control}
                onDateChange={handletoWeeklyDateChange} // Pass the callback function
              />
            </View>     
        </View>
        <View>
        <CustomStackbarChart 
        yAxisMax={10} 
        barSpacing={1} 
        data={weeklyReport} 
        lowerTitle ={'Service'}
        yLabel={'Count'}
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
            Demo Feedback Report
          </Text>
        </View>
        <View style = {{flexDirection:'row',justifyContent:'flex-end',alignItems:'baseline',gap:10}}>
            <View >
            <DatePickerInput
                title={'From'}
                name="fromfeedbackDate"
                maximumDate={new Date()}
                control={control}
                
                onDateChange={handleFeedbackFromDateChange} // Pass the callback function
              />
            </View>
            <View >
            <DatePickerInput
                 title={'- To'}
                name="tofeedbackDate"
                maximumDate={new Date()}
                minimumDate={tofeedbackmaxDate ? new Date(tofeedbackmaxDate) : null}
                control={control}
                onDateChange={handlefeedBacktoDateChange} // Pass the callback function
              />
            </View>     
        </View>
        <View>
        <CustomBarChart 
        yAxisMax={10} 
        barSpacing={1} 
        data={demoFeedBackReport} 
        lowerTitle ={'Demos'}
        yLabel={'Rating'}
        xAxisLabelTextStyle = {{
            transform: [{rotate: '-35deg'}],
            width: 60,
            left: -5,
            fontSize: 10,
          }}
      />
        </View>
        </Card.Content>
      </Card>
      {/* trainer calendar report */}
      <Card style ={{backgroundColor:'#fff',marginVertical:20}}>
        <Card.Content>
        <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
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
                  Trainer Calendar Report
                </Text>
              </View>
              <View style = {{flexDirection:'row',justifyContent:'flex-end',alignItems:'baseline',gap:10}}>
            <View >
            <DatePickerInput
                title={'From'}
                name="fromTrainerCalendarDate"
                maximumDate={new Date()}
                control={control}
                onDateChange={handletrainerCalendarFromDateChange} // Pass the callback function
              />
            </View>
            <View >
            <DatePickerInput
                title={'- To'}
                name="toTrainerCalendarDate"
                maximumDate={new Date()}
                minimumDate={totrainerMaxDate ? new Date(totrainerMaxDate) : null}
                control={control}
                onDateChange={handletrainerCalendartoDateChange} // Pass the callback function
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
                  data={trainerCalenderReport}
                  innerRadius={90}
                  onSlicePress={setSelectedSlice}
                  selectedSlice={selectedSlice}  // Pass selected slice to PieChart
                  outerRadius={'50%'}
                  padAngle={0.07}
                  centerValue = {totaltrainDays}
                />
              </View>
              <View style={{padding: 10}}>
                {trainerFlatList && <LabelList data={trainerFlatList} />}
              </View>
        </Card.Content>
      </Card>
      {/* Total demo count */}
      <Card style ={{backgroundColor:'#fff',marginVertical:20}}>
        <Card.Content>
        <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
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
                 Total Demo Count
                </Text>
              </View>
              <View style = {{flexDirection:'row',justifyContent:'flex-end',alignItems:'baseline',gap:10}}>
            <View >
            <DatePickerInput
                title={'From'}
                name="fromTotalDemo"
                maximumDate={new Date()}
                control={control}
                
                onDateChange={handleTotalDemoFromDateChange} // Pass the callback function
              />
            </View>
            <View >
            <DatePickerInput
                title={'- To'}
                name="toTotalDemo"
                maximumDate={new Date()}
                minimumDate={toDemoMaxDate ? new Date(toDemoMaxDate) : null}
                control={control}
                onDateChange={handleTotalDemotoDateChange} // Pass the callback function
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
                  data={totalDemoCount}
                  onSlicePress={setSelectedTotalDemo}
                  selectedSlice={selectedTotalDemo}  // Pass selected slice to PieChart
                  innerRadius={90}
                  outerRadius={'50%'}
                  padAngle={0.07}
                  centerValue = {totalDemoValue}
                />

              </View>
              <View style={{padding: 10}}>
              {demoCountFlatlist &&  <LabelList data={demoCountFlatlist} />}
              </View>
        </Card.Content>
      </Card>
      <Card style ={{backgroundColor:'#fff',marginVertical:20}}>
        <Card.Content>
        <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
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
                Demo Status Report
                </Text>
              </View>
              <View style = {{flexDirection:'row',justifyContent:'flex-end',alignItems:'baseline',gap:10}}>
            <View >
            <DatePickerInput
                title={'From'}
                name="fromDemoReport"
                maximumDate={new Date()}
                control={control}
                
                onDateChange={handleDemoReportFromDateChange} // Pass the callback function
              />
            </View>
            <View >
            <DatePickerInput
                title={'- To'}
                name="toDemoReport"
                maximumDate={new Date()}
                minimumDate={toStatusMaxDate ? new Date(toStatusMaxDate) : null}
                control={control}
                onDateChange={handleDemoReporttoDateChange} // Pass the callback function
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
                  data={demoStatusReport}
                  onSlicePress={setSelectedDemoReport}
                  selectedSlice={selectedDemoReport}  // Pass selected slice to PieChart
                  innerRadius={90}
                  outerRadius={'50%'}
                  padAngle={0.07}
                  centerValue = {totalDemoReportValue}
                />


              </View>
              <View style={{padding: 10}}>
              {demostatusFlatList && <LabelList data={demostatusFlatList} />}
              </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
export default TrainerReportScreen;
