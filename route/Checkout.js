//import liraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  Pressable,
  Button,
  TextInput,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {color, fonts, system_configuration} from '../config/Constant';

const url =
  system_configuration.ENVIRONMENT === 'development'
    ? system_configuration.REACT_APP_DEV_MODE
    : system_configuration.REACT_APP_PROD_MODE;

const counterPOS = system_configuration.counterSecretKey;

// create a component
const Checkout = ({navigation, route}) => {
  const [itemQuantity, setItemQuantity] = useState(0);
  const [viewPaymentMethod, setViewPaymentMethod] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectPaymentMethod, setSelectPaymentMethod] = useState('');
  const [dataOrder, setDataOrder] = useState([]);
  const [orderCart, setOrderCart] = useState([]);
  const [selectTable, setSelectTable] = useState('');
  const [selectOrderType, setSelectOrderType] = useState('');
  const [selectOrderTypeId, setSelectOrderTypeId] = useState(0);

  const [amountOrder, setAmountOrder] = useState(0);
  const [amountOrderDisplay, setAmountOrderDisplay] = useState('');
  const [totalAmountOrder, setTotalAmountOrder] = useState(0);
  const [totalAmountOrderDisplay, setTotalAmountOrderDisplay] = useState('');
  const [amountDiscount, setAmountDiscount] = useState(0);
  const [amountDiscountDisplay, setAmountDiscountDisplay] = useState('');
  const [tax, setTax] = useState(0);
  const [taxDisplay, setTaxDisplay] = useState('');
  const [serviceCharge, setServiceCharge] = useState(0);
  const [serviceChargeDisplay, setServiceChargeDisplay] = useState('');

  const [counter, setCounter] = useState('');
  const [discountType, setDiscountType] = useState('');

  const [cashValue, setCashValue] = useState('');
  const [cardValue, setCardValue] = useState('');
  const [lengthNumber, setLengthNumber] = useState(0);

  const [ccInvoiceNo, setCCInvoiceNo] = useState('');
  const [orderCartTakeAway, setOrderCartTakeAway] = useState([]);

  const [membershipDiscount, setMembershipDiscount] = useState(0);
  const [outletDiscount, setOutletDiscount] = useState(0);

  useEffect(() => {
    navigation.addListener('focus', function () {
      _getStaff();
      _fetchUserCart();
      _getCustomer();
      _fetchOrder();
      _fetchOrderNo();
      // _calculateTotal();
      // calculate_total_price_in_cart();
    });
  }, []);

  const _getStaff = async () => {
    AsyncStorage.getItem('STAFF')
      .then(function (resp) {
        let stgParsed = JSON.parse(resp);
        console.log('User', stgParsed);
        setStaffName(stgParsed.staffName);
      })
      .catch(e => {});
  };

  const _getCustomer = async () => {
    let customer = await AsyncStorage.getItem('CUSTOMER');
    let custParsed = JSON.parse(customer);

    console.log('Customerrrrr', custParsed);
    setSelectOrderType(custParsed.order_type);
    setSelectTable(custParsed.table_name);
    setSelectOrderTypeId(custParsed.order_typeId);
  };

  const _fetchOrderNo = async () => {
    let orderNo = route.params.data;
    await AsyncStorage.setItem('ORDER_NO', JSON.stringify(orderNo));

    const fetchOrder = await AsyncStorage.getItem('DATA_ORDER');
    let fetchOrderParsed = JSON.parse(fetchOrder);

    let customerDetails = null;
    let customer = [];

    if (orderNo && fetchOrderParsed == null) {
      await axios
        .post(url + '/pos/getOrderCartPOS', {
          order_no: orderNo,
        })
        .then(async res => {
          let data = res.data.data;
          let dataOrderParsed = res.data.data;
          let orderParsed = JSON.parse(res.data.data.order);

          await AsyncStorage.setItem('ORDER_PENDING', JSON.stringify(data));

          console.log('Ordertable', orderParsed);
          setSelectTable('Table ' + orderParsed[0].tableNo);

          const dineIn = orderParsed.filter(item => item.orderType == '1');
          const takeaway = orderParsed.filter(item => item.orderType == '2');

          customer = [
            {
              customer_name: data.customerName,
              customer_phone: data.customerPhoneNo,
            },
          ];

          if (dineIn.length > 0 && takeaway.length > 0) {
            setSelectOrderType('Dine In');
            setSelectOrderTypeId(1);

            setOrderCart(dineIn);
            setOrderCartTakeAway(takeaway);
            await AsyncStorage.setItem('ORDER', JSON.stringify(dineIn));
            await AsyncStorage.setItem(
              'ORDER_TAKEAWAY',
              JSON.stringify(takeaway),
            );

            customerDetails = {
              order_type: 'Dine In',
              order_typeId: 1,
              table_id: Number(data.tableNo),
              table_name: 'Table ' + data.tableNo,
              customer: customer,
            };
          } else if (dineIn.length > 0 && takeaway.length == 0) {
            setSelectOrderType('Dine In');
            setSelectOrderTypeId(1);

            setOrderCart(dineIn);
            await AsyncStorage.setItem('ORDER', JSON.stringify(orderParsed));

            customerDetails = {
              order_type: 'Take Away',
              order_typeId: 2,
              table_id: Number(data.tableNo),
              table_name: 'Table ' + data.tableNo,
              customer: customer,
            };
          } else if (dineIn.length == 0 && takeaway.length > 0) {
            setSelectOrderType('Take Away');
            setSelectOrderTypeId(2);

            setOrderCart(takeaway);
            await AsyncStorage.setItem('ORDER', JSON.stringify(takeaway));

            customerDetails = {
              order_type: 'Dine In',
              order_typeId: 1,
              table_id: Number(data.tableNo),
              table_name: 'Table ' + data.tableNo,
              customer: customer,
            };
          }

          console.log('CustomerDetails', customerDetails);

          await AsyncStorage.setItem(
            'CUSTOMER',
            JSON.stringify(customerDetails),
          );

          setAmountOrder(dataOrderParsed.amt);
          setAmountOrderDisplay(
            dataOrderParsed.amt
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          );

          setTotalAmountOrder(dataOrderParsed.totalAmt);
          setTotalAmountOrderDisplay(
            dataOrderParsed.totalAmt
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          );

          setCashValue(dataOrderParsed.totalAmt.toFixed(2));
          setAmountDiscount(dataOrderParsed.discount);
          setAmountDiscountDisplay(
            dataOrderParsed.discount
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          );
          setTax(dataOrderParsed.tax);
          setTaxDisplay(
            dataOrderParsed.tax
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          );

          setServiceCharge(dataOrderParsed.serviceCharge);
          setServiceChargeDisplay(
            dataOrderParsed.serviceCharge
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          );

          // setCounter('');
          setDiscountType('');
          setDataOrder(dataOrderParsed);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const _fetchUserCart = async () => {
    // AsyncStorage.removeItem('ORDER');
    const fetchOrderCart = await AsyncStorage.getItem('ORDER');
    let stgParsed = JSON.parse(fetchOrderCart);

    const fetchOrderCartTakeAway = await AsyncStorage.getItem('ORDER_TAKEAWAY');
    let takeAwayParsed = JSON.parse(fetchOrderCartTakeAway);

    if (stgParsed.length > 0) {
      setOrderCart(stgParsed);
    } else {
      setOrderCart([]);
    }

    if (takeAwayParsed.length > 0) {
      setOrderCartTakeAway(takeAwayParsed);
      setPlusTakeway(true);
    } else {
      setOrderCartTakeAway([]);
      setPlusTakeway(false);
    }
  };

  const _fetchOrder = async () => {
    const fetchDataOrder = await AsyncStorage.getItem('DATA_ORDER');
    let dataOrderParsed = JSON.parse(fetchDataOrder);

    let membership_discountPercent = 0.07; // config membership discount
    let outlet_discount = 70; // config outlet discount
    let outlet_discountPercent = 0.1; // config outlet discount percent
    let discountOutlet = 0;
    let discountMembership = 0;

    console.log('Data Order', dataOrderParsed);
    if (dataOrderParsed) {
      setAmountOrder(dataOrderParsed.amt);
      setAmountOrderDisplay(
        dataOrderParsed.amt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      );

      setTotalAmountOrder(dataOrderParsed.totalAmt);
      setTotalAmountOrderDisplay(
        dataOrderParsed.totalAmt
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      );

      setCashValue(dataOrderParsed.totalAmt.toFixed(2));
      setAmountDiscount(dataOrderParsed.discount);
      setAmountDiscountDisplay(
        dataOrderParsed.discount
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      );

      setTax(dataOrderParsed.tax);
      setTaxDisplay(
        dataOrderParsed.tax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      );

      setServiceCharge(dataOrderParsed.serviceCharge);
      setServiceChargeDisplay(
        dataOrderParsed.serviceCharge
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      );

      // setCounter(dataOrderParsed.counter);
      setDiscountType(dataOrderParsed.discountType);
      setDataOrder(dataOrderParsed);
      setOrderCartTakeAway(dataOrderParsed.orderTakeAway);

      if (dataOrderParsed.membershipDiscount === true) {
        discountMembership =
          dataOrderParsed.totalAmt * membership_discountPercent;
        setMembershipDiscount(discountMembership);
      }

      if (dataOrderParsed.totalAmt > outlet_discount) {
        discountOutlet = dataOrderParsed.totalAmt * outlet_discountPercent;
        setOutletDiscount(discountOutlet);
      }
    } else {
      setDataOrder([]);
    }

    // let cc = Math.floor(94.5);
    // let lengthNumber = dataOrderParsed.totalAmt.toString().length;

    // setLengthNumber(lengthNumber);
    // console.log('Length', cc);
  };

  const _clickPayment = value => {
    setViewPaymentMethod(false);
    setPaymentMethod(value);

    if (value === 'cash') {
      setSelectPaymentMethod('1');
    }
    if (value === 'card') {
      setSelectPaymentMethod('3');
    }
    // alert(value);
  };

  const _cashInput = e => {
    if (e != 'backspace') {
      cashValue != '' ? setCashValue(cashValue + e) : setCashValue(e);
    } else {
      // console.log(cashValue);
      setCashValue(cashValue.substring(0, cashValue.length - 1));
    }
  };

  const _cardInput = e => {
    if (e != 'backspace') {
      cardValue != '' ? setCardValue(cardValue + e) : setCardValue(e);
    } else {
      // console.log(cashValue);
      setCardValue(cardValue.substring(0, cardValue.length - 1));
    }
  };

  const _confirmPayment = async () => {
    const fetchOrderNo = await AsyncStorage.getItem('ORDER_NO');
    let orderNoParsed = JSON.parse(fetchOrderNo);
    let dataPayment = {};
    let orderTypeId = null;
    let customerDetails = null;

    let fetchStaff = await AsyncStorage.getItem('STAFF');
    let staffParsed = JSON.parse(fetchStaff);

    let fetchCustomer = await AsyncStorage.getItem('CUSTOMER');
    let customerParsed = JSON.parse(fetchCustomer);

    let fetchOrderPending = await AsyncStorage.getItem('ORDER_PENDING');
    let orderPending = JSON.parse(fetchOrderPending);

    console.log('ORDER_PENDING BObo', orderPending);
    if (orderPending) {
      orderPending.order = JSON.parse(orderPending.order);

      await AsyncStorage.setItem('DATA_ORDER', JSON.stringify(orderPending));
    }

    const fetchOrderUser = await AsyncStorage.getItem('DATA_ORDER');
    let orderParsed = JSON.parse(fetchOrderUser);

    console.log('Order No', orderNoParsed);
    console.log('payment method', paymentMethod);
    console.log('url', url);
    console.log('order', orderParsed);

    if (customerParsed != null) {
      orderTypeId = customerParsed.order_typeId;
      customerDetails = customerParsed;
    } else {
      orderTypeId = selectOrderTypeId;
      // customerDetails = customerParsed;
    }

    dataPayment = {
      amt: amountOrder,
      totalAmt: totalAmountOrder,
      discount: amountDiscount,
      counter: counterPOS,
      payment_method: selectPaymentMethod,
      customer: customerParsed,
      cc_invoiceNo: ccInvoiceNo,
      order_no: orderNoParsed,
      order: orderParsed,
      orderTypeId: customerParsed.order_typeId,
      staff: staffParsed.staffId,
    };

    console.log('cash value', cashValue);
    console.log('totalAmountOrder', totalAmountOrder);

    if (paymentMethod === 'cash') {
      if (Number(cashValue) < Number(totalAmountOrder.toFixed(2))) {
        alert('Cash amount is not enough');
        return;
      }
      dataPayment.cc_invoiceNo = null;
    } else if (paymentMethod === 'card') {
      if (cardValue === '') {
        alert('Please enter invoice number');
        return;
      }
      dataPayment.cc_invoiceNo = cardValue;
    }

    await axios
      .post(url + '/pos/paymentOrder', dataPayment)
      .then(async function (resp) {
        console.log('paymentMethod', paymentMethod);
        console.log('Payment', resp);

        console.log('order no', resp.data);
        // _screenCheckout();
        // fetch order no
        if (resp.data.status == 200) {
          await AsyncStorage.removeItem('ORDER');
          await AsyncStorage.removeItem('ORDER_NO');
          await AsyncStorage.removeItem('DATA_ORDER');
          await AsyncStorage.removeItem('ORDER_TAKEAWAY');
          await AsyncStorage.removeItem('DISCOUNT_ORDER');
          await AsyncStorage.removeItem('CUSTOMER');
          await AsyncStorage.removeItem('ORDER_PENDING');

          console.log('order no 123', orderNoParsed);

          Alert.alert('Print Receipt', 'Do you want to print receipt?', [
            {
              text: 'No',
              onPress: async () => {
                await navigation.reset({
                  index: 0,
                  routes: [{name: 'TypeOrder'}],
                });

                await axios
                  .post(url + '/pos/printReceipt', {
                    order_no: orderNoParsed,
                    receipt: 'N',
                    counter: counterPOS,
                  })
                  .then(async function (resp) {
                    // console.log('Print Receipt', resp);
                  });

                
              },
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: async () => {
                await navigation.reset({
                  index: 0,
                  routes: [{name: 'TypeOrder'}],
                });

                await axios
                  .post(url + '/pos/printReceipt', {
                    order_no: orderNoParsed,
                    receipt: 'Y',
                    counter: counterPOS,
                  })
                  .then(async function (resp) {
                    // console.log('Print Receipt', resp);
                  });

               
                // set loading
                // print receipt
              },
            },
          ]);
        }
      })
      .catch(async function (error) {
        console.log('Payment Failed', error);
        alert('Payment Failed');
        // await AsyncStorage.removeItem('STAFF');
      });

    // AsyncStorage.setItem('DATA_ORDER', JSON.stringify(dataOrder));
    // navigation.navigate('Payment');
  };

  const _changeOrder = async () => {
    const fetchOrderNo = await AsyncStorage.getItem('ORDER_NO');
    let orderNoParsed = JSON.parse(fetchOrderNo);
    await AsyncStorage.removeItem('ORDER_PENDING');

    navigation.navigate('Order', {
      screen: 'MenuOrder',
      params: {data: orderNoParsed},
    });
  };

  const _cancelOrder = async () => {
    const fetchOrderNo = await AsyncStorage.getItem('ORDER_NO');
    let orderNo = JSON.parse(fetchOrderNo);
    console.log('order no', orderNo);

    await axios
      .post(url + '/pos/cancelOrder', {order_no: orderNo})
      .then(async function (resp) {
        console.log('Cancel Order', resp);
        await AsyncStorage.removeItem('ORDER');
        await AsyncStorage.removeItem('ORDER_NO');
        await AsyncStorage.removeItem('DATA_ORDER');
        await AsyncStorage.removeItem('ORDER_TAKEAWAY');
        await AsyncStorage.removeItem('DISCOUNT_ORDER');
        await AsyncStorage.removeItem('CUSTOMER');
        await AsyncStorage.removeItem('ORDER_PENDING');

        navigation.reset({
          index: 0,
          routes: [{name: 'TypeOrder'}],
        });
      });
  };

  const _viewCash = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          flex: 6.22,
          // margin:20,
          marginTop: 20,
          height: '100%',
          // marginTop: 0,

          //   justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            //   justifyContent: 'center',
            //   alignItems: 'center',
            justifyContent: 'space-between',
            // marginTop: 0,
            height: '30%',
            marginBottom: 0,
            // backgroundColor:'green'
          }}>
          <View
            style={[styles.boxPaymentSelect, {backgroundColor: color.primary}]}>
            <View>
              <View style={{marginBottom: 15}}>
                <Icon name={'cash-outline'} type="ionicon" size={28} />
              </View>
              <Text style={styles.textFamily}>Cash</Text>
            </View>
          </View>

          <View style={{flexDirection: 'column'}}>
            <TouchableOpacity
              style={[styles.boxChangePayment, {}]}
              onPress={() => {
                setViewPaymentMethod(true);
                setPaymentMethod('');
                setSelectPaymentMethod('');
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor:'pink'
                }}>
                <View style={{marginRight: 10}}>
                  <Icon name={'arrow-left'} type="feather" size={24} />
                </View>
                <Text style={styles.textFamily}>Change Payment Method</Text>
              </View>
            </TouchableOpacity>

            <View
              style={{
                marginTop: 10,
                marginLeft: 20,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                // backgroundColor: color.primary,
                marginRight: 20,
              }}>
              <Text style={{...styles.textFamily, fontFamily: fonts.semibold}}>
                Balance :{' '}
              </Text>
              <Text
                style={{
                  // ...styles.textFamily,
                  // fontFamily: fonts.bold,
                  // fontSize: 23,
                  fontFamily: fonts.bold,
                  fontSize: 35,
                }}>
                RM{' '}
                {(cashValue - totalAmountOrder.toFixed(2))
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            //   justifyContent: 'center',
            //   alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 1}}>
            <TextInput
              style={[
                //   styles.boxPayment,
                styles.textFamily,
                {
                  backgroundColor: color.background,
                  borderRadius: 5,
                  marginRight: 20,
                  height: 40,
                  marginLeft: 20,
                  alignItems: 'center',
                  textAlign: 'center',
                  paddingRight: 20,
                  paddingLeft: 20,
                },
              ]}
              placeholder="Enter Value"
              value={cashValue}
              defaultValue={cashValue}
              onChangeText={text => {
                setCashValue(text);
              }}
            />
          </View>

          <TouchableOpacity
            style={[
              //   styles.boxPayment,
              {
                marginTop: 15,
                marginTop: 0,
                marginLeft: 0,
                marginRight: 20,
                height: 40,
                // width: 150,
                // flex: 1,
                backgroundColor: color.primary,

                margin: 20,
                // width: 167,
                justifyContent: 'center',
                alignItems: 'center',
                // height: '80%',
                borderRadius: 5,
              },
            ]}
            onPress={() => {
              setCashValue(totalAmountOrder.toFixed(2));
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '35%',
                // backgroundColor:'pink'
              }}>
              <Text style={{...styles.textFamily, color: color.white}}>
                Exact
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* {Suggested value} */}

        <View
          style={{
            flexDirection: 'row',
            //   justifyContent: 'center',
            //   alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity
            style={[
              styles.boxNumber,
              {height: 40, marginTop: 0, marginRight: 0},
            ]}
            onPress={() => {
              setCashValue(Math.ceil(totalAmountOrder).toFixed(2));
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: 'black',
              }}>
              <Text style={styles.textFamily}>
                {Math.ceil(totalAmountOrder).toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boxNumber]}
            onPress={() => {
              setCashValue(
                (Math.round((totalAmountOrder + 5) / 10) * 10).toFixed(2),
              );
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.textFamily}>
                {(Math.round((totalAmountOrder + 5) / 10) * 10).toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.boxNumber]}
            onPress={() => {
              setCashValue(
                (Math.round((totalAmountOrder + 10) / 10) * 10).toFixed(2),
              );
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.textFamily}>
                {(Math.round((totalAmountOrder + 10) / 10) * 10).toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.boxNumber, {marginRight: 20}]}
            onPress={() => {
              setCashValue(
                (Math.round((totalAmountOrder + 20) / 10) * 10).toFixed(2),
              );
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.textFamily}>
                {(Math.round((totalAmountOrder + 20) / 10) * 10).toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* {ROW NUMBER} */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity
            style={[
              styles.boxNumber,
              {height: 40, marginTop: 0, marginRight: 0},
            ]}
            onPress={() => {
              _cashInput('1');
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: 'black',
              }}>
              <Text style={styles.textFamily}>1</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boxNumber]}
            onPress={() => {
              _cashInput('2');
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.textFamily}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.boxNumber]}
            onPress={() => {
              _cashInput('3');
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.textFamily}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.boxNumber, {marginRight: 20}]}
            onPress={() => {
              _cashInput('backspace');
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name={'backspace-outline'} type="ionicon" size={24} />
            </View>
          </TouchableOpacity>
        </View>

        {/* {ROW NUMBER 2} */}

        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'column'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <TouchableOpacity
                style={[
                  styles.boxNumber,
                  {height: 40, marginTop: 0, marginRight: 0},
                ]}
                onPress={() => {
                  _cashInput('4');
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: 'black',
                  }}>
                  <Text style={styles.textFamily}>4</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boxNumber]}
                onPress={() => {
                  _cashInput('5');
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.textFamily}>5</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boxNumber]}
                onPress={() => {
                  _cashInput('6');
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.textFamily}>6</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* {ROW NUMBER 3} */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <TouchableOpacity
                style={[
                  styles.boxNumber,
                  {height: 40, marginTop: 0, marginRight: 0},
                ]}
                onPress={() => {
                  _cashInput('7');
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: 'black',
                  }}>
                  <Text style={styles.textFamily}>7</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boxNumber]}
                onPress={() => {
                  _cashInput('8');
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.textFamily}>8</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boxNumber]}
                onPress={() => {
                  _cashInput('9');
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.textFamily}>9</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              // alignItems:'center',
              // flex: 1,
              alignSelf: 'center',
              alignContent: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            <TouchableOpacity style={[styles.boxNumber2, {height: 100}]}>
              <View
                style={{
                  // flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name={'arrow-forward-circle-outline'}
                  type="ionicon"
                  size={24}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* {ROW NUMBER} */}
        <View
          style={{
            flexDirection: 'row',
            //   justifyContent: 'center',
            //   alignItems: 'center',
            justifyContent: 'space-evenly',
            marginTop: 0,
            // height: 40,
            marginBottom: 0,
          }}>
          <TouchableOpacity
            style={[
              styles.boxNumber,
              {
                height: 40,
                marginTop: 0,
                marginRight: 0,
                opacity: 0,
                height: 0,
              },
            ]}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: 'black',
              }}>
              <Text style={styles.textFamily}>1</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.boxNumber]}
            onPress={() => {
              _cashInput('0');
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.textFamily}>0</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.boxNumber]}
            onPress={() => {
              _cashInput('.');
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.textFamily}>.</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.boxNumber,
              {marginRight: 20, opacity: 0, height: 0},
            ]}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name={'backspace-outline'} type="ionicon" size={24} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const _viewCard = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          flex: 6.22,
          // margin:20,
          marginTop: 20,
          height: '100%',
          // marginTop: 0,

          //   justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            //   justifyContent: 'center',
            //   alignItems: 'center',
            justifyContent: 'space-between',
            // marginTop: 0,
            height: '30%',
            marginBottom: 0,
            // backgroundColor:'green'
          }}>
          <View
            style={[styles.boxPaymentSelect, {backgroundColor: color.primary}]}>
            <View>
              <View style={{marginBottom: 15}}>
                <Icon name={'card-outline'} type="ionicon" size={28} />
              </View>
              <Text style={styles.textFamily}>Credit/Debit Card</Text>
            </View>
          </View>

          <View>
            <TouchableOpacity
              style={[styles.boxChangePayment, {}]}
              onPress={() => {
                setViewPaymentMethod(true);
                setPaymentMethod('');
                setSelectPaymentMethod('');
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor:'pink'
                }}>
                <View style={{marginRight: 10}}>
                  <Icon name={'arrow-left'} type="feather" size={24} />
                </View>
                <Text style={styles.textFamily}>Change Payment Method</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            //   justifyContent: 'center',
            //   alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 1}}>
            <TextInput
              style={{
                ...styles.textFamily,
                backgroundColor: color.background,
                borderRadius: 5,
                marginRight: 20,
                height: 40,
                marginLeft: 20,
                alignItems: 'center',
                textAlign: 'center',
                paddingRight: 20,
                paddingLeft: 20,
                margin: 20,
                marginTop: 0,
              }}
              placeholder="Enter Invoice Number"
              placeholderTextColor={color.textGray}
              value={cardValue}
              defaultValue={cardValue}
              onChangeText={text => {
                setCardValue(text);
              }}
            />
          </View>
        </View>

        {/* {ROW NUMBER} */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity
            style={[
              styles.boxNumber,
              {height: 40, marginTop: 0, marginRight: 0},
            ]}
            onPress={() => {
              _cardInput('1');
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: 'black',
              }}>
              <Text style={styles.textFamily}>1</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boxNumber]}
            onPress={() => {
              _cardInput('2');
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.textFamily}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.boxNumber]}
            onPress={() => {
              _cardInput('3');
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.textFamily}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.boxNumber, {marginRight: 20}]}
            onPress={() => {
              _cardInput('backspace');
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name={'backspace-outline'} type="ionicon" size={24} />
            </View>
          </TouchableOpacity>
        </View>

        {/* {ROW NUMBER 2} */}

        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'column'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <TouchableOpacity
                style={[
                  styles.boxNumber,
                  {height: 40, marginTop: 0, marginRight: 0},
                ]}
                onPress={() => {
                  _cardInput('4');
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: 'black',
                  }}>
                  <Text style={styles.textFamily}>4</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boxNumber]}
                onPress={() => {
                  _cardInput('5');
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.textFamily}>5</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boxNumber]}
                onPress={() => {
                  _cardInput('6');
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.textFamily}>6</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* {ROW NUMBER 3} */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <TouchableOpacity
                style={[
                  styles.boxNumber,
                  {height: 40, marginTop: 0, marginRight: 0},
                ]}
                onPress={() => {
                  _cardInput('7');
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: 'black',
                  }}>
                  <Text style={styles.textFamily}>7</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boxNumber]}
                onPress={() => {
                  _cardInput('8');
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.textFamily}>8</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boxNumber]}
                onPress={() => {
                  _cardInput('9');
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.textFamily}>9</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              // alignItems:'center',
              // flex: 1,
              alignSelf: 'center',
              alignContent: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            <TouchableOpacity style={[styles.boxNumber2, {height: 100}]}>
              <View
                style={{
                  // flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name={'arrow-forward-circle-outline'}
                  type="ionicon"
                  size={24}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* {ROW NUMBER} */}
        <View
          style={{
            flexDirection: 'row',
            //   justifyContent: 'center',
            //   alignItems: 'center',
            justifyContent: 'space-evenly',
            marginTop: 0,
            // height: 40,
            marginBottom: 0,
          }}>
          <TouchableOpacity
            style={[
              styles.boxNumber,
              {
                height: 40,
                marginTop: 0,
                marginRight: 0,
                opacity: 0,
                height: 0,
              },
            ]}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: 'black',
              }}>
              <Text style={styles.textFamily}>1</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.boxNumber]}
            onPress={() => {
              _cardInput('0');
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.textFamily}>0</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.boxNumber, {opacity: 0, height: 0}]}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.textFamily}>.</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.boxNumber,
              {marginRight: 20, opacity: 0, height: 0},
            ]}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name={'backspace-outline'} type="ionicon" size={24} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // console.log('route', route.params.data);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', flex: 1}}>
        <View style={styles.box1}>
          {/* {LEFT SECTION TOP} */}
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <View
                style={{padding: 20, flexDirection: 'row', paddingBottom: 10}}>
                <View
                  style={{
                    backgroundColor: color.background,
                    height: 40,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 4,
                  }}>
                  <Text style={{fontSize: 16, fontFamily: fonts.medium}}>
                    {selectOrderType}{' '}
                    {selectOrderType == 'Take Away' ? '' : ' - '} {selectTable}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: color.primary,
                    height: 40,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 100,
                    marginLeft: 10,
                    // padding: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.medium,
                      color: color.white,
                    }}>
                    Split Bill
                  </Text>
                </TouchableOpacity>
              </View>

              {/* {ORDER CART} */}
              <View
                style={{
                  height: '50%',
                  flex: 1,
                  flexDirection: 'column',
                  // backgroundColor: 'white',
                }}>
                <ScrollView
                  contentContainerStyle={{
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: 'auto',
                    // backgroundColor: 'green',
                  }}
                  style={{
                    marginTop: 5,

                    marginLeft: 20,
                    marginRight: 20,
                  }}>
                  {orderCart.map((data, index) => {
                    return (
                      <View style={{flexDirection: 'row'}}>
                        <View
                          style={{
                            ...styles.inputBox2,
                            paddingLeft: 0,
                            marginLeft: 10,
                            marginTop: 5,
                            marginBottom: 5,
                            flex: 0.3,
                            // width:'1%',
                            height: 70,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: color.background,
                          }}>
                          <Image
                            style={{
                              width: '100%',
                              height: '80%',
                              justifyContent: 'center',
                              alignItems: 'center',
                              // backgroundColor:'black'
                            }}
                            source={{uri: data.menu_image}}
                          />
                        </View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'column',
                            height: 70,
                            justifyContent: 'space-between',
                            // backgroundColor: 'black',
                            marginLeft: 5,
                            marginTop: 5,
                          }}>
                          <View>
                            <View>
                              <Text style={styles.textInputAddToCart}>
                                {data.menu_name}
                              </Text>
                            </View>
                            <View style={{marginTop: 10, flexDirection: 'row'}}>
                              {data.menu_variant
                                ? data.menu_variant.map((variant, key) => {
                                    return (
                                      <Text
                                        style={{
                                          fontFamily: fonts.medium,
                                          fontSize: 12,
                                          color: color.textGray,
                                        }}>
                                        {data.menu_variant.length == key + 1
                                          ? variant.name
                                          : variant.name + ', '}
                                      </Text>
                                    );
                                  })
                                : null}
                            </View>
                          </View>

                          <View>
                            <Text style={styles.textInputPriceAddToCart}>
                              RM {data.menu_price.toFixed(2)}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flex: 0.6,
                            height: 70,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            // backgroundColor: 'red',
                            marginRight: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontFamily: fonts.regular,
                                fontSize: 12,
                                color: color.textGray,
                              }}>
                              {data.membership_no}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              height: 50,
                              justifyContent: 'flex-end',
                              // backgroundColor:'blue'
                            }}>
                            <Text> X {data.menu_quantity}</Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>

              {orderCartTakeAway.length > 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    // backgroundColor: 'red',
                    height: '100%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      flex: 1,
                    }}>
                    <View
                      style={{
                        padding: 20,
                        flexDirection: 'row',
                        paddingBottom: 10,
                      }}>
                      <View
                        style={{
                          backgroundColor: color.background,
                          height: 40,
                          borderRadius: 5,
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                        }}>
                        <Text style={{fontSize: 16, fontFamily: fonts.medium}}>
                          Take Away
                        </Text>
                      </View>
                    </View>

                    <ScrollView
                      contentContainerStyle={{
                        alignItems: 'center',
                        flexDirection: 'column',
                        height: 'auto',
                      }}
                      style={{
                        marginTop: 5,
                        marginLeft: 20,
                        marginRight: 20,
                      }}>
                      {orderCartTakeAway.map((data, index) => {
                        return (
                          <View style={{flexDirection: 'row'}}>
                            <View
                              style={{
                                ...styles.inputBox2,
                                paddingLeft: 0,
                                marginLeft: 10,
                                marginTop: 5,
                                marginBottom: 5,
                                flex: 0.3,
                                // width:'1%',
                                height: 70,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: color.background,
                              }}>
                              <Image
                                style={{
                                  width: '100%',
                                  height: '80%',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  // backgroundColor:'black'
                                }}
                                source={{uri: data.menu_image}}
                              />
                            </View>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'column',
                                height: 70,
                                justifyContent: 'space-between',
                                // backgroundColor: 'black',
                                marginLeft: 5,
                                marginTop: 5,
                              }}>
                              <View>
                                <View>
                                  <Text style={styles.textInputAddToCart}>
                                    {data.menu_name}
                                  </Text>
                                </View>
                                <View
                                  style={{marginTop: 10, flexDirection: 'row'}}>
                                  {data.menu_variant
                                    ? data.menu_variant.map((variant, key) => {
                                        return (
                                          <Text
                                            style={{
                                              fontFamily: fonts.medium,
                                              fontSize: 12,
                                              color: color.textGray,
                                            }}>
                                            {data.menu_variant.length == key + 1
                                              ? variant.name
                                              : variant.name + ', '}
                                          </Text>
                                        );
                                      })
                                    : null}
                                </View>
                              </View>

                              <View>
                                <Text style={styles.textInputPriceAddToCart}>
                                  RM {data.menu_price.toFixed(2)}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flex: 0.6,
                                height: 70,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                // backgroundColor: 'red',
                                marginRight: 10,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'flex-end',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    fontFamily: fonts.regular,
                                    fontSize: 12,
                                    color: color.textGray,
                                  }}>
                                  {data.membership_no}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  height: 50,
                                  justifyContent: 'flex-end',
                                  // backgroundColor:'blue'
                                }}>
                                <Text> X {data.menu_quantity}</Text>
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>
              ) : null}
            </View>

            {/* {calculation section} */}
            <View
              style={{
                margin: 20,
                backgroundColor: '#F8F8F8',
              }}>
              <View style={styles.textCalculation}>
                <Text style={styles.textCart}>Subtotal</Text>
                <Text style={styles.textCart}>
                  {amountOrderDisplay !== null
                    ? amountOrderDisplay
                    : (0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.textCalculation}>
                <Text style={styles.textCart}>Discount</Text>
                <Text style={styles.textCart}>
                  {amountDiscountDisplay !== null
                    ? amountDiscountDisplay
                    : (0).toFixed(2)}
                </Text>
              </View>

              {/* {membershipDiscount > 0 ? (
                <View style={styles.textCalculation}>
                  <Text style={styles.textCart}>Membership Discount 7%</Text>
                  <Text style={styles.textCart}>
                    {membershipDiscount !== null
                      ? membershipDiscount
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      : (0).toFixed(2)}
                  </Text>
                </View>
              ) : null} */}
              {/* 
              {outletDiscount > 0 ? (
                <View style={styles.textCalculation}>
                  <Text style={styles.textCart}>Outlet Discount 10%</Text>
                  <Text style={styles.textCart}>
                    {outletDiscount !== null
                      ? outletDiscount
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      : (0).toFixed(2)}
                  </Text>
                </View>
              ) : null} */}

              <View style={styles.textCalculation}>
                <Text style={styles.textCart}>Tax 6%</Text>
                <Text style={styles.textCart}>
                  {taxDisplay !== null ? taxDisplay : (0).toFixed(2)}
                </Text>
              </View>
              {/* <View style={styles.textCalculation}>
                <Text style={styles.textCart}>Service Charges 10%</Text>
                <Text style={styles.textCart}>
                  {serviceChargeDisplay !== null
                    ? serviceChargeDisplay
                    : (0).toFixed(2)}
                </Text>
              </View> */}
              <View style={styles.textCalculation}>
                <Text style={styles.textCart}>Infaq</Text>
                <Text style={styles.textCart}>0.00</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.box2}>
          {/* {RIGHT SECTION FIRST TOP} */}
          <View
            style={{
              flexDirection: 'column',
              flex: 2.4,
            }}>
            <View
              style={{
                flexDirection: 'column',
                // backgroundColor: 'red',
                // justifyContent: 'space-between',
                height: '100%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  //   backgroundColor: 'green',
                  //   height: '90%',
                  // alignItems: 'center',
                  //   justifyContent:'space-between'
                }}>
                <View
                  style={{
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    flex: 1,
                    margin: 20,
                    // backgroundColor: 'pink',
                    // height: '100%',
                  }}>
                  <View style={{alignItems: 'center', paddingTop: 50}}>
                    <Text style={{fontFamily: fonts.semibold, fontSize: 16}}>
                      Total Amount
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      // alignItems: 'center',
                      flex: 1,
                      flexDirection: 'row',
                      // marginBottom : 40
                    }}>
                    <Text style={{fontFamily: fonts.bold, fontSize: 35}}>
                      RM{' '}
                      {totalAmountOrderDisplay !== null
                        ? totalAmountOrderDisplay
                        : (0).toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    height: '80%',
                    width: 1,
                    backgroundColor: color.textGray,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}></View>
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 1,
                    margin: 20,
                    alignItems: 'center',
                    // backgroundColor: 'pink',
                    // justifyContent: 'center',
                    // height: '100%',
                  }}>
                  <View>
                    <Text style={{fontFamily: fonts.semibold, fontSize: 16}}>
                      Suggested Infaq
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row'}}>
                    <TouchableHighlight
                      style={styles.inputBoxInfaq}
                      onPress={() => {
                        alert('derma');
                      }}>
                      <Text style={styles.textFamily}>0.00</Text>
                    </TouchableHighlight>
                    <View style={styles.inputBoxInfaq}>
                      <Text style={styles.textFamily}>
                        {(
                          Math.round(totalAmountOrder) - totalAmountOrder
                        ).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.inputBoxInfaq}>
                      <Text style={styles.textFamily}>
                        {(
                          Math.round(totalAmountOrder / 100) * 100 +
                          40 -
                          totalAmountOrder
                        ).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.inputBoxInfaq}>
                      <Text style={styles.textFamily}>
                        {(
                          Math.round(totalAmountOrder / 100) * 100 +
                          50 -
                          totalAmountOrder
                        ).toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.inputCustomAmt}>
                      <Text style={styles.textFamily}>Custom Amount</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  //   flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor: 'black',
                  height: '2%',
                  // marginBottom: 20,
                }}>
                <View
                  style={{
                    backgroundColor: color.textGray,
                    height: 1,
                    width: '94%',
                  }}></View>
              </View>
            </View>
          </View>

          {/* {RIGHT SECTION SECOND TOP} */}
          {/* {LIST PAYMENT METHOD} */}

          {viewPaymentMethod === false ? null : (
            <View
              style={{
                flexDirection: 'column',
                flex: 6,
                // backgroundColor: 'pink',
                // margin:20,
                // marginTop: 20,

                //   justifyContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '33%',
                  // backgroundColor: 'red',
                }}>
                <TouchableOpacity
                  style={styles.boxPayment}
                  onPress={() => _clickPayment('cash')}>
                  <View>
                    <View style={{marginBottom: 15}}>
                      <Icon name={'cash-outline'} type="ionicon" size={28} />
                    </View>
                    <Text style={styles.textFamily}>Cash</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    ...styles.boxPayment,
                    // backgroundColor: 'pink',
                    //   flexDirection: 'column',
                    //   flex: 1,
                    // width:200
                  }}
                  onPress={() => _clickPayment('card')}>
                  <View style={{marginBottom: 15}}>
                    <Icon name={'card-outline'} type="ionicon" size={28} />
                  </View>
                  <Text style={styles.textFamily}>Credit/Debit Card</Text>
                </TouchableOpacity>

                <View
                  style={{
                    ...styles.boxPayment,
                    // backgroundColor: 'pink',
                    //   flexDirection: 'column',
                    //   flex: 1,
                    // width:200
                  }}>
                  <View style={{marginBottom: 15}}>
                    <Icon
                      name={'qrcode-scan'}
                      type="material-community"
                      size={28}
                      color={color.textGray}
                    />
                  </View>
                  <Text style={{...styles.textFamily, color: color.textGray}}>
                    QR Payment
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '33%',
                  // backgroundColor: 'red',
                }}>
                <View style={styles.boxPayment}>
                  <View style={{marginBottom: 15}}>
                    <Icon
                      name={'cash-outline'}
                      type="ionicon"
                      size={28}
                      color={color.textGray}
                    />
                  </View>
                  <Text style={{...styles.textFamily, color: color.textGray}}>
                    e-Wallet
                  </Text>
                </View>

                <View style={styles.boxPayment}>
                  <View style={{marginBottom: 15}}>
                    <Icon
                      name={'chatbox-ellipses-outline'}
                      type="ionicon"
                      size={28}
                      color={color.textGray}
                    />
                  </View>
                  <Text style={{...styles.textFamily, color: color.textGray}}>
                    Payment Link
                  </Text>
                </View>

                <View style={styles.boxPayment}>
                  <View style={{marginBottom: 15}}>
                    <Icon
                      name={'wallet-outline'}
                      type="ionicon"
                      size={28}
                      color={color.textGray}
                    />
                  </View>
                  <Text style={{...styles.textFamily, color: color.textGray}}>
                    Credit Wallet
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '33%',
                  // backgroundColor: 'red',
                }}>
                <View style={styles.boxPayment}>
                  <View style={{marginBottom: 15}}>
                    <Icon
                      name={'star-outline'}
                      type="ionicon"
                      size={28}
                      color={color.textGray}
                    />
                  </View>
                  <Text style={{...styles.textFamily, color: color.textGray}}>
                    Reward Points
                  </Text>
                </View>

                <View style={styles.boxPayment}>
                  <View style={{marginBottom: 15}}>
                    <Icon
                      name={'GoldOutlined'}
                      type="ant"
                      size={28}
                      color={color.textGray}
                    />
                  </View>
                  <Text style={{...styles.textFamily, color: color.textGray}}>
                    Gold
                  </Text>
                </View>

                <View style={{...styles.boxPayment, opacity: 0, height: 0}}>
                  <View style={{marginBottom: 15}}>
                    <Icon
                      name={'wallet-outline'}
                      type="ionicon"
                      size={24}
                      color={color.textGray}
                    />
                  </View>
                  <Text style={{...styles.textFamily, color: color.textGray}}>
                    Credit Wallet
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* { FOR VIEW CASH } */}

          {paymentMethod === 'cash'
            ? _viewCash()
            : paymentMethod === 'card'
            ? _viewCard()
            : null}

          {/* {RIGHT SECTION THIRD TOP} */}

          {/* {button confirm / change order} */}

          {paymentMethod === '' ? (
            <View
              style={{
                flexDirection: 'row',
                flex: 0.7,
                // backgroundColor: 'black',
                // justifyContent:'center'
              }}>
              {/* <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  // justifyContent: 'center',
                  // alignItems: 'center',
                  // flex: 1,
                }}>
                <View
                  style={{
                    // flex: 1,
                    width: 583,
                    backgroundColor: 'orange',
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 5,
                    marginTop: 20,
                    marginLeft: 20,
                    marginRight: 20,
                    marginBottom: 12,
                    borderRadius: 5,
                  }}>
                  <Text style={styles.textFamily}>Confirm</Text>
                </View>
              </TouchableOpacity> */}

              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    // alignItems: 'center',
                    backgroundColor: 'black',
                    width: 'auto',
                    // flex: 1,
                    backgroundColor: color.white,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: color.primary,
                    borderRadius: 5,
                    marginLeft: 20,
                  }}
                  onPress={() => {
                    Alert.alert(
                      'Cancel Order',
                      'Are you sure you want to cancel your order?',
                      [
                        {
                          text: 'Cancel',
                          // onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Confirm',
                          onPress: () => {
                            _cancelOrder();
                          },
                        },
                      ],
                      {cancelable: false},
                    );
                  }}>
                  <View
                    style={
                      {
                        // flex: 1,
                        // width: '100%',
                        //   margin: 5,
                        // marginLeft: 20,
                        // marginRight: 20,
                        // marginTop: 73,
                      }
                    }>
                    <Text style={styles.textFamily}>Cancel</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    // alignItems: 'center',
                    backgroundColor: 'black',
                    width: 'auto',
                    // flex: 1,
                    backgroundColor: color.white,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: color.primary,
                    borderRadius: 5,
                    marginLeft: 20,
                    marginRight: 20,
                  }}
                  onPress={() => {
                    _changeOrder();
                  }}>
                  <View style={{}}>
                    <Text style={styles.textFamily}>Change Order</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'column',
                flex: 0.7,
                // backgroundColor: 'black',
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  // justifyContent: 'center',
                  // alignItems: 'center',
                  // backgroundColor:'black'
                }}
                onPress={() => {
                  _confirmPayment();
                }}>
                <View
                  style={{
                    // flex: 1,
                    width: 583,
                    backgroundColor: color.primary,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    //   margin: 5,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    // marginTop: 73,
                    borderRadius: 5,
                  }}>
                  <Text style={{...styles.textFamily, color: color.white}}>
                    Confirm
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },

  box1: {
    flex: 1.4,
    backgroundColor: color.white,
  },

  box2: {
    flex: 2,
    backgroundColor: color.white,
    marginLeft: 20,
  },

  textInputAddToCart: {
    fontFamily: fonts.medium,
    fontSize: 13,
  },

  textInputPriceAddToCart: {
    // marginTop: 0,
    // marginLeft: 15,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: color.primary,
  },

  textCalculation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    marginRight: 10,
    marginLeft: 10,
  },

  textCart: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: color.textGray,
  },

  inputBoxInfaq: {
    backgroundColor: color.background,
    height: 38,
    // width: 90,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    // marginTop: 10,
    marginBottom: 0,
    margin: 10,
  },

  inputCustomAmt: {
    backgroundColor: color.background,
    height: 38,
    // width: 180,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    // marginTop: 10,
    marginBottom: 0,
    margin: 10,
  },

  textFamily: {
    fontFamily: fonts.medium,
    fontSize: 16,
  },

  boxPayment: {
    backgroundColor: color.background,
    margin: 20,
    width: 167,
    justifyContent: 'center',
    alignItems: 'center',
    height: '80%',
    borderRadius: 5,
  },

  boxPaymentDisable: {
    backgroundColor: color.background,
  },

  boxPaymentSelect: {
    backgroundColor: color.background,
    // margin: 20,
    // marginTop: 10,
    marginLeft: 20,
    width: 167,
    justifyContent: 'center',
    alignItems: 'center',
    height: '80%',
    borderRadius: 5,
  },

  boxChangePayment: {
    backgroundColor: 'white',
    // margin: 20,
    // marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    // flex: 0.71,
    // marginTop: 0,
    height: 40,
    width: 300,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: color.primary,
  },

  boxNumber: {
    backgroundColor: color.background,
    margin: 20,
    width: 130,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 'auto',
    marginRight: 'auto',
  },

  boxNumber2: {
    backgroundColor: color.background,
    margin: 20,
    width: 130,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 0,
    // marginRight: 0,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});

//make this component available to the app
export default Checkout;
