import { Dimensions, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Colors } from '../../common'
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  imageStyle: { 
    width: 'auto', 
    height: 420 
  },
  otpContainer: {
    width: width * 0.8, // 80% of screen width
    flexDirection: 'row', // Align OTP inputs horizontally
    justifyContent: 'space-between', // Space between inputs
  },
  otpTxtStyle: {
    width: width * 0.12, // Each input field is 12% of screen width
    height: 50, // Fixed height
    fontSize: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E4E5E73D', // Border color
    borderBottomColor: '#E4E5E73D', // Border bottom color
    textAlign: 'center', // Center text inside input
  },
  keyboardView: { 
    flexDirection: 'column', 
    flex: 0.2 
  },
  otpView: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    margin: 10 
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'left',
  //  marginTop: 10,
   
    marginRight:10,
    color: Colors.black,
  },
  subHeader: {
    fontSize: RFPercentage(2.0),
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop:10,
    color: Colors.gray,
   
    marginRight:10,
  },
  ResendText:{
    fontSize: 16,
    textAlign:'left',
  },
  textinput_txt: {
    fontSize: 16, 
    color: Colors.black,  
    marginLeft: 10, 
    marginRight:10,
    marginTop:5
  },
  bottom:{
    justifyContent:'flex-end',
    flex:1,
    paddingBottom:10
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.red,
    fontSize: 16,
  },
})
export { styles };