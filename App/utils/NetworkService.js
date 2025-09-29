import NetInfo from "@react-native-community/netinfo";

let isConnected = true; // Initially assume online

const setConnectivityListener = (callback) => {
  NetInfo.addEventListener((state) => {
    const isInternetReachable = state.isInternetReachable;
    const isConnectedNow = state.isConnected;

    // Check if internet is reachable and device is connected
    isConnected = isInternetReachable && isConnectedNow;

    // Invoke the callback with current connectivity status
    callback(isConnected);
  });
};

const isConnectedToInternet = () => {
  return isConnected;
};

export { setConnectivityListener, isConnectedToInternet };