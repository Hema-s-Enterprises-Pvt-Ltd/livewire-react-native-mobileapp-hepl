import {Dimensions, StyleSheet} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import GlobalStyles from '../../core/GlobalStyles';
import { Colors } from '../../common'

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },

  box_style: {
    flex: 0.3,
    padding: 5,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: GlobalStyles.colorSet.light_orange,
    backgroundColor: GlobalStyles.colorSet.light_orange,
  },
  borderLine: {
    borderBottomWidth: 1,
    borderColor: GlobalStyles.colorSet.light_grey,
    marginTop: 10,
  },
  viewContainer: {
    backgroundColor: GlobalStyles.colorSet.app_bg,
    flexGrow: 1,
  },
  flatContainer: {
    flexDirection: 'column',
   // borderColor: GlobalStyles.colorSet.blue,
    backgroundColor: GlobalStyles.colorSet.blue,
    borderRadius: 5,
    marginTop: 5,
    // marginLeft: 10,
    // marginRight: 10,
    marginBottom: 5,
    elevation: 3,
   // borderWidth: 2,
  },
  declineContainer:{
    flexDirection: 'column',
  //  borderColor: GlobalStyles.colorSet.decline_color,
    backgroundColor: GlobalStyles.colorSet.decline_color,
    borderRadius: 5,
    marginTop: 5,
    // marginLeft: 10,
    // marginRight: 10,
    marginBottom: 5,
    elevation: 3,
  //  borderWidth: 2,
  },
  Image: {
    borderWidth: 2,
    borderColor: 'white',
    resizeMode: 'contain',
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 50,
    borderWidth: 2,
  },
    header: {
    fontSize: RFPercentage(2.0),
    fontWeight: 'bold',
    textAlign: 'left',
    //  marginTop: 10,
    color: 'black',
  },
  subHeader: {
    fontSize: RFPercentage(1.5),
    fontWeight: '500',
    textAlign: 'left',
    color: GlobalStyles.colorSet.Grey,
    marginTop: 5,
  },
  radioButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft:5
}, 
radioLabel: { 
    marginLeft: 8, 
    fontSize: 16, 
    color: '#333', 
}, 
radioGroup: { 
  flexDirection: 'row', 
  alignItems: 'center', 
  //justifyContent: 'space-around', 
  marginTop: 20, 
  borderRadius: 8, 
  padding: 5, 
}, 
demoComplete: {
  flexDirection: 'column',
 // borderColor: GlobalStyles.colorSet.blue,
  backgroundColor: GlobalStyles.colorSet.demo_complete_green,
  borderRadius: 5,
  marginTop: 5,
  // marginLeft: 10,
  // marginRight: 10,
  marginBottom: 5,
  elevation: 3,
 // borderWidth: 2,
},
otherDemo: {
  flexDirection: 'column',
 // borderColor: GlobalStyles.colorSet.blue,
  backgroundColor: GlobalStyles.colorSet.blue,
  borderRadius: 5,
  marginTop: 5,
  // marginLeft: 10,
  // marginRight: 10,
  marginBottom: 5,
  elevation: 3,
 // borderWidth: 2,
},
subfont: {
  fontSize: RFPercentage(1.1),
  fontWeight: '500',
  textAlign: 'left',
  color: GlobalStyles.colorSet.Grey,
  marginTop: 5,
  cursor:'pointer'
},
pointer: {
  cursor: 'pointer',
},
declineTxt: {
  fontSize: RFPercentage(1.3),
  fontWeight: '500',
  textAlign: 'left',
  color: Colors.white,
  marginTop: 5,
},



modalContent: {
  padding:10,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  borderRadius:10 
},
title: {
  fontWeight: '500',
  fontSize: RFValue(14),
  textAlign: 'center',
  color: '#000',
  marginBottom:' 10%',
  marginTop:10
},
buttonContainer: {
  flexDirection: 'row',
  justifyContent:'space-between',
  width:"100%"
},
cancelButton: {
  width:"45%"
  // marginLeft: '20%',
  // marginStart:'50%'
},
cancelButtonText: {
  color: '#F78104',
  fontSize: 18,
  padding: 10,
  fontWeight: 'bold',
  marginLeft:'40%',
  marginRight:'auto',
  textAlign:'center',
  fontSize: RFValue(16)
},
logoutButton: {
  backgroundColor: '#F78104',
  borderRadius: 5,
  padding: 10,
  marginLeft: 10,
  width:"45%"
},
logoutButtonText: {
  color: '#FFFFFF',
  textAlign:'center',
  fontSize:RFValue(16),
  marginLeft:10
},
});
export {styles};
