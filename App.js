//import liraries
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import {Icon} from 'react-native-elements';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';

import Login from './route/Login';
import LoginPw from './route/LoginPw';
import TypeOrder from './route/TypeOrder';
import MenuOrder from './route/MenuOrder';
import Checkout from './route/Checkout';
import Transactions from './route/Transactions';
import Shift from './route/Shift';
import OrderPending from './route/OrderPending';
import TestPrint from './route/TestPrint';

import LinearGradient from 'react-native-linear-gradient';
import QrScan from './route/qrScan';
import Logout from './route/Logout';
import KDS from './route/KDS';
// const image = {uri: './img/mg.png'};
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// create a component
const App = () => {
  useEffect(() => {
    _requestAppTrackingTransparency();
  }, []);

  const _requestAppTrackingTransparency = async () => {
    const trackingStatus = await requestTrackingPermission().then(res => {
      console.log('TRACKING TRANSPARENCY STATUS : ', res);
    });
  };

  const customDrawerContent = props => {
    return (
      <View>
        <Text>hahhsad</Text>
      </View>
    );
  };

  const _OrderScreen = () => {
    return (
      <Stack.Navigator
        initialRouteName="TypeOrder"
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="TypeOrder"
          component={TypeOrder}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="MenuOrder"
          component={MenuOrder}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={{gestureEnabled: false}}
        />
      </Stack.Navigator>
    );
  };

  const _TransactionScreen = () => {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Transactions"
          component={Transactions}
          options={{gestureEnabled: false}}
        />
      </Stack.Navigator>
    );
  };

  const _ShiftScreen = () => {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Shift"
          component={Shift}
          options={{gestureEnabled: false}}
        />
      </Stack.Navigator>
    );
  };

  const _OrderPendingScreen = () => {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="OrderPending"
          component={OrderPending}
          options={{gestureEnabled: false}}
        />
      </Stack.Navigator>
    );
  };

  const _Setting = () => {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="TestPrint" component={TestPrint} options={{gestureEnabled: false}} />

        {/* <Stack.Screen
          name="OrderPending"
          component={OrderPending}
          options={{gestureEnabled: false}}
        /> */}
      </Stack.Navigator>
    );
  };

  const _DrawerScreen = () => {
    return (
      <Drawer.Navigator
        screenOptions={{headerShown: false}}>
        <Drawer.Screen name="Order" component={_OrderScreen} />
        <Drawer.Screen name="Transaction" component={_TransactionScreen} />
        <Drawer.Screen name="Shift" component={_ShiftScreen} />
        <Drawer.Screen name="Order Pending" component={_OrderPendingScreen} />
        <Drawer.Screen name="Settings" component={_Setting} />
        <Drawer.Screen name="Logout" component={Logout} />
      </Drawer.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="LoginPw"
          component={LoginPw}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen name="_DrawerScreen" component={_DrawerScreen} />

        {/* <Stack.Screen name="QrScan" component={QrScan} /> */}
        {/* <Stack.Screen name="TypeOrder" component={TypeOrder} /> */}
        <Stack.Screen name="KDS" component={KDS} />


        <Stack.Screen name="_OrderPendingScreen" component={_OrderPendingScreen} />
        {/* <Stack.Screen name="_OrderScreen" component={_OrderScreen} /> */}
        {/* <Stack.Screen name="MenuOrder" component={MenuOrder} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="Transactions" component={Transactions} />
        <Stack.Screen name="Shift" component={Shift} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

//make this component available to the app
export default App;
