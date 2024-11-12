import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StatusBar,
  TextInput,
  Animated,
} from 'react-native';

let animatedIsFocused = ''

const FloatingLabelInput = ({value, label, onChangeText}) => {
  const [isFocused, setState] = useState('');
  console.log('c', value)
  //let animatedIsFocused = new Animated.Value(value === '' ? 0 : 1);
  const animatedIsFocused = useRef(new Animated.Value(0)).current


  // useMemo(() => {
  //   animatedIsFocused = new Animated.Value(value === '' ? 0 : 1);
  // },[]);

  handleFocus = () => setState(true);
  handleBlur = () => setState(false);

  useEffect(() => {
    console.log('f', isFocused, value)
    Animated.timing(animatedIsFocused, {
      toValue: (isFocused || value !== '') ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, isFocused])

    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 14],
      }),
      color: animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#aaa', '#000'],
      }),
    };
    return (
      <View style={{ paddingTop: 18 }}>
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
        <TextInput
          label={label}
          onChangeText={onChangeText}
          value={value}
          style={{ height: 46, fontSize: 20, color: '#000', borderBottomWidth: 1, borderBottomColor: '#555' }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          blurOnSubmit
        />
      </View>
    );
}

const App = () => {
  const [value, setState] = useState({email: '', password: ''});

  const handleInput = (name) => (value) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

    return (
      <View style={{ flex: 1, padding: 30, backgroundColor: '#f5fcff' }}>
        <FloatingLabelInput
          label="Email"
          value={value.email}
          onChangeText={handleInput('email')}
        />
        <FloatingLabelInput
          label="Password"
          value={value.password}
          onChangeText={handleInput('password')}
        />
      </View>
    );
}

export default App
