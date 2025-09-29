import { Dimensions, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
// import GlobalStyles from "../../../core/GlobalStyles";
import { RFValue } from "react-native-responsive-fontsize";


const styles = StyleSheet.create(
    {
      
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        headerText: {
            fontSize: 16,
            color: '#000',
            marginLeft: 10,
            marginTop: 5,
            fontWeight: 'bold',
        },
        chartContainer: {
            flex: 1,
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
        },
        pieChart: {
            height: 200,
            width: '100%',
        },
        centerText: {
            position: 'absolute',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'center',
        },
        legendWrapper: {
            paddingHorizontal: 15,
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        legendColor: {
            height: 12,
            width: 12,
            borderRadius: 6,
            marginRight: 8,
        },
        legendText: {
            color: '#919EAB',
            fontSize: 16,
        },
        title: {
            fontSize: 24,
            marginBottom: 16,
          },
          selectedText: {
            marginTop: 16,
            fontSize: 18,
          },
          dropdownStyle: {
            width: '80%',
          },
          dropDownStyle: {
            backgroundColor: '#ffffff',
          },
          item: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 8,
            padding: 10,
          },
          colorBox: {
            width: 20,
            height: 20,
            marginRight: 10,
          },
          label: {
            fontSize: 16,
          },
    });

 export { styles };