import {Dimensions, StyleSheet} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import GlobalStyles from '../../core/GlobalStyles';

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: RFPercentage(2.0),
    fontWeight: 'bold',
    textAlign: 'left',
    marginStart: 3,
    color: 'black',
  },
  fab: {
    //  position: 'absolute',
    //   marginBottom:10,
    //   right: 0,
    //   bottom: 0,
    //   borderRadius:50,
    //   marginRight: 10,
    //   backgroundColor:GlobalStyles.colorSet.orange,
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //   height: 50,
    //   width: 50
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: GlobalStyles.colorSet.orange, // Or use GlobalStyles.colorSet.orange
    elevation: 3,
    zIndex: 999,
  },
});

export {styles};
