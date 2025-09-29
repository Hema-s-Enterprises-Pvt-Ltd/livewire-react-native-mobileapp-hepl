import React from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const CustomStackbarChart = ({ barSpacing, data, lowerTitle, yLabel }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }

  const yAxisMax = Math.max(
    ...data.map(item => 
      item.stacks.reduce((sum, stack) => sum + stack.value, 0)
    )) === 0  ? 10  : Math.max(...data.map(item => 
          item.stacks.reduce((sum, stack) => sum + stack.value, 0))
   );

  const getLabelValue = (value) => {
    if (value >= 10000000) {
      return (value / 10000000).toFixed(2) + ' Cr';
    } else if (value >= 100000) {
      return (value / 100000).toFixed(2) + ' L';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(2) + ' K';
    } else {
      return Math.floor(value, 10).toString().padStart(2, '0');
    }
  };

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

  const numberOfSections = 5;
  const sectionInterval = yAxisMax > 0 ? Math.ceil(yAxisMax / numberOfSections) : 0;

  const yAxisLabels = Array.from({ length: numberOfSections + 1 }, (_, i) => {
    const value = i * sectionInterval;
    return getLabelValue(value);
  });

  const dynamicUnit = getDynamicUnit(); // Get the dynamic unit (K, L, Cr)
  const combinedYLabel = dynamicUnit ? `${yLabel} ${dynamicUnit}` : yLabel; // Combine static yLabel with dynamic unit

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <BarChart
          width={0.8 * Dimensions.get('window').width}
          data={data}
          barWidth={10}
          spacing={50}
          initialSpacing={30}
          roundedTop
          xAxisThickness={1}
          yAxisThickness={0} // Ensure Y-axis line is visible
          xAxisColor={'#EBEAEA'}
          xAxisType={'dashed'}
          barBorderTopLeftRadius={10}
          barBorderTopRightRadius={10}
          stackData={data}
          maxValue={yAxisMax}
          isAnimated
          yAxisColor={'#919EAB'}
          yAxisLabelWidth={40} // Set an appropriate width for Y-axis labels
          barSpacing={barSpacing}
          xAxisLabelTextStyle={{ color: 'grey', fontSize: 8 }}
          yAxisTextStyle={{ color: 'grey', fontSize: 10 }} // Make sure the text color is visible
          dashGap={2}
          rulesColor={'#EBEAEA'}
          showScrollIndicator={true}
          noOfSections={numberOfSections}
          showYAxisLabelTexts={true}
          yAxisLabelTexts={yAxisLabels} // Use the generated Y-axis labels
        />
      </View>
      <View style={styles.lowerTitleContainer}>
        <Text style={styles.lowerTitle}>{lowerTitle}</Text>
      </View>
      <View style={styles.yLabelContainer}>
        <Text style={styles.yLabel}>{combinedYLabel}</Text> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    flex: 1,
  },
  chartContainer: {
    flexDirection: 'row',
  },
  yLabelContainer: {
    position: 'absolute',
    left: -30,
    top: '50%',
    transform: [{ translateY: -10 }, { rotate: '-90deg' }],
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,  },
  yLabel: {
    color: '#919EAB',
    textAlign: 'center',
    width:150
  },
  lowerTitleContainer: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  lowerTitle: {
    textAlign: 'center',
    color: '#919EAB',
    marginRight: '50%',
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

export default CustomStackbarChart;
