import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, Animated,TextInput } from 'react-native';
import { StyleSheet } from 'react-native';
import GlobalStyles from '../../../core/GlobalStyles';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { useForm,Controller  } from "react-hook-form";
import { Path, Svg } from 'react-native-svg';
import Simpleicon from 'react-native-vector-icons/SimpleLineIcons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Images } from '../../../common';
import crashlytics from '@react-native-firebase/crashlytics';
const InviteRender = (props) => {
  const [declineExpanded, setDeclineExpanded] = useState(false); // State for expanding decline section
  const [expandedItemId, setExpandedItemId] = useState(null);
  const date=moment(props.item.demo.scheduleDate).format('MMMM-DD');
  const time=props.item.demo.scheduleTime;
  const DateTime=date+" ("+ moment(time, ['HH:mm']).format('h:mm A') +")";

  const {
    handleSubmit: handleSubmitForm,
    register,
    formState: { errors,isValid },
    control,
    setValue,getValues,
    reset
  } = useForm({
    mode: 'onChange', // Enable validation on change
    defaultValues: {
      reason: '',
    },
  });

  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('InviteRenderScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('InviteRenderScreen unmounted');
    };
  }, []);

  const toggleDeclineExpand = () => {
    reset();
    setDeclineExpanded(!declineExpanded);
  };
  const handleToggleDetail = id => {
    setExpandedItemId(prevId => (prevId === id ? null : id));
    setDeclineExpanded(false)
  };
  // Blinking effect
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  const onSubmit = data => {
    setDeclineExpanded(false)
    reset();
    // Handle form submission
    props.DeclineClicked();

  };
 
  return (
    <View style={styles.flatContainer}>
      <View style={styles.row}>
      {
          props.image?
          <Image
          source={props.image}
          resizeMode="stretch"
          style={styles.image}
        />:
        <Image
          source={Images.Person}
          resizeMode="stretch"
          style={[styles.image,{tintColor:"white"}]}
        />
        }


        <View style={styles.textContainer}>
         
          <View style={{flexDirection:'row',alignItems:'baseline'}}>
          <Text style={styles.header}>{props.item.demo.salesman.firstName+" "+props.item.demo.salesman.lastName}</Text>
         {
          props.item.status==="RESENT"&&(
            <Image
            source={Images.ReinviteStart}
            resizeMode="contain"
            style={{width:15,height:15,resizeMode:'contain',marginLeft:5}}
          />
          )
         }
          </View>
          <Text style={styles.subHeader}>{props.item.demo.services.name},{DateTime}</Text>
        </View>
        <TouchableOpacity style={styles.iconContainer} onPress={()=>handleToggleDetail(props.item.id)}>
        <Image
                source={Images.Maximize}
                resizeMode="contain"
                style={{width:20,height:20,resizeMode:'contain' ,tintColor:expandedItemId === props.item.id ?'#81BE83':GlobalStyles.colorSet.orange}}
              />
        </TouchableOpacity>
      </View>

      {expandedItemId === props.item.id && (
        <View style={{backgroundColor:'white'}}>
          <View style={styles.logoBg}>
          {
             props.demo?.client?.clientImage !=null?
              <Image
              source={{uri: details?.client?.clientImage}}
              resizeMode="contain"
              style={styles.logoImg}
            />
            :
            <Image
            source={Images.ClientImg}
            resizeMode="contain"
            style={styles.logoImg}
          />
             }
          </View>

         
            <View style={{ flexDirection: 'column', margin:10 }}>
              <Text
                style={[
                  styles.subHeader,
                  {
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: 16,
                   
                  },
                ]}
              >
            {props.item.demo.client.clientName}
              </Text>
              <View style={{borderRadius: 5, backgroundColor: 'orange',flexDirection:'row',height:40,alignItems:'center'}}>
                <Animated.View style={{ opacity}}>
                  <MaterialIcons color="black" name="gps-fixed" size={20} style={styles.blinkingImage} />
                </Animated.View>

                <Animated.Text style={[styles.blinkingText, { opacity, },]}>{`${props.item.demoCount} Demos on this day`}</Animated.Text>
              </View>
            </View>
        
          <View style={styles.detailContainer}>
          <View style={styles.detailChildContainer}>
            <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: 2,
                    alignItems: 'center',
                    padding:5
                  }}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20" // Adjusted to match the previous size
                    height="20" // Adjusted to match the previous size
                    viewBox="0 0 24 24"
                    fill="none">
                    <Path
                      d="M13.4 14.6c-.19 0-.38-.07-.53-.22l-1.4-1.4a.75.75 0 0 1-.22-.53V9.66c0-.41.34-.75.75-.75s.75.34.75.75v2.48l1.18 1.18c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22Z"
                      fill="#00AEEF"
                    />
                    <Path
                      d="M12 19.25c-1.59 0-3.09-.5-4.35-1.45-.03-.02-.05-.03-.08-.05A7.243 7.243 0 0 1 4.75 12C4.75 8 8 4.75 12 4.75S19.25 8 19.25 12a7.23 7.23 0 0 1-2.79 5.72c-.03.02-.05.04-.08.06A7.2 7.2 0 0 1 12 19.25Zm-3.57-2.74c.03.02.05.03.07.05 2.03 1.57 5.01 1.56 7.03-.02.02-.02.05-.04.07-.05A5.717 5.717 0 0 0 17.75 12c0-3.17-2.58-5.75-5.75-5.75S6.25 8.83 6.25 12c0 1.77.79 3.41 2.18 4.51Z"
                      fill="#00AEEF"
                    />
                    <Path
                      d="M12.55 22.75h-1.09c-1.96 0-3.16-.97-3.67-2.98l-.5-2.47c-.04-.22.01-.45.16-.62.15-.17.36-.27.58-.27h.01c.17 0 .33.05.46.16 2.03 1.57 5.01 1.56 7.03-.02.31-.24.8-.19 1.05.12.14.17.2.4.16.62l-.51 2.47c-.53 2.02-1.73 2.99-3.68 2.99Zm-3.46-4.11.16.8c.38 1.5 1.16 1.81 2.21 1.81h1.09c1.04 0 1.82-.31 2.21-1.83l.16-.78c-1.81.8-4.01.81-5.83 0ZM16 7.62c-.17 0-.34-.06-.47-.16-2.02-1.58-5-1.59-7.03-.02-.31.24-.8.19-1.04-.11-.14-.17-.2-.4-.16-.62l.49-2.44c.51-2.05 1.71-3.02 3.67-3.02h1.09c1.95 0 3.15.97 3.66 2.96l.52 2.51c.05.22-.01.45-.15.62-.14.18-.35.28-.58.28Zm-4-2.87c1.03 0 2.01.21 2.92.61l-.17-.81c-.39-1.48-1.16-1.8-2.2-1.8h-1.09c-1.05 0-1.83.31-2.21 1.85l-.16.76c.91-.4 1.89-.61 2.91-.61Z"
                      fill="#00AEEF"
                    />
                  </Svg>
                  <Text style={[styles.innerFont, {color: '#00AEEF'}]}>
                   {DateTime}
                  </Text>
                </View>
           
             <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: 2,
                    alignItems: 'center',
                    padding:5
                  }}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none">
                    <Path
                      d="M3 8.2v7.6c0 .7.4 1.4 1 1.7l7 3.9c.6.3 1.3.3 1.9 0l7-3.9c.6-.4 1-1 1-1.7V8.2c0-.7-.4-1.4-1-1.7l-7-3.9c-.6-.3-1.3-.3-1.9 0L4 6.4c-.6.4-1 1.1-1 1.8Z"
                      stroke="#666687"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                  <Text style={[styles.innerFont]}>{props.item.demo.brand.brandName}</Text>
                </View>
            
             <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: 2,
                    alignItems: 'center',
                    padding:5
                  }}>
                  <Simpleicon name="user" size={20} color="#666687" />
                  <Text style={[styles.innerFont]}>
                   Decision Maker - {props.item.demo.client.decisionMakerName}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: 2,
                    alignItems: 'center',
                    padding:5
                  }}>
                  <Icons name="cards-heart-outline" size={20} color="#666687" />
                  <Text style={[styles.innerFont]}>
                    {props.item.demo.services.name}
                  </Text>
                </View>
           
          </View>
        </View>
          {
            !declineExpanded?
            <TouchableOpacity style={styles.declineButton} onPress={toggleDeclineExpand}>
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={{
            borderColor: "#FEF2F3",
            backgroundColor: "#FEF2F3",
            borderWidth: 3,
            padding: 10,
            flexDirection:'row',
            justifyContent:'space-between'
          }} onPress={toggleDeclineExpand}>
            <Text style={styles.declineButtonText}>Decline</Text>
            {isValid && <TouchableOpacity   onPress={handleSubmitForm(onSubmit)} 
              >
          
           <Image
                source={Images.TickSquare}
                resizeMode="contain"
                style={{ width: 20,
                    height: 20,
                    marginRight: 5,
                    tintColor:'#81BE83'
                }}
              />
           </TouchableOpacity>}
           
          </TouchableOpacity>
          }
          {declineExpanded && (
            <View style={{marginLeft:10,marginRight:10,marginBottom:10}}>
              <Controller
            control={control}
            name="reason"
            rules={{ required: 'Reason is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  placeholder="Enter Reason here"
                  onChangeText={(text) => {
                    onChange(text);
                    props.onChangeText(text);
                  }}
                  onBlur={onBlur}
                  value={value}
                  keyboardType="default"
                  ref = {props.Ref}
                  style={[styles.input, errors.reason ? { borderColor: 'red' } : null]}
                />
                {errors.reason && (
                  <Text style={styles.errorText}>
                    {errors.reason.message}
                  </Text>
                )}
          </View>
            )}
          />
            </View>
          )}
        </View>
      )}

      <TouchableOpacity style={[styles.acceptButton, expandedItemId === props.item.id 
    ? { borderColor: "#81BE83", backgroundColor: "#81BE83" }
    : { borderColor: "#F78104", backgroundColor: "#F78104" }, declineExpanded && styles.disableButtonaccept]} disabled={declineExpanded} onPress={props.AcceptClicked}>
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  flatContainer: {
    flexDirection: 'column',
    borderColor: "#E6F2E6",
    backgroundColor: "#E6F2E6",
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    elevation: 3,
    borderWidth: 0.5,
  },
  input:{
    backgroundColor:'#fff',
    borderWidth: 2,
    borderColor:'#EDF1F3',
    borderRadius:5,
    padding:5,
    height:50,
    paddingHorizontal:10,
    marginTop:10
    },
    errorText: {
      color: 'red',
      marginTop: 5,
    },
  detailContainer:{
    backgroundColor:"#faeee2",
    marginTop:10,
    marginBottom:10,
    borderRadius:5,
    marginLeft:10,
    marginRight:10
  },
  detailChildContainer:{
    flexDirection: 'column',
    padding: 5,
  },
  disableButtonaccept:{
    opacity:0.5
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  image: {
    borderWidth: 2,
    borderColor: 'white',
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 50,
    borderWidth: 2,
    marginTop: 10,
    marginLeft: "3%"
  },
  textContainer: {
    width: '65%',
    flexDirection: 'column',
    height: 'auto',
  },
  header: {
    fontSize: RFPercentage(2.0),
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'black',
    marginTop: 15
  },
  subHeader: {
    fontSize: RFPercentage(1.5),
    fontWeight: '500',
    textAlign: 'left',
    color: GlobalStyles.colorSet.Grey,
    marginTop: 5,
    marginVertical: 10
  },
  iconContainer: {
    width: '10%',
    alignItems: 'flex-end',
    //paddingRight: 10,
    justifyContent: 'center',
  },
  acceptButton: {
    marginTop: 'auto', // Pushes the button to the bottom
    borderBottomLeftRadius:5,
    borderBottomRightRadius:5,
    borderWidth: 3,
    paddingHorizontal: 10,
    paddingVertical:20,
    width: '100%',
  },
  acceptButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16
  },
  expandedInfo: {
    backgroundColor: '#00AEEF1A',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#ccc',
    margin:10
  },
  expandedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedImage: {
    borderWidth: 2,
    borderColor: 'white',
    width: 30,
    height: 30,
    marginRight: 5,
    borderRadius: 50,
    borderWidth: 2,
  },
  expandedText: {
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: RFPercentage(2),
    marginLeft: 10,
  },
  logoBg: {
    backgroundColor: "#F2F4F7",
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft:10,
    marginRight:10,
    marginTop:10
  },
  logoImg: {
    width: "100%",
    height: 70,
    resizeMode: 'stretch',
  },
  expandedDetial: {
    backgroundColor: '#dfdfdf',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#ccc',
    marginHorizontal: '10%',
    marginVertical: 10
  },
  expandedImages: {
    width: 15,
    height: 15,
    marginLeft: 10,
  },
  expandedRows: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  blinkingText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#fff',
    alignItems: 'center',
  },
  blinkingImage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
    color: 'white',
    marginRight:10,
  },
  declineButton: {
    borderColor: "#FEF2F3",
    backgroundColor: "#FEF2F3",
    borderWidth: 3,
    padding: 10,
  },

  declineButtonText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16
  },
  innerFont:{
    fontSize: RFValue(12),
    fontWeight: '500',
    textAlign: 'left',
    color:"#666687",
    marginLeft:10
  }

});

export default InviteRender;
