import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown'; // Adjust the import based on your dropdown component's location
import { RFValue } from 'react-native-responsive-fontsize';
import GlobalStyles from '../../../core/GlobalStyles';

const ReportDropDown = ({ name, control, placeholder, data, title, rules, valueFields, labelFields, onValueChange }) => {
  const [isFocus, setIsFocus] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
        <View style={styles.container}>
          {/* <Text style={[styles.header, { fontSize: 14, marginTop: 10 }]}>{title}</Text> */}
          <Dropdown
            style={[
              styles.dropdown,
              isFocus && { borderColor: GlobalStyles.colorSet.orange },
              error && { borderColor: 'red' }
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField={labelFields}
            valueField={valueFields}
            placeholder={!isFocus ? placeholder : '...'}
           // searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => {
              setIsFocus(false);
              onBlur();
            }}
            onChange={item => {
              const selectedValue = item[valueFields];
              onChange(selectedValue);
              onValueChange && onValueChange(item); // Call the parent's callback
              setIsFocus(false);
            }}
            renderCustomizedRowChild={(selectedItem) => (
              <View style={styles.row}>
                <Text style={styles.selectedTextStyle}>
                  {data.find(item => item[valueFields] === value)?.[labelFields] || placeholder}
                </Text>
                <Text style={styles.iconText}>▼</Text>
              </View>
            )}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colorSet.app_bg,
    flexGrow: 1,
  },
  header: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'black',
  },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    marginTop:10,
    borderWidth: 0,
    borderColor:'#EDF1F3',
  //  elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // placeholderStyle: {
  //   fontSize: 14,
  //   bottom:30,
    
  // },
  selectedTextStyle: {
    fontSize: 14,
    color: 'black',
    fontWeight:'bold',
  },
  // iconStyle: {
  //   width: 20,
  //   height: 20,
  //   bottom:30,
  //   marginHorizontal:5,
   
  // },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    marginHorizontal:10
  },
  iconText: {
    fontSize: 16,
    color: 'gray',
  
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  
  },
});

export default ReportDropDown;
