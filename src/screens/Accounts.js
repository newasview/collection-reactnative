import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import Table from './Table';
import {GenericStyles} from '../styles/Styles';
import {Context as context} from '../../Context';

/**
 * Functional component variables
 */
const Accounts = ({navigation}) => {
  const auth = context();
  const [accountsData, setAccounts] = useState({
    loan: [],
    deposit: [],
    loanLoading: false,
    depositLoadng: false,
    clientDetails: '',
  });
  const loanColumns = [
    {loanNumber: {text: '', style: {fontSize: 16, fontWeight: 'bold'}}},
    {principalBalance: {text: 'Loan Balance'}, style: {fontSize: 16}},
    {productName: {text: ''}, style: {fontSize: 16}},
  ];
  const depositColumns = [
    {accountNumber: {text: '', style: {fontSize: 16, fontWeight: 'bold'}}},
    {availableBalance: {text: 'Available Balance'}, style: {fontSize: 16}},
    {productName: {text: ''}, style: {fontSize: 16}},
  ];
  useEffect(() => {
    auth.findClient(auth.state.clientId).then(data => {
      if (data.status === 'success') {
        setAccounts(prevState => ({
          ...prevState,
          clientDetails: data.client,
        }));
      }
    });
  }, []);
  useEffect(() => {
    setAccounts(prevState => ({
      ...prevState,
      loanLoading: true,
    }));
    auth.listAccounts('loan', auth.state.clientId).then(data => {
      if (data.loans.length) {
        setAccounts(prevState => ({
          ...prevState,
          loan: data.loans,
          loanLoading: false,
        }));
      } else {
        setAccounts(prevState => ({
          ...prevState,
          loanLoading: false,
        }));
      }
    });
  }, []);
  useEffect(() => {
    setAccounts(prevState => ({
      ...prevState,
      depositLoading: true,
    }));
    auth.listAccounts('deposit', auth.state.clientId).then(data => {
      if (data.accounts.length) {
        setAccounts(prevState => ({
          ...prevState,
          deposit: data.accounts,
          depositLoading: false,
        }));
      } else {
        setAccounts(prevState => ({
          ...prevState,
          depositLoading: false,
        }));
      }
    });
  }, []);
  return (
    <ScrollView nestedScrollEnabled={true} style={styles.scrollView}>
      <View style={GenericStyles.container}>
        <View style={styles.accountProfile}>
          <View style={styles.accountContainer} elevation={2}>
            <View style={styles.logo}>
              <Image
                style={styles.logoImage}
                source={require('../../assets/user.png')}
              />
            </View>
            <View>
              <Text style={styles.accountTitle}>Welcome to Bayanihan Bank</Text>
              <Text style={styles.accountDesc}>
                <Text style={styles.fontBold}>Account:</Text>
                <Text style={styles.textUpper}>
                  {auth.state.userName ? ' ' + auth.state.userName : ''}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <View>
          <>
            <Text style={styles.subTitle}>Loan Accounts</Text>
            <View style={styles.wrapper} elevation={1}>
              <Table
                navigation={navigation}
                style={styles.tableData}
                loading={accountsData.loanLoading}
                headerView={false}
                data={accountsData.loan}
                dataKeys={loanColumns}
                type="loan"
                type1="payments"
                viewId={'id'}
                profileHeaderTitle={'Loan Details'}
              />
            </View>
          </>
        </View>
        <View>
          <>
            <Text style={styles.subTitle}>Deposit Accounts</Text>
            <View style={styles.wrapper} elevation={1}>
              <Table
                navigation={navigation}
                headerView={false}
                loading={accountsData.depositLoading}
                data={accountsData.deposit}
                dataKeys={depositColumns}
                type="deposit"
                type1="transactions"
                viewId={'accountId'}
                profileHeaderTitle={'Deposit Details'}
              />
            </View>
          </>
        </View>
      </View>
    </ScrollView>
  );
};

export default Accounts;

/**
 * Functional component Styles
 */
const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  accountProfile: {
    paddingTop: 10,
  },
  wrapper: {
    borderRadius: 5,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    padding: 10,
    backgroundColor: '#fefefe',
    borderColor: '#e6e6e6',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  accountContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 5,
    borderColor: '#e6e6e6',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  accountTitle: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  accountDesc: {
    fontSize: 14,
    paddingLeft: 10,
    paddingTop: 2,
  },
  fontBold: {
    fontWeight: 'bold',
  },
  textUpper: {
    textTransform: 'uppercase',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius: 2,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    padding: 10,
    paddingLeft: 20,
    marginTop: 20,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#01403c',
    backgroundColor: '#01403c',
  },
  logo: {
    justifyContent: 'center'
  },
  logoImage: {
    height: 30,
    width: 30
  }
});
