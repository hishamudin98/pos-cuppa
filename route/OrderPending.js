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
} from 'react-native';
import {Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DataTable} from 'react-native-paper';
import Drawer from '../component/Drawer';

import {color, fonts, system_configuration} from '../config/Constant';
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url =
  system_configuration.ENVIRONMENT === 'development'
    ? system_configuration.REACT_APP_DEV_MODE
    : system_configuration.REACT_APP_PROD_MODE;

const counterPOS = system_configuration.counterSecretKey;

// create a component
const OrderPending = ({navigation, route}) => {
  const [orderList, setOrderList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);

  useEffect(() => {
    navigation.addListener('focus', function () {
      _fetchOrderPending();
    });
  }, []);

  const _fetchOrderPending = async () => {
    await axios
      .get(url + '/pos/getOrderPending')
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

  return (
    <View style={styles.container}>
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 20,
                marginTop: 20,
                // height: 50,
              }}>
              <View style={styles.inputSearch}>
                <Icon
                  name={'search'}
                  type="feather"
                  size={24}
                  // style={{position: 'absolute', margin: 100}}
                />
                <View style={{flex: 1}}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Search"
                    placeholderTextColor={color.textGray}
                    onChangeText={text => _search(text)}
                  />
                </View>
              </View>
            </View>

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
                  <View style={{flexDirection: 'row'}}>
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
                                  {item.order_status == 2 ? 'Pending' : null}
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
                                  await AsyncStorage.removeItem('DATA_ORDER');
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
                                <Text style={{...styles.textFamily, color:color.white}}>Edit</Text>
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
                                <Text style={{...styles.textFamily, color:color.white}}>Pay</Text>
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
    flexDirection: 'row',
    // width:'100%'

    // backgroundColor: 'pink',
  },

  header: {
    flexDirection: 'row',
    flex: 1,
  },
});

//make this component available to the app
export default OrderPending;
