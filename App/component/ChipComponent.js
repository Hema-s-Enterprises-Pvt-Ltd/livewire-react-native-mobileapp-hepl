import React, { useState } from 'react';
import { Chip } from 'react-native-paper';

const ChipComponent = ({ label,selected, selectedColor = '#F78104', unselectedColor = '#fff', onPress ,style = {}, contentStyle = {}, textStyle = {}  }) => {
  
  const handlePress = () => {
   
    if (onPress) {
        onPress(label,!selected); // Call the parent's callback function with the label
      }
  };

  return (
    <Chip
      showSelectedCheck= {false}
      mode='flat'
      selected={selected}
      onPress={handlePress}
      compact={true}
      style={{ backgroundColor: selected ? selectedColor : unselectedColor ,marginHorizontal:3,
        borderColor: !selected ? '#e6e6e6' : selectedColor, // Set borderColor when not selected
        borderWidth: 1, // Set border width to ensure the color shows
        borderRadius:15,
        ...style // Merge with custom style
      }}
      contentStyle={{
        paddingHorizontal: 0, // Adjust horizontal padding
        ...contentStyle // Merge with custom contentStyle
      }}
      textStyle={{
        color: selected ? '#fff' : '#939393', // Change text color based on selection
        ...textStyle // Merge with custom textStyle
      }}
    >
      {label}
    </Chip>
  );
};

export default ChipComponent;
