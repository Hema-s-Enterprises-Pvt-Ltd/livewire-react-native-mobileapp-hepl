import { Dimensions, StyleSheet } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import GlobalStyles from "../../core/GlobalStyles";
import { Colors } from '../../common'
const size = 40;

const styles = StyleSheet.create(
    {
      itemView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 6,
        alignItems: 'center',
      },
      itemImage: {
        width: 15, 
        height: 15
      },
      itemDemoView: {
        flexDirection: 'row', 
        gap: 6
      },
      itemDemoIdTxt: {
        color: Colors.amtColor, 
        fontSize: 12, 
        fontWeight: '700'
      },
      itemDemoDatetxt: {
        color: Colors.demoTxtColor,
        fontSize: 10,
        fontWeight: '500',
        backgroundColor: Colors.demoBackground,
        borderRadius: 20,
        padding: 5,
      },
      demoProductName: {
        fontSize: 10,
        fontWeight: '500',
        color: Colors.demoTxtColor,
        marginTop: 5,
      },
      itemDetailsView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.demoBackground,
        padding: 10,
        borderRadius: 5,
      },
      itemQtyTxt: {
        color: Colors.amtColor, 
        fontSize: 16, 
        fontWeight: '500'
      },
      itemAmtTxt: {
        color: Colors.amtColor, 
        fontSize: 16, 
        fontWeight: '500'
      },
      logoImage: {
        width: 150,
        height: 40,
        resizeMode: 'contain',
      },
      notificationView: { 
        flex: 0.2, 
        alignItems: 'flex-end', 
        justifyContent: 'center' 
      },
      notificationIconView: {
        resizeMode: 'contain',
        width: 24,
        height: 24,
      },

      noDataTxt: {
        fontSize: RFValue(14),
        fontWeight: '500',
        marginLeft: 5,
        marginRight: 10,
        color: Colors.gray,
        alignSelf: 'center',
        margin: 5,
        textDecorationLine: 'underline',
        textDecorationColor: Colors.gray,
      },
        cardContainer: {
            height: "auto",
            paddingLeft: 10,
            paddingRight: 10,
            marginBottom: 10,
          },
          Icons: {
            backgroundColor: '#ccf1ff',
            width: size,
            height: size,
            borderRadius: size / 2,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
        
          card: {
            backgroundColor: 'white',
            borderRadius: 5,
            padding: 10,
            width: '100%',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        container:{
            padding: 10, 
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
            marginTop:5
        },
        Image:{
            width:"20%",
            height:'auto',
            marginLeft:5,
            marginRight:5,
            marginTop:5,
            borderRadius:5,
            tintColor:"white"
          },
          flatContainer:{
            flexDirection: 'column',
            borderColor:GlobalStyles.colorSet.blue ,
            backgroundColor:GlobalStyles.colorSet.blue ,
            borderRadius: 5,
            marginTop: 5,
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 5,
            elevation: 3,
            borderWidth: 2,
            padding:10
        }
    }
)
export { styles };