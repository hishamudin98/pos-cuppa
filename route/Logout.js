//import liraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import { color } from '../config/Constant';
import Login from './Login';

// create a component
const Logout = ({navigation, route}) => {
  useEffect(() => {
    AsyncStorage.removeItem('ORDER');
    AsyncStorage.removeItem('ORDER_NO');
    AsyncStorage.removeItem('DATA_ORDER');
    AsyncStorage.removeItem('ORDER_TAKEAWAY');
    AsyncStorage.removeItem('DISCOUNT_ORDER');
    AsyncStorage.removeItem('CUSTOMER');
    AsyncStorage.removeItem('ORDER_PENDING');

    Alert.alert('Logout', 'Logout Success', [
      {
        text: 'OK',
        onPress: () =>
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
      },
    ]);
  }, []);

  const [loading, setLoading] = useState(false);

  
  return (
    <View style={styles.container}>
        <ActivityIndicator size="large" color={color.primary} />
    </View>
    // <ActivityIndicator />
    // <View>
    //   <Text>Logout</Text>
    // </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default Logout;
