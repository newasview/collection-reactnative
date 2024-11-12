import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {GenericStyles} from '../styles/Styles';
import {Context as context} from '../../Context';
import TextField from './TextField';
import Dropdown from './Dropdown';
import RadioButton from './RadioButton';
import Loader from './Loader';

/**
 * Functional component variables
 */
const AddRecipient = ({navigation}) => {
  const lastnameInputRef = useRef();
  const accountnumberInputRef = useRef();
  const confirmaccountnumberInputRef = useRef();
  const auth = context();
  const [state, setAdd] = useState({
    transferType: 0,
    firstname: '',
    lastname: '',
    accountnumber: '',
    confirmaccountnumber: '',
    error: '',
    loading: false,
    banks: [],
    bic: '',
    bankname: '',
  });

  useEffect(() => {
    if (state.transferType) {
      setAdd(prevState => ({
        ...prevState,
        loading: true,
      }));
      auth.getPesonetBanklist().then(data => {
        if (data.status === 'success') {
          setAdd(prevState => ({
            ...prevState,
            banks: data.banks,
            loading: false,
          }));
        }
      });
    }
  }, [state.transferType]);

  const handleChange = name => value => {
    setAdd(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onConfirmAdd = () => {
    auth.setState(prevState => ({
      ...prevState,
      loading: true,
    }));

    auth.addRecipient(state, auth.state.clientId).then(data => {
      if (data && data.status === 'success') {
        auth.setState(prevState => ({
          ...prevState,
          loading: false,
        }));
        navigation.navigate('FundTransferView', {
          paramPropKey: 'paramPropValue',
        });
      } else {
        if (data.code) {
          Alert.alert('Info', data.code);
        }
        auth.setState(prevState => ({
          ...prevState,
          loading: false,
          error: data.code,
        }));
      }
    });
  };

  const optionSelected = (bic, bankname) => (value) => {
    setAdd(prevState => ({
      ...prevState,
      'bic': value[bic],
      'bankname': value[bankname]
    }));
  }

  const onAdd = () => {
    if (!state.firstname) {
      Alert.alert('Please enter first name');
      return;
    }
    if (!state.lastname) {
      Alert.alert('Please enter last name');
      return;
    }
    if (!state.accountnumber) {
      Alert.alert('Please enter account number');
      return;
    }
    if (!state.confirmaccountnumber) {
      Alert.alert('Please enter confirm account number');
      return;
    }
    if (state.accountnumber !== state.confirmaccountnumber) {
      Alert.alert("Confirm account number doesn't match the account number");
      return;
    }

    Alert.alert('', 'Are you sure to add the recipient', [
      {text: 'Confirm', onPress: onConfirmAdd},
      {
        text: 'Cancel',
      },
    ]);
  };

  const submitEditing = input => () => {
    return input.current && input.current.focus();
  };

  const checkDisabled = () => {
    let disabled = true;
    if (
      state.firstname &&
      state.lastname &&
      state.accountnumber &&
      state.confirmaccountnumber &&
      (!state.transferType || (state.transferType && state.bic))
    ) {
      disabled = false;
    }
    return disabled;
  };

  const addButtonStyle = [
    styles.btnWrapper,
    checkDisabled() && {
      opacity: 0.5,
    },
  ];

  const transfers = [
    {'id': false, 'label': 'Intrabank Transfer'},
    {'id': true, 'label': 'Interbank Transfer'},
  ]

  const setChecked = (value) => {
    setAdd(prevState => ({
      ...prevState,
      'transferType': value,
      'bic': '',
      'bankname': ''
    }));
  }

  return (
    <KeyboardAvoidingView>
      <ScrollView
        nestedScrollEnabled={true}
        style={styles.scrollView}
        keyboardShouldPersistTaps="always">
        <Loader loading={auth.state.loading} />
        <View style={GenericStyles.container}>
          <View>
            <Text style={styles.title}>Create Recipient</Text>
          </View>
          <View style={styles.inputView}>
            <View style={styles.radioWrapper}>
              {
                transfers.map((item, radioIndex)=>{
                  return(
                    <RadioButton key={radioIndex} item={item} checked={state.transferType} setChecked={setChecked} />
                  ) 
                })
              }
            </View>
          </View>
          {state.transferType ? <View style={styles.inputView}>
            <Dropdown label="BIC" data={state.banks} labelName={'bank_name'} isSearch={true} onSelect={optionSelected('BICFI', 'bank_name')} />
          </View>: ''}
          <View style={styles.inputView}>
            <TextField
              onChangeText={handleChange('firstname')}
              label="First name"
              placeholder="Enter your first name"
              value={state.firstname}
              onSubmitEditing={submitEditing(lastnameInputRef)}
              blurOnSubmit={false}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputView}>
            <TextField
              onChangeText={handleChange('lastname')}
              onSubmitEditing={submitEditing(accountnumberInputRef)}
              value={state.lastname}
              label="Last name"
              placeholder="Enter your last name"
              blurOnSubmit={false}
              innerRef={lastnameInputRef}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputView}>
            <TextField
              onChangeText={handleChange('accountnumber')}
              value={state.accountnumber}
              label="Account number"
              placeholder="Enter your account number"
              onSubmitEditing={submitEditing(confirmaccountnumberInputRef)}
              secureTextEntry={true}
              blurOnSubmit={false}
              innerRef={accountnumberInputRef}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputView}>
            <TextField
              onChangeText={handleChange('confirmaccountnumber')}
              value={state.confirmaccountnumber}
              onSubmitEditing={Keyboard.dismiss}
              label="Confirm account number"
              placeholder="Enter your confirm account number"
              blurOnSubmit={false}
              innerRef={confirmaccountnumberInputRef}
              returnKeyType="next"
            />
          </View>
          {state.error ? <Text style={styles.error}>{state.error}</Text> : ''}
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={addButtonStyle}
              onPress={onAdd}
              disabled={checkDisabled()}
              activeOpacity={0.5}>
              <Text style={styles.buttonTextStyle}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnWrapper}
              onPress={() => navigation.navigate('FundTransferView')}
              activeOpacity={0.5}>
              <Text style={styles.buttonTextStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddRecipient;

/**
 * Functional component Styles
 */
const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  title: {
    paddingLeft: 0,
    paddingTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  error: {
    paddingTop: 25,
    color: '#ff0000',
  },
  radioWrapper: {
    flexDirection:"row",
    flexWrap:"wrap",
  },
  btnContainer: {
    paddingTop: 30,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnWrapper: {
    marginBottom: 40,
    height: 50,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#01403c',
    opacity: 1,
  },
  inputView: {
    marginTop: 20,
    marginBottom: 5,
  },
  buttonTextStyle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
