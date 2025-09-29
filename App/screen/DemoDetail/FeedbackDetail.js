import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {styles} from './DemoDetailStyles';
import CustomAppBar from '../../component/CustomAppBar';
import GlobalStyles from '../../core/GlobalStyles';
import PocFeedback from './PocFeedback';
import DecisionMakerFeedback from './DecisionMakerFeedback';
import { getFeedbackDetails } from '../../networkClient/apifunction';
import { Images, Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const FeedbackDetailScreen = props => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [pocDetails,setPocDetails]=useState();
    const [decisionMakerDetails,setDecisionMakerDetails]=useState();
    const {id,auditDetails} = props.route.params;
    const segments = ['POC Feedback', 'Decision Maker Feedback'];
    useEffect(() => {
      // Log that the component has mounted
      crashlytics().log('FeedbackDetailScreen mounted');
      return () => {
        // Log that the component is unmounting
        crashlytics().log('FeedbackDetailScreen unmounted');
      };
    }, []);

  useEffect(()=>{
    getDetails();
  },[])
  const getDetails=async()=>{
    getFeedbackDetails(id)
    .then(function (response) {
      if (response.data.statusCode == 200) {
        setPocDetails(response.data.data.poc)
        setDecisionMakerDetails(response.data.data.decisionMaker)
      } else {
        Alert.alert('Alert', response.data.data.statusMessage);
      }
    })
    .catch(function (error) {
      Alert.alert("Alert", error.data.message);
    });
  }
  return (
    <SafeAreaView style={{backgroundColor:GlobalStyles.colorSet.app_bg,flex:1}}>
        <View style={{height: 10}} />
        <CustomAppBar title={Languages.Feedback_Details} showImage={true} navigation={props.navigation}/>
        <View style={{height: 10}} />
        <View style={{flexDirection:'row',margin:10,backgroundColor:'white',borderRadius:10,padding:20,alignItems:'center'}}>
            <Image source={Images.StarOutline} style={{width:20,height:20}}/>
             <Text style={{color:"#454F5B",marginLeft:5,fontWeight:'500'}}>
                {Languages.Feedback}
             </Text>
        </View>
        <View style={styles.customSegmentLabels}>
        {segments&&
        segments.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedIndex(index)}
            style={[
              styles.segmentButton,
              {
                borderBottomColor: index === selectedIndex ? GlobalStyles.colorSet.orange:GlobalStyles.colorSet.app_bg,
             
              },
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: index === selectedIndex ?  GlobalStyles.colorSet.orange:"#919EAB" }, // Text color based on selection
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{flex:1}}>
        {selectedIndex === 0 && (<PocFeedback details={auditDetails} pocDetails={pocDetails}/>)}
        {selectedIndex === 1 &&(<DecisionMakerFeedback details={auditDetails} decisionMaker={decisionMakerDetails}/>)}
      </View>
    </SafeAreaView>
  );
};
export default FeedbackDetailScreen;
