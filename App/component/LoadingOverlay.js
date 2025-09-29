// LoadingOverlay.js
import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const textColor = '#F78104';
const LoadingOverlay = ({ isVisible }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
      <ActivityIndicator color={textColor} size="large" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default LoadingOverlay;
