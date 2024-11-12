import React, {useLayoutEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {GenericStyles} from '../styles/Styles';
import {Context as context} from '../../Context';
// 001-51-492789-15
// maria lee

/**
 * Functional component variables
 */
const FundAccountView = ({navigation}) => {
  const auth = context();
  const onDelete = () => {
    auth.deleteRecipient(auth.state.fundsView.id).then((data) => {
      if (data.status === 'success') {
        navigation.navigate('FundTransferView', {'paramPropKey': 'paramPropValue'});
      }
    });
  }

  const onDeleteRecipient = () => {
    Alert.alert('', 'Are you sure to delete the recipent', [
      {text: 'Confirm', onPress: onDelete},
      {
        text: 'Cancel',
      },
    ]);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onDeleteRecipient}>
          <Image style={styles.deleteImage} source={require('../../assets/delete.png')} />
        </TouchableOpacity>
      ),
    });
  }, [navigation])
  return (
    <View style={styles.container}>
      <View style={GenericStyles.container}>
        <View style={styles.viewWrapper} elevation={2}>
          <Text style={styles.textData}>{auth.state.fundsView.firstName} {auth.state.fundsView.lastName}</Text>
          <Text>{auth.state.fundsView.accountNumber}</Text>
          {auth.state.fundsView.name ? <Text style={styles.padTop}>{auth.state.fundsView.name}</Text> : ''}
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btnWrapper}
            onPress={() => navigation.navigate('MoneyTransfer')}
            activeOpacity={0.5}>
            <Text style={styles.buttonTextStyle}>Pay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FundAccountView;

/**
 * Functional component Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  deleteImage: {
    height: 25,
    width: 25,
  },
  viewWrapper: {
    marginTop: 30,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 15,
    borderColor: '#e6e6e6',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  padTop: {
    paddingTop: 10
  },
  textData: {
    paddingBottom: 10,
    fontWeight: 'bold'
  },
  btnContainer: {
    marginTop: 30,
  },
  btnWrapper: {
    height: 50,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#01403c',
  },
  buttonTextStyle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
