//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Icon } from 'react-native-elements';
import { color } from '../config/Constant';

// create a component
const Drawer = ({navigation, route}) => {
  return (
    <View
      style={{
        flex: 0.07,
        backgroundColor: color.black,
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{marginTop: 20}}
        onPress={() => {navigation.toggleDrawer();}}>
        <View style={{}}>
          <Icon
            name={'chevrons-right'}
            type="feather"
            size={24}
            color={color.white}
            // style={{position: 'absolute', margin: 100}}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default Drawer;
