//import liraries
import axios from 'axios';
import moment from 'moment';
import React, {Component, useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Drawer from '../component/Drawer';
import {
  color,
  fonts,
  system_configuration,
  container,
} from '../config/Constant';

const url =
  system_configuration.ENVIRONMENT === 'development'
    ? system_configuration.REACT_APP_DEV_MODE
    : system_configuration.REACT_APP_PROD_MODE;

const counterPOS = system_configuration.counterSecretKey;

// create a component
const KDS = ({navigation, route}) => {
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    navigation.addListener('focus', function () {
      _fetchOrder();
    });
  }, []);

  const _fetchOrder = async () => {
    console.log('fetch order');
    await axios
      .post(url + '/pos/getOrderKDS', {counter: counterPOS})
      .then(async res => {
        // setOrderList(res.data)
        setOrderList(res.data.data ? res.data.data : []);
        // await AsyncStorage.setItem('ORDER_KDS', JSON.stringify(res.data.data));

        console.log('ORDER : ', res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const _fetchOrderDetails = async orderNo => {
    await axios
      .post(url + '/pos/getOrderDetails', {order_no: orderNo})
      .then(async res => {
        // setOrderList(res.data)
        setOrderList(res.data.data ? res.data.data : []);
        // await AsyncStorage.setItem('ORDER_KDS', JSON.stringify(res.data.data));

        console.log('ORDER : ', res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{flexDirection: 'column', flex: 1}}>
            <View style={{marginTop: 30, marginLeft: 20}}>
              <Text style={{fontFamily: fonts.semibold, fontSize: 20}}>
                Orders
              </Text>
            </View>

            <View
              style={{
                marginTop: 30,
                marginLeft: 20,
                // backgroundColor: 'powderblue',
                marginRight: 20,
                flex: 1,
              }}>
              <ScrollView
                style={{flexDirection: 'row', flex: 1}}
                horizontal={true}>
                {orderList.map((item, index) => {
                  let orderDetail = JSON.parse(item.order_detail);
                  const allOrderType = orderDetail.map(x => x.orderType);

                  getOrderType = allOrderType.filter((item, index) => {
                    return allOrderType.indexOf(item) === index;
                  });
                  console.log('ORDER TYPE ID : ', getOrderType);

                  //   _fetchOrderDetails(item.order_no);
                  return (
                    <View
                      style={{
                        flex: 1,
                        width: 0.25 * container.width,
                        backgroundColor: color.white,
                        //   height: 20,
                        borderRadius: 5,
                        marginLeft: index == 0 ? 0 : 10,
                      }}>
                      <View
                        style={{
                          backgroundColor: 'brown',
                          height: 70,
                          borderRadius: 5,

                          //   justifyContent: 'center',
                          //   alignItems: 'center',
                        }}>
                        <View
                          style={{
                            marginTop: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{fontFamily: fonts.regular, fontSize: 20}}>
                            {item.order_tableNo}
                          </Text>
                        </View>
                        <View
                          style={{
                            marginTop: 5,
                            marginLeft: 10,
                          }}>
                          <Text style={{fontFamily: fonts.regular}}>
                            {moment(item.order_datetime).format('HH:mm')}
                            {', '}
                            {item.order_customerName}
                          </Text>
                        </View>
                      </View>

                      {getOrderType.map((item, index) => {
                        return (
                          <View>
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  fontFamily: fonts.bold,
                                  fontSize: 20,
                                }}>
                                {item == 1
                                  ? 'Dine In'
                                  : item == 2
                                  ? 'Takeaway'
                                  : item == 3
                                  ? 'Pickup'
                                  : item == 4
                                  ? 'Delivery'
                                  : item == 5
                                  ? 'Drive In'
                                  : item == 6
                                  ? 'Pre Order'
                                  : null}
                              </Text>
                            </View>

                            {orderDetail.map((data, index) => {
                              if (item === data.orderType) {
                                // let variant = data.menu_variant ? JSON.parse(data.menu_variant) : [];
                                console.log('VARIANT : ', data.menu_variant);
                                let variant = data.menu_variant;
                                return (
                                  <View
                                    style={{
                                    //   backgroundColor: 'powderblue',
                                      //   height: 30,
                                      justifyContent: 'center',
                                      //   alignItems: 'center',
                                      marginLeft: 10,
                                      borderTopEndRadius: 5,
                                      borderTopStartRadius: 5,
                                      marginBottom: 15,
                                    }}>
                                    <Text
                                      style={{
                                        fontFamily: fonts.semibold,
                                        // fontSize: 20,
                                      }}>
                                      {data.menu_quantity} x {data.menu_name}
                                    </Text>

                                    {variant.length > 0
                                      ? variant.map((variant, index) => {
                                          return (
                                            <Text
                                              style={{
                                                fontFamily: fonts.regular,
                                                // fontSize: 20,
                                              }}>
                                              {' '}
                                              - {variant.name}{' '}
                                              {variant.variant_quantity}
                                            </Text>
                                          );
                                        })
                                      : null}

                                    {data.menu_remark ? (
                                      <Text
                                        style={{
                                          fontFamily: fonts.regular,
                                          // fontSize: 20,
                                        }}>
                                        {' '}
                                        - {data.menu_remark}{' '}
                                      </Text>
                                    ) : null}
                                  </View>
                                );
                              }
                            })}
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </ScrollView>
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

  header: {
    flexDirection: 'row',
    flex: 1,
  },
});

//make this component available to the app
export default KDS;
