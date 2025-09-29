import * as React from 'react';
import { Searchbar } from 'react-native-paper';
import { StyleSheet } from "react-native";
import GlobalStyles from "../core/GlobalStyles";
const CustomSearchInput = React.forwardRef(({
  placeholder = "Search", // Default value
  value,
  onChangeText,
  elevation = 1,
  style // Custom style
}, ref) => {
  return (
    <Searchbar
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      mode="bar"
      icon="magnify"
      iconColor="grey"
      rippleColor="lightgrey"
      style={styles.textinput} // Apply custom style
      ref={ref} // Forward the ref
      inputStyle={styles.input}
      elevation={elevation} // Set the elevation
       keyboardType="default"
    />
  );
});
const styles = StyleSheet.create(
    {
        textinput: {
            borderWidth: 1,
            borderColor: 'white',
            backgroundColor: 'white',
            marginTop: 10,
            marginBottom:10,
            borderRadius: 10,
        },
        input: {
        
            color: '#ff6347', // Change text color
        fontSize: 16, color: GlobalStyles.colorSet.Grey,
          },
       
    }
)

export default CustomSearchInput;
