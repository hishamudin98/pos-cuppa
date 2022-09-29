//import liraries
import React, {Component, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  Pressable,
  Button,
  TextInput,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {color, fonts} from '../config/Constant';

const dataMenu = [
  {
    id: 1,
    menuCode: 'S01',
    menuName: 'Kambing Shellout Berapi',
    menuPrice: '59.90',
  },
  {
    id: 2,
    menuCode: 'GR1',
    menuName: 'Shoulder Lamb',
    menuPrice: '35.90',
  },
  {
    id: 3,
    menuCode: 'GR2',
    menuName: 'Crispy Lamb',
    menuPrice: '35.90',
  },
  {
    id: 4,
    menuCode: 'GR3',
    menuName: 'Ribby Lamb',
    menuPrice: '45.90',
  },
  {
    id: 5,
    menuCode: 'GR3',
    menuName: 'Ribby Lamb',
    menuPrice: '45.90',
  },
  {
    id: 6,
    menuCode: 'GR3',
    menuName: 'Ribby Lamb',
    menuPrice: '45.90',
  },
  {
    id: 7,
    menuCode: 'GR3',
    menuName: 'Ribby Lamb',
    menuPrice: '45.90',
  },
];

// create a component
const orderPayment = ({navigation, route}) => {
  const [itemQuantity, setItemQuantity] = useState(0);
  const [viewPaymentMethod, setViewPaymentMethod] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');

  const _clickPayment = value => {
    setViewPaymentMethod(false);
    setPaymentMethod(value);
    // alert(value);
  };
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
            <View style={{backgroundColor: 'black'}}>
              <View style={{padding: 20, flexDirection: 'row'}}>
                <View
                  style={{
                    backgroundColor: '#F8F8F8',
                    height: 40,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 4,
                  }}>
                  <Text style={{fontSize: 16, fontFamily: fonts.medium}}>
                    Dine in - Table 1
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'orange',
                    height: 40,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 100,
                    marginLeft: 10,
                    // padding: 20,
                  }}>
                  <Text style={{fontSize: 16, fontFamily: fonts.medium}}>
                    Split Bill
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  height: 'auto',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  marginLeft: 20,
                  marginRight: 20,
                }}>
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
                  }}>
                  <Image
                    style={{
                      width: '100%',
                      height: '80%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      // backgroundColor:'black'
                    }}
                    source={require('../img/NK02.png')}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDestination: 'column',
                    height: 70,
                    justifyContent: 'space-between',
                    // backgroundColor: 'black',
                    marginLeft: 5,
                  }}>
                  <View>
                    <View>
                      <Text style={styles.textInputAddToCart}>
                        {dataMenu[0].menuName}
                      </Text>
                    </View>
                    <View style={{marginTop: 10}}>
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: 10,
                          color: '#A3A3A3',
                        }}>
                        Nasi Putih, Blackpepper,
                      </Text>
                    </View>
                  </View>

                  <View>
                    <Text style={styles.textInputPriceAddToCart}>
                      RM {dataMenu[0].menuPrice}
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
                        color: '#A3A3A3',
                      }}>
                      10872
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
                    <Text>X 1</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* {calculation section} */}
            <View
              style={{
                margin: 20,
                backgroundColor: '#F8F8F8',
              }}>
              <View style={styles.textCalculation}>
                <Text style={styles.textCart}>Subtotal</Text>
                <Text style={styles.textCart}>0.00</Text>
              </View>
              <View style={styles.textCalculation}>
                <Text style={styles.textCart}>Discount</Text>
                <Text style={styles.textCart}>0.00</Text>
              </View>
              <View style={styles.textCalculation}>
                <Text style={styles.textCart}>Tax 6%</Text>
                <Text style={styles.textCart}>0.00</Text>
              </View>
              <View style={styles.textCalculation}>
                <Text style={styles.textCart}>Service Charges 10%</Text>
                <Text style={styles.textCart}>0.00</Text>
              </View>
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
                  alignItems: 'center',
                  //   justifyContent:'space-between'
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    margin: 20,
                    backgroundColor: 'white',
                  }}>
                  <Text style={{fontFamily: fonts.bold, fontSize: 35}}>
                    RM 0.00
                  </Text>
                </View>
                <View
                  style={{
                    height: '80%',
                    width: 1,
                    backgroundColor: '#A3A3A3',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}></View>
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 1,
                    margin: 20,
                    alignItems: 'center',
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
                      <Text style={styles.textFamily}>1000.00</Text>
                    </TouchableHighlight>
                    <View style={styles.inputBoxInfaq}>
                      <Text style={styles.textFamily}>6.00</Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.inputBoxInfaq}>
                      <Text style={styles.textFamily}>6.00</Text>
                    </View>
                    <View style={styles.inputBoxInfaq}>
                      <Text style={styles.textFamily}>6.00</Text>
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
                  backgroundColor: 'black',
                  height: '5%',
                }}>
                <View
                  style={{
                    backgroundColor: '#A3A3A3',
                    height: 1,
                    width: '94%',
                  }}></View>
              </View>
            </View>
          </View>

          {/* {RIGHT SECTION SECOND TOP} */}

          <View
            style={{
              flexDirection: 'column',
              flex: 5,
              backgroundColor: 'pink',
              //   margin:20,
              marginTop: 0,

              //   justifyContent: 'center',
            }}>
            {viewPaymentMethod === false ? null : (
              <>
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
                    }}>
                    <View style={{marginBottom: 15}}>
                      <Icon name={'card-outline'} type="ionicon" size={28} />
                    </View>
                    <Text style={styles.textFamily}>Credit/Debit Card</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
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
                      />
                    </View>
                    <Text style={styles.textFamily}>QR Payment</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '33%',
                    // backgroundColor: 'red',
                  }}>
                  <TouchableOpacity style={styles.boxPayment}>
                    <View style={{marginBottom: 15}}>
                      <Icon name={'cash-outline'} type="ionicon" size={28} />
                    </View>
                    <Text style={styles.textFamily}>e-Wallet</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.boxPayment}>
                    <View style={{marginBottom: 15}}>
                      <Icon
                        name={'chatbox-ellipses-outline'}
                        type="ionicon"
                        size={28}
                      />
                    </View>
                    <Text style={styles.textFamily}>Payment Link</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.boxPayment}>
                    <View style={{marginBottom: 15}}>
                      <Icon name={'wallet-outline'} type="ionicon" size={28} />
                    </View>
                    <Text style={styles.textFamily}>Credit Wallet</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '33%',
                    // backgroundColor: 'red',
                  }}>
                  <TouchableOpacity style={styles.boxPayment}>
                    <View style={{marginBottom: 15}}>
                      <Icon name={'star-outline'} type="ionicon" size={28} />
                    </View>
                    <Text style={styles.textFamily}>Reward Points</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.boxPayment}>
                    <View style={{marginBottom: 15}}>
                      <Icon name={'GoldOutlined'} type="ant" size={28} />
                    </View>
                    <Text style={styles.textFamily}>Gold</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{...styles.boxPayment, opacity: 0, height: 0}}>
                    <View style={{marginBottom: 15}}>
                      <Icon name={'wallet-outline'} type="ionicon" size={24} />
                    </View>
                    <Text style={styles.textFamily}>Credit Wallet</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* { FOR VIEW CASH } */}

            {paymentMethod === 'cash' ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    //   justifyContent: 'center',
                    //   alignItems: 'center',
                    justifyContent: 'space-between',
                    // marginTop: 0,
                    height: '25%',
                  }}>
                  <View
                    style={[
                      styles.boxPayment,
                      {margin: 0, marginLeft: 20, marginTop: 10},
                    ]}>
                    <View>
                      <View style={{marginBottom: 15}}>
                        <Icon name={'cash-outline'} type="ionicon" size={28} />
                      </View>
                      <Text style={styles.textFamily}>Cash</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.boxPayment,
                      {
                        marginTop: 0,
                        height: 40,
                        width: 300,
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderColor: 'orange',
                      },
                    ]}>
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
                      <Text style={styles.textFamily}>
                        Change Payment Method
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    //   justifyContent: 'center',
                    //   alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 0,
                    // height: 40,
                    marginBottom: 0,
                    backgroundColor: 'green',
                  }}>
                  <TextInput
                    style={[
                      //   styles.boxPayment,
                      styles.textFamily,
                      {
                        backgroundColor: 'white',
                        marginTop: 0,
                        height: 40,
                        // flex: 1,
                        width: 0,
                        paddingLeft: 20,
                        paddingRight: 20,
                        textAlign: 'center',

                        margin: 20,
                        width: '69.5%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // height: '80%',
                        borderRadius: 5,
                      },
                    ]}
                    placeholder="Enter Value"
                  />

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
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderColor: 'orange',

                        margin: 20,
                        // width: 167,
                        justifyContent: 'center',
                        alignItems: 'center',
                        // height: '80%',
                        borderRadius: 5,
                      },
                    ]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '35%',
                        // backgroundColor:'pink'
                      }}>
                      <Text style={styles.textFamily}>Exact</Text>
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
                    marginTop: 0,
                    // height: 40,
                    marginBottom: 0,
                    backgroundColor: 'blue',
                  }}>
                  <View
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 0},
                    ]}>
                    <Text style={styles.textFamily}>0.00</Text>
                  </View>
                  <View
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 0},
                    ]}>
                    <Text style={styles.textFamily}>0.00</Text>
                  </View>
                  <View
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 0},
                    ]}>
                    <Text style={styles.textFamily}>0.00</Text>
                  </View>
                  <View
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 20},
                    ]}>
                    <Text style={styles.textFamily}>0.00</Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    //   justifyContent: 'center',
                    //   alignItems: 'center',
                    justifyContent: 'space-evenly',
                    marginTop: 0,
                    // height: 40,
                    marginBottom: 0,
                    backgroundColor: 'blue',
                  }}>
                  <View
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 0},
                    ]}>
                    <Text style={styles.textFamily}>1</Text>
                  </View>
                  <View
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 0},
                    ]}>
                    <Text style={styles.textFamily}>2</Text>
                  </View>
                  <View
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 0},
                    ]}>
                    <Text style={styles.textFamily}>3</Text>
                  </View>
                  <View
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 20},
                    ]}>
                    <Text>icon backspace</Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    //   justifyContent: 'center',
                    //   alignItems: 'center',
                    justifyContent: 'space-evenly',
                    marginTop: 0,
                    // height: 40,
                    marginBottom: 0,
                    backgroundColor: 'blue',
                  }}>
                  <View
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 0},
                    ]}>
                    <Text style={styles.textFamily}>1</Text>
                  </View>
                  <View
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 0},
                    ]}>
                    <Text style={styles.textFamily}>2</Text>
                  </View>
                  <View
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 0},
                    ]}>
                    <Text style={styles.textFamily}>3</Text>
                  </View>
                  <View
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 20},
                    ]}>
                    <Text>icon backspace</Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    //   justifyContent: 'center',
                    //   alignItems: 'center',
                    justifyContent: 'space-evenly',
                    marginTop: 0,
                    // height: 40,
                    marginBottom: 0,
                    backgroundColor: 'blue',
                  }}>
                  <TouchableOpacity
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 0},
                    ]}>
                    <Text style={styles.textFamily}>1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 0},
                    ]}>
                    <Text style={styles.textFamily}>2</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 0},
                    ]}>
                    <Text style={styles.textFamily}>3</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.boxPayment,
                      {height: 40, flex: 1, marginTop: 0, marginRight: 20},
                    ]}>
                    <Text style={styles.textFamily}>icon backspace</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </View>

          {/* {RIGHT SECTION THIRD TOP} */}
          <View
            style={{
              flexDirection: 'column',
              flex: 1.5,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                // justifyContent: 'center',
                // alignItems: 'center',
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
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                // justifyContent: 'center',
                // alignItems: 'center',
              }}>
              <View
                style={{
                  // flex: 1,
                  width: 583,
                  backgroundColor: 'white',
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'orange',
                  //   margin: 5,
                  marginLeft: 20,
                  marginRight: 20,
                  //   marginBottom:20,
                  borderRadius: 5,
                }}>
                <Text style={styles.textFamily}>Change Order</Text>
              </View>
            </TouchableOpacity>
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
    backgroundColor: '#F8F8F8',
  },

  box1: {
    flex: 1.4,
    backgroundColor: 'pink',
  },

  box2: {
    flex: 2,
    backgroundColor: 'blue',
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
    color: '#A3A3A3',
  },

  inputBoxInfaq: {
    backgroundColor: 'white',
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
    backgroundColor: 'white',
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
    backgroundColor: 'red',
    margin: 20,
    width: 167,
    justifyContent: 'center',
    alignItems: 'center',
    height: '80%',
    borderRadius: 5,
  },
});

//make this component available to the app
export default orderPayment;
