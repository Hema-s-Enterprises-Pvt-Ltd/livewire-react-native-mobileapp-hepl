import { StyleSheet } from "react-native";
import GlobalStyles from "../../core/GlobalStyles";
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
const styles = StyleSheet.create(
    {
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
      disabled:{
        opacity:0.5,
        
      },
      enabled:{
        opacity:1,
      },
      button:{
        width:'100%',
        height:50,
        backgroundColor:GlobalStyles.colorSet.orange,
        borderRadius:5,
        marginLeft:20,
        marginRight:20,
        marginBottom:10,
        marginTop:10,
        alignItems:'center',
        justifyContent:'center'
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
    Buttonattachment:{
      position:'absolute',
      right:10,
      bottom:25,
    },
    buttonText:{
       fontSize:16,
       fontWeight:'bold',
       color:'white' 
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
       // borderColor: GlobalStyles.colorSet.blue,
        backgroundColor: GlobalStyles.colorSet.blue,
        borderRadius: 5,
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        elevation: 3,
        //borderWidth: 2,
      },
        container:{
            padding: 10, 
        },
        header: {
            fontSize: RFPercentage(2.5),
            fontWeight: 'bold',
            textAlign: 'left',
            color: GlobalStyles.colorSet.dark_blue,
        },
        subHeader: {
            fontSize: RFPercentage(2.0),
            fontWeight: '500',
            textAlign: 'center',
            color: GlobalStyles.colorSet.orange,
            fontWeight:'semibold'
            },
        Image:{
            width: 40,
            height: 40,
            marginRight: 10,
            borderRadius: 50,
            borderColor: "white",
            borderWidth: 2,
          },
          box_style:{
            flex: 0.3,
            padding:5,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            borderRadius:5,
            borderWidth:2,
            borderColor:GlobalStyles.colorSet.light_orange,
            backgroundColor:GlobalStyles.colorSet.light_orange
          },
          parentContainer:{
            backgroundColor:GlobalStyles.colorSet.white,
            borderRadius:5,
            //padding:10
           },
           viewContainer: {
            backgroundColor: GlobalStyles.colorSet.app_bg,
            flexGrow: 1,
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
          dropdown: {
            marginTop: 10,
            marginBottom:10,
            height: 50,
            backgroundColor: 'white',
            borderColor: '#E4E5E73D',
            borderWidth: 1,
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
            color: 'black',
          },
          headerText: {
            fontSize: 18,
            fontWeight: 'bold',
          },
          legend: {
            padding: 20,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          },
          legendText: {
            fontSize: RFValue(12),
            color: '#637381',
            margin: 5,
          },
          lengendView: {flexDirection: 'row', alignItems: 'baseline'},
          eclipseView: {
            backgroundColor: 'white',
            borderColor: GlobalStyles.colorSet.blue,
            borderWidth: 1,
            width: 10,
            height: 10,
            borderRadius: 10,
          },
          pendingflatContainer: {
            flexDirection: 'column',
           // borderColor: GlobalStyles.colorSet.blue,
            backgroundColor: "#FDB022",
            borderRadius: 5,
            marginTop: 5,
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 5,
            elevation: 3,
            //borderWidth: 2,
          },
    }
)
export { styles };