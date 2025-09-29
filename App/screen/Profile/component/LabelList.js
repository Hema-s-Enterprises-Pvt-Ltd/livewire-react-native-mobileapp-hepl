import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const LabelList = ({ data }) => {
  const renderBrandItem = ({ item }) => (
    <View style={styles.brandItem}>
      <View style={[styles.colorBox, {
        backgroundColor: item.backgroundColor,
        borderColor: item.borderColor,
        borderWidth: item.borderWidth,
      }]} />
      <Text style={styles.brandText}>{item.name}-{item.value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={false}
        data={data}
        renderItem={renderBrandItem}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  brandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    margin: 5,
    borderRadius: 5,
    width:60
  },
  colorBox: {
    height: 12,
    width: 12,
    borderRadius: 6,
    marginHorizontal: 5,
   
  },
  brandText: {
    width:'90%',
    color: '#919EAB',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default LabelList;
