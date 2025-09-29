import React from 'react';
import { StyleSheet, View,Text } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import PropTypes from 'prop-types';
import GlobalStyles from '../core/GlobalStyles';

const CustomButton = ({ text, onPress, disabled, loading }) => {
  const buttonColor = text === 'Cancel' ? GlobalStyles.colorSet.cancel_button_grey : GlobalStyles.colorSet.orange;
  const textColor = text === 'Cancel' ? GlobalStyles.colorSet.orange : 'white';
  return (
    <Button
      mode="contained"
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button,{backgroundColor:buttonColor,borderColor:GlobalStyles.colorSet.orange,borderWidth:1}, (disabled || loading) && styles.disabledButton]}
      contentStyle={styles.buttonContent}
      
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.buttonText, { color: textColor }]}>
          {text}
        </Text>
      )}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonContent: {
    height: 50,
    justifyContent: 'center', // Center the content (text or spinner)
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// CustomButton.propTypes = {
//   text: PropTypes.string,
//   onPress: PropTypes.func,
//   disabled: PropTypes.bool,
//   loading: PropTypes.bool,
// };

export default CustomButton;
