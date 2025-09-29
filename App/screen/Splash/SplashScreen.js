import React from 'react';
import {View, Image} from 'react-native';
import GlobalStyles from '../../core/GlobalStyles';
import { Images } from '../../common';

const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: GlobalStyles.colorSet.white,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={Images.RaagaNewLogo}
        resizeMode="contain"
        style={{
          height: 60,
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          borderRadius: 5,
        }}
      />
    </View>
  );
};
export default SplashScreen;
