import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Legend = ({ selectedSlice }) => {
    return (
        <View style={styles.legendContainer}>
            <View
                style={[
                    styles.colorBox,
                    { backgroundColor: selectedSlice?.svg.fill },
                ]}
            />
            <Text style={styles.legendText}>{selectedSlice?.label} - {selectedSlice?.value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    legendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderColor: '#F8F8F8',
        borderWidth: 2,
        padding: 10,
        width: '40%',
    },
    colorBox: {
        height: 12,
        width: 12,
        borderRadius: 12,
        marginHorizontal: 5,
    },
    legendText: {
        fontSize: 16,
    },
});

export default Legend;
