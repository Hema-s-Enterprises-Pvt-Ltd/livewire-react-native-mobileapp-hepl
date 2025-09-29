import React, { PureComponent } from 'react';
import { View, Platform, Text, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import PropTypes from 'prop-types';
import * as shape from 'd3-shape';

class PieChart extends PureComponent {
  state = {
    height: 0,
    width: 0,
    selectedSlice: null,
    legendPosition: { x: 0, y: 0 },
    hideLegendTimeout: null, // State to track timeout
  };

  _onLayout(event) {
    const { height, width } = event.nativeEvent.layout;
    this.setState({ height, width });
  }

  _calculateRadius(arg, max, defaultVal) {
    if (typeof arg === 'string') {
      return (arg.split('%')[0] / 100) * max;
    } else if (arg) {
      return arg;
    } else {
      return defaultVal;
    }
  }

  _onSlicePress(slice, centroid) {
    const { onSlicePress } = this.props;

    // Clear previous timeout if any
    if (this.state.hideLegendTimeout) {
      clearTimeout(this.state.hideLegendTimeout);
    }

    // Toggle slice selection on click
    if (this.state.selectedSlice === slice) {
      this.setState({ selectedSlice: null });
    } else {
      this.setState({ selectedSlice: slice, legendPosition: centroid });
      
      // Set a timeout to hide the legend after 3 seconds
      const timeout = setTimeout(() => {
        this.setState({ selectedSlice: null });
      }, 3000); // Hide the legend after 3 seconds
      this.setState({ hideLegendTimeout: timeout });
    }

    if (onSlicePress) {
      onSlicePress(slice);
    }
  }

  _onChartPress() {
    // Reset the selected slice and clear the timeout when clicking outside
    if (this.state.hideLegendTimeout) {
      clearTimeout(this.state.hideLegendTimeout);
    }
    this.setState({ selectedSlice: null });
  }

  render() {
    const {
      data,
      innerRadius,
      outerRadius,
      labelRadius,
      padAngle,
      animate,
      animationDuration,
      style,
      sort,
      valueAccessor,
      children,
      startAngle,
      endAngle,
      centerValue
    } = this.props;

    const { height, width, selectedSlice, legendPosition } = this.state;

    if (data.length === 0) {
      return <View style={style} />;
    }

    const maxRadius = Math.min(width, height) / 2;
    const _outerRadius = this._calculateRadius(outerRadius, maxRadius, maxRadius);
    const _innerRadius = this._calculateRadius(innerRadius, maxRadius, 0);
    const _labelRadius = this._calculateRadius(labelRadius, maxRadius, _outerRadius);

    if (outerRadius > 0 && _innerRadius >= outerRadius) {
      console.warn('innerRadius is equal to or greater than outerRadius');
    }

    const arcs = data.map((item) => {
      const arc = shape
        .arc()
        .outerRadius(_outerRadius)
        .innerRadius(_innerRadius)
        .padAngle(padAngle);

      if (item.arc) {
        Object.entries(item.arc).forEach(([key, value]) => {
          if (typeof arc[key] === 'function') {
            if (typeof value === 'string') {
              arc[key]((value.split('%')[0] / 100) * _outerRadius);
            } else {
              arc[key](value);
            }
          }
        });
      }

      return arc;
    });

    const pieSlices = shape
      .pie()
      .value((d) => valueAccessor({ item: d }))
      .sort(sort)
      .startAngle(startAngle)
      .endAngle(endAngle)(data);

    const slices = pieSlices.map((slice, index) => ({
      ...slice,
      pieCentroid: arcs[index].centroid(slice),
    }));

    const extraProps = { width, height, data, slices };

    return (
      <TouchableWithoutFeedback onPress={() => this._onChartPress()}>
        <View pointerEvents="box-none" style={style}>
          <View style={{ flex: 1 }} onLayout={(event) => this._onLayout(event)}>
            {height > 0 && width > 0 && (
              <Svg pointerEvents={Platform.OS === 'android' ? 'box-none' : 'none'} style={{ height, width }}>
                <G x={width / 2} y={height / 2}>
                  {pieSlices.map((slice, index) => {
                    const { key, svg } = data[index];
                    const centroid = arcs[index].centroid(slice);

                    return (
                      <Path
                        key={key}
                        onPress={() => this._onSlicePress(data[index], centroid)}
                        {...svg}
                        d={arcs[index](slice)}
                        animate={animate}
                        animationDuration={animationDuration}
                      />
                    );
                  })}

                  <SvgText x="0" y="0" textAnchor="middle" fontSize="20" fill="black">
                    {centerValue}
                  </SvgText>
                </G>
              </Svg>
            )}

            {selectedSlice && (
              <Animated.View
                style={[
                  styles.legendContainer,
                  {
                    transform: [
                      { translateX: legendPosition[0] },
                      { translateY: legendPosition[1] },
                    ],
                    position: 'absolute',
                    left: width / 2,
                    top: height / 2,
                  },
                ]}
              >
                <View
                  style={[
                    styles.colorBox,
                    { backgroundColor: selectedSlice?.svg.fill },
                  ]}
                />
                <Text style={styles.legendText}>
                  {selectedSlice?.label} - {selectedSlice?.value}
                </Text>
              </Animated.View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  legendContainer: {
    backgroundColor: 'white',
    padding: 5,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    flexWrap: 'wrap', 
    maxWidth: '80%', 
  },
  colorBox: {
    height: 12,
    width: 10,
    borderRadius: 12,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
  },
});

PieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      svg: PropTypes.object,
      key: PropTypes.any.isRequired,
      value: PropTypes.number,
      arc: PropTypes.object,
    })
  ).isRequired,
  innerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  outerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  labelRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  padAngle: PropTypes.number,
  animate: PropTypes.bool,
  animationDuration: PropTypes.number,
  style: PropTypes.any,
  sort: PropTypes.func,
  valueAccessor: PropTypes.func,
  onSlicePress: PropTypes.func,
};

PieChart.defaultProps = {
  width: 100,
  height: 100,
  padAngle: 0.05,
  startAngle: 0,
  endAngle: Math.PI * 2,
  valueAccessor: ({ item }) => item.value,
  innerRadius: '50%',
  sort: (a, b) => b.value - a.value,
};

export default PieChart;
