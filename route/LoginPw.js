// import { StatusBar } from "expo-status-bar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ImageBackground,
  TouchableNativeFeedback,
  Keyboard,
  StatusBar,
} from 'react-native';

import {Icon} from 'react-native-elements';

import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import {color, fonts, system_configuration} from '../config/Constant';
// const image = {uri: './img/mg.png'};
const image = require('../img/mg.png');
const imagelogo = require('../img/logomg.jpeg');
// create a component
const LoginPw = ({navigation, route}) => {
  // const [loading, set_loading]                = useState(false);
  // const [show_password, set_show_password]    = useState(false);
  
  const [staffNo, setStaffNo] = useState('');
  const [password, setPassword] = useState('');
  const [staffDetails, setStaffDetails] = useState({});
  const [outlet, setOutlet] = useState([]);
  const [outletName, setOutletName] = useState('');

  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [pw3, setPw3] = useState('');
  const [pw4, setPw4] = useState('');

  const ref_input1 = useRef('');
  const ref_input2 = useRef('');
  const ref_input3 = useRef('');
  const ref_input4 = useRef('');

  const [loading, setLoading] = useState(false);

  const url =
    system_configuration.ENVIRONMENT === 'development'
      ? system_configuration.REACT_APP_DEV_MODE
      : system_configuration.REACT_APP_PROD_MODE;

  const counterPOS = system_configuration.counterSecretKey;

  const _changePassword = async string_password => {
    console.log('PASSWORD : ', string_password);
  };

  const _loginPw = async () => {
    navigation.navigate('LoginPw');
  };

  const _login = async () => {
    navigation.navigate('Login');
  };

  const _screenOrder = async () => {
    // navigation.navigate('TypeOrder');
    navigation.navigate('_DrawerScreen', {
      screen: '_OrderScreen',
      params: {data: false},
    });
  };

  const _inputPw = e => {
    if (e && e != 'backspace') {
      //   if (value.length === 1) {
      //       ref_input1.current.focus();
      //   }
      // if input pw 1 empty
      // pw1 != "" ? setPw1(e) : setPw2(e);

      if (!pw1 && pw1.length == 0) {
        setPw1(e);
        ref_input2.current.focus();
      } else if (!pw2 && pw2.length == 0) {
        setPw2(e);
        ref_input3.current.focus();
      } else if (!pw3 && pw3.length == 0) {
        setPw3(e);
        ref_input4.current.focus();
      } else if (!pw4 && pw4.length == 0) {
        setPw4(e);
      }
      // if (pw1.length == 1) {
      //     ref_input2.current.focus();
      // }
    } else {
      //   setPassword(password.substring(0, password.length - 1));

      // alert('backspace');
      setPw1('');
      setPw2('');
      setPw3('');
      setPw4('');
      // console.log('e',e);

      // if (pw1 && pw1.length == 1 && ref_input1.current.focus()) {
      //   setPw1(pw1.substring(0, pw1.length - 1));
      //   ref_input1.current.focus();
      // } else if (pw2 && pw2.length == 1 && ref_input2.current.focus()) {
      //   setPw2(pw2.substring(0, pw2.length - 1));
      //   ref_input1.current.focus();
      // } else if (pw3 && pw3.length == 1 && ref_input3.current.focus()) {
      //   setPw3(pw3.substring(0, pw3.length - 1));
      //   ref_input2.current.focus();
      // } else if (pw4 && pw4.length == 1 && ref_input4.current.focus()) {
      //   alert('4');
      //   setPw4(pw4.substring(0, pw4.length - 1));
      //   ref_input3.current.focus();
      // }
    }

    // setStaffNo(e)
    console.log(pw1);
  };

  useEffect(() => {
    // console.log('effect', password);
    _fetchOutlet();
    _validateLogin();
  }, [password]);

  const _fetchOutlet = async () => {
    await axios
      .post(url + '/pos/getOutlet', {
        counter: counterPOS,
      })
      .then(async res => {
        // console.log(res.data);
        setOutlet(res.data.data);
        setOutletName(res.data.data[0].outlet_name);
      });
  };

  const validatePw = async e => {
    if (
      pw1.length == 1 &&
      pw2.length == 1 &&
      pw3.length == 1 &&
      pw4.length == 1
    ) {
      const fetchNoStaff = await AsyncStorage.getItem('staffno');
      let noStaff = JSON.parse(fetchNoStaff);
      setStaffNo(noStaff.noStaff);
      setPassword(pw1 + pw2 + pw3 + pw4);

      _validateLogin();
      // alert(password);
    }

    // _screenOrder()
  };

  const _validateLogin = async () => {
    let response;
    // alert(password);
    // alert(counterPOS);
    if (staffNo && password) {
      response = await axios
        .post(url + '/loginStaff', {
          noStaff: staffNo,
          pincodeStaff: password,
          counter: counterPOS,
        })
        .then(async function (resp) {
          await AsyncStorage.setItem('STAFF', JSON.stringify(resp.data.data));
          console.log('status', resp.data.status);
          if (resp.data.status == 200) {
            _screenOrder();
            // alert('Login Successful');
          }
          // console.log('status', resp.data.data);
          // _screenOrder();
        })
        .catch(async function (error) {
          alert('Unsuccessful Login');
          await AsyncStorage.removeItem('STAFF');
        });
    }
  };

  const _loading = async () => {
    if (loading == true) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      return (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  };

  return (
    <>
      <StatusBar hidden />
      <ImageBackground
        source={{
          uri: 'https://s3.ap-southeast-1.amazonaws.com/cdn.ngam.my/cuppa-coffee/front.jpg',
        }}
        style={styles.image}>
        <LinearGradient colors={['#000000', '#00000000']} style={styles.lg}>
          <SafeAreaView style={{flex: 1}}>
            <View style={styles.containerLogo}>
              <Image
                style={styles.stretch}
                source={{
                  uri: 'https://s3.ap-southeast-1.amazonaws.com/cdn.ngam.my/cuppa-coffee/logo.png',
                }}
              />
            </View>
            <View style={styles.container}>
              <Text
                style={{
                  fontFamily: fonts.semibold,
                  color: color.white,
                  fontSize: 16,
                  marginTop: 20,
                }}>
                Password
              </Text>

              <View style={{flexDirection: 'row'}}>
                <View style={{padding: 10}}>
                  <View style={styles.inputPw}>
                    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
                      <TextInput
                        style={styles.TextInput}
                        ref={ref_input1}
                        placeholderTextColor="#000000"
                        maxLength={1}
                        // defaultValue='1'
                        value={pw1}
                        // onChangeText={value => {
                        //   setPw1(value);
                        //   if (value.length === 1) {
                        //     ref_input2.current.focus();
                        //   }
                        // }}
                        secureTextEntry={true}
                        showSoftInputOnFocus={false}
                      />
                    </TouchableNativeFeedback>
                  </View>
                </View>

                <View style={{padding: 10}}>
                  <View style={styles.inputPw}>
                    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
                      <TextInput
                        style={styles.TextInput}
                        ref={ref_input2}
                        value={pw2}
                        maxLength={1}
                        placeholderTextColor="#000000"
                        secureTextEntry={true}
                        showSoftInputOnFocus={false}
                      />
                    </TouchableNativeFeedback>
                  </View>
                </View>

                <View style={{padding: 10}}>
                  <View style={styles.inputPw}>
                    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
                      <TextInput
                        style={styles.TextInput}
                        ref={ref_input3}
                        value={pw3}
                        maxLength={1}
                        placeholderTextColor="#000000"
                        secureTextEntry={true}
                        showSoftInputOnFocus={false}
                      />
                    </TouchableNativeFeedback>
                  </View>
                </View>

                <View style={{padding: 10}}>
                  <View style={styles.inputPw}>
                    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
                      <TextInput
                        style={styles.TextInput}
                        ref={ref_input4}
                        value={pw4}
                        maxLength={1}
                        placeholderTextColor="#000000"
                        secureTextEntry={true}
                        showSoftInputOnFocus={false}
                      />
                    </TouchableNativeFeedback>
                  </View>
                </View>
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
                      onPress={() => _inputPw('1')}>
                      <View style={styles.numpad}>
                        <Text style={styles.numpadNumber}>1</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{padding: 10}}>
                    <TouchableOpacity
                      style={styles.btnNumpad}
                      onPress={() => _inputPw('2')}>
                      <View style={styles.numpad}>
                        <Text style={styles.numpadNumber}>2</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{padding: 10}}>
                    <TouchableOpacity
                      style={styles.btnNumpad}
                      onPress={() => _inputPw('3')}>
                      <View style={styles.numpad}>
                        <Text style={styles.numpadNumber}>3</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{padding: 10}}>
                    <TouchableOpacity
                      style={styles.btnNumpad}
                      onPress={() => _inputPw('backspace')}>
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
                          onPress={() => _inputPw('4')}>
                          <View style={styles.numpad}>
                            <Text style={styles.numpadNumber}>4</Text>
                          </View>
                        </TouchableOpacity>
                      </View>

                      <View style={{padding: 10}}>
                        <TouchableOpacity
                          style={styles.btnNumpad}
                          onPress={() => _inputPw('5')}>
                          <View style={styles.numpad}>
                            <Text style={styles.numpadNumber}>5</Text>
                          </View>
                        </TouchableOpacity>
                      </View>

                      <View style={{padding: 10}}>
                        <TouchableOpacity
                          style={styles.btnNumpad}
                          onPress={() => _inputPw('6')}>
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
                          onPress={() => _inputPw('7')}>
                          <View style={styles.numpad}>
                            <Text style={styles.numpadNumber}>7</Text>
                          </View>
                        </TouchableOpacity>
                      </View>

                      <View style={{padding: 10}}>
                        <TouchableOpacity
                          style={styles.btnNumpad}
                          onPress={() => _inputPw('8')}>
                          <View style={styles.numpad}>
                            <Text style={styles.numpadNumber}>8</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={{padding: 10}}>
                        <TouchableOpacity
                          style={styles.btnNumpad}
                          onPress={() => _inputPw('9')}>
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
                        onPress={() => validatePw()}>
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
                      onPress={() => _inputPw('0')}>
                      <View style={styles.numpad}>
                        <Text style={styles.numpadNumber}>0</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

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
                      onPress={() => _login()}>
                      <Icon
                        name={'arrow-back-circle-outline'}
                        type="ionicon"
                        size={30}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={{position: 'absolute', bottom: 0, marginBottom: 30}}>
                <Text
                  style={{
                    fontFamily: fonts.semibold,
                    color: color.white,
                    fontSize: 21,
                    marginBottom: 10,
                    marginTop: 20,
                  }}>
                  {outletName}
                </Text>
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
    </>
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
    // paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stretch: {
    width: 140,
    height: 140,
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

  inputPw: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    width: 80,
    height: 45,
    marginBottom: 400,
    alignItems: 'center',
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    // marginLeft: 20,
    fontSize: 16,
    // justifyContent:'center'
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
});

//make this component available to the app
export default LoginPw;
