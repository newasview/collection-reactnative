import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {GenericStyles} from '../styles/Styles';
import {Context as context} from '../../Context';

/**
 * Functional component variables
 */
const FundTransferView = ({navigation, route}) => {
  const auth = context();
  const [receipient, setRecipient] = useState({
    loading: false,
    receipientDetails: [],
  });
  useEffect(() => {
    setRecipient(prevState => ({
      ...prevState,
      loading: true,
    }));
    auth.listRecipient(auth.state.clientId).then(data => {
      if (data.recipients.length) {
        setRecipient(prevState => ({
          ...prevState,
          receipientDetails: data.recipients,
          loading: false,
        }));
      } else {
        setRecipient(prevState => ({
          ...prevState,
          loading: false,
        }));
      }
    });
  }, [route]);

  const toView = item => () => {
    auth.setState(prevState => ({
      ...prevState,
      fundsView: item,
    }));
    navigation.navigate('FundAccountView');
  };

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.scrollView}>
      <View style={GenericStyles.container}>
        <View style={styles.btnWrapper}>
          <TouchableOpacity
            style={styles.addRecp}
            onPress={() => navigation.navigate('Add Recipient')}
            activeOpacity={0.5}>
            <Text style={styles.buttonTextStyle}>Add recipient</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.title}>All Recipients</Text>
        </View>
        {receipient.receipientDetails.map((item, index) => (
          <View key={index} style={styles.wrapperItems}>
            <TouchableOpacity onPress={toView(item)} activeOpacity={0.5}>
              <View style={styles.recpList}>
                <View>
                  <Text style={styles.fontBold}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text>{item.accountNumber}</Text>
                </View>
                <Image
                  style={styles.arrowImage}
                  source={require('../../assets/right-arrow.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
        ))}
        {receipient.loading && <ActivityIndicator />}
        {receipient.receipientDetails.length === 0 ? (
          <Text style={styles.noRecords}>No records</Text>
        ) : (
          ''
        )}
      </View>
    </ScrollView>
  );
};

export default FundTransferView;

/**
 * Functional component Styles
 */
const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  fontBold: {
    fontWeight: 'bold',
  },
  title: {
    paddingLeft: 0,
    paddingTop: 20,
    paddingBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  arrowImage: {
    height: 20,
    width: 20,
  },
  recpList: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noRecords: {
    paddingTop: 10,
  },
  wrapperItems: {
    paddingTop: 10,
    paddingBottom: 15,
    borderColor: '#e6e6e6',
    borderBottomWidth: 1,
  },
  addRecp: {
    width: '45%',
    borderRadius: 5,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: '#01403c',
    opacity: 1,
  },
  btnWrapper: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  buttonTextStyle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
