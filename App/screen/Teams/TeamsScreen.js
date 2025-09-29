import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import CustomAppBar from '../../component/CustomAppBar';
import {styles} from './TeamStyles';
import GlobalStyles from '../../core/GlobalStyles';
import {DataTable} from 'react-native-paper';
import CustomSearchInput from '../../component/CustomSearchInput'
import { getASMList, getASMSearchList, getOtherSegmentList, getOtherSegmentSearchList } from '../../networkClient/apifunction';
import { Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const TeamsScreen = (props) => {

  const roleName=props.route.params.role
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState([]);
  const [asmData, setASMData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setsearch] = useState('');
  const [input, setinput] = useState('');
  const [header, setHeader] = useState();
  const [segments,setSegments]=useState([]);
  const RSMsegments = ['ASM', 'Salesman', 'Trainer'];
  const ASMsegments = ['Salesman', 'Trainer'];
  const SalesManHeader = [
    'Salesman Name',
    'Email ID',
    'Mobile Number',
    'ASM',
    'RSM',
  ];
  const TrainerHeader = [
    'Trainer Name',
    'Location',
    'Email ID',
    'RTE',
    'Mobile Number',
  ];
  const ASMHeader = ['Name', 'Email ID', 'Mobile Number',"Location"];

  const searchInputRef = useRef(null);
  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('TeamsScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('TeamsScreen unmounted');
    };
  }, []);
  useEffect(() => {
    if(roleName=== 'ASM'){
      setSegments(ASMsegments)
        if (ASMsegments[0] === 'Salesman') {
          setHeader(SalesManHeader);
          setLoading(false);
      } else if (ASMsegments[0] === 'Trainer') {
        setHeader(TrainerHeader);
        setLoading(false);
      }
    }else{
      setSegments(RSMsegments)
      if (RSMsegments[0] === 'Salesman') {
        setHeader(SalesManHeader);
        setLoading(false);
    } else if (RSMsegments[0] === 'Trainer') {
      setHeader(TrainerHeader);
      setLoading(false);
    } else {
      setHeader(ASMHeader);
      setLoading(false);
    }
    }
   
  }, []);
  useEffect(()=>{
    if(roleName=== 'ASM'){
      getData()
  }else{
      getASMData()
      getData()
      
  }
  },[selectedIndex])
  
  const getASMData = async () => {
    await getASMList()
      .then(function (response) {
        if (response.data.statusCode === 200) {
          if(response.data.data!=null){
            setASMData(response.data.data);
          }else{
            setASMData([]);
          }
        } else {
          Alert.alert(Languages.Alert, response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.response.data.message);
      });
  };
  const getData = async () => {
    var isRSM;
    var role;
    if(roleName==="RSM"){
      isRSM=true
      role=RSMsegments[selectedIndex]
    }else{
      isRSM=false
      role=ASMsegments[selectedIndex]
    }
    await getOtherSegmentList(isRSM,role)
      .then(function (response) {
        if (response.data.statusCode === 200) {
          if(response.data.data!=null){
            setData(response.data.data);
          }else{
            setData([])
          }
        } else {
          Alert.alert(Languages.Alert, response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.response.data.message);
      });
  };
  const getASMSearchData = async (value) => {
    await getASMSearchList(value)
      .then(function (response) {
        if (response.data.statusCode === 200) {
          if(response.data.data!=null){
            setASMData(response.data.data);
          }else{
            setASMData([]);
          }
         
        } else {
          Alert.alert(Languages.Alert, response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.response.data.message);
      });
  };
  const getSearchData = async (value) => {
    var isRSM;
    var role;
    if(roleName==="RSM"){
      isRSM=true
      role=RSMsegments[selectedIndex]
    }else{
      isRSM=false
      role=ASMsegments[selectedIndex]
    }
    await getOtherSegmentSearchList(isRSM,role,value)
      .then(function (response) {
        if (response.data.statusCode === 200) {
          if(response.data.data!=null){
            setData(response.data.data);
          }else{
            setData([])
          }
          
        } else {
          Alert.alert(Languages.Alert, response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert(Languages.Alert, error.response.data.message);
      });
  };
  const setTableHeader = index => {
    if (segments[index] === 'Salesman') {
        setHeader(SalesManHeader);
        setLoading(false);
    } else if (segments[index] === 'Trainer') {
      setHeader(TrainerHeader);
      setLoading(false);
    } else {
      setHeader(ASMHeader);
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large" color={GlobalStyles.colorSet.orange} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{backgroundColor: GlobalStyles.colorSet.app_bg, flexGrow: 1}}>
      <View style={styles.container}>
        <CustomAppBar title={Languages.Teams} showImage={true} navigation={props.navigation}/>
        <View style={styles.customSegmentLabels}>
          {segments&&
          segments.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedIndex(index);
                setTableHeader(index);
              }}
              style={[
                styles.segmentButton,
                {
                  borderBottomColor:
                    index === selectedIndex
                      ? GlobalStyles.colorSet.orange
                      : GlobalStyles.colorSet.app_bg,
                },
              ]}>
              <Text
                style={[
                  styles.segmentText,
                  {
                    color:
                      index === selectedIndex
                        ? GlobalStyles.colorSet.orange
                        : '#919EAB',
                  }, // Text color based on selection
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <CustomSearchInput
            placeholder={"Search"}
            value={search}
            onChangeText={text => {
              setsearch(text);
              var role;
              if(roleName==="RSM"){
                role=RSMsegments[selectedIndex]
              }else{
                role=ASMsegments[selectedIndex]
              }
              if(role==="ASM"){
                getASMSearchData(text.trim())
              }else{
                getSearchData(text.trim())
              }
            }}
           
            ref={searchInputRef} // Pass the ref
        />
        {/* <SearchInput
          placeholder="Search"
          onChangeText={text => {
            setsearch(text.trim());
            var role;
            if(roleName==="RSM"){
              role=RSMsegments[selectedIndex]
            }else{
              role=ASMsegments[selectedIndex]
            }
            if(role==="ASM"){
              getASMSearchData(text.trim())
            }else{
              getSearchData(text.trim())
            }
          }}
          Ref={input => {
            setinput(input);
          }}
          maxLength={10}
          showClose={search ? true : false}
          onClose={() => {
            input.clear();
            setsearch('');
            if(roleName=== 'ASM'){
              getData()
          }else{
              getASMData()
              getData()
          }
          }}
        /> */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{height: '75%', marginTop: 10}}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <DataTable style={{width: '100%'}}>
              <DataTable.Header
                style={{backgroundColor: '#00AEEF1A', width: '100%'}}>
                {header&&
                header.map((item, index) => (
                  <DataTable.Title key={index} style={styles.column1}>
                    <Text
                      style={[
                        styles.cellText,
                        {color: '#848484', fontWeight: '700'},
                      ]}>
                      {item}
                    </Text>
                  </DataTable.Title>
                ))}
              </DataTable.Header>

              {roleName === 'RSM' &&
                (RSMsegments[selectedIndex] === 'ASM'
                  ? asmData&&
                  asmData.map((item, index) => (
                      <DataTable.Row key={index}>
                        <DataTable.Cell style={styles.column1}>
                          <Text style={styles.cellText} numberOfLines={2}>
                            {item.salesmanName}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.column2} >
                          <Text style={styles.cellText} numberOfLines={2}>{item.emailId}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.column3}>
                          <Text style={styles.cellText}>
                            {item.mobileNumber}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.column4}>
                          {item.stateList&&
                          item.stateList.map((item, index) => (
                            <Text
                            key={index}
                             style={styles.cellText} numberOfLines={5}>{item.name},</Text>
                          ))}
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))
                  : RSMsegments[selectedIndex] === 'Salesman'
                  ? data.map((item, index) => (
                      <DataTable.Row key={index}>
                        <DataTable.Cell style={styles.column1}>
                          <Text style={styles.cellText}>
                            {item.salesmanName}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.column2}>
                          <Text style={styles.cellText} numberOfLines={2}>{item.emailId}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.column3}>
                          <Text style={styles.cellText}>
                            {item.mobileNumber}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.column4}>
                          <Text style={styles.cellText} numberOfLines={2}>{item.asmName}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.column5}>
                          <Text style={styles.cellText} numberOfLines={2}>{item.rsmName}</Text>
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))
                  : data.map((item, index) => (
                      <DataTable.Row key={index}>
                        <DataTable.Cell style={styles.column1}>
                          <Text style={styles.cellText} numberOfLines={2}>
                            {item.trainerName}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.column2}>
                          <Text style={styles.cellText} numberOfLines={5}>{item.locationList}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.column3}>
                          <Text style={styles.cellText} numberOfLines={2}>{item.emailId}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.column4}>
                          <Text style={styles.cellText} numberOfLines={2}>{item.rte?item.rte.rteName:''}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.column5}>
                          <Text style={styles.cellText}>
                            {item.mobileNumber}
                          </Text>
                        </DataTable.Cell>
                      </DataTable.Row>
                    )))}
                    {
                      roleName==="ASM"&&(
                        ASMsegments[selectedIndex] === 'Salesman'
                        ? data.map((item, index) => (
                            <DataTable.Row key={index}>
                              <DataTable.Cell style={styles.column1}>
                                <Text style={styles.cellText} numberOfLines={2}>
                                  {item.salesmanName}
                                </Text>
                              </DataTable.Cell>
                              <DataTable.Cell style={styles.column2}>
                                <Text style={styles.cellText} numberOfLines={2}>{item.emailId}</Text>
                              </DataTable.Cell>
                              <DataTable.Cell style={styles.column3}>
                                <Text style={styles.cellText}>
                                  {item.mobileNumber}
                                </Text>
                              </DataTable.Cell>
                              <DataTable.Cell style={styles.column4}>
                                <Text style={styles.cellText} numberOfLines={2}>{item.asmName}</Text>
                              </DataTable.Cell>
                              <DataTable.Cell style={styles.column5}>
                                <Text style={styles.cellText} numberOfLines={2}>{item.rsmName}</Text>
                              </DataTable.Cell>
                            </DataTable.Row>
                          ))
                        : data.map((item, index) => (
                            <DataTable.Row key={index}>
                              <DataTable.Cell style={styles.column1}>
                                <Text style={styles.cellText} numberOfLines={2}>
                                  {item.trainerName}
                                </Text>
                              </DataTable.Cell>
                              <DataTable.Cell style={styles.column2}>
                                <Text style={styles.cellText}numberOfLines={5}>{item.locationList}</Text>
                              </DataTable.Cell>
                              <DataTable.Cell style={styles.column4}>
                                <Text style={styles.cellText} numberOfLines={2}>{item.emailId}</Text>
                              </DataTable.Cell>
                              <DataTable.Cell style={styles.column4}>
                                <Text style={styles.cellText} numberOfLines={2}>{item.rte?item.rte.rteName:''}</Text>
                              </DataTable.Cell>
                              <DataTable.Cell style={styles.column5}>
                                <Text style={styles.cellText}>
                                  {item.mobileNumber}
                                </Text>
                              </DataTable.Cell>
                            </DataTable.Row>
                          )))}
            </DataTable>
          </ScrollView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default TeamsScreen;
