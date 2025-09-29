import {Dimensions, StyleSheet} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import GlobalStyles from '../../core/GlobalStyles';
import { serviceTypes } from '../../networkClient/apifunction';

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  viewContainer: {
    backgroundColor: GlobalStyles.colorSet.app_bg,
    flexGrow: 1,
  },
  header: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    textAlign: 'left',
    //  marginTop: 10,
    color: 'black',
  },
  textinput_txt:{
    fontSize: RFValue(14),
    fontWeight: 'semibold',
    textAlign: 'left',
    //  marginTop: 10,
    color: 'black',
  },
  subHeader: {
    fontSize: RFValue(12),
    fontWeight: 'semibold',
    textAlign: 'left',
    color: GlobalStyles.colorSet.Grey,
    marginTop: 5,
    // shadowColor: GlobalStyles.colorSet.light_grey,
    // shadowOffset: {
    //   width: 3,
    //   height: 3,
    // },
    // shadowOpacity: 1.0,
  },
  Image: {
    width: '20%',
    height: 'auto',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    borderRadius: 5,
    tintColor: 'white',
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 10, // Add spacing between image and text
  },
  flatContainer: {
    flexDirection: 'column',
    borderColor: GlobalStyles.colorSet.blue,
    backgroundColor: GlobalStyles.colorSet.blue,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    elevation: 3,
    borderWidth: 2,
    padding: 10,
  },
  button: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderColor: GlobalStyles.colorSet.orange,
    borderWidth: 1,
    backgroundColor: GlobalStyles.colorSet.white,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'semibold',
    color: GlobalStyles.colorSet.orange,
  },
  textinput: {
    borderWidth: 1,
    borderColor: GlobalStyles.colorSet.light_grey,
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom:10,
    borderRadius:5,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height:60
   // elevation: 3
},
dropdown: {
  height: 50,
  backgroundColor: 'white',
  borderRadius: 5,
  padding: 12,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.2,
  shadowRadius: 1.41,
//  elevation: 2,
},
placeholderStyle: {
  fontSize: 16,
},
selectedTextStyle: {
  fontSize: 14,
  color:"black"
},
iconStyle: {
  width: 20,
  height: 20,
},
inputSearchStyle: {
  height: 40,
  fontSize: 16,
},
icon: {
  marginRight: 5,
},
item: {
  padding: 17,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
selectedStyle: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 14,
  backgroundColor: GlobalStyles.colorSet.light_blue,
  shadowColor: '#000',
  marginTop: 8,
  marginRight: 12,
  paddingHorizontal: 12,
  paddingVertical: 8,
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.2,
  shadowRadius: 1.41,

  elevation: 2,
},
textSelectedStyle: {
  marginRight: 5,
  fontSize: 16,
},

 serviceItem: {
  backgroundColor: '#d8f9ff',
   borderRadius: 10,
   textAlign:'center',
   padding:2,
   fontSize: 14,
   marginHorizontal:5,
   marginVertical:5,
 },
 serviceText: {
  // color: '#000',
  width:'auto',
  height:'auto',
  margin:5,
 },
 serviceValue:{
  backgroundColor: '#d8f9ff',
   borderRadius: 10,
   textAlign:'center',
   padding:2,
   fontSize: 14,
   marginHorizontal:5,
   marginVertical:5,
   flex:1,
   flexShrink:1,
 },
 serviceType:{
  // color: '#000',
  width:'auto',
  height:'auto',
  margin:5,
 },
 brandList: {
  // flexDirection:'row',
  color: '#000',
  width:'20%',
  height:'auto',
  margin:5,
  flex:1,
  flexShrink:1
 
},
brandName:{
  
  backgroundColor: '#d8f9ff',
   borderRadius: 10,
   textAlign:'center',
   padding:3,
   fontSize: 14,
  //  marginLeft:'10%'
 },
 cityText:{
  marginLeft:5
 },
 stateText:{
  marginLeft:'5%'
 },
 additionalTextinput:{
  marginTop: 10,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.2,
  shadowRadius: 1.41,
  width:"100%",
 // height:50,
  flexDirection: 'row', 
  flexWrap: 'wrap', 
  justifyContent: 'flex-start', 
},

});
export {styles};
