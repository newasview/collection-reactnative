import React, {useState} from 'react';
import {Image, TouchableOpacity, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Login from './src/screens/Login';
import Accounts from './src/screens/Accounts';
import Verification from './src/screens/Verification';
import {Context as context} from './Context';
import CustomSidebarMenu from './CustomSideMenu';
import NavigationDrawerHeader from './NavigationDrawerHeader';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const MyRoutes = () => {
  const auth = context();
  const [isProtectedRoutes, setProtected] = useState(false);
  const onLogout = () => {
    auth.removeToken().then(() => {
      setProtected(false);
    });
  };

  const showConfirmDialog = () => {
    Alert.alert('', 'Are you sure to Logout', [
      {text: 'Yes', onPress: onLogout},
      {
        text: 'No',
      },
    ]);
  };

  const handleVerification = data => {
    setProtected(data);
  };

  const HomeTabs = ({navigation}) => {
    return (
      <Tab.Navigator
        screenOptions={{
          activeTintColor: '#101010',
        }}>
        <Tab.Screen
          name="Accounts"
          options={{
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#01403c',
            },
            headerLeft: () => (
              <NavigationDrawerHeader navigationProps={navigation} />
            ),
            headerRight: () => (
              <TouchableOpacity onPress={showConfirmDialog}>
                <Image source={require('./assets/logout-1.png')} />
              </TouchableOpacity>
            ),
          }}
          component={Accounts}
        />
      </Tab.Navigator>
    );
  };

  const DrawerNavigator = () => {
    return (
      <Drawer.Navigator
        drawerContentOptions={{
          activeTintColor: '#cee1f2',
          color: '#cee1f2',
          itemStyle: {marginVertical: 5, color: 'white'},
          labelStyle: {
            color: '#d8d8d8',
          },
        }}
        screenOptions={{headerShown: false}}
        drawerContent={CustomSidebarMenu}>
        <Drawer.Screen
          name="mains"
          options={{
            headerShown: false,
          }}
          component={HomeTabs}
        />
      </Drawer.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isProtectedRoutes ? (
          <>
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="DrawerNavigator"
              component={DrawerNavigator}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              options={{
                title: 'Login',
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#01403c',
                },
              }}>
              {props => <Login {...props} />}
            </Stack.Screen>
            <Stack.Screen
              name="Verification"
              options={{
                title: 'Login',
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#01403c',
                },
              }}>
              {props => (
                <Verification {...props} onVerification={handleVerification} />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyRoutes;
