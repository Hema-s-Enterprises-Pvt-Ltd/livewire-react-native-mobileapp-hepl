import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const CustomBarChart = ({ data, lowerTitle, yLabel }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }

  // Find the maximum value in the dataset
  const yAxisMax = Math.max(...data.map(item => item.value)) === 0 ? 10 : Math.max(...data.map(item => item.value));

  // Method to dynamically determine the unit (K, L, Cr)
  const getDynamicUnit = () => {
    if (yAxisMax >= 10000000) {
      return '(Cr)'; // If values are in crores
    } else if (yAxisMax >= 100000) {
      return '(L)';  // If values are in lakhs
    } else if (yAxisMax >= 1000) {
      return '(K)';  // If values are in thousands
    } else {
      return '';   // No unit for smaller values
    }
  };

  const dynamicUnit = getDynamicUnit(); // Get the dynamic unit (K, L, Cr)

  // Combine static yLabel (e.g., "Amount") with the dynamic unit, including "in" if there's a unit
  const combinedYLabel = dynamicUnit ? `${yLabel} ${dynamicUnit}` : yLabel;

  const getLabelValue = (value) => {
    if (value >= 10000000) {
      return (value / 10000000).toFixed(2) + ' Cr';
    } else if (value >= 100000) {
      return (value / 100000).toFixed(2) + ' L';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(2) + ' K';
    } else {
      return Math.floor(value).toString().padStart(2, '0');
    }
  };

  const numberOfSections = 5;
  const sectionInterval = yAxisMax > 0 ? Math.ceil(yAxisMax / numberOfSections) : 0;
    
  const yAxisLabelTexts = Array.from({ length: numberOfSections + 1 }, (_, i) => {
    const value = i * sectionInterval;
    return getLabelValue(value);
  }).filter(label => label !== ''); // Filter out empty labels for small values

  return (
    <View style={styles.container}>
      {/* Display the combined Y-label (e.g., "Amount in K") */}
      <View style={styles.yLabelContainer}>
        <Text style={styles.yLabel}>{combinedYLabel}</Text>
      </View>

      <View style={styles.chartContainer}>
        <BarChart
          width={0.8 * Dimensions.get('window').width}
          data={data}
          barWidth={10}
          spacing={50}
          initialSpacing={30}
          roundedTop
          xAxisThickness={1}
          yAxisThickness={0}
          xAxisColor={'#EBEAEA'}
          xAxisType={'dashed'}
          noOfSections={numberOfSections}
          maxValue={yAxisMax}
          yAxisLabelWidth={40}
          showYAxisLabelTexts={true}
          yAxisTextStyle={{ color: 'grey', fontSize: 8 }}
          barSpacing={50}
          xAxisLabelTextStyle={{ color: 'grey', fontSize: 10 }}
          yAxisLabelTexts={yAxisLabelTexts}
          isAnimated
          dashGap={2}
          rulesColor={'#EBEAEA'}
          showScrollIndicator={true}
        />
      </View>
      <View style={styles.lowerTitleContainer}>
        <Text style={styles.lowerTitle}>{lowerTitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
  },
  yLabelContainer: {
    position: 'absolute',
    left: -30,
    top: '50%',
    transform: [{ translateY: -10 }, { rotate: '-90deg' }],
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  yLabel: {
    color: '#919EAB',
    textAlign: 'center',
    width:150,
  },
  lowerTitleContainer: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  lowerTitle: {
    textAlign: 'center',
    color: '#919EAB',
    top: 20,
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
  },
  noDataText: {
    textAlign: 'center',
    color: '#919EAB',
  },
});

export default CustomBarChart;
