// import { StatusBar } from "expo-status-bar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';

import {Icon} from 'react-native-elements';

import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import { color, fonts } from '../config/Constant';
// const image = {uri: './img/mg.png'};
const image = require('../img/mg.png');
const imagelogo = require('../img/logomg.jpeg');
const numbers = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];


// create a component
const Login = ({navigation, route}) => {
  useEffect(() => {
    _requestAppTrackingTransparency();
  }, []);

  const _requestAppTrackingTransparency = async () => {
    const trackingStatus = await requestTrackingPermission().then(res => {
      console.log('TRACKING TRANSPARENCY STATUS : ', res);
    });
  };

  const [staffNo, setStaffNo] = useState('');
  const _changeStaffNo = async string_staffno => {
    console.log('STAFFNO : ', string_staffno);
  };

  const _loginPw = async () => {
    navigation.navigate('LoginPw');
  };

  const inputStaffNo = e => {
    if (e != 'backspace') {
      staffNo != '' ? setStaffNo(staffNo + e) : setStaffNo(e);
    } else {
      setStaffNo(staffNo.substring(0, staffNo.length - 1));
    }

    // setStaffNo(e)
    console.log(staffNo);
  };

  const validateLogin = async() => {
   
    if (staffNo == '') {
      Alert.alert('Login', 'Please Enter Staff No', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    } else {

      // alert(staffNo);
      await AsyncStorage.setItem('staffno', JSON.stringify({noStaff:staffNo}));

      _loginPw();
    }
  };

  return (
    <ImageBackground source={{uri:'https://s3.ap-southeast-1.amazonaws.com/cdn.heandshe.toyyibfnb.com/front.jpg'}} style={styles.image}>
      <LinearGradient colors={['#000000', '#00000000']} style={styles.lg}>
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.containerLogo}>
            <Image style={styles.stretch} source={{uri:'https://s3.ap-southeast-1.amazonaws.com/cdn.heandshe.toyyibfnb.com/logo.png'}} />
          </View>

          <View style={styles.container}>
            <Text style={{fontFamily: fonts.semibold, color:color.white, fontSize:16, marginBottom:10, marginTop : 20}}>Staff No</Text>
            <View style={styles.inputView}>
              <TextInput
                style={[styles.TextInput, styles.textFamily , {justifyContent: 'center', alignSelf: 'center', marginLeft:0}]}
                placeholder="Staff No."
                // placeholderTextColor="#000000"
                defaultValue={staffNo}
                onChangeText={text => _changeStaffNo(text)}
              />
            </View>

            {/* <View style={{position: 'absolute'}}>
              {numbers.map((chunk, index) => {
                return (
                  <View key={index} style={styles.numpadWrapper}>
                    {chunk.map(number => {
                      return (
                        <TouchableOpacity style={styles.btnNumpad}>
                          <View key={number} style={styles.numpad}>
                            <Text style={styles.numpadNumber}>{number}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
            </View> */}

            <View style={{position: 'absolute'}}>
              <View style={{flexDirection: 'row', marginTop: 250}}>
                <View style={{padding: 10}}>
                  <TouchableOpacity
                    style={styles.btnNumpad}
                    onPress={() => inputStaffNo('1')}>
                    <View style={styles.numpad}>
                      <Text style={styles.numpadNumber}>1</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{padding: 10}}>
                  <TouchableOpacity
                    style={styles.btnNumpad}
                    onPress={() => inputStaffNo('2')}>
                    <View style={styles.numpad}>
                      <Text style={styles.numpadNumber}>2</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{padding: 10}}>
                  <TouchableOpacity
                    style={styles.btnNumpad}
                    onPress={() => inputStaffNo('3')}>
                    <View style={styles.numpad}>
                      <Text style={styles.numpadNumber}>3</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{padding: 10}}>
                  <TouchableOpacity
                    style={styles.btnNumpad}
                    onPress={() => inputStaffNo('backspace')}>
                    <View style={styles.numpad}>
                      <Icon
                        name={'backspace-outline'}
                        type="ionicon"
                        size={30}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column'}}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{padding: 10}}>
                      <TouchableOpacity
                        style={styles.btnNumpad}
                        onPress={() => inputStaffNo('4')}>
                        <View style={styles.numpad}>
                          <Text style={styles.numpadNumber}>4</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={{padding: 10}}>
                      <TouchableOpacity
                        style={styles.btnNumpad}
                        onPress={() => inputStaffNo('5')}>
                        <View style={styles.numpad}>
                          <Text style={styles.numpadNumber}>5</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={{padding: 10}}>
                      <TouchableOpacity
                        style={styles.btnNumpad}
                        onPress={() => inputStaffNo('6')}>
                        <View style={styles.numpad}>
                          <Text style={styles.numpadNumber}>6</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{flexDirection: 'row'}}>
                    <View style={{padding: 10}}>
                      <TouchableOpacity
                        style={styles.btnNumpad}
                        onPress={() => inputStaffNo('7')}>
                        <View style={styles.numpad}>
                          <Text style={styles.numpadNumber}>7</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={{padding: 10}}>
                      <TouchableOpacity
                        style={styles.btnNumpad}
                        onPress={() => inputStaffNo('8')}>
                        <View style={styles.numpad}>
                          <Text style={styles.numpadNumber}>8</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{padding: 10}}>
                      <TouchableOpacity
                        style={styles.btnNumpad}
                        onPress={() => inputStaffNo('9')}>
                        <View style={styles.numpad}>
                          <Text style={styles.numpadNumber}>9</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={{flexDirection: 'column'}}>
                  <View style={{padding: 10}}>
                    <TouchableOpacity
                      style={styles.btnNumpadCfm}
                      onPress={() => validateLogin()}>
                      <View style={styles.numpad}>
                        <Icon
                          name={'arrow-forward-circle-outline'}
                          type="ionicon"
                          size={30}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={{padding: 10, opacity: 0, height: 0}}>
                  <TouchableOpacity style={styles.btnNumpad}>
                    <View style={styles.numpad}>
                      <Text style={styles.numpadNumber}>0</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{padding: 10}}>
                  <TouchableOpacity
                    style={styles.btnNumpad}
                    onPress={() => inputStaffNo('0')}>
                    <View style={styles.numpad}>
                      <Text style={styles.numpadNumber}>0</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* <TouchableOpacity>
              <Text style={styles.forgot_button}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginBtn}>
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity> */}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    // position:'absolute',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },

  containerLogo: {
    // flex: 1,
    // paddingTop: 50,
    backgroundColor: '#fff',
    // margin:50,
    justifyContent: 'center',
    alignItems: 'center',
    // height:'10%'
  },

  stretch: {
    width: 160,
    height: 160,
    // left: 50,
    top: 15,
    resizeMode: 'stretch',
    position: 'absolute',
  },

  lg: {
    height: '100%',
    width: '100%',
  },

  inputView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    width: '50%',
    height: 45,
    marginBottom: 400,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  
  textFamily: {
    fontFamily: fonts.medium,
    fontSize: 16,
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    fontSize: 16,
    fontFamily:fonts.medium
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },

  loginBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#FF1493',
  },

  numpadWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 40,
  },

  numpadNumber: {
    fontWeight: 'bold',
    color: '#000000',
    fontSize: 24,
  },

  numpad: {
    alignSelf: 'center',
  },

  btnNumpad: {
    elevation: 8,
    backgroundColor: '#FFF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 130,
    height: 60,
    justifyContent: 'center',
  },

  btnNumpadCfm: {
    elevation: 8,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 130,
    height: 140,
    justifyContent: 'center',
  },

  TextFamily: {
    fontFamily: fonts.medium,
    fontSize: 16,
  },
});

//make this component available to the app
export default Login;
