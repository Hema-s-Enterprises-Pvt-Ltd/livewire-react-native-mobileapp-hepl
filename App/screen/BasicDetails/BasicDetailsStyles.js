import { StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import GlobalStyles from '../../core/GlobalStyles';

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  
  textinput_txt:{
    fontSize: RFValue(14),
    fontWeight: 'semibold',
    textAlign: 'left',
    color: 'black',
  },
  subHeader: {
    fontSize: RFValue(12),
    fontWeight: 'semibold',
    textAlign: 'left',
    color: GlobalStyles.colorSet.Grey,
    marginTop: 5,
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
 
dropdown: {
  //height: 50,
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
  marginTop:10,
  borderWidth: 2,
  borderColor:'#EDF1F3',
//  elevation: 2,
},
placeholderStyle: {
  fontSize: 16,
},
selectedTextStyle: {
  fontSize: 14,
  color:"black",
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
  fontSize: 14,
},
textinput_txt:{
  fontSize: RFValue(14),
  fontWeight: 'semibold',
  textAlign: 'left',
  color: 'black',
},
textinput: {
  backgroundColor: 'white',
  borderColor: '#EDF1F3',
  borderWidth: 2,
  borderRadius: 5,
  marginTop: 10,
  marginBottom:20,
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
headerText: {
  fontSize: 18,
  fontWeight: 'bold',
},
errorText: {
  color: 'red',
  marginBottom: 16,
},
Subheader_black: {
  fontSize: RFValue(12),
  fontWeight: 'bold',
  textAlign: 'left',
  //  marginTop: 10,
  color: 'black',
},
focusedInput: {
  borderColor: GlobalStyles.colorSet.orange, // Use a primary color or any color for focused state
},
errorInput:{
  borderColor:'red'
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
