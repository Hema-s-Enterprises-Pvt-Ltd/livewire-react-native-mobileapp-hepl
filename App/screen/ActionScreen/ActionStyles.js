import {Dimensions, StyleSheet} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import GlobalStyles from '../../core/GlobalStyles';

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  modalView: {
    width: '100%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  //  alignItems: 'center',
  // justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '90%',
  },
  viewContainer: {
    backgroundColor: GlobalStyles.colorSet.app_bg,
    flexGrow: 1,
  },
  parentContainer:{
   backgroundColor:GlobalStyles.colorSet.white,
   borderRadius:5,
   padding:10,
  },
  header: {
    fontSize: RFPercentage(2.0),
    fontWeight: 'bold',
    textAlign: 'left',
    // marginTop: 10,
    paddingLeft:10,
    color: 'black',
  },
  subHeader: {
    fontSize: RFPercentage(1.5),
    fontWeight: '500',
    textAlign: 'left',
    color: GlobalStyles.colorSet.Grey,
    marginTop: 5,
    marginLeft:10
  },
  textinput_txt:{
    fontSize: RFValue(12),
    fontWeight: 'semibold',
    textAlign: 'left',
    //  marginTop: 10,
    color: 'black',
  },
  stepText:{
    fontSize: RFPercentage(1.5),
    fontWeight: '500',
    textAlign: 'center',
    color: GlobalStyles.colorSet.Grey,
  },
  addressText:{
    fontSize: RFValue(12),
    fontWeight: '500',
    textAlign: 'left',
    color: '#666687',
    flexWrap:'wrap'
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
  flatContainer: {
    flexDirection: 'column',
    borderColor: GlobalStyles.colorSet.blue,
    backgroundColor: GlobalStyles.colorSet.blue,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    elevation: 3,
    borderWidth: 2,
    padding: 10,
  },
  logoBg:{
    backgroundColor:"#F2F4F7",
    padding:10,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:5
  },
  logoImg:{
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  locationImage:{
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight:5
  },
  detailContainer:{
    backgroundColor:"#faeee2",
    marginTop:10,
    marginBottom:10,
    borderRadius:5
  },
  mapContainer:{
  },
  detailChildContainer:{
    flexDirection: 'column',
    padding: 5,
  },
  stepIndicator: {
 //   marginVertical: 50,
   paddingHorizontal: 10,
   height:300,
  },
  rowItem: {
    flex: 1,
    paddingVertical: 10,
  },
  title: {
   // flex: 1,
    fontSize: 20,
    color: '#333333',
    //paddingVertical: 16,
    fontWeight: '600',
  },
  radioGroup: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-around', 
    marginTop: 20, 
    borderRadius: 8, 
    padding: 10, 
}, 
radioButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
}, 
radioLabel: { 
    marginLeft: 8, 
    fontSize: 16, 
    color: '#333', 
}, 
selectedStyle: {
  width:"85%",
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10,
  backgroundColor: GlobalStyles.colorSet.light_blue,
  shadowColor: '#000',
  paddingHorizontal: 5,
  paddingVertical: 5,
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
  fontSize: 12,
},
textinput: {
  backgroundColor: 'white',
  borderColor: '#E4E5E73D',
  borderWidth: 1,
  borderRadius: 5,
  marginTop: 10,
  marginBottom:10,
  paddingLeft: 10,
  flexDirection: 'row',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.2,
  shadowRadius: 1.41,
  flexDirection:'row',justifyContent:'space-between',
  width:"100%",
  height:50
},
textinput_txt:{
  fontSize: RFValue(14),
  fontWeight: 'semibold',
  textAlign: 'left',
  //  marginTop: 10,
  color: 'black',
},
textinput: {
  backgroundColor: 'white',
  borderColor: '#E4E5E73D',
  borderWidth: 1,
  borderRadius: 5,
  marginTop: 10,
  marginBottom:10,
  paddingLeft: 10,
  flexDirection: 'row',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.2,
  shadowRadius: 1.41,
  flexDirection:'row',justifyContent:'space-between',
  width:"100%",
  height:50
},
buttonContainer: {
  alignItems: 'center',
  marginLeft: 10,
  marginRight: 10,
},
disabledButtonContainer: {
  opacity: 0.5,
},
button: {
  width: '100%',
  height: 50,
  borderRadius: 5,
  marginLeft: 20,
  marginRight: 20,
  marginBottom: 10,
  marginTop: 10,
  alignItems: 'center',
  justifyContent: 'center',
  borderColor: GlobalStyles.colorSet.orange,
  borderWidth: 1,
  flexDirection:'row'
},
disabledButton: {
  borderColor: 'grey',
},
buttonText: {
  fontSize: 16,
  fontWeight: 'bold',
},
});
export {styles};
