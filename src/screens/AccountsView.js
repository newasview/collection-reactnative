import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  Image,
} from 'react-native';
import Table from './Table';
import {GenericStyles} from '../styles/Styles';
import {Context as context} from '../../Context';

/**
 * Functional component variables
 */
const Accounts = ({route}) => {
  const auth = context();
  const [accountsData, setAccounts] = useState({
    loan: {dataKey: 'loans', data: {}},
    deposit: {dataKey: 'account', data: {}},
  });
  const dateFormatter = data => {
    const date = new Date(data);
    const month = date.toLocaleString('default', {month: 'numeric'});
    const year = date.toLocaleString('default', {year: 'numeric'});
    return (month > 9 ? month : ('0' + month)) + '-' + date.getDate() + '-' + year;
  };
  const [isFocus, setFocus] = useState(false);
  const columns = {
    loans: [
      {
        loanNumber: {
          text: 'Loan Number',
          style: {fontSize: 16, fontWeight: 'bold'},
        },
      },
      {
        productName: {
          text: 'Loan Poduct Name',
          style: {fontSize: 16, fontWeight: 'bold'},
        },
      },
      {principalBalance: {text: 'Loan Balance', style: {fontSize: 16}}},
      {
        branchName: {
          text: 'Loan Branch Name',
          style: {fontSize: 16, fontWeight: 'bold'},
        },
      },
      {
        maturityDate: {
          text: 'Maturity Date',
          style: {fontSize: 16, fontWeight: 'bold'},
          formatter: dateFormatter,
        },
      },
      {
        grantDate: {
          text: 'Next Payment Due Date',
          style: {fontSize: 16, fontWeight: 'bold'},
          formatter: dateFormatter,
        },
      },
      {
        status: {
          text: 'Loan Status',
          style: {fontSize: 16, fontWeight: 'bold'},
        },
      },
      {term: {text: 'Tenure', style: {fontSize: 16}}},
    ],
    account: [
      {
        accountNumber: {
          text: 'Account Number',
          style: {fontSize: 16, fontWeight: 'bold'},
        },
      },
      {
        productName: {
          text: 'Deposit Name',
          style: {fontSize: 16, fontWeight: 'bold'},
        },
      },
      {availableBalance: {text: 'Available Balance', style: {fontSize: 16}}},
      {
        branchName: {
          text: 'Account Branch Name',
          style: {fontSize: 16, fontWeight: 'bold'},
        },
      },
      {
        maturityDate: {
          text: 'Maturity Date',
          style: {fontSize: 16, fontWeight: 'bold'},
          formatter: dateFormatter,
        },
      },
      {
        interestBalance: {
          text: 'Interest Balance',
          style: {fontSize: 16, fontWeight: 'bold'},
        },
      },
      {term: {text: 'Tenure', style: {fontSize: 16}}},
    ],
  };
  const method = accountsData[route.params.type];
  const details = method['data'] ? method['data'] : {};
  useEffect(() => {
    auth.findAccounts(route.params.type, route.params.viewId).then(data => {
      setAccounts(prevState => {
        if (method.dataKey === 'loans') {
          return {
            ...prevState,
            [route.params.type]: {...method, data: data['loan']},
          };
        } else {
          return {
            ...prevState,
            [route.params.type]: {...method, data: data[method['dataKey']]},
          };
        }
      });
    });
  }, []);

  const [transData, setTrans] = useState({
    loan: {dataKey: 'payments', data: [], search: []},
    deposit: {dataKey: 'transactions', data: [], search: []},
    loading: false,
  });
  const [query, setQuery] = useState('');

  const columns1 = {
    payments: [
      {
        postedDate: {
          text: 'Payment Date',
          style: {fontSize: 16, fontWeight: 'bold'},
          formatter: dateFormatter,
        },
      },
      {amount: {text: 'Amount', style: {fontSize: 16}}},
    ],
    transactions: [
      {
        postedDate: {
          text: 'Payment Date',
          style: {fontSize: 14, fontWeight: 'bold'},
          formatter: dateFormatter,
        },
      },
      {
        transactionType: {
          text: 'Type',
          style: {fontSize: 14},
        },
      },
      {amount: {text: 'Amount', style: {fontSize: 14}}},
    ],
  };
  const method2 = transData[route.params.type];
  const details2 = method2['data'] ? method2['data'] : [];
  const search = method2['search'] ? method2['search'] : [];

  useEffect(() => {
    setTrans(prevState => ({
      ...prevState,
      loading: true,
    }));
    auth
      .listTrans(route.params.type, route.params.type1, route.params.viewId)
      .then(data => {
        setTrans(prevState => {
          return {
            ...prevState,
            [route.params.type]: {
              ...method2,
              data: data[route.params.type1],
              search: data[route.params.type1],
            },
            loading: false,
          };
        });
      });
  }, []);

  const handleSearch = text => {
    const formattedQuery = text;
    let filteredData = details2.filter(item => {
      return dateFormatter(item.postedDate).includes(formattedQuery);
    });

    if (text === '') {
      filteredData = details2;
    }
    setTrans(prevState => {
      return {
        ...prevState,
        [route.params.type]: {...method2, search: filteredData},
        loading: false,
      };
    });
    setQuery(text);
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setFocus(true);
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setFocus(false);
    });

    return () => {
      hideSubscription.remove();
      showSubscription.remove();
    };
  }, []);

  const focusStyle = {display: isFocus ? 'none' : 'block'};

  return (
    <SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        contentInsetAdjustmentBehavior={'automatic'}
        style={styles.scrollView}>
        <View style={GenericStyles.container}>
          <View style={focusStyle}>
            {Object.keys(details) ? (
              <View style={styles.viewWrapper} elevation={2}>
                {columns[method['dataKey']].map((item, index) => {
                  const keyItem = Object.keys(item)[0];
                  return (
                    <Text key={index} style={{padding: 2, fontSize: 14}}>
                      <Text style={{fontWeight: 'bold'}}>
                        {item[keyItem].text}:
                      </Text>
                      {' '}
                      {item[keyItem].formatter ? item[keyItem].formatter(details[keyItem]) : details[keyItem]}
                    </Text>
                  );
                })}
              </View>
            ) : (
              <ActivityIndicator />
            )}
          </View>
          <View style={styles.searchWrapper}>
            <Image
              source={require('../../assets/search.png')}
              style={styles.searchIcon}
            />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
              value={query}
              onChangeText={handleSearch}
              placeholder="Search by payment date (mm-dd-yyyy)"
              style={styles.searchTextInput}
            />
          </View>
          <View style={styles.wrapper} elevation={2}>
            <Table
              headerView={true}
              loading={transData.loading}
              data={search}
              dataKeys={columns1[method2['dataKey']]}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Accounts;

/**
 * Fuctional component styles
 */
const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  viewWrapper: {
    marginTop: 10,
    padding: 4,
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
  wrapper: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
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
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 4,
  },
  searchTextInput: {
    flex: 1,
    paddingLeft: 35,
    borderWidth: 1,
    borderColor: '#bbb',
    paddingHorizontal: 20,
    borderRadius: 10,
    height: 50,
  },
  searchIcon: {
    position: 'absolute',
    top: 12,
    left: 5,
  },
});
