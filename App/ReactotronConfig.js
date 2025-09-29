// ReactotronConfig.js
import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  Reactotron
    .configure({ host: 'localhost' }) // You can specify the host if you're using a custom setup
    .useReactNative() // Enables react-native specific plugins
    .connect(); // Connects to the Reactotron app
}

export default Reactotron;
