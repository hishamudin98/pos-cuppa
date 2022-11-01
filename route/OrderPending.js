//import liraries
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';

import {Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DataTable} from 'react-native-paper';
import Drawer from '../component/Drawer';

import {color, fonts, system_configuration} from '../config/Constant';
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

const url =
  system_configuration.ENVIRONMENT === 'development'
    ? system_configuration.REACT_APP_DEV_MODE
    : system_configuration.REACT_APP_PROD_MODE;

const counterPOS = system_configuration.counterSecretKey;

// create a component
const OrderPending = ({navigation, route}) => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionList, setTransactionList] = useState([]);
  const [modalQR, setModalQR] = useState(false);
  const [dataScan, setDataScan] = useState('');

  useEffect(() => {
    navigation.addListener('focus', function () {
      _fetchOrderPending();
      _startLoading();
    });
  }, []);

  const _startLoading = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const _fetchOrderPending = async () => {
    await axios
      .post(url + '/pos/getOrderPending', {counter: counterPOS})
      .then(res => {
        // setOrderList(res.data)
        setOrderList(res.data.data ? res.data.data : []);
        setTransactionList(res.data.data ? res.data.data : []);

        // console.log('ORDER PENDING : ', res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const _search = async search => {
    let transSearch = transactionList.filter(item => {
      return item.order_no.toLowerCase().includes(search.toLowerCase());
    });

    // console.log('menu search', menuSearch);
    setOrderList(transSearch);
  };

  const onSuccess = async e => {
    Alert.alert(
      'Confirmation',
      'Are you sure to proceed this order?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            setModalQR(false);
            navigation.navigate('Order', {
              screen: 'Checkout',
              params: {data: e.data},
            });
          },
        },
      ],
      {cancelable: false},
    );

    // setDataScan(e.data);
    // console.log(e.data);
    // alert(e.data);
  };

  return (
    <View style={styles.container}>
      {loading == true ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            width: '100%',
            height: '100%',
            // backgroundColor: 'red',
          }}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <StatusBar hidden />
          <View style={styles.header}>
            <Drawer navigation={navigation} />

            <View style={{flexDirection: 'row', flex: 1}}>
              <View style={{flexDirection: 'column', flex: 1}}>
                <View style={{marginTop: 30, marginLeft: 20}}>
                  <Text style={{fontFamily: fonts.semibold, fontSize: 20}}>
                    Order Pending
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}></View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 20,
                    marginTop: 20,
                    justifyContent: 'space-between',
                    // height: 50,
                  }}>
                  <View style={styles.inputSearch}>
                    <Icon name={'search'} type="feather" size={24} />
                    <View style={{flex: 1}}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Search"
                        placeholderTextColor={color.textGray}
                        onChangeText={text => _search(text)}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={{
                      backgroundColor: color.primary,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '20%',
                      borderRadius: 5,
                      // flex: 0.7,
                      marginRight: 20,
                      flexDirection: 'row',
                      // borderWidth: 1,
                      // borderColor:color.primary
                    }}
                    onPress={() => {
                      // navigation.navigate('QrScan');
                      _startLoading();
                      _fetchOrderPending();
                    }}>
                    <Text
                      style={{
                        ...styles.textFamily,
                        color: color.white,
                        marginLeft: 5,
                      }}>
                      Refresh
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      backgroundColor: color.primary,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '20%',
                      borderRadius: 5,
                      // flex: 0.7,
                      marginRight: 20,
                      flexDirection: 'row',
                      // borderWidth: 1,
                      // borderColor:color.primary
                    }}
                    onPress={() => {
                      // navigation.navigate('QrScan');
                      setModalQR(true);
                    }}>
                    <Icon
                      name={'camera'}
                      type="feather"
                      size={24}
                      color={color.white}
                    />
                    <Text
                      style={{
                        ...styles.textFamily,
                        color: color.white,
                        marginLeft: 5,
                      }}>
                      Scan QR Code
                    </Text>
                  </TouchableOpacity>
                </View>

                <Modal
                  animationType="fade"
                  visible={modalQR}
                  style={{...styles.modalView}}>
                  <View
                    style={{
                      alignItems: 'flex-start',
                      padding: 20,
                      paddingBottom: 0,
                    }}>
                    <Icon
                      name={'x'}
                      type="feather"
                      size={24}
                      onPress={() => {
                        setModalQR(!modalQR);
                        setDataScan('');
                      }}
                    />
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      // backgroundColor: 'green',
                    }}>
                    <QRCodeScanner
                      // reactivate={true}
                      onRead={read => onSuccess(read)}
                      flashMode={RNCamera.Constants.FlashMode.off}
                      // containerStyle={{flex: 1, backgroundColor: color.white, width:20, height:20}}
                      // topContent={
                      //   <Text style={styles.centerText}>
                      //     Go to{' '}
                      //     <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text>{' '}
                      //     on your computer and scan the QR code.
                      //   </Text>
                      // }
                      cameraContainerStyle={{
                        flex: 1,
                        backgroundColor: color.primary,
                      }}
                      cameraStyle={{
                        flex: 1,
                        backgroundColor: color.white,
                        width: 700,
                        height: 500,
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                </Modal>

                <View style={{flexDirection: 'row', marginTop: 20}}>
                  <View
                    style={{
                      backgroundColor: color.white,
                      flex: 1,
                      height: 'auto',
                      marginLeft: 20,
                      marginRight: 20,
                      marginBottom: 20,
                    }}>
                    <View style={{flexDirection: 'column', height: 'auto'}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          backgroundColor: color.primary,
                        }}>
                        <View
                          style={{
                            flex: 0.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 60,
                          }}>
                          <Text
                            style={{
                              ...styles.textFamily,
                              fontFamily: fonts.semibold,
                              color: color.white,
                            }}>
                            No.{' '}
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 1.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 60,
                          }}>
                          <Text
                            style={{
                              ...styles.textFamily,
                              fontFamily: fonts.semibold,
                              color: color.white,
                            }}>
                            Order No
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 60,
                          }}>
                          <Text
                            style={{
                              ...styles.textFamily,
                              fontFamily: fonts.semibold,
                              color: color.white,
                            }}>
                            Datetime
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 60,
                          }}>
                          <Text
                            style={{
                              ...styles.textFamily,
                              fontFamily: fonts.semibold,
                              color: color.white,
                            }}>
                            Table No
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 60,
                          }}>
                          <Text
                            style={{
                              ...styles.textFamily,
                              fontFamily: fonts.semibold,
                              color: color.white,
                            }}>
                            Total (RM)
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 0.7,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 60,
                          }}>
                          <Text
                            style={{
                              ...styles.textFamily,
                              fontFamily: fonts.semibold,
                              color: color.white,
                            }}>
                            Status
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 60,
                          }}>
                          <Text
                            style={{
                              ...styles.textFamily,
                              fontFamily: fonts.semibold,
                              color: color.white,
                            }}>
                            Action
                          </Text>
                        </View>
                      </View>
                      <View style={{height: 600}}>
                        <ScrollView>
                          {orderList.map((item, index) => {
                            return (
                              <View style={{flexDirection: 'row'}}>
                                <View
                                  style={{
                                    flex: 0.5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 60,
                                  }}>
                                  <Text style={styles.textFamily}>
                                    {index + 1}.
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flex: 1.5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 60,
                                  }}>
                                  <Text style={styles.textFamily}>
                                    {item.order_no}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 60,
                                  }}>
                                  <Text style={styles.textFamily}>
                                    {moment(item.order_datetime).format(
                                      'h:mm A DD-MM-YYYY',
                                    )}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 60,
                                  }}>
                                  <Text style={styles.textFamily}>
                                    {item.order_tableNo}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 60,
                                  }}>
                                  <Text style={styles.textFamily}>
                                    {item.order_total_amount}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 60,
                                    flex: 0.7,
                                  }}>
                                  <View
                                    style={{
                                      backgroundColor: color.warning,
                                      height: 30,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      width: 100,
                                      borderRadius: 5,
                                      flex: 0.7,
                                      // borderWidth: 1,
                                      // borderColor:color.primary
                                    }}>
                                    <Text
                                      style={{
                                        ...styles.textFamily,
                                        color: color.white,
                                      }}>
                                      {item.order_status == 2
                                        ? 'Pending'
                                        : null}
                                    </Text>
                                  </View>
                                </View>
                                <View
                                  style={{
                                    flex: 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 60,
                                    flexDirection: 'row',
                                  }}>
                                  <TouchableOpacity
                                    style={{
                                      backgroundColor: color.primary,
                                      height: 30,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      width: 90,
                                      borderRadius: 5,
                                      marginRight: 10,
                                      // borderWidth: 1,
                                      // borderColor:color.primary
                                    }}
                                    onPress={async () => {
                                      await AsyncStorage.removeItem('ORDER');
                                      await AsyncStorage.removeItem(
                                        'DATA_ORDER',
                                      );
                                      await AsyncStorage.removeItem(
                                        'DISCOUNT_ORDER',
                                      );
                                      await AsyncStorage.removeItem(
                                        'ORDER_TAKEAWAY',
                                      );
                                      await AsyncStorage.removeItem('CUSTOMER');

                                      navigation.navigate('Order', {
                                        screen: 'MenuOrder',
                                        params: {data: item.order_no},
                                      });
                                    }}>
                                    <Text
                                      style={{
                                        ...styles.textFamily,
                                        color: color.white,
                                      }}>
                                      Edit
                                    </Text>
                                  </TouchableOpacity>

                                  <TouchableOpacity
                                    style={{
                                      backgroundColor: color.primary,
                                      height: 30,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      width: 90,
                                      borderRadius: 5,
                                      // borderWidth: 1,
                                      // borderColor:color.primary
                                    }}
                                    onPress={() => {
                                      AsyncStorage.removeItem('ORDER');
                                      AsyncStorage.removeItem('DATA_ORDER');
                                      AsyncStorage.removeItem('DISCOUNT_ORDER');
                                      AsyncStorage.removeItem('ORDER_TAKEAWAY');
                                      AsyncStorage.removeItem('CUSTOMER');

                                      navigation.navigate('Order', {
                                        screen: 'Checkout',
                                        params: {data: item.order_no},
                                      });
                                    }}>
                                    <Text
                                      style={{
                                        ...styles.textFamily,
                                        color: color.white,
                                      }}>
                                      Pay
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            );
                          })}
                        </ScrollView>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },

  textFamily: {
    fontFamily: fonts.medium,
    fontSize: 16,
  },

  inputSearch: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // alignContent:'center',
    backgroundColor: color.white,
    borderRadius: 5,
    width: '30%',
    height: 40,
    paddingLeft: 10,
    marginRight: 40,
  },

  textInput: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    flex: 1,
    padding: 10,
    // marginLeft: 20,
    fontSize: 16,
    fontFamily: fonts.medium,
    backgroundColor: color.white,
    borderRadius: 5,
    // flexDirection: 'row',
    // width:'100%'

    // backgroundColor: 'pink',
  },

  header: {
    flexDirection: 'row',
    flex: 1,
  },

  modalView: {
    justifyContent: 'flex-start',
    flex: 1,
    // alignContent:'center',
    // margin: 100,
    // width: 800,
    // height:'50%',
    // marginLeft: 'auto',
    marginBottom: 100,
    marginTop: 100,
    // marginRight: 'auto',
    // backgroundColor: 'pink',
    // margin: 50,
    backgroundColor: color.background,
    borderRadius: 20,
    // padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    // opacity:0.6,
    // elevation: 5,
    // justifyContent: 'center',
  },
});

//make this component available to the app
export default OrderPending;
