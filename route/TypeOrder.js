import {useEffect, useState} from 'react';
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
  StatusBar,
} from 'react-native';

import {Icon} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
// import {color} from 'react-native-elements/dist/helpers';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fonts, color, system_configuration} from '../config/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Drawer from '../component/Drawer';

const url =
  system_configuration.ENVIRONMENT === 'development'
    ? system_configuration.REACT_APP_DEV_MODE
    : system_configuration.REACT_APP_PROD_MODE;

const dataTableOrder = [
  {
    id: 1,
    orderTableName: 'Table 1',
  },
  {
    id: 2,
    orderTableName: 'Table 2',
  },
  {
    id: 3,
    orderTableName: 'Table 3',
  },
  {
    id: 4,
    orderTableName: 'Table 4',
  },
  {
    id: 5,
    orderTableName: 'Table 5',
  },
  {
    id: 6,
    orderTableName: 'Table 6',
  },
  {
    id: 6,
    orderTableName: 'Table 7',
  },
  {
    id: 6,
    orderTableName: 'Table 8',
  },
  {
    id: 6,
    orderTableName: 'Table 9',
  },
  {
    id: 6,
    orderTableName: 'Table 10',
  },
];

// create a component
const TypeOrder = ({navigation, route}) => {
  const [dineIn, setDineIn] = useState(false);
  const [takeAway, setTakeAway] = useState(false);
  const [pickup, setPickup] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [driveIn, setDriveIn] = useState(false);
  const [preOrder, setPreOrder] = useState(false);
  const [chosenDate, setChosenDate] = useState('');
  const [chosenTime, setChosenTime] = useState('');
  const [count, setCount] = useState(0);
  // const [orderType, setOrderType] = useState({});
  const [press, setPress] = useState(false);

  const [staffName, setStaffName] = useState('');

  const [selectOrderType, setSelectOrderType] = useState('');
  const [selectOrderTypeId, setSelectOrderTypeId] = useState('');
  const [selectTable, setSelectTable] = useState('');
  const [selectTableId, setSelectTableId] = useState('');

  const [customerDetails, setCustomerDetails] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // const [orderType, setOrderType] = useState({
  //   backgroundColor: 'white',
  //   backgroundColor2: 'orange',
  //   pressed: false,
  // });

  const [orderType, setOrderType] = useState([]);

  useEffect(() => {
    navigation.addListener('focus', function () {
      _getStaff();
      _getOrderType();

      // setCustomerDetails([
      //   {
      //     cust_name: customerName,
      //     cust_phone: customerPhone,
      //   },
      // ]);
    });
  }, []);

  const _getOrderType = async () => {
    // console.log('_getOrderType');
    await axios
      .get(url + '/getTypeOrder')
      .then(res => {
        setOrderType(res.data.data);
        console.log('res', res.data.data);
      })
      .catch(err => {
        console.log('err', err);
      });

    // console.log('orderType', orderType);
  };

  const _getStaff = async () => {
    AsyncStorage.getItem('STAFF')
      .then(function (resp) {
        let stgParsed = JSON.parse(resp);
        console.log('User', stgParsed);
        setStaffName(stgParsed.staffName);
      })
      .catch(e => {});
  };

  const changeState = (id, type) => {
    if (id == 1) {
      // Dine In
      setSelectOrderType(type);
      setSelectOrderTypeId(id);
      setDineIn(true);
      setTakeAway(false);
      setDelivery(false);
      setPickup(false);
      setDriveIn(false);
      setPreOrder(false);
    } else if (id == 2) {
      // Take Away
      setSelectOrderType(type);
      setSelectOrderTypeId(id);
      setDineIn(false);
      setTakeAway(true);
      // setDelivery(false);
      setPickup(false);
      // setDriveIn(false);
      setPreOrder(false);
    } else if (id == 3) {
      setSelectOrderType(type);
      setSelectOrderTypeId(id);
      setDineIn(false);
      setTakeAway(false);
      // setDelivery(false);
      setPickup(true);
      setPreOrder(false);
    }
    // else if (mode === 'delivery') {
    // } else if (mode === 'drive-in') {
    // }
    else if (id == 6) {
      setSelectOrderType(type);
      setSelectOrderTypeId(id);
      setDineIn(false);
      setTakeAway(false);
      // setDelivery(false);
      setPickup(false);
      setPreOrder(true);
    }
  };

  const _addBtn = () => {
    // setCount(1);

    setCount(count + 1);
    // alert(count);
  };

  const _renderAdd = () => {
    const elements = [];
    let i = 0;
    for (i; i < count; i++) {
      elements.push(
        <View
          key={count}
          style={{
            // flex: 1,
            flexDirection: 'row',
            marginTop: 20,
            // marginLeft: '15%',
            width: '70%',
            backgroundColor: 'blue',
          }}>
          <TouchableOpacity
            style={[styles.Icon, {marginRight: 10}]}
            onPress={() => _minusBtn()}>
            <View>
              <Icon
                name={'minus-square'}
                type="feather"
                size={30}
                // style={{paddingLeft:}}
              />
            </View>
          </TouchableOpacity>
          <View style={[styles.inputView, {flex: 1}]}>
            <TextInput
              style={styles.TextInput}
              placeholder="Enter Customer Name"
              placeholderTextColor={color.textGray}

              // placeholderTextColor={color.placeholder}
              // defaultValue={staffNo}
            />
          </View>
          {/* <View style={{flex: 0.1}} /> */}
          <View style={[styles.inputView, {flex: 1}]}>
            <TextInput
              style={styles.TextInput}
              placeholder="Enter Contact No."
              placeholderTextColor={color.textGray}

              // placeholderTextColor={color.placeholder}
              // defaultValue={staffNo}
            />
          </View>
          {/* <View style={{flex:0.1}}/> */}
          {i + 1 == count ? (
            <TouchableOpacity
              style={styles.Icon}
              onPress={() => {
                // setCount(1);
                _addBtn();
              }}>
              <View>
                <Icon
                  name={'plus-square'}
                  type="feather"
                  size={30}
                  // style={{paddingLeft:}}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{...styles.Icon, height: 0, opacity: 0}}
              onPress={() => {
                // setCount(1);
                // _addBtn();
              }}>
              <View>
                <Icon
                  name={'plus-square'}
                  type="feather"
                  size={30}
                  // style={{paddingLeft:}}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>,
      );
    }

    return elements;
  };

  const _minusBtn = () => {
    // setCount(1);

    setCount(count - 1);
    alert(count);
  };

  const _renderMinus = () => {
    const elements = [];
    for (let i = 0; i < count; i++) {
      elements.splice(
        <View
          key={count}
          style={{
            // flex: 1,
            flexDirection: 'row',
            // padding: 20,
            // paddingLeft: '15%',
            // justifyContent: 'space-around',
            // margin: 20,
            // marginLeft: '15%',
            width: '70%',
          }}>
          <TouchableOpacity
            style={[styles.Icon, {marginRight: 10}]}
            onPress={() => _minusBtn()}>
            <View>
              <Icon
                name={'minus-square'}
                type="feather"
                size={30}
                // style={{paddingLeft:}}
              />
            </View>
          </TouchableOpacity>
          <View style={[styles.inputView, {flex: 1}]}>
            <TextInput
              style={styles.TextInput}
              placeholder="Enter Customer Name"
              placeholderTextColor={color.textGray}

              // placeholderTextColor={color.placeholder}
              // defaultValue={staffNo}
            />
          </View>
          {/* <View style={{flex: 0.1}} /> */}
          <View style={[styles.inputView, {flex: 1}]}>
            <TextInput
              style={styles.TextInput}
              placeholder="Enter Contact No."
              placeholderTextColor={color.textGray}

              // placeholderTextColor={color.placeholder}
              // defaultValue={staffNo}
            />
          </View>
          {/* <View style={{flex:0.1}}/> */}
          <TouchableOpacity style={styles.Icon} onPress={() => _addBtn()}>
            <View>
              <Icon
                name={'plus-square'}
                type="feather"
                size={30}
                // style={{paddingLeft:}}
              />
            </View>
          </TouchableOpacity>
        </View>,
      );
    }

    return elements;
  };

  // const _dinein = dineIn ? (
  //   dataTableOrder.map(data => {
  //     return (

  //     );
  //   })
  // ) : null;

  const _dinein = dineIn ? (
    <View
      style={{
        // flex: 0.7,
        flexDirection: 'row',
        // backgroundColor: 'grey',
        justifyContent: 'center',
        // flexWrap: 'wrap',
        // marginRight: 20,
      }}>
      <ScrollView
        contentContainerStyle={{
          flexWrap: 'wrap',
          flexDirection: 'row',
          // backgroundColor:'black'
          justifyContent: 'center',
          // flex: 1,
        }}>
        {dataTableOrder.map(data => {
          if (data.orderTableName == selectTable) {
            return (
              <TouchableOpacity
                style={{...styles.BoxTable, backgroundColor: color.primary}}
                onPress={() => {
                  setSelectTable(data.orderTableName);
                  setSelectTableId(data.id);
                }}>
                <Text style={{...styles.TextFamily, color: color.white}}>
                  {data.orderTableName}
                </Text>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                style={{...styles.BoxTable, backgroundColor: color.white}}
                onPress={() => {
                  setSelectTable(data.orderTableName);
                  setSelectTableId(data.id);
                }}>
                <Text style={styles.TextFamily}>{data.orderTableName}</Text>
              </TouchableOpacity>
            );
          }
        })}
      </ScrollView>
    </View>
  ) : null;

  const _takeaway = takeAway ? (
    <View
      style={{
        ...styles.Box,
        flex: 1,
        flexDirection: 'column',
        height: 600,
        width: '100%',
        margin: 0,
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        // marginBottom: 20,
      }}>
      <Text style={{fontFamily: fonts.medium, fontSize: 16}}>Take Away</Text>
    </View>
  ) : null;

  const _pickup = pickup ? (
    <>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={styles.inputDate}>
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode={'date'}
            is24Hour={true}
            minimumDate={new Date()}
            style={{width: 200, marginRight: '25%'}}
            onChange={setDate}
          />
        </View>
        <View style={styles.inputDate}>
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode={'time'}
            is24Hour={true}
            minimumDate={new Date()}
            style={{width: 200, marginRight: '30%'}}
          />
        </View>
      </View>
      <View>
        <Text>{chosenDate}</Text>
      </View>
      <View>
        <Text>tarikh</Text>
      </View>
    </>
  ) : null;

  const setDate = (event, date) => {
    console.log(date);
    setChosenDate(date.toLocaleDateString());
  };

  const _preorder = preOrder ? (
    <>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={styles.inputDate}>
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode={'date'}
            is24Hour={true}
            minimumDate={new Date()}
            style={{width: 200, marginRight: '25%'}}
            onChange={setDate}
          />
        </View>
        <View style={styles.inputDate}>
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode={'time'}
            is24Hour={true}
            minimumDate={new Date()}
            style={{width: 200, marginRight: '30%'}}
          />
        </View>
      </View>
      <View>
        <Text>{chosenDate}</Text>
      </View>
      <View
        style={{justifyContent: 'center', flexDirection: 'row', marginTop: 6}}>
        <TouchableOpacity style={styles.BoxTable}>
          <Text style={styles.TextFamily}>
            {dataTableOrder[0].orderTableName}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.BoxTable}>
          <Text style={styles.TextFamily}>
            {dataTableOrder[1].orderTableName}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.BoxTable}>
          <Text style={styles.TextFamily}>
            {dataTableOrder[2].orderTableName}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  ) : null;

  const _menuOrder = async () => {
    if (customerName == '' || customerPhone == '') {
      alert('Please Enter Customer Details');
      return;
    }

    if (selectOrderType == '') {
      alert('Please Choose Order Type');
      return;
    }

    // console.log('customer', customerDetails);

    if (dineIn == true) {
      if (selectTable == '') {
        alert('Please Choose Table');
        return;
      } else {
        AsyncStorage.setItem(
          'CUSTOMER',
          JSON.stringify({
            order_type: 'Dine In',
            order_typeId: 1,
            table_name: selectTable,
            table_id: selectTableId,
            customer: [
              {customer_name: customerName, customer_phone: customerPhone},
            ],
          }),
        );

        // alert(selectTableId);
      }
    } else if (takeAway == true) {
      AsyncStorage.setItem(
        'CUSTOMER',
        JSON.stringify({
          order_type: 'Take Away',
          order_typeId: 2,
          table_name: '',
          table_id: '',
          customer: [
            {customer_name: customerName, customer_phone: customerPhone},
          ],
        }),
      );

      AsyncStorage.removeItem('ORDER_TAKEAWAY');
    } else if (pickup == true) {
      alert('pickup');
    } else if (preOrder == true) {
      alert('pre order');
    } else if (driveIn == true) {
      alert('drive in');
    } else if (delivery == true) {
      alert('delivery');
    }

    // console.log(customerName);
    navigation.push('MenuOrder', {
      data: '',
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar hidden />
      <View style={{flexDirection: 'row', flex: 1}}>
        <Drawer navigation={navigation} />
        <View style={{flex: 1}}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{flex: 1, backgroundColor: color.background}}>
              <View style={{flex: 1, flexDirection: 'column', padding: 20}}>
                <View>
                  <Text style={{fontSize: 20, fontFamily: fonts.semibold}}>
                    Welcome, {staffName}
                  </Text>
                </View>

                <View style={{paddingTop: 5}}>
                  <Text style={{fontSize: 12, fontFamily: fonts.regular}}>
                    Discover whatever you need easily
                  </Text>
                </View>
              </View>
            </View>

            <View style={{flex: 2, backgroundColor: color.background}}>
              <ScrollView>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    // justifyContent: 'center',
                    // padding: 20,
                    // backgroundColor:'blue',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      // flex: 1,
                      flexDirection: 'row',
                      // padding: 20,
                      // paddingLeft: '15%',
                      // justifyContent: 'space-around',
                      marginTop: 20,
                      // marginLeft: '15%',
                      width: '70%',
                      // backgroundColor: color.background,
                    }}>
                    <View
                      style={[
                        styles.Icon,
                        {marginRight: 10, padding: 10, opacity: 0, height: 0},
                      ]}>
                      <Icon
                        name={'plus-minus'}
                        type="feather"
                        size={30}
                        // style={{paddingLeft:}}
                      />
                    </View>

                    <View
                      style={[
                        styles.inputView,
                        {
                          flex: 1,
                          borderWidth: 1,
                          borderColor: color.danger,
                          flexDirection: 'row',
                          alignItems: 'center',
                        },
                      ]}>
                      <TextInput
                        style={[styles.TextInput]}
                        placeholder="Enter Customer Name"
                        placeholderTextColor={color.textGray}
                        onChangeText={text => setCustomerName(text)}
                        defaultValue={''}

                        // defaultValue={staffNo}
                      />
                      {/* <View style={{marginRight: 10}}>
                        <Icon
                          name={'alert-circle'}
                          type="feather"
                          size={24}
                          color={color.textGray}
                        />
                      </View> */}
                    </View>

                    {/* <View style={{flex: 0.1}} /> */}
                    <View style={[styles.inputView, {flex: 1}]}>
                      <TextInput
                        style={styles.TextInput}
                        placeholder="Enter Contact No."
                        placeholderTextColor={color.textGray}
                        onChangeText={text => setCustomerPhone(text)}
                        defaultValue={''}
                        // placeholderTextColor={color.placeholder}
                        // defaultValue={staffNo}
                      />
                    </View>
                    {/* <View style={{flex:0.1}}/> */}

                    {/* {count == 0 ? (
                  <TouchableOpacity
                    style={styles.Icon}
                    onPress={() => {
                      _addBtn();
                    }}>
                    <View>
                      <Icon
                        name={'plus-square'}
                        type="feather"
                        size={30}
                        // style={{paddingLeft:}}
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{...styles.Icon, height: 0, opacity: 0}}
                    onPress={() => {
                      // _addBtn();
                    }}>
                    <View>
                      <Icon
                        name={'plus-square'}
                        type="feather"
                        size={30}
                        // style={{paddingLeft:}}
                      />
                    </View>
                  </TouchableOpacity>
                )} */}
                  </View>

                  {_renderAdd() ? _renderAdd() : _renderMinus()}
                </View>
              </ScrollView>
            </View>

            <View style={{flex: 9, backgroundColor: color.background}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  // padding: 20,
                  // paddingLeft: 50,
                  justifyContent: 'space-evenly',
                  // backgroundColor:'black'
                }}>
                <View style={{flex: 1}}>
                  <ScrollView>
                    <View
                      style={{
                        // height: '100%',
                        // width: '50%',
                        // flex: 0.3,
                        flexDirection: 'column',
                        // justifyContent: 'flex-end',
                        alignItems: 'center',
                        // backgroundColor: 'pink',
                        // right:0,
                      }}>
                      {orderType.map((data, key) => {
                        if (data.status == 1) {
                          return (
                            <TouchableOpacity
                              key={key}
                              style={{
                                ...styles.Box,
                                backgroundColor:
                                  selectOrderType == data.title
                                    ? color.primary
                                    : color.white,
                              }}
                              onPress={() => {
                                changeState(data.id, data.title);
                              }}>
                              <View>
                                <Text
                                  style={{
                                    ...styles.TextFamily,
                                    color:
                                      selectOrderType == data.title
                                        ? color.white
                                        : null,
                                  }}>
                                  {data.title}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          );
                        } else {
                          return (
                            <View
                              key={key}
                              style={{
                                ...styles.Box,
                                backgroundColor:
                                  selectOrderType == data.title
                                    ? color.primary
                                    : color.white,
                              }}
                              onPress={() => {
                                changeState(data.id, data.title);
                              }}>
                              <View>
                                <Text
                                  style={{
                                    ...styles.TextFamily,
                                    color: color.textGray,
                                  }}>
                                  {data.title}
                                </Text>
                              </View>
                            </View>
                          );
                        }
                      })}
                    </View>
                  </ScrollView>
                </View>

                <View
                  style={{
                    flex: 1,
                    // height: 525,
                    width: '50%',
                    flexDirection: 'column',
                    // backgroundColor: 'orange',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                    marginRight: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      // height: 400,
                      flex: 10,
                      width: '100%',
                      marginBottom: 20,
                    }}>
                    {dineIn == true ? <ScrollView>{_dinein}</ScrollView> : null}

                    {_takeaway}
                    {_pickup}
                    {_preorder}
                  </View>

                  <View style={{flex: 0.8, width: '100%'}}>
                    <TouchableOpacity
                      style={{...styles.BtnConfirm, marginLeft: 0}}
                      onPress={() => {
                        _menuOrder();
                      }}>
                      <Text style={{...styles.TextFamily, color: color.white}}>
                        Confirm
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: color.white,
    borderRadius: 5,
    width: '30%',
    height: 40,
    paddingLeft: 10,
    marginRight: 20,
    // backgroundColor:"black"
    // marginBottom: 400,
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  inputDate: {
    backgroundColor: color.white,
    borderRadius: 5,
    width: '43%',
    height: 40,
    margin: 15,
    // marginLeft: 15,
    // paddingLeft: 10,
    // backgroundColor:"black"
    // marginBottom: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },

  Box: {
    backgroundColor: color.white,
    borderRadius: 5,
    width: '80%',
    height: 60,
    margin: 15,
    // paddingLeft: 10,
    // backgroundColor:"black"
    // marginBottom: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    // marginLeft: 20,
    fontSize: 16,
    fontFamily: fonts.medium,
  },

  Icon: {
    width: '5%',
    // flex: 0.5,
    flexDirection: 'row',
    // paddingLeft: 20,
    alignItems: 'center',
    height: 40,
    marginLeft: 1,

    // backgroundColor:'black'
  },

  TextFamily: {
    fontFamily: fonts.medium,
    fontSize: 16,
  },

  BoxTable: {
    backgroundColor: color.white,
    borderRadius: 5,
    width: '27%',
    height: 150,
    margin: 15,
    // marginLeft:1,
    // paddingLeft: 10,
    // backgroundColor:"black"
    // marginBottom: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },

  BtnConfirm: {
    // backgroundColor: color.danger,
    borderRadius: 5,
    // width: '92%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.primary,
    position: 'absolute',
    bottom: 0,
    marginLeft: 15,
    flex: 1,
    width: '100%',

    // marginBottom:20,
  },
});
//make this component available to the app
export default TypeOrder;
