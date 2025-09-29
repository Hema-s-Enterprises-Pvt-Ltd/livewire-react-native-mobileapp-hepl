const size = 40;
import { Dimensions, StatusBar, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import GlobalStyles from "../../core/GlobalStyles";

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            paddingTop: StatusBar.currentHeight,
            backgroundColor: '#FAFAFA',
          },
          headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 15,
          },
          headerText: {
            fontSize: 20,
            marginLeft: 10, // Add spacing between the icon and text
          },
          scrollView: {
            marginHorizontal: 10,
            backgroundColor: '#FAFAFA',
          },
          text: {
            fontSize: 22,
          },
          marginTop: {
            marginTop: 10,
          },
          login: {
            marginTop: 10,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            fontSize: 32,
          },
          innerContainer: {
            marginLeft: 20,
          },
          image: {
            width: 80,
            height: 80,
          },
          header: {
            marginLeft: 30,
          },
          secondContainer: {
            width: '100%',
            height: 60,
            backgroundColor: '#ccf1ff',
          },
          body: {
            padding: 10,
          },
          thirdContainer: {},
        
          button: {
            backgroundColor: '#E6F2E633',
            padding:10,
            borderRadius: 5,
            alignItems: 'center',
            height: "auto",
           // flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
          buttonText: {
            fontSize: 15,
            color: '#F78104',
          },
          cardContainer: {
            height: 80,
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
        
    }
)
export { styles };
