import {Dimensions, StyleSheet} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import GlobalStyles from '../../core/GlobalStyles';

const styles = StyleSheet.create({
  parentContainer: {
    backgroundColor: GlobalStyles.colorSet.app_bg,
    flexGrow: 1,
  },
  container: {
    padding: 10,
    flex:1
  },
  titleText: {
    fontSize: RFValue(12),
    fontWeight: '500',
    marginLeft: 5,
    marginRight: 10,
    color: '#1E293B',
    margin: 5,
  },
  messageText: {
    fontSize: RFValue(10),
    marginLeft: 5,
    marginRight: 10,
    color: '#334155',
    margin: 5,
  },
  timeText: {
    fontSize: RFValue(10),
    marginLeft: 5,
    marginRight: 10,
    color: '#475569',
    margin: 5,
  },
});
export {styles};
