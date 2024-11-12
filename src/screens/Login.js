import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  Alert,
} from 'react-native';
import TextField from './TextField'
import {GenericStyles} from '../styles/Styles';
import {Context as context} from '../../Context';
import Loader from './Loader';

export default function Login({navigation}) {
  const auth = context();
  const [login, setLogin] = useState({
    username: '',
    password: '',
    hidePassword: true,
  });
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
    auth.setState(prevState => ({
      ...prevState,
      loading: true,
    }));
    auth.saveToken(login).then(data => {
      if (data && data.status === 'mfa') {
        auth.setState(prevState => ({
          ...prevState,
          error: '',
          success: '',
          loading: false,
          secure: {
            hash: data.hash,
            session: data.session,
            username: login.username,
          },
          pwd: login.password,
        }));
        navigation.navigate('Verification');
      } else {
        auth.setState(prevState => ({
          ...prevState,
          error: 'Invalid username or password',
          success: '',
          loading: false,
        }));
      }
    });
  };

  const handleInput = name => value => {
    setLogin(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const setPasswordVisibility = () => {
    setLogin(prevState => ({
      ...prevState,
      hidePassword: !login.hidePassword,
    }));
  };

  const submitEditing = () => {
    return passwordInputRef.current && passwordInputRef.current.focus()
  }

  return (
      <KeyboardAvoidingView>
        <ScrollView style={GenericStyles.container} keyboardShouldPersistTaps='always'>
          <Loader loading={auth.state.loading} />
          <View style={styles.logo}>
            <Image source={require('../../assets/splashlogo.png')} />
          </View>
          <View>
            <View style={styles.inputView}>
              <TextField
                value={login.username}
                label="Username"
                placeholder="Enter your username"
                returnKeyType="next"
                onSubmitEditing={submitEditing}
                autoCapitalize="none"
                blurOnSubmit={false}
                onChangeText={handleInput('username')}
              />
            </View>
            <View style={styles.inputView}>
              <TextField
                value={login.password}
                label="Password"
                placeholder="Enter your password"
                innerRef={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType="next"
                blurOnSubmit={false}
                secureTextEntry={login.hidePassword}
                onChangeText={handleInput('password')}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.touachableButton}
                onPress={setPasswordVisibility}>
                <Image
                  source={
                    login.hidePassword
                      ? require('../../assets/eye.png')
                      : require('../../assets/eye-slash.png')
                  }
                  style={styles.buttonImage}
                />
              </TouchableOpacity>
            </View>
            {auth.state.error && (
              <View style={styles.errorWrapper}>
                <Text style={styles.error}>{auth.state.error}</Text>
              </View>
            )}
            <View style={styles.pad30}>
              <TouchableOpacity
                style={GenericStyles.btnWrapper}
                onPress={onLogin}
                activeOpacity={0.5}>
                <Text style={GenericStyles.buttonTextStyle}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  touachableButton: {
    position: 'absolute',
    top: 10,
    right: 3,
    height: 40,
    width: 35,
    padding: 2,
  },
  pad30: {
    paddingTop: 30
  },
  buttonImage: {
    resizeMode: 'contain',
    height: '70%',
    width: '70%',
  },
  errorWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#ff0000',
    fontSize: 14,
    marginBottom: 20,
  },
  inputView: {
    marginTop: 20,
    marginBottom: 5,
  },
  logo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70,
    marginBottom: 70,
  },
});