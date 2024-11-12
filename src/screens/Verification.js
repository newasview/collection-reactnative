import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {Context as context} from '../../Context';
import Loader from './Loader';
import {GenericStyles} from '../styles/Styles';

/**
 * Fuctional component variables
 */
const Verification = ({navigation, onVerification}) => {
  const auth = context();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  // in secs, if value is greater than 0 then button will be disabled
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(0);
  const inputs = [];
  let resendOtpTimerInterval;
  const onConfirm = () => {
    let params = {};
    params = {...auth.state.secure, code: otp.toString().split(',').join('')};
    auth.setState(prevState => ({
      ...prevState,
      loading: true,
    }));
    auth.saveMFA(params).then(data => {
      if (data.code && data.code === 'Successful') {
        auth.setState(prevState => ({
          ...prevState,
          loading: false,
          secure: '',
          pwd: '',
          userName: data.clientuser.userName,
          sessionId: data.session.accessToken.JwtToken,
          clientId: data.clientuser.clientId,
        }));
        onVerification(data.clientuser.clientId);
        navigation.navigate('Home');
      } else {
        auth.setState(prevState => ({
          ...prevState,
          loading: false,
          secure: '',
          sessionId: '',
          pwd: '',
        }));
        Alert.alert('Error in submitting SMS code, Need to relogin');
        navigation.navigate('Login');
      }
    });
  };

  const callResendOtp = () => {
    auth.setState(prevState => ({
      ...prevState,
      loading: true,
    }));
    auth
      .saveToken({
        username: auth.state.secure.username,
        password: auth.state.pwd,
      })
      .then(data => {
        if (data && data.status === 'mfa') {
          auth.setState(prevState => ({
            ...prevState,
            error: '',
            success: 'A new OTP has been sent to your mobile number',
            loading: false,
            secure: {
              hash: data.hash,
              session: data.session,
              username: auth.state.secure.username,
            },
          }));
        }
      });
  };

  useEffect(() => {
    startResendOtpTimer();

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);

  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  const onOtpChange = index => value => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Move focus to the next box if the current one has a value
    if (value && index < newOtp.length - 1) {
      inputs[index + 1].focus();
    }
  };

  const onOtpKeyPress = index => {
    return ({nativeEvent: {key: value}}) => {
      // auto focus to previous InputText if value is blank and existing value is also blank
      if (value === 'Backspace' && otp[index] === '') {
        if (index >= 1) {
          inputs[index - 1].focus();
        }

        /**
         * clear the focused text box as well only on Android because on mweb onOtpChange will be also called
         * doing this thing for us
         * todo check this behaviour on ios
         */
        if (Platform.OS === 'android' && index > 0) {
          const otpCopy = otp.concat();
          otpCopy[index - 1] = ''; // clear the previous box which will be in focus
          setOtp(otpCopy);
        }
      }
    };
  };

  const onResendOtpButtonPress = () => {
    if (inputs[0]) {
      setOtp(['', '', '', '', '', '']);
      inputs[0].focus();
    }
    if (auth.state.success) {
      auth.setState(prevState => ({
        ...prevState,
        success: '',
      }));
      setResendButtonDisabledTime(30);
    } else {
      callResendOtp();
    }
  };

  const resendButtonStyle = [
    styles.loginBtn,
    resendButtonDisabledTime > 0 && {
      opacity: 0.5,
    },
  ];

  const refCallback = index => input => {
    inputs[index] = input;
  };

  // Keyboard automatically shown after open the screen
  useEffect(() => {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        if (inputs[0]) {
          inputs[0].focus();
        }
      }, 60);
    }
  }, []);
  return (
    <ScrollView
      keyboardShouldPersistTaps={'handled'}
      style={GenericStyles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Loader loading={auth.state.loading} />
        <Text style={styles.title}>Verification</Text>
        <Text>
          We sent you a SMS Code on your registered phone number with us.
        </Text>
        <View style={styles.buttonWrapper}>
          {otp.map((digit, index) => (
            <TextInput
              style={styles.TextInput}
              placeholderTextColor="#003f5c"
              value={digit}
              backgroundColor="#d3d3d3"
              onKeyPress={onOtpKeyPress(index)}
              onChangeText={onOtpChange(index)}
              maxLength={1}
              autoFocus={
                Platform.OS === 'ios' && index === 0 ? true : undefined
              }
              keyboardType="numeric"
              key={index}
              ref={refCallback(index)}
            />
          ))}
        </View>
        {auth.state.success && resendButtonDisabledTime <= 0 && (
          <View style={styles.errorWrapper}>
            <Text style={styles.success}>{auth.state.success}</Text>
          </View>
        )}
        {resendButtonDisabledTime > 0 && (
          <View style={styles.errorWrapper}>
            <Text style={styles.timeDisplay}>
              Please wait {resendButtonDisabledTime} second(s) before requesting
              a new One Time Password (OTP).
            </Text>
          </View>
        )}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={resendButtonStyle}
            onPress={onResendOtpButtonPress}
            activeOpacity={0.5}
            disabled={resendButtonDisabledTime > 0 ? true : false}>
            <Text style={styles.buttonTextStyle}>Resend</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={onConfirm}
            activeOpacity={0.5}>
            <Text style={styles.buttonTextStyle}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default Verification;

/**
 * Fuctional component styles
 */
const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    color: '#000',
    marginBottom: 20,
  },
  loginBtn: {
    width: '45%',
    borderRadius: 5,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginRight: 35,
    backgroundColor: '#01403c',
    opacity: 1,
  },
  success: {
    color: '#067D62',
    fontSize: 14,
    marginTop: 20,
  },
  timeDisplay: {
    color: '#000000',
    fontSize: 14,
    marginTop: 20,
  },
  TextInput: {
    flex: 1,
    width: '15%',
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#ccc',
    color: '#000',
    backgroundColor: '#fff',
  },
  buttonTextStyle: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 10,
  },
  buttonWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 40,
  },
});
