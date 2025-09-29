import {StyleSheet} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import GlobalStyles from '../../core/GlobalStyles';

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  viewContainer: {
    backgroundColor: GlobalStyles.colorSet.app_bg,
   // flexGrow: 1,
  },
  parentContainer:{
   backgroundColor:GlobalStyles.colorSet.white,
   borderRadius:5,
   padding:10,
   marginTop:10
  },
  header: {
    fontSize: RFPercentage(2.0),
    fontWeight: 'bold',
    textAlign: 'left',
    //  marginTop: 10,
    paddingLeft:10,
    color: 'black',
  },
  subHeader: {
    fontSize: RFPercentage(1.5),
    fontWeight: '500',
    textAlign: 'left',
    color: GlobalStyles.colorSet.Grey,
    marginLeft:10
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
    
  },
  Image: {
    borderWidth: 2,
    borderColor: 'white',
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
    width: "100%",
    height: 80,
    resizeMode: 'stretch',
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
  detailChildContainer:{
    flexDirection: 'column',
    gap:15,
    paddingVertical:5,
    
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
  textinput_txt:{
    fontSize: RFValue(14),
    fontWeight: 'semibold',
    textAlign: 'left',
    //  marginTop: 10,
    color: 'black',
  },
  innerFont:{
    fontSize: RFValue(12),
    fontWeight: '500',
    textAlign: 'left',
    color:"#666687",
    marginLeft:10
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
    flexDirection:'row',
    justifyContent:'space-between',
    width:"100%",
    height:50
  },
  additionalTextinput:{
    backgroundColor: 'white',
    borderColor: '#E4E5E73D',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    marginBottom:10,
    padding: 10,
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
  segmentedControl: {
    height: 50,
    width: '80%',
    
  },
  customSegmentLabels: {
    flexDirection: 'row',
    margin: 10,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: GlobalStyles.colorSet.app_bg,
    borderWidth:1,
    borderTopColor:GlobalStyles.colorSet.app_bg,
    borderLeftColor:GlobalStyles.colorSet.app_bg,
    borderRightColor:GlobalStyles.colorSet.app_bg,
  },
  segmentLine:{
    height:1,
    borderWidth:1,
    borderTopColor:GlobalStyles.colorSet.app_bg,
    borderLeftColor:GlobalStyles.colorSet.app_bg,
    borderRightColor:GlobalStyles.colorSet.app_bg,
  },
  segmentText: {
    fontSize: 14,
    fontWeight:"500"
  },


  /////

  timelineContainer: {
    paddingVertical: 20,
   
  },
  timelineItem: {
    flexDirection: 'row',
    marginLeft: 20,
   
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 10,
  },
  timecircle: {
    width: 24,
    height: 24,
    borderRadius: 12,  // This makes it a circle
    borderWidth: 2,    // Border width for the blue outline
    borderColor: GlobalStyles.colorSet.Grey,  // Blue outline color
    backgroundColor: '#fff', // White background for the outer circle
    justifyContent:'center',
    alignItems:'center'
  },

subcircle:{
  width: 12,
  height: 12,
  borderRadius: 6, // This makes it a smaller circle
    backgroundColor: GlobalStyles.colorSet.Grey, // Solid blue inner circle
    zIndex: 2,
},
  timeline: {
    width: 2,
    flex: 1,
    borderColor:GlobalStyles.colorSet.Grey,
    backgroundColor: GlobalStyles.colorSet.Grey,
    marginTop: -2,
  },
  timelineContent: {
    paddingBottom:20,
    paddingHorizontal: 15,
    borderRadius: 10,
    flex: 1,
    flexDirection:'row',
    justifyContent:'space-between',
    
  },
  subtimetext: {
    fontSize: 12,
    color: '#888',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
});
export {styles};
