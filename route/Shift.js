//import liraries
import axios from 'axios';
import moment from 'moment';
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {DataTable} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {color, fonts, system_configuration} from '../config/Constant';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from '../component/Drawer';

const url =
  system_configuration.ENVIRONMENT === 'development'
    ? system_configuration.REACT_APP_DEV_MODE
    : system_configuration.REACT_APP_PROD_MODE;

const counterPOS = system_configuration.counterSecretKey;

// create a component
const Shift = ({navigation, route}) => {
  const [details, setDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const [orderId, setOrderId] = useState('');
  const [staffId, setStaffId] = useState('');

  const [orderList, setOrderList] = useState([]);

  const [getDetails, setGetDetails] = useState([]);
  const [getDetailsByOrder, setGetDetailsByOrder] = useState([]);

  const [typeModal, setTypeModal] = useState('');

  const [modalVisibleOpenShift, setModalVisibleOpenShift] = useState(false);
  const [openShift, setOpenShift] = useState(true);
  const [openShiftId, setOpenShiftId] = useState('');
  const [openShiftTime, setOpenShiftTime] = useState('');
  const [openShiftCash, setOpenShiftCash] = useState([]);
  const [openShiftCashTotalAdd, setopenShiftCashTotalAdd] = useState(0);
  const [openShiftCashTotal, setOpenShiftCashTotal] = useState(0);
  const [openShiftCashTotalEdit, setOpenShiftCashTotalEdit] = useState(0);
  const [openCashValue, setOpenCashValue] = useState([]);

  const [modalVisibleCloseShift, setModalVisibleCloseShift] = useState(false);
  const [closeShift, setCloseShift] = useState(true);
  const [closeShiftId, setCloseShiftId] = useState('');
  const [closeShiftTime, setCloseShiftTime] = useState('');
  const [closeShiftCash, setCloseShiftCash] = useState([]);
  const [closeShiftCashTotalAdd, setCloseShiftCashTotalAdd] = useState(0);
  const [closeShiftCashTotal, setCloseShiftCashTotal] = useState(0);
  const [closeShiftCashTotalEdit, setCloseShiftCashTotalEdit] = useState(0);
  const [closeCashValue, setCloseCashValue] = useState([]);

  const [val5cents, setVal5cents] = useState(0);
  const [val10cents, setVal10cents] = useState(0);
  const [val20cents, setVal20cents] = useState(0);
  const [val50cents, setVal50cents] = useState(0);
  const [val1RM, setVal1RM] = useState(0);
  const [val5RM, setVal5RM] = useState(0);
  const [val10RM, setVal10RM] = useState(0);
  const [val20RM, setVal20RM] = useState(0);
  const [val50RM, setVal50RM] = useState(0);
  const [val100RM, setVal100RM] = useState(0);

  const [closedVal5cents, setClosedVal5cents] = useState(0);
  const [closedVal10cents, setClosedVal10cents] = useState(0);
  const [closedVal20cents, setClosedVal20cents] = useState(0);
  const [closedVal50cents, setClosedVal50cents] = useState(0);
  const [closedVal1RM, setClosedVal1RM] = useState(0);
  const [closedVal5RM, setClosedVal5RM] = useState(0);
  const [closedVal10RM, setClosedVal10RM] = useState(0);
  const [closedVal20RM, setClosedVal20RM] = useState(0);
  const [closedVal50RM, setClosedVal50RM] = useState(0);
  const [closedVal100RM, setClosedVal100RM] = useState(0);

  const [grossSales, setGrossSales] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalRefund, setTotalRefund] = useState(0);
  const [netSales, setNetSales] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [total, setTotal] = useState(0);

  //   const [page, setPage] = useState(0);
  //   const from = page * itemsPerPage;
  //   const to = (page + 1) * itemsPerPage;
  useEffect(() => {
    _getStaff();
    _getOpenShiftAPI();
    _getOpenShift();
    _startLoading();

    // AsyncStorage.removeItem('OPENSHIFT_DETAILS');
    // _fetchOrder();
  }, [_getOpenShiftAPI]);

  //   const _fetchOrder = async () => {
  //     const response = await axios.post(url + '/pos/getOrderList', {
  //       counterSecretKey: counterPOS,
  //     });
  //     // console.log('ORDER LIST : ', response.data.data);
  //     setOrderList(response.data.data);
  //     // setOrderId(response.data.data);
  //   };

  const _pressOrder = async id => {
    setDetails(true);
    setOrderId(id);

    orderList.filter(item => {
      if (item.invoice_no === id) {
        setGetDetails(item);
        setGetDetailsByOrder(JSON.parse(item.order_detail));
      }
    });
  };

  const _startLoading = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const _calculateSales = async () => {
    let total = 0;
    let discount = 0;
    let refund = 0;
    let deposit = 0;
    let tax = 0;
    let netSales = 0;
    let grossSales = 0;
    let dataRefund = 0;

    let nettAmount = 0;
    let serviceCharge = 0;
    let taxAmount = 0;
    let discountAmount = 0;

    let data = {};
    data = {
      shift_startDatetime: openShiftTime,
      shift_endDatetime: new Date(),
    };
    // grossSales = closeShiftCashTotal - openShiftCashTotal;

    await axios.post(url + '/pos/getNetSales', data).then(response => {
      console.log('NET SALES : ', response);
      data = response.data.data;

      nettAmount = data.nettAmount;
      serviceCharge = data.serviceCharge;
      taxAmount = data.tax;
      discountAmount = data.discount;

      refund =
        response.data.dataRefund.amountRefund !== null
          ? response.data.dataRefund.amountRefund
          : 0;
    });

    grossSales = nettAmount - taxAmount + discountAmount;
    tax = taxAmount;
    discount = discountAmount;
    netSales = nettAmount;
    deposit = closeShiftCashTotal - openShiftCashTotal;
    console.log('closeee', closeShiftCashTotal);
    console.log('opennnn', openShiftCashTotal);

    console.log('deposit : ', deposit);

    total = nettAmount + deposit;

    setTotal(total ? total : 0);
    setTotalDiscount(discount ? discount : 0);
    setTotalRefund(refund ? refund : 0);
    setTotalDeposit(deposit ? deposit : 0);
    setTotalTax(tax ? tax : 0);
    setNetSales(netSales ? netSales : 0);
    setGrossSales(grossSales ? grossSales : 0);
  };

  const _getStaff = async () => {
    const staffDetails = await AsyncStorage.getItem('STAFF');
    const staffDetailsParsed = JSON.parse(staffDetails);
    setStaffId(staffDetailsParsed.staffId);
  };

  const _getOpenShift = async () => {
    // let fetchCash = null;
    const cash_openDetails = await AsyncStorage.getItem('OPENSHIFT_DETAILS');
    const parseCash_details = JSON.parse(cash_openDetails);

    console.log('OPENSHIFT_DETAILS', parseCash_details);
    const cash_open = await AsyncStorage.getItem('OPENCASH_SHIFT');
    const parseCash = JSON.parse(cash_open);
    // const fetchCash = JSON.parse(parseCash.shift_openDenomination);

    // AsyncStorage.removeItem('OPENCASH_SHIFT');
    // AsyncStorage.removeItem('OPENSHIFT_DETAILS');

    if (parseCash_details && parseCash) {
      setOpenShift(false);
      setOpenShiftId(parseCash_details.shift_id);
      setOpenShiftTime(parseCash_details.shift_startDatetime);
      setOpenShiftCashTotal(parseCash_details.shift_totalAmount);
      setOpenShiftCashTotalEdit(parseCash_details.shift_totalAmount);

      //   setOpenShiftCashTotal()
      setOpenCashValue(parseCash);
      setOpenShiftCash(parseCash);
      console.log('OPEN CASH VALUE : ', parseCash);
    }
  };

  const _getOpenShiftAPI = async () => {
    let staff_id;
    let stgParsed = null;
    const staffDetails = await AsyncStorage.getItem('STAFF');
    const staffDetailsParsed = JSON.parse(staffDetails);
    setStaffId(staffDetailsParsed.staffId);
    staff_id = staffDetailsParsed.staffId;

    console.log('STAFF ID : ', staff_id);

    await axios
      .post(url + '/pos/getShift', {
        counterSecretKey: counterPOS,
        staffId: staff_id,
        type: 'open',
      })
      .then(async resp => {
        console.log('resp', resp);

        if (resp.data.status == 200) {
          await AsyncStorage.setItem(
            'OPENCASH_SHIFT',
            resp.data.data.shift_openDenomination,
          );

          await AsyncStorage.setItem(
            'OPENSHIFT_DETAILS',
            JSON.stringify(resp.data.data),
          );
        }
      })
      .catch(e => {
        console.log('OPEN SHIFT ERROR : ', e);
      });
  };

  const _newShift = async () => {
    setVal5cents(0);
    setVal10cents(0);
    setVal20cents(0);
    setVal50cents(0);
    setVal1RM(0);
    setVal5RM(0);
    setVal10RM(0);
    setVal20RM(0);
    setVal50RM(0);
    setVal100RM(0);

    setClosedVal5cents(0);
    setClosedVal10cents(0);
    setClosedVal20cents(0);
    setClosedVal50cents(0);
    setClosedVal1RM(0);
    setClosedVal5RM(0);
    setClosedVal10RM(0);
    setClosedVal20RM(0);
    setClosedVal50RM(0);
    setClosedVal100RM(0);

    setopenShiftCashTotalAdd(0);
    setOpenShiftCashTotalEdit(0);
    setOpenShiftCashTotal(0);

    setCloseShiftCashTotalAdd(0);
    setCloseShiftCashTotalEdit(0);
    setCloseShiftCashTotal(0);

    setOpenCashValue([]);

    setCloseCashValue([]);

    setGrossSales(0);
    setTotalDiscount(0);
    setTotalRefund(0);
    setNetSales(0);
    setTotalDeposit(0);
    setTotalTax(0);
    setTotal(0);
  };

  const _openShift = async mode => {
    if (mode === 'add') {
      const data = {
        val5cents: val5cents,
        val10cents: val10cents,
        val20cents: val20cents,
        val50cents: val50cents,
        val1RM: val1RM,
        val5RM: val5RM,
        val10RM: val10RM,
        val20RM: val20RM,
        val50RM: val50RM,
        val100RM: val100RM,
      };

      await axios
        .post(url + '/pos/insertShift', {
          counterSecretKey: counterPOS,
          staff_id: staffId,
          cash_open: JSON.stringify(data),
        })
        .then(async function (resp) {
          setOpenShiftCash(data);
          alert('Open Shift Successful');
          setOpenShift(false);
          setOpenCashValue(data);
          setOpenShiftCash(data);
          setOpenShiftId(resp.data.data[0].shift_id);
          setOpenShiftTime(resp.data.data[0].shift_startDatetime);
          setOpenShiftCashTotal(resp.data.data[0].shift_totalAmount);
          setOpenShiftCashTotalEdit(resp.data.data[0].shift_totalAmount);

          await AsyncStorage.setItem(
            'OPENCASH_SHIFT',
            resp.data.data[0].shift_openDenomination,
          );

          await AsyncStorage.setItem(
            'OPENSHIFT_DETAILS',
            JSON.stringify(resp.data.data[0]),
          );
        })
        .catch(async function (error) {
          console.log('Open Shift Failed', error);
          alert('Open Shift Failed');
          // await AsyncStorage.removeItem('STAFF');
        });
    } else {
      const data = {
        val5cents: openCashValue.val5cents,
        val10cents: openCashValue.val10cents,
        val20cents: openCashValue.val20cents,
        val50cents: openCashValue.val50cents,
        val1RM: openCashValue.val1RM,
        val5RM: openCashValue.val5RM,
        val10RM: openCashValue.val10RM,
        val20RM: openCashValue.val20RM,
        val50RM: openCashValue.val50RM,
        val100RM: openCashValue.val100RM,
      };

      await axios
        .post(url + '/pos/updateShift', {
          shift_id: openShiftId,
          cash_open: JSON.stringify(data),
          type: 'open',
        })
        .then(async function (resp) {
          setOpenShiftCash(data);
          console.log('res', resp);
          alert('Edit Successful');
          setOpenShift(false);
          setOpenCashValue(data);
          setOpenShiftCash(data);
          setOpenShiftId(resp.data.data[0].shift_id);
          setOpenShiftTime(resp.data.data[0].shift_startDatetime);
          setOpenShiftCashTotal(resp.data.data[0].shift_totalAmount);
          setOpenShiftCashTotalEdit(resp.data.data[0].shift_totalAmount);
        })
        .catch(async function (error) {
          console.log('Edit Failed', error);
          alert('Edit Failed');
          // await AsyncStorage.removeItem('STAFF');
        });
    }
  };

  const _closeShift = async mode => {
    console.log('mode', mode);
    if (mode == 'addClose') {
      const data = {
        closedVal5cents: closedVal5cents,
        closedVal10cents: closedVal10cents,
        closedVal20cents: closedVal20cents,
        closedVal50cents: closedVal50cents,
        closedVal1RM: closedVal1RM,
        closedVal5RM: closedVal5RM,
        closedVal10RM: closedVal10RM,
        closedVal20RM: closedVal20RM,
        closedVal50RM: closedVal50RM,
        closedVal100RM: closedVal100RM,
      };

      await axios
        .post(url + '/pos/updateShift', {
          shift_id: openShiftId,
          cash_open: JSON.stringify(data),
          type: 'close',
        })
        .then(async function (resp) {
          setCloseShiftCash(data);
          setCloseShift(false);
          setCloseCashValue(data);
          setCloseShiftCash(data);
          setCloseShiftId(resp.data.data[0].shift_id);
          setCloseShiftTime(resp.data.data[0].shift_endDatetime);
          setCloseShiftCashTotal(resp.data.data[0].shift_closeTotalAmount);
          setCloseShiftCashTotalEdit(resp.data.data[0].shift_closeTotalAmount);

          setGrossSales(resp.data.data[0].shift_grossSales);
          setTotalDiscount(resp.data.data[0].shift_discount);
          setTotalRefund(resp.data.data[0].shift_refunds);
          setNetSales(resp.data.data[0].shift_netSales);
          setTotalDeposit(resp.data.data[0].shift_deposit);
          setTotalTax(resp.data.data[0].shift_tax);
          setTotal(resp.data.data[0].shift_total);

          alert('Close Shift Successful');

          AsyncStorage.removeItem('OPENCASH_SHIFT');
          AsyncStorage.removeItem('OPENSHIFT_DETAILS');
        })
        .catch(async function (error) {
          console.log('Close Shift Failed', error);
          alert('Close Shift Failed');
          // await AsyncStorage.removeItem('STAFF');
        });
    } else {
      const data = {
        closedVal5cents: closeCashValue.closedVal5cents,
        closedVal10cents: closeCashValue.closedVal10cents,
        closedVal20cents: closeCashValue.closedVal20cents,
        closedVal50cents: closeCashValue.closedVal50cents,
        closedVal1RM: closeCashValue.closedVal1RM,
        closedVal5RM: closeCashValue.closedVal5RM,
        closedVal10RM: closeCashValue.closedVal10RM,
        closedVal20RM: closeCashValue.closedVal20RM,
        closedVal50RM: closeCashValue.closedVal50RM,
        closedVal100RM: closeCashValue.closedVal100RM,
      };

      await axios
        .post(url + '/pos/updateShift', {
          shift_id: openShiftId,
          cash_open: JSON.stringify(data),
          type: 'close',
        })
        .then(async function (resp) {
          setCloseShiftCash(data);
          setCloseShift(false);
          setCloseCashValue(data);
          setCloseShiftCash(data);
          setCloseShiftId(resp.data.data[0].shift_id);
          setCloseShiftTime(resp.data.data[0].shift_endDatetime);
          setCloseShiftCashTotal(resp.data.data[0].shift_closeTotalAmount);
          setCloseShiftCashTotalEdit(resp.data.data[0].shift_closeTotalAmount);

          setGrossSales(resp.data.data[0].shift_grossSales);
          setTotalDiscount(resp.data.data[0].shift_discount);
          setTotalRefund(resp.data.data[0].shift_refunds);
          setNetSales(resp.data.data[0].shift_netSales);
          setTotalDeposit(resp.data.data[0].shift_deposit);
          setTotalTax(resp.data.data[0].shift_tax);
          setTotal(resp.data.data[0].shift_total);

          // _calculateSales();
          alert('Edit Close Shift Successful');

          AsyncStorage.removeItem('OPENCASH_SHIFT');
          AsyncStorage.removeItem('OPENSHIFT_DETAILS');
        })
        .catch(async function (error) {
          console.log('Edit Close Shift Failed', error);
          alert('Edit Close Shift Failed');
          // await AsyncStorage.removeItem('STAFF');
        });
    }
  };

  /**************** START 5 CENTS ****************/

  const _minus5Cents = mode => {
    let value = 0.05;
    if (mode === 'open') {
      if (typeModal == 'edit') {
        if (openCashValue.val5cents > 0) {
          setOpenCashValue(item => {
            return {
              ...item,
              val5cents: item.val5cents - 1,
            };
          });
          let total = openShiftCashTotal - value;
          setOpenShiftCashTotal(total);
        }
      } else {
        if (val5cents > 0) {
          setVal5cents(val5cents - 1);
          let total = openShiftCashTotalAdd - value;
          setopenShiftCashTotalAdd(total);
        }
      }
    } else {
      if (typeModal == 'editCloseShift') {
        if (closeCashValue.closedVal5cents > 0) {
          setCloseCashValue(item => {
            return {
              ...item,
              closedVal5cents: item.closedVal5cents - 1,
            };
          });
          let total = closeShiftCashTotal - value;
          setCloseShiftCashTotal(total);
        }
      } else {
        if (closedVal5cents > 0) {
          setClosedVal5cents(closedVal5cents - 1);
          let total = closeShiftCashTotalAdd - value;
          setCloseShiftCashTotalAdd(total);
        }
      }
    }
  };

  const _plus5Cents = mode => {
    let value = 0.05;
    if (mode === 'open') {
      // setTypeModal('edit');
      if (typeModal == 'edit') {
        setOpenCashValue(item => {
          return {
            ...item,
            val5cents: item.val5cents + 1,
          };
        });
        let total = openShiftCashTotal + value;
        setOpenShiftCashTotal(total);
      } else {
        setVal5cents(val5cents + 1);
        setopenShiftCashTotalAdd(openShiftCashTotalAdd + value);
      }
    } else {
      if (typeModal == 'editCloseShift') {
        console.log('closeCashValue', closeCashValue);

        setCloseCashValue(item => {
          return {
            ...item,
            closedVal5cents: item.closedVal5cents + 1,
          };
        });
        let total = closeShiftCashTotal + value;
        setCloseShiftCashTotal(total);
      } else {
        setClosedVal5cents(closedVal5cents + 1);
        setCloseShiftCashTotalAdd(closeShiftCashTotalAdd + value);
      }
    }
  };

  /**************** END 5 CENTS ****************/

  /**************** START 10 CENTS ****************/

  const _minus10Cents = mode => {
    let value = 0.1;
    if (mode === 'open') {
      if (typeModal == 'edit') {
        if (openCashValue.val10cents > 0) {
          setOpenCashValue(item => {
            return {
              ...item,
              val10cents: item.val10cents - 1,
            };
          });
          let total = openShiftCashTotal - value;
          setOpenShiftCashTotal(total);
        }
      } else {
        if (val10cents > 0) {
          setVal10cents(val10cents - 1);
          let total = openShiftCashTotalAdd - value;
          setopenShiftCashTotalAdd(total);
        }
      }
    } else {
      if (typeModal == 'editCloseShift') {
        if (closeCashValue.closedVal10cents > 0) {
          setCloseCashValue(item => {
            return {
              ...item,
              closedVal10cents: item.closedVal10cents - 1,
            };
          });
          let total = closeShiftCashTotal - value;
          setCloseShiftCashTotal(total);
        }
      } else {
        if (closedVal10cents > 0) {
          setClosedVal10cents(closedVal10cents - 1);
          let total = closeShiftCashTotalAdd - value;
          setCloseShiftCashTotalAdd(total);
        }
      }
    }
  };

  const _plus10Cents = mode => {
    let value = 0.1;

    if (mode === 'open') {
      if (typeModal == 'edit') {
        setOpenCashValue(item => {
          return {
            ...item,
            val10cents: item.val10cents + 1,
          };
        });
        let total = openShiftCashTotal + value;
        setOpenShiftCashTotal(total);
      } else {
        setVal10cents(val10cents + 1);
        setopenShiftCashTotalAdd(openShiftCashTotalAdd + value);
      }
    } else {
      if (typeModal == 'editCloseShift') {
        setCloseCashValue(item => {
          return {
            ...item,
            closedVal10cents: item.closedVal10cents + 1,
          };
        });
        let total = closeShiftCashTotal + value;
        setCloseShiftCashTotal(total);
      } else {
        setClosedVal10cents(closedVal10cents + 1);
        setCloseShiftCashTotalAdd(closeShiftCashTotalAdd + value);
      }
    }
  };

  /**************** END 10 CENTS ****************/

  /**************** START 20 CENTS ****************/

  const _minus20Cents = mode => {
    let value = 0.2;

    if (mode === 'open') {
      if (typeModal == 'edit') {
        if (openCashValue.val20cents > 0) {
          setOpenCashValue(item => {
            return {
              ...item,
              val20cents: item.val20cents - 1,
            };
          });
          let total = openShiftCashTotal - value;
          setOpenShiftCashTotal(total);
        }
      } else {
        if (val20cents > 0) {
          setVal20cents(val20cents - 1);
          let total = openShiftCashTotalAdd - value;
          setopenShiftCashTotalAdd(total);
        }
      }
    } else {
      if (typeModal == 'editCloseShift') {
        if (closeCashValue.closedVal20cents > 0) {
          setCloseCashValue(item => {
            return {
              ...item,
              closedVal20cents: item.closedVal20cents - 1,
            };
          });
          let total = closeShiftCashTotal - value;
          setCloseShiftCashTotal(total);
        }
      } else {
        if (closedVal20cents > 0) {
          setClosedVal20cents(closedVal20cents - 1);
          let total = closeShiftCashTotalAdd - value;
          setCloseShiftCashTotalAdd(total);
        }
      }
    }
  };

  const _plus20Cents = mode => {
    let value = 0.2;

    if (mode === 'open') {
      if (typeModal == 'edit') {
        setOpenCashValue(item => {
          return {
            ...item,
            val20cents: item.val20cents + 1,
          };
        });
        let total = openShiftCashTotal + value;
        setOpenShiftCashTotal(total);
      } else {
        setVal20cents(val20cents + 1);
        setopenShiftCashTotalAdd(openShiftCashTotalAdd + value);
      }
    } else {
      if (typeModal == 'editCloseShift') {
        setCloseCashValue(item => {
          return {
            ...item,
            closedVal20cents: item.closedVal20cents + 1,
          };
        });
        let total = closeShiftCashTotal + value;
        setCloseShiftCashTotal(total);
      } else {
        setClosedVal20cents(closedVal20cents + 1);
        setCloseShiftCashTotalAdd(closeShiftCashTotalAdd + value);
      }
    }
  };

  /**************** END 20 CENTS ****************/

  /**************** START 50 CENTS ****************/

  const _minus50Cents = mode => {
    if (mode === 'open') {
      if (typeModal == 'edit') {
        if (openCashValue.val50cents > 0) {
          setOpenCashValue(item => {
            return {
              ...item,
              val50cents: item.val50cents - 1,
            };
          });
          let total = openShiftCashTotal - 0.5;
          setOpenShiftCashTotal(total);
        }
      } else {
        if (val50cents > 0) {
          setVal50cents(val50cents - 1);
          let total = openShiftCashTotalAdd - 0.5;
          setopenShiftCashTotalAdd(total);
        }
      }
    } else {
      if (typeModal == 'editCloseShift') {
        if (closeCashValue.closedVal50cents > 0) {
          setOpenCashValue(item => {
            return {
              ...item,
              closedVal50cents: item.closedVal50cents - 1,
            };
          });
          let total = closeShiftCashTotal - 0.5;
          setCloseShiftCashTotal(total);
        }
      } else {
        if (closedVal50cents > 0) {
          setClosedVal50cents(closedVal50cents - 1);
          let total = closeShiftCashTotalAdd - 0.5;
          setCloseShiftCashTotalAdd(total);
        }
      }
    }
  };

  const _plus50Cents = mode => {
    if (mode === 'open') {
      if (typeModal == 'edit') {
        setOpenCashValue(item => {
          return {
            ...item,
            val50cents: item.val50cents + 1,
          };
        });
        let total = openShiftCashTotal + 0.5;
        setOpenShiftCashTotal(total);
      } else {
        setVal50cents(val50cents + 1);
        setopenShiftCashTotalAdd(openShiftCashTotalAdd + 0.5);
      }
    } else {
      if (typeModal == 'editCloseShift') {
        setCloseCashValue(item => {
          return {
            ...item,
            closedVal50cents: item.closedVal50cents + 1,
          };
        });
        let total = closeShiftCashTotal + 0.5;
        setCloseShiftCashTotal(total);
      } else {
        setClosedVal50cents(closedVal50cents + 1);
        setCloseShiftCashTotalAdd(closeShiftCashTotalAdd + 0.5);
      }
    }
  };

  /**************** END 50 CENTS ****************/

  /**************** START RM 1 ****************/

  const _minus1RM = mode => {
    if (mode === 'open') {
      if (typeModal == 'edit') {
        if (openCashValue.val1RM > 0) {
          setOpenCashValue(item => {
            return {
              ...item,
              val1RM: item.val1RM - 1,
            };
          });
          let total = openShiftCashTotal - 1;
          setOpenShiftCashTotal(total);
        }
      } else {
        if (val1RM > 0) {
          setVal1RM(val1RM - 1);
          let total = openShiftCashTotalAdd - 1;
          setopenShiftCashTotalAdd(total);
        }
      }
    } else {
      if (typeModal == 'editCloseShift') {
        if (closeCashValue.closedVal1RM > 0) {
          setCloseCashValue(item => {
            return {
              ...item,
              closedVal1RM: item.closedVal1RM - 1,
            };
          });
          let total = closeShiftCashTotal - 1;
          setCloseShiftCashTotal(total);
        }
      } else {
        if (closedVal1RM > 0) {
          setClosedVal1RM(closedVal1RM - 1);
          let total = closeShiftCashTotalAdd - 1;
          setCloseShiftCashTotalAdd(total);
        }
      }
    }
  };

  const _plus1RM = mode => {
    if (mode === 'open') {
      if (typeModal == 'edit') {
        setOpenCashValue(item => {
          return {
            ...item,
            val1RM: item.val1RM + 1,
          };
        });
        let total = openShiftCashTotal + 1;
        setOpenShiftCashTotal(total);
      } else {
        setVal1RM(val1RM + 1);
        setopenShiftCashTotalAdd(openShiftCashTotalAdd + 1);
      }
    } else {
      if (typeModal == 'editCloseShift') {
        setCloseCashValue(item => {
          return {
            ...item,
            closedVal1RM: item.closedVal1RM + 1,
          };
        });
        let total = closeShiftCashTotal + 1;
        setCloseShiftCashTotal(total);
      } else {
        setClosedVal1RM(closedVal1RM + 1);
        setCloseShiftCashTotalAdd(closeShiftCashTotalAdd + 1);
      }
    }
  };

  /**************** END RM 1 ****************/

  /**************** START RM 5 ****************/

  const _minus5RM = mode => {
    if (mode == 'open') {
      if (typeModal == 'edit') {
        if (openCashValue.val5RM > 0) {
          setOpenCashValue(item => {
            return {
              ...item,
              val5RM: item.val5RM - 1,
            };
          });

          let total = openShiftCashTotal - 5;
          setOpenShiftCashTotal(total);
        }
      } else {
        if (val5RM > 0) {
          setVal5RM(val5RM - 1);
          let total = openShiftCashTotalAdd - 5;
          setopenShiftCashTotalAdd(total);
        }
      }
    } else {
      if (typeModal == 'editCloseShift') {
        if (closeCashValue.closedVal5RM > 0) {
          setCloseCashValue(item => {
            return {
              ...item,
              closedVal5RM: item.closedVal5RM - 1,
            };
          });
          let total = closeShiftCashTotal - 5;
          setCloseShiftCashTotal(total);
        }
      } else {
        if (closedVal5RM > 0) {
          setClosedVal5RM(closedVal5RM - 1);
          let total = closeShiftCashTotalAdd - 5;
          setCloseShiftCashTotalAdd(total);
        }
      }
    }
  };

  const _plus5RM = mode => {
    if (mode == 'open') {
      if (typeModal == 'edit') {
        setOpenCashValue(item => {
          return {
            ...item,
            val5RM: item.val5RM + 1,
          };
        });
        let total = openShiftCashTotal + 5;
        setOpenShiftCashTotal(total);
      } else {
        setVal5RM(val5RM + 1);
        setopenShiftCashTotalAdd(openShiftCashTotalAdd + 5);
      }
    } else {
      if (typeModal == 'editCloseShift') {
        setCloseCashValue(item => {
          return {
            ...item,
            closedVal5RM: item.closedVal5RM + 1,
          };
        });
        let total = closeShiftCashTotal + 5;
        setCloseShiftCashTotal(total);
      } else {
        setClosedVal5RM(closedVal5RM + 1);
        setCloseShiftCashTotalAdd(closeShiftCashTotalAdd + 5);
      }
    }
  };

  /**************** END RM 5 ****************/

  /**************** START RM 10 ****************/

  const _minus10RM = mode => {
    if (mode == 'open') {
      if (typeModal == 'edit') {
        if (openCashValue.val10RM > 0) {
          setOpenCashValue(item => {
            return {
              ...item,
              val10RM: item.val10RM - 1,
            };
          });
          let total = openShiftCashTotal - 10;
          setOpenShiftCashTotal(total);
        }
      } else {
        if (val10RM > 0) {
          setVal10RM(val10RM - 1);
          let total = openShiftCashTotalAdd - 10;
          setopenShiftCashTotalAdd(total);
        }
      }
    } else {
      if (typeModal == 'editCloseShift') {
        if (closeCashValue.val10RM > 0) {
          setCloseCashValue(item => {
            return {
              ...item,
              closedVal10RM: item.closedVal10RM - 1,
            };
          });
          let total = closeShiftCashTotal - 10;
          setCloseShiftCashTotal(total);
        }
      } else {
        if (closedVal10RM > 0) {
          setClosedVal10RM(closedVal10RM - 1);
          let total = closeShiftCashTotalAdd - 10;
          setCloseShiftCashTotalAdd(total);
        }
      }
    }
  };

  const _plus10RM = mode => {
    if (mode == 'open') {
      if (typeModal == 'edit') {
        setOpenCashValue(item => {
          return {
            ...item,
            val10RM: item.val10RM + 1,
          };
        });
        let total = openShiftCashTotal + 10;
        setOpenShiftCashTotal(total);
      } else {
        setVal10RM(val10RM + 1);
        setopenShiftCashTotalAdd(openShiftCashTotalAdd + 10);
      }
    } else {
      if (typeModal == 'editCloseShift') {
        setCloseCashValue(item => {
          return {
            ...item,
            closedVal10RM: item.closedVal10RM + 1,
          };
        });
        let total = closeShiftCashTotal + 10;
        setCloseShiftCashTotal(total);
      } else {
        setClosedVal10RM(closedVal10RM + 1);
        setCloseShiftCashTotalAdd(closeShiftCashTotalAdd + 10);
      }
    }
  };

  /**************** END RM 10 ****************/

  /**************** START RM 20 ****************/

  const _minus20RM = mode => {
    if (mode == 'open') {
      if (typeModal == 'edit') {
        if (openCashValue.val20RM > 0) {
          setOpenCashValue(item => {
            return {
              ...item,
              val20RM: item.val20RM - 1,
            };
          });
          let total = openShiftCashTotal - 20;
          setOpenShiftCashTotal(total);
        }
      } else {
        if (val20RM > 0) {
          setVal20RM(val20RM - 1);
          let total = openShiftCashTotalAdd - 20;
          setopenShiftCashTotalAdd(total);
        }
      }
    } else {
      if (typeModal == 'editCloseShift') {
        if (closeCashValue.closedVal20RM > 0) {
          setCloseCashValue(item => {
            return {
              ...item,
              closedVal20RM: item.closedVal20RM - 1,
            };
          });
          let total = closeShiftCashTotal - 20;
          setCloseShiftCashTotal(total);
        }
      } else {
        if (closedVal20RM > 0) {
          setClosedVal20RM(closedVal20RM - 1);
          let total = closeShiftCashTotalAdd - 20;
          setCloseShiftCashTotalAdd(total);
        }
      }
    }
  };

  const _plus20RM = mode => {
    if (mode == 'open') {
      if (typeModal == 'edit') {
        setOpenCashValue(item => {
          return {
            ...item,
            val20RM: item.val20RM + 1,
          };
        });
        let total = openShiftCashTotal + 20;
        setOpenShiftCashTotal(total);
      } else {
        setVal20RM(val20RM + 1);
        setopenShiftCashTotalAdd(openShiftCashTotalAdd + 20);
      }
    } else {
      if (typeModal == 'editCloseShift') {
        setCloseCashValue(item => {
          return {
            ...item,
            closedVal20RM: item.closedVal20RM + 1,
          };
        });
        let total = closeShiftCashTotal + 20;
        setCloseShiftCashTotal(total);
      } else {
        setClosedVal20RM(closedVal20RM + 1);
        setCloseShiftCashTotalAdd(closeShiftCashTotalAdd + 20);
      }
    }
  };

  /**************** END RM 20 ****************/

  /**************** START RM 50 ****************/

  const _minus50RM = mode => {
    if (mode == 'open') {
      if (typeModal == 'edit') {
        if (openCashValue.val50RM > 0) {
          setOpenCashValue(item => {
            return {
              ...item,
              val50RM: item.val50RM - 1,
            };
          });
          let total = openShiftCashTotal - 50;
          setOpenShiftCashTotal(total);
        }
      } else {
        if (val50RM > 0) {
          setVal50RM(val50RM - 1);
          let total = openShiftCashTotalAdd - 50;
          setopenShiftCashTotalAdd(total);
        }
      }
    } else {
      if (typeModal == 'editCloseShift') {
        if (closeCashValue.closedVal50RM > 0) {
          setCloseCashValue(item => {
            return {
              ...item,
              closedVal50RM: item.closedVal50RM - 1,
            };
          });
          let total = closeShiftCashTotal - 50;
          setCloseShiftCashTotal(total);
        }
      } else {
        if (closedVal50RM > 0) {
          setClosedVal50RM(closedVal50RM - 1);
          let total = closeShiftCashTotalAdd - 50;
          setCloseShiftCashTotalAdd(total);
        }
      }
    }
  };

  const _plus50RM = mode => {
    if (mode == 'open') {
      if (typeModal == 'edit') {
        setOpenCashValue(item => {
          return {
            ...item,
            val50RM: item.val50RM + 1,
          };
        });
        let total = openShiftCashTotal + 50;
        setOpenShiftCashTotal(total);
      } else {
        setVal50RM(val50RM + 1);
        setopenShiftCashTotalAdd(openShiftCashTotalAdd + 50);
      }
    } else {
      if (typeModal == 'editCloseShift') {
        setCloseCashValue(item => {
          return {
            ...item,
            closedVal50RM: item.closedVal50RM + 1,
          };
        });
        let total = closeShiftCashTotal + 50;
        setCloseShiftCashTotal(total);
      } else {
        setClosedVal50RM(closedVal50RM + 1);
        setCloseShiftCashTotalAdd(closeShiftCashTotalAdd + 50);
      }
    }
  };

  /**************** END RM 50 ****************/

  /**************** START RM 100 ****************/

  const _minus100RM = mode => {
    if (mode == 'open') {
      if (typeModal == 'edit') {
        if (openCashValue.val100RM > 0) {
          setOpenCashValue(item => {
            return {
              ...item,
              val100RM: item.val100RM - 1,
            };
          });
          let total = openShiftCashTotal - 100;
          setOpenShiftCashTotal(total);
        }
      } else {
        if (val100RM > 0) {
          setVal100RM(val100RM - 1);
          let total = openShiftCashTotalAdd - 100;
          setopenShiftCashTotalAdd(total);
        }
      }
    } else {
      if (typeModal == 'editCloseShift') {
        if (closeCashValue.closedVal100RM > 0) {
          setOpenCashValue(item => {
            return {
              ...item,
              closedVal100RM: item.closedVal100RM - 1,
            };
          });
          let total = closeShiftCashTotal - 100;
          setCloseShiftCashTotal(total);
        }
      } else {
        if (closedVal100RM > 0) {
          setClosedVal100RM(closedVal100RM - 1);
          let total = closeShiftCashTotalAdd - 100;
          setCloseShiftCashTotalAdd(total);
        }
      }
    }
  };

  const _plus100RM = mode => {
    if (mode == 'open') {
      if (typeModal == 'edit') {
        setOpenCashValue(item => {
          return {
            ...item,
            val100RM: item.val100RM + 1,
          };
        });
        let total = openShiftCashTotal + 100;
        setOpenShiftCashTotal(total);
      } else {
        setVal100RM(val100RM + 1);
        setopenShiftCashTotalAdd(openShiftCashTotalAdd + 100);
      }
    } else {
      if (typeModal == 'editCloseShift') {
        setCloseCashValue(item => {
          return {
            ...item,
            closedVal100RM: item.closedVal100RM + 1,
          };
        });
        let total = closeShiftCashTotal + 100;
        setCloseShiftCashTotal(total);
      } else {
        setClosedVal100RM(closedVal100RM + 1);
        setCloseShiftCashTotalAdd(closeShiftCashTotalAdd + 100);
      }
    }
  };

  /**************** END RM 100 ****************/

  return (
    <SafeAreaView style={styles.container}>
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
        <View
          style={{
            //   backgroundColor: color.white,
            flex: 1,
            flexDirection: 'row',
          }}>
          <Drawer navigation={navigation} />
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              margin: 20,
              borderRadius: 5,
            }}>
            <View style={{marginTop: 10, marginBottom: 10}}>
              <Text style={{fontFamily: fonts.semibold, fontSize: 20}}>
                Shift
              </Text>
            </View>

            <View
              style={{
                justifyContent: 'center',
                //   alignItems: 'center',
                //   flex: 1,
                height: '20%',

                // width: '50%',
                //   marginLeft: '10%',
                //   marginRight: '10%',
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
                    <Text style={styles.textFamily}> Open Shift </Text>
                  </View>
                  <View style={styles.boxNumber}>
                    <Text style={{fontFamily: fonts.semibold, fontSize: 25}}>
                      {openShiftCashTotal
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    </Text>
                  </View>
                </View>

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
                    <Text style={{...styles.textFamily, alignSelf: 'center'}}>
                      Close Shift
                    </Text>
                  </View>
                  <View style={styles.boxNumber}>
                    <Text style={{fontFamily: fonts.semibold, fontSize: 25}}>
                      {closeShiftCashTotal
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    </Text>
                  </View>
                </View>
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
                    <Text style={styles.textFamily}> Net Sales </Text>
                  </View>
                  <View style={styles.boxNumber}>
                    <Text style={{fontFamily: fonts.semibold, fontSize: 25}}>
                      {netSales.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
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
              }}>
              {openShift == true && openShiftId == '' ? (
                <View
                  style={{
                    backgroundColor: color.white,
                    flex: 3,
                    marginRight: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: 20,
                    width: '100%',
                  }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      // width: '100%',

                      backgroundColor: color.primary,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                      marginRight: 20,
                      marginLeft: 20,
                    }}
                    onPress={() => {
                      setModalVisibleOpenShift(true);
                      setTypeModal('add');
                    }}>
                    {/* // button open modal shift */}

                    <Text style={{...styles.textFamily, color: color.white}}>
                      Open Shift
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : openShiftId != '' && closeShift == true ? (
                <View
                  style={{
                    backgroundColor: color.white,
                    flex: 3,
                    marginRight: 20,
                    flexDirection: 'column',
                    //   justifyContent: 'space-between',
                    paddingTop: 20,
                    width: '100%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      // marginTop: 10,
                      paddingBottom: 100,
                    }}>
                    <View
                      style={{
                        //   flex: 1,
                        width: '50%',
                        //   backgroundColor: color.primary,

                        borderRadius: 5,
                        //   paddingLeft: 20,
                        flexDirection: 'column',
                      }}
                      onPress={() => {
                        setModalVisibleOpenShift(true);
                      }}>
                      <View
                        style={{
                          flexDirection: 'column',
                          // backgroundColor: color.danger,
                          height: 60,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <View style={{flexDirection: 'row', marginBottom: 5}}>
                          {/* // edit cash open shift */}
                          <Text
                            style={{...styles.textFamily, paddingRight: 10}}>
                            Open Shift
                          </Text>
                          <Icon
                            name={'edit-3'}
                            type="feather"
                            size={20}
                            onPress={() => {
                              setModalVisibleOpenShift(!modalVisibleOpenShift);
                              setTypeModal('edit');
                            }}
                            // style={{position: 'absolute', margin: 100}}
                          />
                        </View>
                        <Text style={{...styles.textFamily}}>
                          {moment(openShiftTime).format('h:mm A DD-MM-YYYY')}
                        </Text>
                      </View>

                      <ScrollView
                        style={{
                          marginTop: 20,
                        }}>
                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              5 cents
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val5cents}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              10 cents
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val10cents}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              20 cents
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val20cents}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              50 cents
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val50cents}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 1
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val1RM}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 5
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val5RM}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 10
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val10RM}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 20
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val20RM}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 50
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val50RM}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 100
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val100RM}
                            </Text>
                          </View>
                        </View>
                      </ScrollView>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        marginRight: 20,
                        marginLeft: 20,
                      }}>
                      <TouchableOpacity
                        style={{
                          height: 40,
                          backgroundColor: color.primary,
                          justifyContent: 'center',
                          width: '100%',
                          // margin: 20,
                          alignItems: 'center',
                          borderRadius: 5,
                          //   flex: 1,
                          // marginLeft:'auto',
                        }}
                        onPress={() => {
                          // _closeShift();
                          setModalVisibleCloseShift(!modalVisibleCloseShift);
                          setTypeModal('addClose');
                        }}>
                        {/* // button open modal close shift  */}
                        <Text
                          style={{...styles.textFamily, color: color.white}}>
                          Close Shift
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : openShiftId != '' && closeShiftId != '' ? (
                <View
                  style={{
                    backgroundColor: color.white,
                    flex: 3,
                    marginRight: 20,
                    flexDirection: 'column',
                    //   justifyContent: 'space-between',
                    paddingTop: 20,
                    width: '100%',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        // width: '100%',

                        backgroundColor: color.primary,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                        marginRight: 20,
                        marginLeft: 20,
                      }}
                      onPress={() => {
                        //   setModalVisibleOpenShift(true);
                        setOpenShiftId('');
                        setOpenShift(true);
                        setCloseShift(true);
                        setCloseShiftId('');
                        _newShift();
                      }}>
                      <Text style={{...styles.textFamily, color: color.white}}>
                        New Shift
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      paddingBottom: 100,
                    }}>
                    <View
                      style={{
                        //   flex: 1,
                        width: '50%',
                        //   backgroundColor: color.primary,

                        borderRadius: 5,
                        //   paddingLeft: 20,
                        flexDirection: 'column',
                      }}
                      onPress={() => {
                        setModalVisibleOpenShift(true);
                      }}>
                      <View
                        style={{
                          flexDirection: 'column',
                          // backgroundColor: color.danger,
                          height: 60,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <View style={{flexDirection: 'row', marginBottom: 5}}>
                          {/* // edit cash open shift */}

                          <Text
                            style={{...styles.textFamily, paddingRight: 10}}>
                            Open Shift
                          </Text>
                          <Icon
                            name={'edit-3'}
                            type="feather"
                            size={20}
                            onPress={() => {
                              setModalVisibleOpenShift(!modalVisibleOpenShift);
                              setTypeModal('edit');
                            }}
                            // style={{position: 'absolute', margin: 100}}
                          />
                        </View>
                        <Text style={{...styles.textFamily}}>
                          {moment(openShiftTime).format('h:mm A DD-MM-YYYY')}
                        </Text>
                      </View>

                      <ScrollView
                        style={{
                          marginTop: 20,
                        }}>
                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              5 cents
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val5cents}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              10 cents
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val10cents}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              20 cents
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val20cents}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              50 cents
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val50cents}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 1
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val1RM}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 5
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val5RM}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 10
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val10RM}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 20
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val20RM}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 50
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val50RM}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 100
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {openShiftCash.val100RM}
                            </Text>
                          </View>
                        </View>
                      </ScrollView>
                    </View>
                    <View
                      style={{
                        //   flex: 1,
                        width: '50%',
                        // backgroundColor: color.primary,

                        borderRadius: 5,
                        //   paddingLeft: 20,
                        flexDirection: 'column',
                      }}
                      onPress={() => {
                        setModalVisibleCloseShift(true);
                      }}>
                      <View
                        style={{
                          flexDirection: 'column',
                          // backgroundColor: color.danger,
                          height: 60,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <View style={{flexDirection: 'row', marginBottom: 5}}>
                          {/* // modal close edit shift */}
                          <Text
                            style={{...styles.textFamily, paddingRight: 10}}>
                            Close Shift
                          </Text>
                          <Icon
                            name={'edit-3'}
                            type="feather"
                            size={20}
                            onPress={() => {
                              setModalVisibleCloseShift(
                                !modalVisibleCloseShift,
                              );
                              setTypeModal('editCloseShift');
                            }}
                            // style={{position: 'absolute', margin: 100}}
                          />
                        </View>
                        <Text style={{...styles.textFamily}}>
                          {moment(closeShiftTime).format('h:mm A DD-MM-YYYY')}
                        </Text>
                      </View>

                      <ScrollView
                        style={{
                          marginTop: 20,
                        }}>
                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              5 cents
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {closeShiftCash.closedVal5cents}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              10 cents
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {closeShiftCash.closedVal10cents}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              20 cents
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {closeShiftCash.closedVal20cents}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              50 cents
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {closeShiftCash.closedVal50cents}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 1
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {closeShiftCash.closedVal1RM}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 5
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {closeShiftCash.closedVal5RM}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 10
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {closeShiftCash.closedVal10RM}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 20
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {closeShiftCash.closedVal20RM}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 50
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {closeShiftCash.closedVal50RM}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <View
                            style={{
                              backgroundColor: color.background,
                              width: '70%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{...styles.textFamily, paddingLeft: 20}}>
                              RM 100
                            </Text>
                            <Text
                              style={{...styles.textFamily, paddingRight: 20}}>
                              x {closeShiftCash.closedVal100RM}
                            </Text>
                          </View>
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                </View>
              ) : null}

              <View
                style={{
                  backgroundColor: color.white,
                  flex: 2.5,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    paddingRight: 20,
                    paddingLeft: 20,
                    width: '100%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingTop: 20,
                    }}>
                    <Text style={{...styles.textFamily, marginBottom: 10}}>
                      Gross Sales
                    </Text>
                    <Text style={{...styles.textFamily, marginBottom: 10}}>
                      {grossSales
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingTop: 10,
                    }}>
                    <Text style={{...styles.textFamily, marginBottom: 10}}>
                      Refunds
                    </Text>
                    <Text style={{...styles.textFamily, marginBottom: 10}}>
                      {totalRefund
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingTop: 10,
                    }}>
                    <Text style={{...styles.textFamily, marginBottom: 10}}>
                      Discount
                    </Text>
                    <Text style={{...styles.textFamily, marginBottom: 10}}>
                      {totalDiscount
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingTop: 10,
                    }}>
                    <Text style={{...styles.textFamily, marginBottom: 10}}>
                      Net Sales
                    </Text>
                    <Text style={{...styles.textFamily, marginBottom: 10}}>
                      {netSales.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingTop: 10,
                    }}>
                    <Text style={{...styles.textFamily, marginBottom: 10}}>
                      Deposit
                    </Text>
                    <Text style={{...styles.textFamily, marginBottom: 10}}>
                      {totalDeposit
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingTop: 10,
                    }}>
                    <Text style={{...styles.textFamily, marginBottom: 10}}>
                      Rounding
                    </Text>
                    <Text style={{...styles.textFamily, marginBottom: 10}}>
                      0.00
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingTop: 10,
                    }}>
                    <Text style={{...styles.textFamily, marginBottom: 10}}>
                      Tax
                    </Text>
                    <Text style={{...styles.textFamily, marginBottom: 10}}>
                      {totalTax.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    </Text>
                  </View>
                </View>

                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingLeft: 20,
                      paddingBottom: 20,
                      paddingRight: 20,
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontFamily: fonts.semibold, fontSize: 20}}>
                      Total
                    </Text>
                    <Text style={{fontFamily: fonts.semibold, fontSize: 20}}>
                      {total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={{
                      backgroundColor: color.primary,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      // paddingTop: 10,
                      marginLeft: 20,
                      marginRight: 20,
                      borderRadius: 5,
                      // borderWidth: 1,
                      // borderColor: color.primary,
                      marginBottom: 20,
                    }}
                    onPress={() => {
                      _generateReport();
                    }}>
                    <Text style={{...styles.textFamily, color: color.white}}>
                      Download Report
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* // modal open shift */}
      <Modal
        animationType="fade"
        visible={modalVisibleOpenShift}
        style={{...styles.modalView}}>
        <View style={{alignItems: 'flex-start', padding: 20, paddingBottom: 0}}>
          <Icon
            name={'x'}
            type="feather"
            size={24}
            onPress={() => {
              setModalVisibleOpenShift(!modalVisibleOpenShift);
              setOpenCashValue(openShiftCash);
              setOpenShiftCashTotal(openShiftCashTotalEdit);
              setopenShiftCashTotalAdd(0);

              setVal5cents(0);
              setVal10cents(0);
              setVal20cents(0);
              setVal50cents(0);
              setVal1RM(0);
              setVal5RM(0);
              setVal10RM(0);
              setVal20RM(0);
              setVal50RM(0);
              setVal100RM(0);
            }}
            // style={{position: 'absolute', margin: 100}}
          />
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            // justifyContent: 'flex-start',

            // backgroundColor: 'black',
          }}>
          <View
            style={{
              backgroundColor: color.white,
              width: 250,
              height: 90,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              borderRadius: 5,
              marginRight: 10,
            }}>
            <Text style={styles.textFamily}>Total</Text>

            <Text
              style={{
                ...styles.textFamily,
                fontSize: 25,
                fontFamily: fonts.semibold,
              }}>
              RM{' '}
              {openShiftCashTotal != ''
                ? Number(openShiftCashTotal)
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                : openShiftCashTotalAdd
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: color.white,
              width: 250,
              height: 90,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              borderRadius: 5,
              marginLeft: 10,
            }}>
            <Text style={styles.textFamily}>Time</Text>

            <View
              style={{
                width: 200,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  ...styles.textFamily,
                  fontSize: 25,
                  fontFamily: fonts.semibold,
                }}>
                {openShiftTime
                  ? moment(openShiftTime).format('h:mm A')
                  : moment(new Date()).format('h:mm A')}
              </Text>
              <Text
                style={{
                  ...styles.textFamily,
                  fontSize: 25,
                  fontFamily: fonts.semibold,
                }}>
                {openShiftTime
                  ? moment(openShiftTime).format('DD-MM-YYYY')
                  : moment(new Date()).format('DD-MM-YYYY')}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            // justifyContent: 'center',
            // height: 160,
            flex: 1,
            // backgroundColor: 'pink',
            marginBottom: 40,
          }}>
          <View
            style={{
              flexDirection: 'column',
              //   width: '70%',
              // backgroundColor: 'black',
              //   marginLeft: 'auto',
              //   marginRight: 'auto',
              // height: 200,
              // justifyContent:'space-around'
              // justifyContent: 'center',
              //   backgroundColor: 'yellow',
              alignItems: 'center',
              paddingTop: 40,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  //   marginLeft: 20,
                }}>
                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  5
                </Text>

                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  Cents
                </Text>
                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus5Cents('open');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {openCashValue != ''
                        ? openCashValue.val5cents
                        : val5cents}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus5Cents('open');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  10
                </Text>

                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  Cents
                </Text>
                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus10Cents('open');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {openCashValue != ''
                        ? openCashValue.val10cents
                        : val10cents}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus10Cents('open');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  20
                </Text>

                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  Cents
                </Text>
                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus20Cents('open');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {openCashValue != ''
                        ? openCashValue.val20cents
                        : val20cents}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus20Cents('open');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  50
                </Text>

                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  Cents
                </Text>
                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus50Cents('open');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {openCashValue != ''
                        ? openCashValue.val50cents
                        : val50cents}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus50Cents('open');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  RM
                </Text>

                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  1
                </Text>

                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus1RM('open');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {openCashValue != '' ? openCashValue.val1RM : val1RM}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus1RM('open');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                paddingTop: 20,
              }}>
              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  //   marginLeft: 20,
                }}>
                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  RM
                </Text>
                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  5
                </Text>

                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus5RM('open');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {' '}
                      {openCashValue != '' ? openCashValue.val5RM : val5RM}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus5RM('open');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  RM
                </Text>
                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  10
                </Text>

                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus10RM('open');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {' '}
                      {openCashValue != '' ? openCashValue.val10RM : val10RM}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus10RM('open');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  RM
                </Text>

                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  20
                </Text>

                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus20RM('open');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {' '}
                      {openCashValue != ''
                        ? openCashValue.val20RM
                        : val20RM}{' '}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus20RM('open');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  RM
                </Text>
                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  50
                </Text>

                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus50RM('open');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {openCashValue != '' ? openCashValue.val50RM : val50RM}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus50RM('open');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  RM
                </Text>

                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  100
                </Text>

                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus100RM('open');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {openCashValue != '' ? openCashValue.val100RM : val100RM}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus100RM('open');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 40,
                paddingBottom: 0,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  height: 40,
                  backgroundColor: color.primary,
                  justifyContent: 'center',
                  width: '99%',
                  // margin: 20,
                  alignItems: 'center',
                  borderRadius: 5,
                  //   flex: 1,
                  // marginLeft:'auto',
                }}
                onPress={() => {
                  _openShift(typeModal);
                  setModalVisibleOpenShift(false);
                }}>
                {/* // button confirm cash open shift */}

                <Text style={{...styles.textFamily, color: color.white}}>
                  {typeModal == 'edit' ? 'Confirm' : 'Open Shift'}{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* // modal close shift */}

      <Modal
        animationType="fade"
        visible={modalVisibleCloseShift}
        style={{...styles.modalView}}>
        <View style={{alignItems: 'flex-start', padding: 20, paddingBottom: 0}}>
          <Icon
            name={'x'}
            type="feather"
            size={24}
            onPress={() => {
              setModalVisibleCloseShift(!modalVisibleCloseShift);
              setCloseCashValue(closeShiftCash);
              setCloseShiftCashTotal(closeShiftCashTotalEdit);
              setCloseShiftCashTotalAdd(0);

              setClosedVal5cents(0);
              setClosedVal10cents(0);
              setClosedVal20cents(0);
              setClosedVal50cents(0);
              setClosedVal1RM(0);
              setClosedVal5RM(0);
              setClosedVal10RM(0);
              setClosedVal20RM(0);
              setClosedVal50RM(0);
              setClosedVal100RM(0);
            }}
            // style={{position: 'absolute', margin: 100}}
          />
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',

            // justifyContent: 'flex-start',

            // backgroundColor: 'black',
          }}>
          <View
            style={{
              backgroundColor: color.white,
              width: 250,
              height: 90,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              borderRadius: 5,
              marginRight: 10,
            }}>
            <Text style={styles.textFamily}>Total</Text>

            <Text
              style={{
                ...styles.textFamily,
                fontSize: 25,
                fontFamily: fonts.semibold,
              }}>
              RM{' '}
              {closeShiftCashTotal != ''
                ? Number(closeShiftCashTotal)
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                : closeShiftCashTotalAdd
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: color.white,
              width: 250,
              height: 90,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              borderRadius: 5,
              marginLeft: 10,
            }}>
            <Text style={styles.textFamily}>Time</Text>

            <Text
              style={{
                ...styles.textFamily,
                fontSize: 25,
                fontFamily: fonts.semibold,
              }}>
              {closeShiftTime
                ? moment(closeShiftTime).format('h:mm A')
                : moment(new Date()).format('h:mm A')}
            </Text>

            <Text
              style={{
                ...styles.textFamily,
                fontSize: 25,
                fontFamily: fonts.semibold,
              }}>
              {closeShiftTime
                ? moment(closeShiftTime).format('DD-MM-YYYY')
                : moment(new Date()).format('DD-MM-YYYY')}
            </Text>
          </View>
        </View>

        <View
          style={{
            // justifyContent: 'center',
            // height: 160,
            flex: 1,
            // backgroundColor: 'pink',
            marginBottom: 40,
          }}>
          <View
            style={{
              flexDirection: 'column',
              //   width: '70%',
              // backgroundColor: 'black',
              //   marginLeft: 'auto',
              //   marginRight: 'auto',
              // height: 200,
              // justifyContent:'space-around'
              // justifyContent: 'center',
              //   backgroundColor: 'yellow',
              alignItems: 'center',
              paddingTop: 40,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  //   marginLeft: 20,
                }}>
                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  5
                </Text>

                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  Cents
                </Text>
                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus5Cents('close');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {closeCashValue != ''
                        ? closeCashValue.closedVal5cents
                        : closedVal5cents}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus5Cents('close');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  10
                </Text>

                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  Cents
                </Text>
                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus10Cents('close');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {closeCashValue != ''
                        ? closeCashValue.closedVal10cents
                        : closedVal10cents}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus10Cents('close');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  20
                </Text>

                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  Cents
                </Text>
                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus20Cents('close');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {closeCashValue != ''
                        ? closeCashValue.closedVal20cents
                        : closedVal20cents}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus20Cents('close');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  50
                </Text>

                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  Cents
                </Text>
                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus50Cents('close');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {closeCashValue != ''
                        ? closeCashValue.closedVal50cents
                        : closedVal50cents}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus50Cents('close');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  RM
                </Text>

                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  1
                </Text>

                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus1RM('close');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {closeCashValue != ''
                        ? closeCashValue.closedVal1RM
                        : closedVal1RM}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus1RM('close');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                paddingTop: 20,
              }}>
              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  //   marginLeft: 20,
                }}>
                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  RM
                </Text>
                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  5
                </Text>

                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus5RM('close');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {' '}
                      {closeCashValue != ''
                        ? closeCashValue.closedVal5RM
                        : closedVal5RM}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus5RM('close');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  RM
                </Text>
                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  10
                </Text>

                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus10RM('close');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {' '}
                      {closeCashValue != ''
                        ? closeCashValue.closedVal10RM
                        : closedVal10RM}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus10RM('close');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  RM
                </Text>

                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  20
                </Text>

                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus20RM('close');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {' '}
                      {closeCashValue != ''
                        ? closeCashValue.closedVal20RM
                        : closedVal20RM}{' '}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus20RM('close');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  RM
                </Text>
                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  50
                </Text>

                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus50RM('close');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {closeCashValue != ''
                        ? closeCashValue.closedVal50RM
                        : closedVal50RM}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus50RM('close');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  height: 150,
                  width: 160,
                  backgroundColor: color.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  marginLeft: 20,
                }}>
                <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                  RM
                </Text>

                <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                  100
                </Text>

                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopStartRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      _minus100RM('close');
                    }}>
                    <Icon name={'minus'} type="feather" size={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 60,
                      backgroundColor: color.background,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textFamily}>
                      {closeCashValue != ''
                        ? closeCashValue.closedVal100RM
                        : closedVal100RM}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 35,
                      backgroundColor: color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      _plus100RM('close');
                    }}>
                    <Icon name={'plus'} type="feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 40,
                paddingBottom: 0,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  height: 40,
                  backgroundColor: color.primary,
                  justifyContent: 'center',
                  width: '99%',
                  // margin: 20,
                  alignItems: 'center',
                  borderRadius: 5,
                  //   flex: 1,
                  // marginLeft:'auto',
                }}
                onPress={() => {
                  _closeShift(typeModal);
                  setModalVisibleCloseShift(false);
                }}>
                {/* // button confirm cash open shift */}

                <Text style={{...styles.textFamily, color: color.white}}>
                  {closeShift == true
                    ? 'Close Shift'
                    : typeModal == 'editCloseShift'
                    ? 'Confirm'
                    : null}{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
export default Shift;
