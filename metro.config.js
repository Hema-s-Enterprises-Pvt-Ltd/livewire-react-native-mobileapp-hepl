const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
// const config = {};
const config = {
    maxWorkers: 2,  // Reduce the number of workers to reduce file watching pressure
  };

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

