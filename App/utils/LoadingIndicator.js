import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import GlobalStyles from '../core/GlobalStyles';


const LoadingIndicator = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#F78104" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: GlobalStyles.colorSet.app_bg,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});

export default LoadingIndicator;
