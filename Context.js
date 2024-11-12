import React, {createContext, useState, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from './Config';

/**
 * Fuctional component variables
 */
const initialState = {
  loading: false,
  token: '',
  error: '',
  secure: '',
  pwd: '',
  clientId: '',
  fundsView: {},
};

const MyContext = createContext(initialState);

export const Provider = ({children}) => {
  const [state, setState] = useState(initialState);

  // Update AsyncStorage & context state
  const saveToken = async auth => {
    try {
      const response = await fetch(config.API_URL + 'auth/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: auth.username,
          password: auth.password,
        }),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  const moneyTransfer = async (senderaccountid, recipientid, amount, isintrabank) => {
    try {
      let url = 'deposit/transaction/moneytransfer'
      if (isintrabank === 0) {
        url = 'deposit/transaction/pesonet/add'
      }
      const response = await fetch(
        config.API_URL + url,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderaccountid: senderaccountid,
            recipientid: recipientid,
            amount: amount,
          }),
        },
      );
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  const addRecipient = async (auth, clientid) => {
    let data = {
      clientid: clientid.toString(),
      firstname: auth.firstname,
      lastname: auth.lastname,
      accountnumber: auth.accountnumber,
      isintrabank: !auth.transferType
    }
    if (auth.transferType) {
      data = {...data, ...{
        bic: auth.bic,
        bankname: auth.bankname
      }}
    }
    try {
      const response = await fetch(config.API_URL + 'recipient/add', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error('error', error);
    }
  };

  const deleteRecipient = async recipientId => {
    try {
      const response = await fetch(
        config.API_URL + 'recipient/delete?id=' + recipientId,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error('derror', error);
    }
  };

  const listRecipient = async clientId => {
    try {
      const response = await fetch(
        config.API_URL + 'client/find/recipients?id=' + clientId,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  const saveMFA = async auth => {
    try {
      const response = await fetch(config.API_URL + 'auth/password/mfa', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: auth.username,
          code: auth.code,
          hash: auth.hash,
          session: auth.session,
        }),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  const listTrans = async (type1, type2, clientId) => {
    try {
      const response = await fetch(
        config.API_URL + type1 + '/account/' + type2,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: clientId,
          }),
        },
      );
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  const listAccounts = async (type, clientId) => {
    try {
      const response = await fetch(config.API_URL + type + '/account/list', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: clientId,
        }),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  const findAccounts = async (type, id) => {
    try {
      const response = await fetch(config.API_URL + type + '/account/find', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
        }),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  const findClient = async clientId => {
    try {
      const response = await fetch(
        config.API_URL + '/client/find/detail?id=' + clientId,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  const getPesonetBanklist = async () => {
    try {
      const response = await fetch(
        config.API_URL + '/deposit/transaction/pesonet/banklist',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  const getToken = async () => {
    try {
      const resp = await AsyncStorage.getItem('userToken');
      return resp;
    } catch (error) {
      Promise.reject(error);
    }
  };

  const removeToken = async () => {
    try {
      const resp = await AsyncStorage.getAllKeys().then(keys =>
        AsyncStorage.multiRemove(keys),
      );
      return resp;
    } catch (error) {
      Promise.reject(error);
    }
  };

  return (
    <MyContext.Provider
      value={{
        state,
        setState,
        findClient,
        listTrans,
        listAccounts,
        findAccounts,
        saveToken,
        saveMFA,
        getToken,
        removeToken,
        addRecipient,
        deleteRecipient,
        listRecipient,
        moneyTransfer,
        getPesonetBanklist,
      }}>
      {children}
    </MyContext.Provider>
  );
};

/**
 *  Context initialisation
 */
export function Context() {
  const context = useContext(MyContext);
  // if (!context) {
  //   throw new Error('useAuth must be used within an AuthProvider');
  // }
  return context;
}
