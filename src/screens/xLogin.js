import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import {GenericStyles} from '../styles/Styles';
import {Context as context} from '../../Context';
import Loader from './Loader';

const Login = ({navigation}) => {
  const auth = context();
  const [login, setLogin] = useState({
    "username": "",
    "password": "",
    "hidePassword": true,
  })
  const [isLegend, setLegend] = useState({"username": false,"password": false})
  const passwordInputRef = useRef();

  const onLogin = () => {
    if (!login.username) {
      Alert.alert('Please fill Username');
      return;
    }
    if (!login.password) {
      Alert.alert('Please fill Password');
      return;
    }
    auth.setState((prevState) => ({
      ...prevState,
      'loading': true,
    }))
    auth.saveToken(login)
    .then((data) => {
      if (data && data.status === 'mfa') {
        auth.setState((prevState) => ({
          ...prevState,
          'error': '',
          'success': '',
          'loading': false,
          'secure' : {
            hash: data.hash,
            session: data.session,
            username: login.username,
          },
          'pwd': login.password
        }))
        navigation.navigate('Verification');
      }
      else { 
        auth.setState((prevState) => ({
          ...prevState,
          'error': 'Invalid username or password',
          'success': '',
          'loading': false,
        }))
      }
    })
  };

  const handleInput = (name) => (value) => {
    setLogin((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const setPasswordVisibility = () => {
    setLogin((prevState) => ({
      ...prevState,
      'hidePassword': !login.hidePassword,
    }))
  }

  useEffect(() => {
    const showSubscription  = Keyboard.addListener('keyboardDidShow', () => {
      //setLegend(true)
    });
  
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      //setLegend(false)
    });
  
    return () => {
      hideSubscription.remove();
      showSubscription.remove();
    }
  }, []);

  return (
    <ScrollView style={GenericStyles.container}>
      <Loader loading={auth.state.loading} />
      <View style={styles.logo}>
        <Image source={require("../../assets/splashlogo.png")} />
      </View>
      <View>
      <View style={[isLegend.username ? styles.fieldSet : styles.inputView]}>
        {isLegend.username ? <Text style={styles.legend}>Username</Text> : ''}
          <TextInput
            style={styles.TextInput}
            label="Username"
            placeholder={isLegend.username && !login.username ? "Enter your username": "Username"}
            placeholderTextColor="#888"
            autoCapitalize="none"
            returnKeyType="next"
            onFocus={() => {
              setLegend((prevState) => ({
                ...prevState,
                'username': true,
              }))
            }}
            onBlur={() => {
              setLegend((prevState) => ({
                ...prevState,
                'username': false,
              }))
            }}
            onSubmitEditing={() =>
              passwordInputRef.current &&
              passwordInputRef.current.focus()
            }
            onChangeText={handleInput('username')}
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
          /> 
        </View> 
        <View style={[isLegend.password ? styles.fieldSet : styles.inputView]}>
          {isLegend.password ? <Text style={styles.legend}>Password</Text> : ''}
          <TextInput
            style={styles.TextInput}
            label="Password"
            placeholder="Password"
            ref={passwordInputRef}
            onFocus={() => {
              setLegend((prevState) => ({
                ...prevState,
                'password': true,
              }))
            }}
            onBlur={() => {
              setLegend((prevState) => ({
                ...prevState,
                'password': false,
              }))
            }}
            placeholderTextColor="#888"
            onSubmitEditing={Keyboard.dismiss}
            secureTextEntry={login.hidePassword}
            returnKeyType="next"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
            onChangeText={handleInput('password')}
          /> 
          <TouchableOpacity activeOpacity={0.8} style={styles.touachableButton} onPress={setPasswordVisibility}>
            <Image source={(login.hidePassword) ? require('../../assets/eye.png') : require('../../assets/eye-slash.png')} style={styles.buttonImage} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgot_button}>Forgot Password?</Text> 
        </TouchableOpacity> 
        {auth.state.error &&
          <View style={styles.errorWrapper}>
            <Text style={styles.error}>{auth.state.error}</Text>
          </View>
        }
        <TouchableOpacity
          style={GenericStyles.btnWrapper}
          onPress={onLogin}
          activeOpacity={0.5}
        >
          <Text style={GenericStyles.buttonTextStyle}>Login</Text>
        </TouchableOpacity> 
      </View> 
    </ScrollView> 
  );
}

export default Login;

const styles = StyleSheet.create({
  touachableButton: {
    position: 'absolute',
    top: 16,
    right: 3,
    height: 40,
    width: 35,
    padding: 2,
  },
  buttonImage: {
    resizeMode: 'contain',
    height: '70%',
    width: '70%',
  },
  errorWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "#ff0000",
    fontSize:14,
    marginBottom: 20,
  },
  title:{
    fontWeight: "bold",
    fontSize:60,
    color:"#fb5b5a",
    marginBottom: 40,
  },
  image: {
    marginBottom: 40,
  },
  inputView: {
    marginTop: 20,
    marginBottom:10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#dedede'
  },
  TextInput: {
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    color: "#000",
    backgroundColor: "transparent",
  },
  forgot_button: {
    height: 30,
    marginTop: 15,
    marginBottom: 30,
    color: '#01403C',
  },

  logo:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop:80,
    marginBottom:70,
  },
  fieldSet:{
    marginTop: 20,
    marginBottom:10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#01403c',
    backgroundColor: 'transparent',
    paddingHorizontal: 10,

  },
  legend:{
    position: 'absolute',
    top: -15,
    left: 10,
    padding: 4,
    fontWeight: 'bold',
    backgroundColor: '#efefef',
    color: '#01403c'
  },
});