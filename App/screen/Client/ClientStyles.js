import { Dimensions, StyleSheet } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import GlobalStyles from "../../core/GlobalStyles";
const size = 40;
const styles = StyleSheet.create(
    {
        Icons: {
            backgroundColor: '#ccf1ff',
            width: size,
            height: size,
            borderRadius: size / 2,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
        
        cardContainer: {
            height:"auto",
            marginBottom: 10,
          },
          card: {
            backgroundColor: 'white',
            borderRadius: 5,
            padding: 15,
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
            fontSize: RFPercentage(2.5),
            fontWeight: 'bold',
            textAlign: 'left',
            color: GlobalStyles.colorSet.dark_blue,
        },
        viewContainer: {
          backgroundColor: GlobalStyles.colorSet.app_bg,
          flexGrow: 1,
        },
        subHeader: {
            fontSize: RFPercentage(2.0),
            fontWeight: '500',
            textAlign: 'center',
            color: GlobalStyles.colorSet.orange,
            fontWeight:'semibold'
            },
        Image:{
            resizeMode: 'contain',
            width: 40,
            height: 40,
            marginRight: 10,
            borderRadius: 50,
            borderColor: GlobalStyles.colorSet.Grey,
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
          detailContainer: {
            backgroundColor: '#F2F4F7',
            marginTop: 10,
            borderRadius: 5,
            marginBottom: 10,
          },
        
          detailChildContainer: {
            flexDirection: 'column',
            padding: 5,
          },
          addressText: {
            fontSize: RFValue(12),
            fontWeight: '500',
            textAlign: 'left',
            color: '#666687',
          },
          segmentedControl: {
            height: 50,
            width: '80%',
            
          },
          customSegmentLabels: {
            flexDirection: 'row',
            marginTop: 10,
            marginBottom:10
          },
          segmentButton: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            borderWidth:1,
            borderColor:GlobalStyles.colorSet.orange,
          },
          segmentText: {
            fontSize: 14,
          },
          textContainer:{
            padding:10,
          },
          separator: {
            height: 1,
            backgroundColor: '#cccccc', // Light gray color
            margin: 8,
          },
    }
)
export { styles };