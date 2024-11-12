import React, {useEffect, useState} from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
} from "react-native";
import Table from './Table'
import {GenericStyles} from '../styles/Styles';
import {Context as context} from '../../Context';

const Accounts = ({route}) => {
  const auth = context();
  const [accountsData, setAccounts] = useState({
    'loan': {dataKey: 'loans', data: {}},
    'deposit': {dataKey: 'account', data: {}}
  }) 
  const columns = { 'loans' : [
    {loanNumber: {'text': 'Loan Number', 'style': { fontSize: 16, fontWeight: "bold" }}},
    {productName: {'text': 'Loan Poduct Name', 'style': { fontSize: 16, fontWeight: "bold" }}},
    {principalBalance: {'text': 'Loan Balance', 'style': { fontSize: 16 }}},
    {branchName: {'text': 'Loan Branch Name', 'style': { fontSize: 16, fontWeight: "bold" }}},
    {maturityDate: {'text': 'Maturity Date', 'style': { fontSize: 16, fontWeight: "bold" }}},
    {loanNumber: {'text': 'Next Payment Due Date', 'style': { fontSize: 16, fontWeight: "bold" }}},
    {status: {'text': 'Loan Status', 'style': { fontSize: 16, fontWeight: "bold" }}},
    {term: {'text': 'Tenure', 'style': { fontSize: 16 }}}
  ],
  'account': [
    {accountNumber: {'text': 'Account Number', 'style': { fontSize: 16, fontWeight: "bold" }}},
    {productName: {'text': 'Deposit Name', 'style': { fontSize: 16, fontWeight: "bold" }}},
    {availableBalance: {'text': 'Available Balance', 'style': { fontSize: 16 }}},
    {branchName: {'text': 'Account Branch Name', 'style': { fontSize: 16, fontWeight: "bold" }}},
    {maturityDate: {'text': 'Maturity Date', 'style': { fontSize: 16, fontWeight: "bold" }}},
    {interestBalance: {'text': 'Interest Balance', 'style': { fontSize: 16, fontWeight: "bold" }}},
    {term: {'text': 'Tenure', 'style': { fontSize: 16 }}}
  ]
}
const method = accountsData[route.params.type]
const details = method['data'] ? method['data'] : {} 
useEffect(() => {
  auth.findAccounts(route.params.type, route.params.viewId)
  .then(data => {
    setAccounts(prevState => {
      return {
        ...prevState, 
        [route.params.type]: {...method ,'data': data[method['dataKey']]}
      }
    })
})}, [])


const [transData, setTrans] = useState({
  'loan': {dataKey: 'payments', data: [], search: []},
  'deposit': {dataKey: 'transactions', data: [], search: []},
  loading: false,
}) 
const [ query, setQuery ] = useState('')
const [show, setShow] = useState(true)

const columns1 = { 'payments' : [
  {postedDate: {'text': 'Payment Date', 'style': { fontSize: 16, fontWeight: "bold" }, formatter: (data) => {
    const date = new Date(data);
    const month = date.toLocaleString('default', { month: 'short' });
    return date.getDate() + ' ' + month
  }}},
  {amount: {'text': 'Amount', 'style': { fontSize: 16, fontWeight: "bold" }}}
  ],
  'transactions': [
    {postedDate: {'text': 'Payment Date', 'style': { fontSize: 16 }, formatter: (data) => {
      const date = new Date(data);
      const month = date.toLocaleString('default', { month: 'short' });
      return date.getDate() + ' ' + month
    }}},
    {transactionType: {'text': 'Type', 'style': { fontSize: 16, fontWeight: "bold" }}},
    {amount: {'text': 'Amount', 'style': { fontSize: 16, fontWeight: "bold" }}}
  ]
}
const method2 = transData[route.params.type]
const details2 = method2['data'] ? method2['data'] : [] 
const search = method2['search'] ? method2['search'] : [] 

useEffect(() => {
  setTrans((prevState) => ({
    ...prevState,
    'loading': true,
  }))
  auth.listTrans(route.params.type, route.params.type1, route.params.viewId)
  .then(data => {
    setTrans(prevState => {
      return {
        ...prevState, 
        [route.params.type]: {...method2 ,'data': data[route.params.type1], 'search': data[route.params.type1]},
        loading: false
      }
    })
})}, [])

const handleSearch = text => {
  const formattedQuery = text;
  let filteredData = details2.filter((item) => {
    return item.postedDate.includes(formattedQuery)
  })

  if (text === '' ) {
    filteredData = details2
  }
  setTrans(prevState => {
    return {
      ...prevState, 
      [route.params.type]: {...method2 , 'search': filteredData},
      loading: false
    }
  })
  setQuery(text);
};

useEffect(() => {
  const showSubscription  = Keyboard.addListener('keyboardDidShow', () => {
    setShow(false)
  });

  const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
    setShow(true)
  });

  return () => {
    hideSubscription.remove();
    showSubscription.remove();
  }
}, []);

return (
  <SafeAreaView>
    <ScrollView keyboardShouldPersistTaps={'handled'} contentInsetAdjustmentBehavior={'automatic'} style={styles.scrollView}>
      <KeyboardAvoidingView behavior="padding">
        <View style={GenericStyles.container}>
          {show ? <View>
            {Object.keys(details) ? <View style={styles.wrapper}>
              {columns[method['dataKey']].map((item, index) => {
                const keyItem = Object.keys(item)[0]
                return <Text key={index}>{item[keyItem].text}: {details[keyItem]}</Text> 
              })}
            </View> : <ActivityIndicator />}
          </View> : ''}
          <View style={styles.searchWrapper} elevation={2}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              value={query}
              onChangeText={queryText => handleSearch(queryText)}
              placeholder="Search"
              style={{ backgroundColor: 'transparent', paddingHorizontal: 20 }}
            />
            </View>
            <View style={styles.wrapper} elevation={2}>
              <Table headerView={true} loading={transData.loading} data={search} dataKeys={columns1[method2['dataKey']]} />
            </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  </SafeAreaView>);
}

export default Accounts;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  searchWrapper: {
    marginTop: 10,
    borderRadius:4, 
    borderColor: '#fff',
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  wrapper: {
    marginTop: 10,
    padding: 10,
    borderRadius:10, 
    backgroundColor: '#fefefe',
    borderRadius: 5,
    borderColor: '#e6e6e6',
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
});