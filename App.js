import React, { useEffect } from 'react';
import Routes from "./Routes";
import {Provider} from './Context';
import SplashScreen from 'react-native-splash-screen';
import { Platform } from 'react-native';

const App = () => {
  useEffect(()=>{
    if(Platform.OS === 'android')
    SplashScreen.hide();
  },[]);
  return (
    <Provider>
      <Routes />
    </Provider>
  );
};

export default App