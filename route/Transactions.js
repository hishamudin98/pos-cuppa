//import liraries
import axios from 'axios';
import moment from 'moment';
import React, {Component, useEffect, useState} from 'react';
import Modal from 'react-native-modal';

import DateTimePicker from '@react-native-community/datetimepicker';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {jsonToCSV} from 'react-native-csv';
import {Icon} from 'react-native-elements';
import {
  DocumentDirectoryPath,
  DownloadDirectoryPath,
  ExternalDirectoryPath,
  RNFS,
  writeFile,
} from 'react-native-fs';
import {SafeAreaView} from 'react-native-safe-area-context';
import {utils, write, XLSX} from 'xlsx';
import {color, fonts, system_configuration} from '../config/Constant';
import Drawer from '../component/Drawer';
const url =
  system_configuration.ENVIRONMENT === 'development'
    ? system_configuration.REACT_APP_DEV_MODE
    : system_configuration.REACT_APP_PROD_MODE;

const counterPOS = system_configuration.counterSecretKey;

const itemsPerPage = 5;

// create a component
const Transactions = ({navigation, route}) => {
  const [modalFilter, setModalFilter] = useState(false);

  const [details, setDetails] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [orderList, setOrderList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);

  const [getDetails, setGetDetails] = useState([]);
  const [getDetailsByOrder, setGetDetailsByOrder] = useState([]);

  const [invoiceNo, setInvoiceNo] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [methodPayment, setMethodPayment] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const [filterPaymentMethod, setFilterPaymentMethod] = useState([]);
  const [filterPaymentStatus, setFilterPaymentStatus] = useState([]);
  const [paymentMethodList, setPaymentMethodList] = useState([]);
  const [paymentStatusList, setPaymentStatusList] = useState([]);

  const [dateTransaction, setDateTransaction] = useState(new Date());
  const [dateTransactionEnd, setDateTransactionEnd] = useState(new Date());
  const [myDate, setMyDate] = useState(new Date());
  const [displayMode, setDisplayMode] = useState('date');
  const [clickDate, setClickDate] = useState(false);
  const [dateDisplay, setDateDisplay] = useState('');
  const [dateDisplayEnd, setDateDisplayEnd] = useState('');
  //   const [page, setPage] = useState(0);
  //   const from = page * itemsPerPage;
  //   const to = (page + 1) * itemsPerPage;
  useEffect(() => {
    navigation.addListener('focus', () => {
      _fetchOrder();
      _selectMethod();
      _filterPaymentMethod(filterPaymentMethod.length == 0 ? 'all' : id);
      _fetchPaymentMethod();
      _fetchPaymentStatus();
    });
  }, []);

  const _fetchOrder = async () => {
    const response = await axios.get(url + '/pos/getOrderList');
    setOrderList(response.data.data);
    setTransactionList(response.data.data);
    // setOrderId(response.data.data);
    console.log('ORDER LIST', response.data.data);
  };

  const _fetchPaymentMethod = async () => {
    const response = await axios.get(url + '/getPaymentMethod');
    setPaymentMethodList(response.data.data);
  };

  const _fetchPaymentStatus = async () => {
    const response = await axios.get(url + '/getPaymentStatus');
    setPaymentStatusList(response.data.data);
  };

  const _selectMethod2 = async () => {
    console.log('filterpayment', filterPaymentMethod);
    filterPayment = transactionList.filter(item => {
      return filterPaymentMethod
        .map(data => Number(data.payment_method))
        .includes(Number(item.payment_method));
    });
    setOrderList(filterPayment);
  };

  const _search = async search => {
    let transSearch = transactionList.filter(item => {
      if (item.card_invoice_no) {
        return item.card_invoice_no
          .toLowerCase()
          .includes(search.toLowerCase());
      } else {
        return (
          item.invoice_no.toLowerCase().includes(search.toLowerCase()) ||
          item.order_no.toLowerCase().includes(search.toLowerCase())
        );
      }
    });

    // console.log('menu search', menuSearch);
    setOrderList(transSearch);
  };

  const _pressOrder = async id => {
    setDetails(true);
    setOrderId(id);

    orderList.filter(async item => {
      if (item.invoice_no === id) {
        setGetDetails(item);
        console.log('get details', item);
        // setGetDetailsByOrder(JSON.parse(item.order_detail));
        // let aa = JSON.parse(item.order_detail);
        // console.log('get details', aa);
        // axios details by order no

        await axios
          .post(url + '/pos/getOrderDetails', {
            order_no: item.order_no,
          })
          .then(res => {
            if (res.data.status == 200) {
              console.log('get details by order', res.data.data);
              setGetDetailsByOrder(res.data.data);
            }
          })
          .catch(err => {
            console.log('get details', err);
          });
      }
    });
  };

  const _generateReport = async () => {
    const csv = jsonToCSV(orderList);
    // const path = 'file:///storage/emulated/0/Download/report.csv';
    let path = DocumentDirectoryPath + '/report.csv';
    let path2 = DownloadDirectoryPath + '/report.csv';

    // const path = `${RNFS.DocumentDirectoryPath}/report.csv`;
    // writeFile(path, csv, 'utf8')
    //   .then(success => {
    //     console.log('FILE WRITTEN!');
    //   })
    //   .catch(err => {
    //     console.log(err.message);
    //   });

    // writeFile('file:///storage/emulated/0/Download/transactions.csv', csv, 'utf8')
    let wb = utils.book_new();
    let ws = utils.json_to_sheet(orderList);
    // console.log('ws',ws);
    utils.book_append_sheet(wb, ws, 'Users');
    const wbout = write(wb, {bookType: 'xlsx', type: 'binary'});
    console.log('path', path);
    console.log('path2', path2);
    writeFile(path, wbout, 'ascii')
      .then(res => {
        console.log('res', res);
      })
      .catch(err => {
        console.log('err', err);
        alert(err);
      });
  };

  const _filterPaymentMethod = async id => {
    let data = {};
    data = {payment_method: id};
    const filter = [];
    let filterPayment = [];
    filter.push(data);
    let sliceMethod = [];

    // console.log('filterPaymentMethod', filterPaymentMethod);
    const exists = filterPaymentMethod.find(item => item.payment_method === id);

    console.log('filter', filter);
    console.log('exists', exists);

    if (id === 'all') {
      // setOrderList(transactionList);
      _confirmFilter('all');
      setFilterPaymentMethod([]);
    } else {
      if (filterPaymentMethod.length > 0) {
        if (exists) {
          sliceMethod = filterPaymentMethod.filter(
            item => item.payment_method !== id,
          );
          setFilterPaymentMethod(sliceMethod);
        } else {
          setFilterPaymentMethod(prevValue => {
            return [...prevValue, data];
          });
        }
      } else {
        setFilterPaymentMethod(filter);
      }

      // setModalFilter(false);
    }
  };

  const _filterPaymentStatus = async id => {
    let data = {};
    data = {payment_status: id};
    const filter = [];
    filter.push(data);
    let sliceMethod = [];

    const exists = filterPaymentStatus.find(item => item.payment_status === id);

    if (id === 'all') {
      // setOrderList(transactionList);
      _confirmFilter('all');
      setFilterPaymentStatus([]);
    } else {
      if (setFilterPaymentStatus.length > 0) {
        if (exists) {
          sliceMethod = filterPaymentMethod.filter(
            item => item.payment_status !== id,
          );
          setFilterPaymentStatus(sliceMethod);
        } else {
          setFilterPaymentStatus(prevValue => {
            return [...prevValue, data];
          });
        }
      } else {
        setFilterPaymentStatus(filter);
      }

      // setModalFilter(false);
    }
  };

  const _selectMethod = async () => {
    // console.log('filterpayment', filterPaymentMethod);

    filterPayment = transactionList.filter(item => {
      return filterPaymentMethod
        .map(data => Number(data.payment_method))
        .includes(Number(item.payment_method));
    });
    setOrderList(filterPayment);
  };

  const _dataFilter = async (method, status, dateStart, dateEnd) => {
    // console.log('method', method);
    let fetchDate = moment(dateStart).format('DD-MM-YYYY');
    let fetchDateEnd = moment(dateEnd).format('DD-MM-YYYY');
    // console.log('date', fetchDate);

    let filterPayment = [];

    let filterByMethod = transactionList.filter(item =>
      filterPaymentMethod
        .map(data => Number(data.payment_method))
        .includes(Number(item.payment_method)),
    );

    console.log('filterByMethod', filterByMethod);

    let filterByStatus = transactionList.filter(item =>
      filterPaymentStatus
        .map(data => Number(data.payment_status))
        .includes(Number(item.payment_status)),
    );

    console.log('filterByStatus', filterByStatus);

    let filterByDate = transactionList.filter(item => {
      let item_date = moment(item.payment_datetime).format('DD-MM-YYYY');
      return item_date >= fetchDate && item_date <= fetchDateEnd;
    });

    console.log('filterByDate', filterByDate);

    console.log('method length', method.length);
    console.log('status length', status.length);
    console.log('dateStart length', dateStart);
    console.log('dateEnd length', dateEnd);

    if (
      method.length > 0 &&
      status.length === 0 &&
      dateStart === '' &&
      dateEnd === ''
    ) {
      filterPayment = filterByMethod;
    } else if (
      status.length > 0 &&
      method.length === 0 &&
      dateStart === '' &&
      dateEnd === ''
    ) {
      filterPayment = filterByStatus;
    } else if (
      status.length === 0 &&
      method.length === 0 &&
      dateStart !== '' &&
      dateEnd !== ''
    ) {
      filterPayment = filterByDate;
      console.log('filterPayment no stat', filterPayment);
    } else if (
      status.length > 0 &&
      method.length > 0 &&
      dateStart === '' &&
      dateEnd === ''
    ) {
      filterPayment = filterByMethod.filter(item => {
        return filterPaymentStatus
          .map(data => Number(data.payment_status))
          .includes(Number(item.payment_status));
      });
    } else if (
      status.length > 0 &&
      method.length === 0 &&
      dateStart !== '' &&
      dateEnd !== ''
    ) {
      filterPayment = filterByDate.filter(item => {
        return filterByStatus
          .map(data => Number(data.payment_status))
          .includes(Number(item.payment_status));
      });
    } else if (
      status.length === 0 &&
      method.length > 0 &&
      dateStart !== '' &&
      dateEnd !== ''
    ) {
      filterPayment = filterByDate.filter(item => {
        return filterPaymentMethod
          .map(data => Number(data.payment_method))
          .includes(Number(item.payment_method));
      });
    } else {
      console.log('masuk sini');
      filterPayment = filterByDate.filter(item => {
        return (
          filterPaymentStatus
            .map(data => Number(data.payment_status))
            .includes(Number(item.payment_status)) &&
          filterPaymentMethod
            .map(data => Number(data.payment_method))
            .includes(Number(item.payment_method))
        );
      });
    }
    setOrderList(filterPayment);
  };

  const _confirmFilter = async mode => {
    console.log('dateeee', dateDisplay);
    console.log('dateeee end', dateDisplayEnd);
    console.log('method', filterPaymentMethod);
    console.log('status', filterPaymentStatus);
    let fetchDateStart = moment(dateDisplay).format('DD-MM-YYYY');
    let fetchDateEnd = moment(dateDisplayEnd).format('DD-MM-YYYY');

    if (mode !== 'all') {
      setModalFilter(false);
    } else {
      setFilterPaymentStatus([]);
      setFilterPaymentMethod([]);
    }

    if (fetchDateStart > fetchDateEnd) {
      Alert.alert('Error', 'Date start must be less than date end');
      return;
    }
    if (
      filterPaymentMethod.length > 0 ||
      filterPaymentStatus.length > 0 ||
      dateDisplay != '' ||
      dateDisplayEnd != ''
    ) {
      _dataFilter(
        filterPaymentMethod,
        filterPaymentStatus,
        dateDisplay,
        dateDisplayEnd,
      );
    } else {
      setOrderList(transactionList);
    }
  };

  const _refundProcess = async order_no => {
    Alert.alert(
      'Refund',
      'Are you sure want to refund this transaction?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await axios
              .post(url + '/pos/refund', {
                order_no: order_no,
              })
              .then(res => {
                console.log('refund', res);
                if (res.data.status === 200) {
                  _fetchOrder();
                  Alert.alert('Success', 'Refund success');

                  _fetchOrder();
                } else {
                  Alert.alert('Failed', 'Refund failed');
                }
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  const _onChangeDate = async (event, selectedDate) => {
    if (displayMode == 'date') {
      const currentDate = selectedDate;
      setDateTransaction(currentDate);
      setDateDisplay(currentDate);

      // console.log('date', dateTransaction);
    }
  };

  const _onChangeDateEnd = async (event, selectedDate) => {
    if (displayMode == 'date') {
      const currentDate = selectedDate;
      setDateTransactionEnd(currentDate);
      setDateDisplayEnd(currentDate);

      // console.log('date', dateTransaction);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', flex: 1}}>
        <Drawer navigation={navigation} />
        <View
          style={{
            //   backgroundColor: color.white,
            flex: 1,
            flexDirection: 'row',
            margin: 20,
            borderRadius: 5,
            // marginBottom:0
          }}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{marginTop: 10}}>
              <Text style={{fontFamily: fonts.semibold, fontSize: 20}}>
                Transactions
              </Text>
            </View>

            <View
              style={{
                marginTop: 20,
                justifyContent: 'center',
                //   alignItems: 'center',
                //   flex: 1,
                height: '20%',

                // width: '50%',
                marginLeft: '10%',
                marginRight: '10%',
                borderRadius: 5,
                backgroundColor: color.white,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                }}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View
                    style={{
                      backgroundColor: color.primary,
                      borderRadius: 5,
                      padding: 2,
                    }}>
                    <Icon
                      name={'dollar-sign'}
                      type="feather"
                      size={24}
                      color={color.white}
                      // style={{position: 'absolute', margin: 100}}
                    />
                  </View>

                  <View style={styles.boxMiddle}>
                    <Text style={styles.textFamily}> Order </Text>
                  </View>
                  <View style={styles.boxNumber}>
                    <Text style={{fontFamily: fonts.semibold, fontSize: 25}}>
                      {orderList.length}
                    </Text>
                  </View>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View
                    style={{
                      backgroundColor: color.primary,
                      borderRadius: 5,
                      padding: 2,
                      width: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      // height: 40,
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: fonts.bold,
                        color: color.white,
                      }}>
                      RM
                    </Text>
                  </View>
                  <View style={styles.boxMiddle}>
                    <Text style={styles.textFamily}> Refunds </Text>
                  </View>
                  <View style={styles.boxNumber}>
                    <Text style={{fontFamily: fonts.semibold, fontSize: 25}}>
                      {
                        orderList.filter(item => item.payment_status === '5')
                          .length
                      }
                    </Text>
                  </View>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View
                    style={{
                      backgroundColor: color.primary,
                      borderRadius: 5,
                      padding: 2,
                      width: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      // height: 40,
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: fonts.bold,
                        color: color.white,
                      }}>
                      RM
                    </Text>
                  </View>
                  <View style={styles.boxMiddle}>
                    <Text style={{...styles.textFamily, alignSelf: 'center'}}>
                      Average Order Value
                    </Text>
                  </View>
                  <View style={styles.boxNumber}>
                    <Text style={{fontFamily: fonts.semibold, fontSize: 25}}>
                      {(
                        orderList
                          .filter(item => item.payment_status === '1')
                          .map(item => item.amountNett)
                          .reduce((a, b) => a + b, 0)
                          .toFixed(2) / orderList.length
                      ).toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View
                    style={{
                      backgroundColor: color.primary,
                      borderRadius: 5,
                      padding: 2,
                      width: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      // height: 40,
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: fonts.bold,
                        color: color.white,
                      }}>
                      RM
                    </Text>
                  </View>
                  <View style={styles.boxMiddle}>
                    <Text style={styles.textFamily}> Net Sales </Text>
                  </View>
                  <View style={styles.boxNumber}>
                    <Text style={{fontFamily: fonts.semibold, fontSize: 25}}>
                      {orderList
                        .filter(item => item.payment_status === '1')
                        .map(item => item.amountNett)
                        .reduce((a, b) => a + b, 0)
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                marginTop: 20,
                flexDirection: 'row',
                // height: 525,
                // backgroundColor: color.white,
              }}>
              <View
                style={{
                  backgroundColor: color.white,
                  flex: 3,
                  marginRight: 20,
                  flexDirection: 'column',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      ...styles.inputSearch,
                      flex: 1,
                      // marginLeft: 40,
                      // backgroundColor: color.black,
                      marginTop: 20,
                      marginRight: 20,
                      marginLeft: 20,
                    }}>
                    <Icon
                      name={'search'}
                      type="feather"
                      size={24}
                      // style={{position: 'absolute', margin: 100}}
                    />
                    <View
                      style={{
                        flex: 1,
                        paddingRight: 10,
                      }}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Search"
                        placeholderTextColor={color.textGray}
                        onChangeText={text => _search(text)}
                        // defaultValue={staffNo}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      marginTop: 20,
                      height: 40,
                      backgroundColor: color.white,
                      marginRight: 20,
                      width: 60,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: color.primary,
                    }}
                    onPress={() => {
                      setModalFilter(true);
                    }}>
                    <Icon name={'filter'} type="feather" size={24} />
                  </TouchableOpacity>
                </View>

                <Modal
                  id={1}
                  animationType="fade"
                  visible={modalFilter}
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
                        setModalFilter(!modalFilter);
                      }}
                      // style={{position: 'absolute', margin: 100}}
                    />
                  </View>

                  <View
                    style={{
                      alignItems: 'center',
                      marginBottom: 20,
                      // justifyContent: 'center',
                      // justifyContent: 'flex-start',

                      // backgroundColor: 'black',
                    }}>
                    <Text style={{fontSize: 16, fontFamily: fonts.medium}}>
                      Choose Filter By
                    </Text>
                  </View>

                  <View
                    style={{
                      // margin: 20,
                      marginLeft: 0,
                      marginRight: 0,
                      marginLeft: '10%',
                      marginRight: '10%',
                      marginBottom: 20,
                      //   borderRadius: 5,
                      //   backgroundColor: color.white,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        // justifyContent: 'space-evenly',
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          style={{
                            ...styles.boxMiddle,
                            backgroundColor:
                              clickDate == true ? color.white : color.primary,
                            height: 35,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: color.primary,
                            width: 60,
                          }}
                          onPress={() => {
                            setClickDate(false);
                            setDateDisplay('');
                            setDateDisplayEnd('');
                          }}>
                          <Text
                            style={{
                              ...styles.textFamily,
                              color: clickDate == true ? null : color.white,
                            }}>
                            {' '}
                            All{' '}
                          </Text>
                        </TouchableOpacity>

                        <View style={{justifyContent: 'center'}}>
                          <TouchableOpacity
                            style={{
                              ...styles.boxMiddle,
                              backgroundColor:
                                clickDate == true ? color.primary : color.white,
                              height: 35,
                              marginLeft: 20,
                              borderRadius: 5,
                              borderColor: color.primary,
                              borderWidth: 1,
                              width: 120,
                            }}
                            onPress={() => {
                              setClickDate(true);
                              // setDateTransaction('');
                              setDateDisplay(dateTransaction);
                              setDateDisplayEnd(dateTransactionEnd);
                              setDateTransaction(new Date());
                              setDateTransactionEnd(new Date());
                              // setDateTransaction(new Date());
                              // alert(dateTransaction);
                              // console.log('dd', dateTransaction);
                            }}>
                            <Text
                              style={{
                                ...styles.textFamily,
                                color: clickDate == true ? color.white : null,
                              }}>
                              {' '}
                              Select Date{' '}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {clickDate == true ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            // backgroundColor: 'pink',
                          }}>
                          <View
                            style={{
                              // ...styles.inputDate,
                              // backgroundColor: color.primary,
                              justifyContent: 'center',
                              marginLeft: 20,
                              alignItems: 'center',
                              height: 35,
                              flex: 1,
                              // padding:0
                            }}>
                            <DateTimePicker
                              testID="dateTimePicker"
                              value={dateTransaction}
                              mode={displayMode}
                              // is24Hour={true}
                              // minimumDate={new Date()}
                              style={{
                                // marginLeft: 110,
                                paddingLeft: 0,
                                width: 150,
                              }}
                              onChange={_onChangeDate}
                            />
                          </View>
                          <View
                            style={{
                              marginLeft: 20,
                              justifyContent: 'center',
                              alignItems: 'center',
                              flex: 0.2,
                              // backgroundColor: 'green',
                              flexDirection: 'row',
                              marginLeft: 27,
                            }}>
                            <Icon name={'minus'} type="feather" size={24} />
                          </View>
                          <View
                            style={{
                              // ...styles.inputDate,
                              // backgroundColor: color.primary,
                              justifyContent: 'center',
                              // marginLeft: 20,
                              alignItems: 'center',
                              height: 35,
                              flex: 1,
                              // padding:0
                            }}>
                            <DateTimePicker
                              testID="dateTimePicker"
                              value={dateTransactionEnd}
                              mode={displayMode}
                              // is24Hour={true}
                              // minimumDate={new Date()}
                              style={{
                                // marginLeft: 110,
                                paddingLeft: 0,
                                width: 150,
                              }}
                              onChange={_onChangeDateEnd}
                            />
                          </View>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  <View
                    style={{
                      height: 160,
                      flex: 1,
                    }}>
                    <View
                      style={{
                        marginLeft: '10%',
                        marginRight: '10%',
                        height: 'auto',
                        // justifyContent:'space-around'
                        justifyContent: 'center',
                        alignItems: 'center',
                        // backgroundColor: color.white,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          height: 'auto',
                          backgroundColor: color.white,
                        }}>
                        <View
                          style={{
                            padding: 20,
                            width: '100%',
                            height: '100%',
                            paddingBottom: 0,
                          }}>
                          <View style={{marginBottom: 5}}>
                            <Text style={styles.textFamily}>
                              Payment Method
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              width: '100%',
                              flexWrap: 'wrap',
                            }}>
                            <TouchableOpacity
                              style={{
                                // backgroundColor: color.background,
                                width: 'auto',
                                margin: 10,
                                height: 30,
                                borderRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 5,
                                borderWidth: 1,
                                borderColor: color.primary,
                                backgroundColor:
                                  filterPaymentMethod.length == 0
                                    ? color.primary
                                    : color.white,
                                width: 50,
                              }}
                              onPress={() => {
                                _filterPaymentMethod('all');
                              }}>
                              <Text
                                style={{
                                  ...styles.textFamily,
                                  color:
                                    filterPaymentMethod.length == 0
                                      ? color.white
                                      : null,
                                }}>
                                All
                              </Text>
                            </TouchableOpacity>
                            {paymentMethodList.map((data, index) => {
                              return (
                                <TouchableOpacity
                                  key={index}
                                  style={{
                                    // backgroundColor: color.background,
                                    width: 'auto',
                                    height: 30,
                                    borderRadius: 5,
                                    // marginLeft: 10,
                                    margin: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 5,
                                    borderWidth: 1,
                                    borderColor: color.primary,
                                    backgroundColor: filterPaymentMethod.find(
                                      item =>
                                        item.payment_method ===
                                        data.payment_val,
                                    )
                                      ? color.primary
                                      : color.white,
                                  }}
                                  onPress={() => {
                                    _filterPaymentMethod(data.payment_val);
                                  }}>
                                  <Text
                                    style={{
                                      ...styles.textFamily,
                                      color: filterPaymentMethod.find(
                                        item =>
                                          item.payment_method ===
                                          data.payment_val,
                                      )
                                        ? color.white
                                        : null,
                                    }}>
                                    {data.payment_method}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                        }}>
                        <View
                          style={{
                            padding: 20,
                            width: '100%',
                            height: '100%',
                            // paddingBottom: 10,
                            backgroundColor: color.white,
                          }}>
                          <View style={{marginBottom: 5}}>
                            <Text style={styles.textFamily}>Status</Text>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              width: '100%',
                              flexWrap: 'wrap',
                            }}>
                            <TouchableOpacity
                              style={{
                                // backgroundColor: color.background,
                                width: 'auto',
                                margin: 10,
                                height: 30,
                                borderRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 5,
                                borderWidth: 1,
                                borderColor: color.primary,
                                backgroundColor:
                                  filterPaymentStatus.length == 0
                                    ? color.primary
                                    : color.white,
                                width: 50,
                              }}
                              onPress={() => {
                                _filterPaymentStatus('all');
                              }}>
                              <Text
                                style={{
                                  ...styles.textFamily,
                                  color:
                                    filterPaymentStatus.length == 0
                                      ? color.white
                                      : null,
                                }}>
                                All
                              </Text>
                            </TouchableOpacity>

                            {paymentStatusList.map((data, index) => {
                              return (
                                <TouchableOpacity
                                  key={index}
                                  style={{
                                    // backgroundColor: color.background,
                                    width: 'auto',
                                    margin: 10,
                                    height: 30,
                                    borderRadius: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 5,
                                    borderWidth: 1,
                                    borderColor: color.primary,
                                    backgroundColor: filterPaymentStatus.find(
                                      item => item.payment_status === data.id,
                                    )
                                      ? color.primary
                                      : color.white,
                                  }}
                                  onPress={() => {
                                    _filterPaymentStatus(data.id);
                                  }}>
                                  <Text
                                    style={{
                                      ...styles.textFamily,
                                      color: filterPaymentStatus.find(
                                        item => item.payment_status === data.id,
                                      )
                                        ? color.white
                                        : null,
                                    }}>
                                    {data.name}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={{
                          justifyContent: 'center',
                          // height: 160,
                          alignItems: 'center',
                          width: '100%',
                          // flex: 1,
                          backgroundColor: color.primary,
                          height: 40,
                          borderRadius: 5,
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          marginTop: 20,
                        }}
                        onPress={() => {
                          _confirmFilter('confirm');
                        }}>
                        <Text
                          style={{...styles.textFamily, color: color.white}}>
                          Confirm
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>

                <ScrollView style={{height: 350}}>
                  {orderList.map((data, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={{
                          flexDirection: 'row',
                          height: 80,
                          backgroundColor:
                            orderId == data.invoice_no
                              ? color.primary
                              : color.white,
                          marginTop: 10,
                          justifyContent: 'space-between',
                          // opacity: orderId == data.invoice_no ? 0 : 1
                        }}
                        // opacity={orderId == data.invoice_no ? 0.0 : 1}
                        onPress={() => {
                          _pressOrder(data.invoice_no);
                        }}>
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            paddingLeft: 20,
                            // margin:5,
                          }}>
                          <View>
                            <Text
                              style={{
                                ...styles.textFamily,
                                marginBottom: 5,
                                color:
                                  orderId == data.invoice_no
                                    ? color.white
                                    : null,
                              }}>
                              {data.invoice_no}
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={{
                                ...styles.textFamily,
                                color:
                                  orderId == data.invoice_no
                                    ? color.white
                                    : null,
                              }}>
                              {moment(data.payment_datetime).format(
                                'h:mm A DD-MM-YYYY',
                              )}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            marginRight: 20,
                            //   backgroundColor: 'red',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 140,
                          }}>
                          <View>
                            <Text
                              style={{
                                ...styles.textFamily,
                                marginBottom: 5,
                                color:
                                  orderId == data.invoice_no
                                    ? color.white
                                    : null,
                              }}>
                              {data.payment_method == 1
                                ? 'Cash'
                                : data.payment_method == 3
                                ? 'Card'
                                : data.payment_method == 2
                                ? 'FPX'
                                : null}
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={{
                                ...styles.textFamily,
                                color:
                                  orderId == data.invoice_no
                                    ? color.white
                                    : null,
                              }}>
                              {data.order_total_amount.toFixed(2)}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <TouchableOpacity
                  style={{
                    backgroundColor: color.white,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // paddingTop: 10,
                    marginLeft: 20,
                    marginTop: 20,
                    marginRight: 20,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: color.primary,
                  }}
                  onPress={() => {
                    _generateReport();
                  }}>
                  <Text style={styles.textFamily}>Download Report</Text>
                </TouchableOpacity>
              </View>

              {details == true ? (
                <View style={{backgroundColor: color.white, flex: 2.5}}>
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{paddingLeft: 20, marginTop: 20, width: '55%'}}>
                      <Text
                        style={{
                          ...styles.textFamily,
                          marginBottom: 10,
                          fontFamily: fonts.semibold,
                          fontSize: 14,
                        }}>
                        {getDetails.order_no}
                      </Text>
                      <Text
                        style={{
                          ...styles.textFamily,
                          marginBottom: 10,
                          fontSize: 14,
                        }}>
                        {moment(getDetails.payment_datetime).format(
                          'h:mm A DD-MM-YYYY',
                        )}
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...styles.textFamily,
                            marginBottom: 10,
                            fontSize: 14,
                          }}>
                          {getDetails.payment_method == 1
                            ? 'Cash'
                            : getDetails.payment_method == 3
                            ? 'Card (' + getDetails.card_invoice_no + ')'
                            : getDetails.payment_method == 2
                            ? 'FPX (' + getDetails.fpx_transaction_id + ')'
                            : null}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            ...styles.textFamily,
                            marginBottom: 10,
                            marginRight: 0,
                            fontSize: 14,
                          }}>
                          Tax
                        </Text>
                        <Text
                          style={{
                            ...styles.textFamily,
                            marginBottom: 10,
                            fontSize: 14,
                          }}>
                          RM {getDetails.tax.toFixed(2)}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            ...styles.textFamily,
                            marginBottom: 10,
                            fontSize: 14,
                          }}>
                          Discount
                        </Text>
                        <Text
                          style={{
                            ...styles.textFamily,
                            marginBottom: 10,
                            fontSize: 14,
                          }}>
                          RM {getDetails.discount.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        // justifyContent: 'center',
                        // alignItems: 'center',
                        // flexDirection:'row',
                        marginTop: 20,
                        alignItems: 'flex-end',
                        // backgroundColor:'pink',
                        paddingRight: 20,
                        flex: 1,
                        // width: '50%',
                      }}>
                      <Text
                        style={{
                          marginBottom: 10,
                          fontFamily: fonts.semibold,
                          fontSize: 30,
                        }}>
                        RM{' '}
                        {getDetails.order_total_amount
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                      </Text>
                      <View
                        style={{
                          backgroundColor:
                            getDetails.payment_status == '1'
                              ? color.success
                              : getDetails.payment_status == '3'
                              ? color.danger
                              : getDetails.payment_status == '4'
                              ? color.danger
                              : getDetails.payment_status == '5'
                              ? color.danger
                              : null,
                          width: 100,
                          height: 30,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 5,
                        }}>
                        <Text
                          style={{
                            ...styles.textFamily,
                            color: color.white,
                            fontSize: 16,
                            fontFamily: fonts.semibold,
                          }}>
                          {getDetails.payment_status == '1'
                            ? 'Success'
                            : getDetails.payment_status == '3'
                            ? 'Failed'
                            : getDetails.payment_status == '4'
                            ? 'Unknown'
                            : getDetails.payment_status == '5'
                            ? 'Refund'
                            : null}
                        </Text>
                      </View>

                      <Text
                        style={{
                          ...styles.textFamily,
                          marginTop: 33,
                          fontSize: 14,
                        }}>
                        {getDetails.staff_name}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    {getDetails.payment_method == 1 &&
                    getDetails.payment_status == 1 ? (
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          backgroundColor: color.white,
                          height: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 5,
                          borderColor: color.primary,
                          borderWidth: 1,
                          marginLeft: 20,
                          marginRight: 20,
                        }}
                        onPress={() => {
                          _refundProcess(getDetails.order_no);
                        }}>
                        <Text style={{...styles.textFamily}}>Refund</Text>
                      </TouchableOpacity>
                    ) : null}

                    {/* <View
                    style={{
                      backgroundColor: color.primary,
                      flex: 1,
                      marginLeft: 20,
                      marginRight: 20,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    }}>
                    <Text style={{...styles.textFamily}}>
                      Cancel Transaction
                    </Text>
                  </View> */}
                  </View>

                  <ScrollView>
                    {getDetailsByOrder.map((data, index) => {
                      let menuParsed = JSON.parse(data.menu_order_detail);
                      return (
                        <View
                          key={index}
                          style={{
                            marginTop: 5,
                            flexDirection: 'row',
                            height: 'auto',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            //   marginLeft: 20,
                            //   marginRight: 20,
                          }}>
                          <View
                            style={{
                              //   paddingLeft: 20,
                              marginLeft: 20,
                              marginTop: 5,
                              marginBottom: 5,
                              flex: 0.3,
                              // width:'1%',
                              height: 70,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: color.background,
                              borderRadius: 5,
                            }}>
                            <Image
                              style={{
                                width: '100%',
                                height: '80%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                // backgroundColor:'black'
                              }}
                              source={{
                                uri: menuParsed.menu_image,
                              }}
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
                            }}>
                            <View>
                              <View style={{marginBottom: 10}}>
                                <Text
                                  style={{
                                    fontFamily: fonts.medium,
                                    fontSize: 13,
                                  }}>
                                  {menuParsed.menu_name}
                                </Text>
                              </View>
                              {/* <View style={{marginTop: 10}}>
                         <Text
                           style={{
                             fontFamily: fonts.regular,
                             fontSize: 10,
                             color: color.textGray,
                           }}>
                           Nasi Putih, Blackpepper,
                         </Text>
                       </View> */}
                              <View style={{flexDirection: 'row'}}>
                                {menuParsed.menu_variant.length > 0
                                  ? menuParsed.menu_variant.map(
                                      (variant, key) => {
                                        return (
                                          <Text
                                            style={{
                                              fontFamily: fonts.medium,
                                              fontSize: 12,
                                              color: color.textGray,
                                            }}>
                                            {menuParsed.menu_variant.length ==
                                            key + 1
                                              ? variant.name
                                              : variant.name + ', '}
                                          </Text>
                                        );
                                      },
                                    )
                                  : null}
                              </View>
                            </View>

                            <View>
                              <Text style={styles.textInputPriceAddToCart}>
                                RM {menuParsed.menu_price.toFixed(2)}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flex: 0.6,
                              height: 70,
                              // flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              // backgroundColor: 'red',
                              marginRight: 10,
                            }}>
                            <View
                              style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                height: 50,
                                justifyContent: 'flex-end',
                                // backgroundColor:'blue'
                              }}>
                              <Text> X {menuParsed.menu_quantity}</Text>
                              <Text> ( {data.order_typeName} )</Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                  <View
                    style={{
                      backgroundColor: color.primary,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 20,
                      marginRight: 20,
                      borderRadius: 5,
                    }}>
                    <Text style={{...styles.textFamily, color: color.white}}>
                      Print Receipt
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    //   backgroundColor: 'yellow',
                    flex: 2.5,
                    opacity: 0,
                  }}></View>
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: color.background,
  },

  textFamily: {
    fontFamily: fonts.medium,
    fontSize: 16,
  },

  boxMiddle: {
    height: 50,
    width: 150,
    // backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    // alignSelf: 'center',
  },
  boxNumber: {
    // height: 50,
    marginTop: 10,
    width: 150,
    // backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    // textAlign: 'center',
  },

  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    // marginLeft: 20,
    fontSize: 16,
    fontFamily: fonts.medium,
    flexDirection: 'row',
    width: '100%',
  },

  inputSearch: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // alignContent:'center',
    backgroundColor: color.background,
    borderRadius: 5,
    // width: '50%',
    height: 40,
    paddingLeft: 10,
    marginRight: 40,
  },

  textInputPriceAddToCart: {
    // marginTop: 0,
    // marginLeft: 15,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: color.primary,
  },

  modalView: {
    justifyContent: 'flex-start',
    // flex: 1,
    alignContent: 'center',
    // margin: 100,
    width: 700,
    // height:'50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 160,
    marginBottom: 160,
    // height: 'auto',
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
  },

  modalVariant: {
    padding: 10,
    // backgroundColor: 'black',
    width: '100%',
    // alignItems: 'center',
    flexDirection: 'row',
  },

  inputDate: {
    borderRadius: 5,
    // width: 10,
    width: 150,
    height: 40,
    marginLeft: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//make this component available to the app
export default Transactions;
