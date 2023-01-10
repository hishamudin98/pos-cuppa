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
  Switch,
  ActivityIndicator,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import {Icon} from 'react-native-elements';
import {
  fonts,
  color,
  system_configuration,
  containerStyle,
} from '../config/Constant';
import {DrawerActions} from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {useEffect, useRef, useState} from 'react';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ENV_APP, REACT_APP_DEV_MODE, REACT_APP_PROD_MODE} from '@env';
import axios from 'axios';
import Drawer from '../component/Drawer';
import moment from 'moment';

const url =
  system_configuration.ENVIRONMENT === 'development'
    ? system_configuration.REACT_APP_DEV_MODE
    : system_configuration.REACT_APP_PROD_MODE;

const counterPOS = system_configuration.counterSecretKey;

const dataReward = [
  {
    id: 1,
    rewardName: 'RM 5 Off',
  },
];

const local_data = [
  {
    value: '1',
    lable: 'Country 1',
    image: {
      uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
    },
  },
  {
    value: '2',
    lable: 'Country 2',
    image: {
      uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
    },
  },
  {
    value: '3',
    lable: 'Country 3',
    image: {
      uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
    },
  },
  {
    value: '4',
    lable: 'Country 4',
    image: {
      uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
    },
  },
  {
    value: '5',
    lable: 'Country 5',
    image: {
      uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
    },
  },
];

// create a component
const MenuOrder = ({navigation, route}) => {
  const scrollView = useRef();

  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalDiscount, setModalDiscount] = useState(false);
  const [toggleEnable, setToggleEnable] = useState(false);

  const [textInputMembershipNo, setTextInputMembershipNo] = useState('');
  const [membershipNo, setMembershipNo] = useState('');
  const [menuOrderTypeId, setMenuOrderTypeId] = useState('');

  const [remark, setRemark] = useState('');

  const [menuId, setMenuId] = useState('');
  const [menuCategory, setMenuCategory] = useState([]);
  const [menuCode, setMenuCode] = useState('');
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState(0);
  const [menuItem, setMenuItem] = useState('');
  const [menuVariant, setMenuVariant] = useState([]);
  const [menuVariantId, setMenuVariantId] = useState('');
  const [menuVariantType, setMenuVariantType] = useState('');
  const [menuVariantPrice, setMenuVariantPrice] = useState(0);
  const [menuVariantSelected, setMenuVariantSelected] = useState([]);

  const [menuVariantId2, setMenuVariantId2] = useState('');
  const [menuVariantType2, setMenuVariantType2] = useState('');
  const [menuVariantPrice2, setMenuVariantPrice2] = useState(0);
  const [menuVariantSelected2, setMenuVariantSelected2] = useState({});

  const [menuImage, setMenuImage] = useState('');
  const [menuAddon, setMenuAddon] = useState('');
  const [menuQuantity, setMenuQuantity] = useState(1);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemPrice, setItemPrice] = useState(0);
  const [selectedValue, setSelectedValue] = useState('');
  const [value, setValue] = useState(null);
  const [country, setCountry] = useState('1');

  const [orderCart, setOrderCart] = useState([]);
  const [orderCartTakeAway, setOrderCartTakeAway] = useState([]);
  const [staffName, setStaffName] = useState('');
  const [selectTable, setSelectTable] = useState('');
  const [selectOrderTypeId, setSelectOrderTypeId] = useState(0);
  const [selectOrderType, setSelectOrderType] = useState('');
  const [menu, setMenu] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [textInputDiscount, setTextInputDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('');
  const [discountTypeSelect, setDiscountTypeSelect] = useState('');

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

  const [activeCategory, setActiveCategory] = useState('');
  const [activeAllCategory, setActiveAllCategory] = useState(true);

  const [discountInput, setDiscountInput] = useState(0);
  const [discountConfirm, setDiscountConfirm] = useState(0);

  const [endScroll, setEndScroll] = useState(false);
  const [plusTakeway, setPlusTakeway] = useState(false);

  const [selectDineInOrTakeAway, setSelectDineInOrTakeAway] = useState(0);
  const [customerDetails, setCustomerDetails] = useState([]);

  const [linkMembership, setLinkMembership] = useState(false);
  const [linkMembershipNo, setLinkMembershipNo] = useState('');
  const [textInputLinkMember, setTextInputLinkMember] = useState('');
  const [linkMembershipName, setLinkMembershipName] = useState('');
  const [linkMembershipPoint, setLinkMembershipPoint] = useState(0);
  const [linkMembershipPointDisplay, setLinkMembershipPointDisplay] =
    useState('');
  const [linkMembershipExpiry, setLinkMembershipExpiry] = useState('');

  const [membershipDiscount, setMembershipDiscount] = useState(0);
  const [outletDiscount, setOutletDiscount] = useState(0);

  useEffect(() => {
    // console.log('route.params', route.params);

    navigation.addListener('focus', function () {
      _getOrderNo();
      _getStaff();
      _getMenu();
      _getCategoryMenu();
      _fetchUserCart();
      _getCustomer();
      _calculateTotal();
      _checkDiscount();
      _startLoading();

      // AsyncStorage.removeItem('ORDER');
      // AsyncStorage.removeItem('DATA_ORDER');
      // AsyncStorage.removeItem('DISCOUNT_ORDER');
      // AsyncStorage.removeItem('ORDER_TAKEAWAY');
      // AsyncStorage.removeItem('CUSTOMER');
    });
  }, [route.params?.data]);

  const _startLoading = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const _getOrderNo = async () => {
    console.log('getOrderNo', route.params);
    let orderNo = route.params.data;
    const fetchOrder = await AsyncStorage.getItem('DATA_ORDER');
    let fetchOrderParsed = JSON.parse(fetchOrder);
    let customerDetails = null;
    let customer = [];

    console.log('orderNoooo', orderNo);
    console.log('fetchOrderParsed', fetchOrderParsed);

    if (orderNo && fetchOrderParsed == null) {
      await axios
        .post(url + '/pos/getOrderCartPOS', {
          order_no: orderNo,
        })
        .then(async res => {
          let data = res.data.data;
          console.log('data', data);
          let orderParsed = JSON.parse(res.data.data.order);
          setSelectTable('Table ' + data.tableNo);

          console.log('orderParsed', orderParsed);

          const dineIn = orderParsed.filter(item => item.orderType == '1');
          const takeaway = orderParsed.filter(item => item.orderType == '2');

          customer = [
            {
              customerName: data.customerName,
              customerPhone: data.customerPhoneNo,
            },
          ];

          let dataDisc = {};
          dataDisc = {
            discountAmount: data.discount,
            discountType: '',
            discountInput: '',
          };

          await AsyncStorage.setItem(
            'DISCOUNT_ORDER',
            JSON.stringify(dataDisc),
          );

          setAmountDiscountDisplay(
            data.discount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          );

          if (takeaway.length > 0 && dineIn.length > 0) {
            setSelectOrderTypeId(1);
            setSelectOrderType('Dine In');
            await AsyncStorage.setItem(
              'ORDER_TAKEAWAY',
              JSON.stringify(takeaway),
            );
            setPlusTakeway(true);
            setOrderCartTakeAway(takeaway);
            setOrderCart(dineIn);
            await AsyncStorage.setItem('ORDER', JSON.stringify(dineIn));

            console.log('dineIndddd', dineIn);
            customerDetails = {
              order_type: 'Dine In',
              order_typeId: 1,
              table_id: Number(data.tableNo),
              table_name: 'Table ' + data.tableNo,
              customer: customer,
            };
          } else if (takeaway.length > 0 && dineIn.length === 0) {
            setSelectOrderType('Take Away');

            await AsyncStorage.setItem('ORDER', JSON.stringify(orderParsed));
            setOrderCart(orderParsed);
            setPlusTakeway(false);
            setSelectOrderTypeId(2);

            customerDetails = {
              order_type: 'Take Away',
              order_typeId: 2,
              table_id: Number(data.tableNo),
              table_name: 'Table ' + data.tableNo,
              customer: customer,
            };
          } else if (takeaway.length === 0 && dineIn.length > 0) {
            await AsyncStorage.setItem('ORDER', JSON.stringify(orderParsed));
            setOrderCart(orderParsed);
            setPlusTakeway(false);
            setSelectOrderTypeId(1);
            setSelectOrderType('Dine In');

            customerDetails = {
              order_type: 'Dine In',
              order_typeId: 1,
              table_id: Number(data.tableNo),
              table_name: 'Table ' + data.tableNo,
              customer: customer,
            };
          }

          await AsyncStorage.setItem(
            'CUSTOMER',
            JSON.stringify(customerDetails),
          );

          _calculateTotal();
          _confirmDiscount();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      setMembershipDiscount(0);
    }
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

  const _getCustomer = async () => {
    let customer = await AsyncStorage.getItem('CUSTOMER');
    let stgParsed = JSON.parse(customer);
    console.log('customer12312', stgParsed);
    setSelectOrderType(stgParsed.order_type);
    setSelectTable(stgParsed.table_name);
    setSelectOrderTypeId(stgParsed.order_typeId);
  };

  const _getMenu = async () => {
    await axios
      .get(url + '/getMenu')
      .then(res => {
        AsyncStorage.setItem('MENU', JSON.stringify(res.data.data));
        setMenu(res.data.data);
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const _getCategoryMenu = async () => {
    await axios
      .get(url + '/tbl/getCategory')
      .then(res => {
        // AsyncStorage.setItem('MENU', JSON.stringify(res.data.data));
        setMenuCategory(res.data.data);
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const _showModal = mode => {
    if (mode === 'order') {
      setModalVisible(true);
      setModalDiscount(false);
    } else {
      setModalVisible(false);
      setModalDiscount(true);
    }
    // setMenuId(id);
    // alert('haha');
  };

  const _toggleSwitchDiscount = mode => {
    if (mode === 'order') {
      setModalVisible(true);
      setModalDiscount(false);
    } else {
      setModalVisible(false);
      setModalDiscount(true);
    }
  };

  const _addQuantity = () => {
    setItemQuantity(itemQuantity + 1);
  };
  const _reduceQuantity = () => {
    if (itemQuantity - 0 < 1) {
    } else {
      setItemQuantity(itemQuantity - 1);
    }
  };

  const _addMenuQuantity = () => {
    setMenuQuantity(menuQuantity + 1);
  };

  const _reduceMenuQuantity = () => {
    if (menuQuantity - 0 < 1) {
    } else {
      setMenuQuantity(menuQuantity - 1);
    }
  };

  const _addMenuCartQuantity = async (id, membership, variant, remark) => {
    // alert(id);
    let fetchOrder = await AsyncStorage.getItem('ORDER');
    let stgParsed = JSON.parse(fetchOrder);
    const menuExists = stgParsed.find(menu => menu.menu_id === id);

    console.log('variant', variant);
    let menuVariantExists = null;
    if (variant.length > 0) {
      menuVariantExists = stgParsed.filter(menu => {
        if (menu.menu_variant.length > 0) {
          const checkVariant = menu.menu_variant.filter(item =>
            variant.some(variant2 => {
              if (item.type === variant2.type && item.id === variant2.id) {
                return item;
              } else {
                return null;
              }
            }),
          );

          if (variant.length == checkVariant.length) {
            return true;
          } else {
            return false;
          }
        }
      });

      // console.log(
      //   'menuVariantExists 432344',
      //   menuVariantExists[0].menu_variant,
      // );
    }

    // return;
    const membershipExists = stgParsed.find(
      member => member.membership_no === membership,
    );

    if (variant.length > 0) {
      let isEqual = variant.every(
        (val, i) =>
          val.id === menuVariantExists[0].menu_variant[i].id &&
          val.type === menuVariantExists[0].menu_variant[i].type,
      );

      console.log('isEqual', isEqual);
      if (isEqual == true && membershipExists) {
        const newCart = stgParsed.map(menu => {
          let prevVariant = JSON.stringify(menu.menu_variant);
          let newVariant = JSON.stringify(variant);

          console.log('prev remark : ', menu.menu_remark);
          console.log('now remark : ', remark);

          if (
            menu.menu_id === id &&
            menu.membership_no === membership &&
            prevVariant === newVariant &&
            menu.menu_remark === remark
          ) {
            // setAmountOrder(amountOrder + menu.menu_price)
            return {
              ...menu,
              menu_quantity: menu.menu_quantity + 1,
            };
          } else {
            return menu;
          }
        });
        // return;

        await AsyncStorage.setItem('ORDER', JSON.stringify(newCart));
      }
    } else {
      console.log('membershipExists', membershipExists);
      console.log('menuExists', menuExists);
      console.log('stgParsed :', stgParsed);

      if (menuExists && membershipExists) {
        const newCart = stgParsed.map(menu => {
          console.log('menu_id', menu.menu_id === id);
          console.log('membership_no', menu.membership_no === membership);
          console.log('menu_remark', menu.menu_remark === remark);
          if (
            menu.menu_id === id &&
            menu.membership_no === membership &&
            menu.menu_remark === remark
          ) {
            // setAmountOrder(amountOrder + menu.menu_price)
            return {
              ...menu,
              menu_quantity: menu.menu_quantity + 1,
            };
          } else {
            return menu;
          }
        });
        await AsyncStorage.setItem('ORDER', JSON.stringify(newCart));
      }
    }

    const saveCart = await AsyncStorage.getItem('ORDER');
    const cart = JSON.parse(saveCart);
    setOrderCart(cart);
    _calculateTotal();
    _confirmDiscount();
  };

  const _addMenuCartQuantityTakeaway = async (
    id,
    membership,
    variant,
    remark,
  ) => {
    // alert(id);
    let fetchOrder = await AsyncStorage.getItem('ORDER_TAKEAWAY');
    let stgParsed = JSON.parse(fetchOrder);
    const menuExists = stgParsed.find(menu => menu.menu_id === id);

    let menuVariantExists = null;
    if (variant.length > 0) {
      menuVariantExists = stgParsed.filter(menu => {
        if (menu.menu_variant.length > 0) {
          const checkVariant = menu.menu_variant.filter(item =>
            variant.some(variant2 => {
              if (item.type === variant2.type && item.id === variant2.id) {
                return item;
              } else {
                return null;
              }
            }),
          );

          console.log('checkVariant', checkVariant);

          if (variant.length == checkVariant.length) {
            return true;
          } else {
            return false;
          }
        }
      });

      // console.log('menuVariantExists', menuVariantExists);
    }

    const membershipExists = stgParsed.find(
      member => member.membership_no === membership,
    );

    if (variant.length > 0) {
      let isEqual = variant.every(
        (val, i) =>
          val.id === menuVariantExists[0].menu_variant[i].id &&
          val.type === menuVariantExists[0].menu_variant[i].type,
      );
      console.log('isEqual take away', isEqual);
      if (isEqual == true && membershipExists) {
        const newCart = stgParsed.map(menu => {
          let prevVariant = JSON.stringify(menu.menu_variant);
          let newVariant = JSON.stringify(variant);
          if (
            menu.menu_id === id &&
            menu.membership_no === membership &&
            prevVariant === newVariant &&
            menu.menu_remark === remark
          ) {
            // setAmountOrder(amountOrder + menu.menu_price)
            return {
              ...menu,
              menu_quantity: menu.menu_quantity + 1,
            };
          } else {
            return menu;
          }
        });
        // return;

        await AsyncStorage.setItem('ORDER_TAKEAWAY', JSON.stringify(newCart));
      }
    } else {
      console.log('membershipExists123 : ', membershipExists);
      console.log('menuExists123 :', menuExists);

      console.log('stgParsed123 :', stgParsed);

      if (menuExists && membershipExists) {
        const newCart = stgParsed.map(menu => {
          console.log('menu_id', menu.menu_id === id);
          console.log('membership_no', menu.membership_no === membership);
          console.log('menu_remark', remark);
          if (
            menu.menu_id === id &&
            menu.membership_no === membership &&
            menu.menu_remark === remark
          ) {
            // setAmountOrder(amountOrder + menu.menu_price)
            return {
              ...menu,
              menu_quantity: menu.menu_quantity + 1,
            };
          } else {
            return menu;
          }
        });
        await AsyncStorage.setItem('ORDER_TAKEAWAY', JSON.stringify(newCart));
      }
    }

    const saveCart = await AsyncStorage.getItem('ORDER_TAKEAWAY');
    const cart = JSON.parse(saveCart);
    setOrderCartTakeAway(cart);
    _calculateTotal();
    _confirmDiscount();
  };

  const _reduceMenuCartQuantity = async (id, membership, variant, remark) => {
    // LOOP ALL CART THEN FIND ID AND REDUCE QUANTITY
    let fetchOrder = await AsyncStorage.getItem('ORDER');
    console.log('order reduce', fetchOrder);

    if (fetchOrder !== null) {
      let stgParsed = JSON.parse(fetchOrder);
      const menuExists = stgParsed.find(menu => menu.menu_id === id);

      const membershipExists = stgParsed.find(
        member => member.membership_no === membership,
      );

      let menuVariantExists = null;
      if (variant.length > 0) {
        menuVariantExists = stgParsed.filter(menu => {
          if (menu.menu_variant.length > 0) {
            const checkVariant = menu.menu_variant.filter(item =>
              variant.some(variant2 => {
                if (item.type === variant2.type && item.id === variant2.id) {
                  return item;
                } else {
                  return null;
                }
              }),
            );

            console.log('checkVariant', checkVariant);

            if (variant.length == checkVariant.length) {
              return true;
            } else {
              return false;
            }
          }
        });

        // console.log('menuVariantExists', menuVariantExists);
      }

      if (variant.length > 0) {
        let isEqual = variant.every(
          (val, i) =>
            val.id === menuVariantExists[0].menu_variant[i].id &&
            val.type === menuVariantExists[0].menu_variant[i].type,
        );
        console.log('isEqual reduce ', isEqual);

        if (isEqual == true && membershipExists) {
          const newCart = stgParsed.map(menu => {
            let prevVariant = JSON.stringify(menu.menu_variant);
            let newVariant = JSON.stringify(variant);
            if (
              menu.menu_id === id &&
              menu.membership_no === membership &&
              prevVariant === newVariant &&
              menu.menu_remark === remark
            ) {
              if (menu.menu_quantity - 1 < 1) {
                return {
                  ...menu,
                  menu_quantity: 0,
                };
              } else {
                return {
                  ...menu,
                  menu_quantity: menu.menu_quantity - 1,
                };
              }
            } else {
              return menu;
            }
          });
          await AsyncStorage.setItem('ORDER', JSON.stringify(newCart));
        }
      } else {
        if (menuExists && membershipExists) {
          const newCart = stgParsed.map(menu => {
            if (
              menu.menu_id === id &&
              menu.membership_no === membership &&
              menu.menu_remark === remark
            ) {
              if (menu.menu_quantity - 1 < 1) {
                return {
                  ...menu,
                  menu_quantity: 0,
                };
              } else {
                return {
                  ...menu,
                  menu_quantity: menu.menu_quantity - 1,
                };
              }
            } else {
              return menu;
            }
          });
          await AsyncStorage.setItem('ORDER', JSON.stringify(newCart));
        }
      }
    }

    const saveCart = await AsyncStorage.getItem('ORDER');
    const cart = JSON.parse(saveCart);
    let cartReduce = cart.filter(menu => menu.menu_quantity !== 0);
    await AsyncStorage.setItem('ORDER', JSON.stringify(cartReduce));
    setOrderCart(cartReduce);
    _calculateTotal();
    _confirmDiscount();
  };

  const _reduceMenuCartQuantityTakeaway = async (
    id,
    membership,
    variant,
    remark,
  ) => {
    // LOOP ALL CART THEN FIND ID AND REDUCE QUANTITY
    let fetchOrder = await AsyncStorage.getItem('ORDER_TAKEAWAY');

    console.log('variant momo', fetchOrder);

    if (fetchOrder !== null) {
      let stgParsed = JSON.parse(fetchOrder);
      const menuExists = stgParsed.find(menu => menu.menu_id === id);

      const membershipExists = stgParsed.find(
        member => member.membership_no === membership,
      );

      let menuVariantExists = null;
      if (variant.length > 0) {
        menuVariantExists = stgParsed.filter(menu => {
          if (menu.menu_variant.length > 0) {
            const checkVariant = menu.menu_variant.filter(item =>
              variant.some(variant2 => {
                if (item.type === variant2.type && item.id === variant2.id) {
                  return item;
                } else {
                  return null;
                }
              }),
            );

            console.log('checkVariant', checkVariant);

            if (variant.length == checkVariant.length) {
              return true;
            } else {
              return false;
            }
          }
        });

        // console.log('menuVariantExists', menuVariantExists);
      }

      if (variant.length > 0) {
        let isEqual = variant.every(
          (val, i) =>
            val.id === menuVariantExists[0].menu_variant[i].id &&
            val.type === menuVariantExists[0].menu_variant[i].type,
        );
        console.log('isEqual reduce ', isEqual);

        if (isEqual == true && membershipExists) {
          const newCart = stgParsed.map(menu => {
            let prevVariant = JSON.stringify(menu.menu_variant);
            let newVariant = JSON.stringify(variant);
            if (
              menu.menu_id === id &&
              menu.membership_no === membership &&
              prevVariant === newVariant &&
              menu.menu_remark === remark
            ) {
              if (menu.menu_quantity - 1 < 1) {
                return {
                  ...menu,
                  menu_quantity: 0,
                };
              } else {
                return {
                  ...menu,
                  menu_quantity: menu.menu_quantity - 1,
                };
              }
            } else {
              return menu;
            }
          });
          await AsyncStorage.setItem('ORDER_TAKEAWAY', JSON.stringify(newCart));
        }
      } else {
        if (menuExists && membershipExists) {
          const newCart = stgParsed.map(menu => {
            if (
              menu.menu_id === id &&
              menu.membership_no === membership &&
              menu.menu_remark === remark
            ) {
              if (menu.menu_quantity - 1 < 1) {
                return {
                  ...menu,
                  menu_quantity: 0,
                };
              } else {
                return {
                  ...menu,
                  menu_quantity: menu.menu_quantity - 1,
                };
              }
            } else {
              return menu;
            }
          });
          await AsyncStorage.setItem('ORDER_TAKEAWAY', JSON.stringify(newCart));
        }
      }
    }

    const saveCart = await AsyncStorage.getItem('ORDER_TAKEAWAY');
    const cart = JSON.parse(saveCart);
    let cartReduce = cart.filter(menu => menu.menu_quantity !== 0);
    await AsyncStorage.setItem('ORDER_TAKEAWAY', JSON.stringify(cartReduce));
    setOrderCartTakeAway(cartReduce);
    _calculateTotal();
    _confirmDiscount();
  };

  const _addToCart = async () => {
    let fetchCustomer = await AsyncStorage.getItem('CUSTOMER');
    let customerParsed = JSON.parse(fetchCustomer);
    let menuOrderTypeId = customerParsed.order_typeId;
    let variantSelected = [];
    let updatedCart = {};
    updatedCart = {
      menu_id: menuId,
      menu_name: menuName,
      menu_price: menuPrice,
      menu_quantity: menuQuantity,
      menu_image: menuImage,
      membership_no: membershipNo,
      menu_variant: menuVariant,
      menu_remark: remark,
      orderType:
        selectDineInOrTakeAway == 0 ? menuOrderTypeId : selectDineInOrTakeAway,
    };

    console.log('updatedCart', updatedCart);

    let lengthVariant = null;

    const details = await axios
      .post(url + '/getMenuDetails', {menu_id: menuId})
      .then(res => {
        console.log('menu details', res.data.data.menu_variant);
        lengthVariant =
          res.data.data.menu_variant == null
            ? 0
            : JSON.parse(res.data.data.menu_variant).length;
      });

    if (selectDineInOrTakeAway == 1 || selectDineInOrTakeAway == 0) {
      if (menuVariant.length > 0) {
        if (menuVariantSelected.length == 0) {
          // alert('Please select variant');
          // Alert('Please select variant');
          Alert.alert('Alert', 'Please select variant', [
            {text: 'OK', onPress: () => setModalVisible(true)},
          ]);
          return;
        }
        console.log('variantselected', variantSelected);
        console.log('menuVariantSelected2', menuVariantSelected2);
        variantSelected.push(menuVariantSelected);

        let emptyVariantSelect2 = JSON.stringify(menuVariantSelected2);

        if (menuVariant.length > 1) {
          if (emptyVariantSelect2 == '{}') {
            // alert('Please select variant');
            // setModalVisible(true);

            Alert.alert('Alert', 'Please select variant', [
              {text: 'OK', onPress: () => setModalVisible(true)},
            ]);

            return;
          } else {
            variantSelected.push(menuVariantSelected2);
          }
        }
        updatedCart.menu_variant = variantSelected;
        updatedCart.menu_price = menuVariantPrice;
      }

      let fetchOrder = await AsyncStorage.getItem('ORDER');

      // await AsyncStorage.removeItem('ORDER');

      // // // setOrderCart(orderCart => ({...orderCart, ...updatedCart}));
      let stgParsed = JSON.parse(fetchOrder);

      if (fetchOrder !== null) {
        console.log('stgParsed', stgParsed);

        const menuVariantExists = stgParsed.filter(menu => {
          if (menu.menu_variant.length > 0) {
            const checkVariant = menu.menu_variant.filter(
              variant =>
                updatedCart.menu_variant.some(variant2 => {
                  if (
                    variant.type === variant2.type &&
                    variant.id === variant2.id
                  ) {
                    return variant;
                  } else {
                    return null;
                  }
                }),
              // updatedCart.menu_variant
              //   .map(variant2 => variant2.type)
              //   .includes(variant.type)
            );

            // const checkVariant_type = menu.menu_variant.filter(
            //   variant =>
            //     updatedCart.menu_variant
            //       .map(variant2 => variant2.type)
            //       .includes(variant.type)
            //     // updatedCart.menu_variant
            //     //   .map(variant2 => variant2.type)
            //     //   .includes(variant.type),
            // );

            console.log('updatedCart.menu_variant', updatedCart.menu_variant);
            console.log('checkVariant', checkVariant);

            if (updatedCart.menu_variant.length == checkVariant.length) {
              return true;
            } else {
              return false;
            }
          }
        });

        const menuExists = stgParsed.filter(
          menu => menu.menu_id === updatedCart.menu_id,
        );

        const membershipExists = stgParsed.filter(
          member => member.membership_no === updatedCart.membership_no,
        );

        const checkMenuVariantExists = menuVariantExists.filter(menu => {
          if (menu.menu_variant.length > 0) {
            const checkVariantMenu = menu.menu_variant.filter(variant =>
              menuExists.map(variant2 =>
                variant2.menu_variant
                  .map(variant3 => variant3.id)
                  .includes(variant.id),
              ),
            );

            if (checkVariantMenu.length > 0) {
              return true;
            } else {
              return false;
            }
          }
        });

        if (checkMenuVariantExists.length > 0) {
          let checkMembership = checkMenuVariantExists.filter(member => {
            if (
              member.membership_no === updatedCart.membership_no &&
              member.menu_id === updatedCart.menu_id &&
              member.menu_remark === updatedCart.menu_remark
            ) {
              return true;
            } else {
              return false;
            }
          });

          if (checkMembership.length > 0) {
            // console.log('membershipExists', membershipExists);
            const newCart = stgParsed.map(menu => {
              const isVariant = updatedCart.menu_variant.filter(
                variant =>
                  menu.menu_variant
                    .map(variant2 => variant2.id)
                    .includes(variant.id) &&
                  menu.menu_id === updatedCart.menu_id,
              );

              let prevVariant = JSON.stringify(menu.menu_variant);
              let newVariant = JSON.stringify(updatedCart.menu_variant);

              if (
                menu.membership_no === updatedCart.membership_no &&
                prevVariant === newVariant
              ) {
                return {
                  ...menu,
                  menu_quantity: menu.menu_quantity + updatedCart.menu_quantity,
                };
              } else {
                return menu;
              }
            });
            console.log('newCart', newCart);
            await AsyncStorage.setItem('ORDER', JSON.stringify(newCart));
          } else {
            await AsyncStorage.setItem(
              'ORDER',
              JSON.stringify([...stgParsed, updatedCart]),
            );
          }
        } else {
          const isMenu = stgParsed.filter(
            menu =>
              menu.menu_id === updatedCart.menu_id &&
              menu.membership_no == updatedCart.membership_no &&
              menu.menu_remark == updatedCart.menu_remark,
          );

          if (updatedCart.menu_variant.length > 0 || isMenu.length == 0) {
            console.log(
              'updatedCart.menu_variant.lengt',
              updatedCart.menu_variant.length,
            );
            await AsyncStorage.setItem(
              'ORDER',
              JSON.stringify([...stgParsed, updatedCart]),
            );
          } else {
            if (isMenu.length > 0) {
              const newCart = stgParsed.map(menu => {
                if (
                  menu.menu_id === updatedCart.menu_id &&
                  menu.membership_no === updatedCart.membership_no &&
                  menu.menu_remark == updatedCart.menu_remark
                ) {
                  return {
                    ...menu,
                    menu_quantity:
                      menu.menu_quantity + updatedCart.menu_quantity,
                  };
                } else {
                  return menu;
                }
              });
              await AsyncStorage.setItem('ORDER', JSON.stringify(newCart));
            } else {
              console.log('aharam');
              await AsyncStorage.setItem(
                'ORDER',
                JSON.stringify([...stgParsed, updatedCart]),
              );
            }
          }
        }

        // setOrderCart(stgParsed);
      } else {
        await AsyncStorage.setItem('ORDER', JSON.stringify([updatedCart]));
      }

      // alert(await AsyncStorage.getItem('ORDER'));

      const saveCart = await AsyncStorage.getItem('ORDER');
      const cart = JSON.parse(saveCart);
      // console.log(currentUser);
      setOrderCart(cart);
    } else {
      if (menuVariant.length > 0) {
        if (menuVariantSelected.length == 0) {
          alert('Please select variant');
          setModalVisible(true);

          return;
        }
        console.log('variantselected', variantSelected);
        console.log('menuVariantSelected2', menuVariantSelected2);
        variantSelected.push(menuVariantSelected);

        let emptyVariantSelect2 = JSON.stringify(menuVariantSelected2);

        if (menuVariant.length > 1) {
          if (emptyVariantSelect2 == '{}') {
            setModalVisible(true);
            alert('Please select variant');
            return;
          } else {
            variantSelected.push(menuVariantSelected2);
          }
        }
        updatedCart.menu_variant = variantSelected;
        updatedCart.menu_price = menuVariantPrice;
      }

      let fetchOrder = await AsyncStorage.getItem('ORDER_TAKEAWAY');

      let stgParsed = JSON.parse(fetchOrder);

      if (fetchOrder !== null) {
        const menuVariantExists = stgParsed.filter(menu => {
          if (menu.menu_variant.length > 0) {
            const checkVariant = menu.menu_variant.filter(
              variant =>
                updatedCart.menu_variant.some(variant2 => {
                  if (
                    variant.type === variant2.type &&
                    variant.id === variant2.id
                  ) {
                    return variant;
                  } else {
                    return null;
                  }
                }),
              // updatedCart.menu_variant
              //   .map(variant2 => variant2.type)
              //   .includes(variant.type)
            );
            if (updatedCart.menu_variant.length == checkVariant.length) {
              return true;
            } else {
              return false;
            }
          }
        });

        const menuExists = stgParsed.filter(
          menu => menu.menu_id === updatedCart.menu_id,
        );

        const membershipExists = stgParsed.filter(
          member => member.membership_no === updatedCart.membership_no,
        );

        const checkMenuVariantExists = menuVariantExists.filter(menu => {
          if (menu.menu_variant.length > 0) {
            const checkVariantMenu = menu.menu_variant.filter(variant =>
              menuExists.map(variant2 =>
                variant2.menu_variant
                  .map(variant3 => variant3.id)
                  .includes(variant.id),
              ),
            );

            if (checkVariantMenu.length > 0) {
              return true;
            } else {
              return false;
            }
          }
        });

        if (checkMenuVariantExists.length > 0) {
          let checkMembership = checkMenuVariantExists.filter(member => {
            if (
              member.membership_no === updatedCart.membership_no &&
              member.menu_id === updatedCart.menu_id &&
              member.menu_remark === updatedCart.menu_remark
            ) {
              return true;
            } else {
              return false;
            }
          });
          if (checkMembership.length > 0) {
            // console.log('membershipExists', membershipExists);
            const newCart = stgParsed.map(menu => {
              const isVariant = updatedCart.menu_variant.filter(
                variant =>
                  menu.menu_variant
                    .map(variant2 => variant2.id)
                    .includes(variant.id) &&
                  menu.menu_id === updatedCart.menu_id,
              );

              let prevVariant = JSON.stringify(menu.menu_variant);
              let newVariant = JSON.stringify(updatedCart.menu_variant);

              if (
                menu.membership_no === updatedCart.membership_no &&
                prevVariant === newVariant
              ) {
                return {
                  ...menu,
                  menu_quantity: menu.menu_quantity + updatedCart.menu_quantity,
                };
              } else {
                return menu;
              }
            });
            console.log('newCart', newCart);
            await AsyncStorage.setItem(
              'ORDER_TAKEAWAY',
              JSON.stringify(newCart),
            );
          } else {
            await AsyncStorage.setItem(
              'ORDER_TAKEAWAY',
              JSON.stringify([...stgParsed, updatedCart]),
            );
          }
        } else {
          const isMenu = stgParsed.filter(
            menu =>
              menu.menu_id === updatedCart.menu_id &&
              menu.membership_no == updatedCart.membership_no &&
              menu.menu_remark == updatedCart.menu_remark,
          );
          if (updatedCart.menu_variant.length > 0 || isMenu.length == 0) {
            await AsyncStorage.setItem(
              'ORDER_TAKEAWAY',
              JSON.stringify([...stgParsed, updatedCart]),
            );
          } else {
            if (isMenu.length > 0) {
              const newCart = stgParsed.map(menu => {
                if (
                  menu.menu_id === updatedCart.menu_id &&
                  menu.membership_no === updatedCart.membership_no &&
                  menu.menu_remark == updatedCart.menu_remark
                ) {
                  return {
                    ...menu,
                    menu_quantity:
                      menu.menu_quantity + updatedCart.menu_quantity,
                  };
                } else {
                  return menu;
                }
              });
              await AsyncStorage.setItem(
                'ORDER_TAKEAWAY',
                JSON.stringify(newCart),
              );
            } else {
              await AsyncStorage.setItem(
                'ORDER_TAKEAWAY',
                JSON.stringify([...stgParsed, updatedCart]),
              );
            }
          }
        }

        // setOrderCart(stgParsed);
      } else {
        await AsyncStorage.setItem(
          'ORDER_TAKEAWAY',
          JSON.stringify([updatedCart]),
        );
      }

      const saveCart = await AsyncStorage.getItem('ORDER_TAKEAWAY');
      const cart = JSON.parse(saveCart);
      // console.log(currentUser);
      setOrderCartTakeAway(cart);
    }

    _calculateTotal();
    _confirmDiscount();
  };

  const _fetchUserCart = async () => {
    // AsyncStorage.removeItem('ORDER');
    const fetchOrderCart = await AsyncStorage.getItem('ORDER');
    let stgParsed = JSON.parse(fetchOrderCart);
    console.log('stgParsed123123', stgParsed);

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

  const _calculateTotal = async () => {
    let total = 0;
    let totalTakeAway = 0;
    let totalAmount = 0;
    let discountOrder = 0;
    let taxOrder = 0;
    let membership_discountPercent = 0.07; // config membership discount
    let outlet_discount = 70; // config outlet discount
    let outlet_discountPercent = 0.1; // config outlet discount percent
    let discountOutlet = 0;
    let discountMembership = 0;

    const fetchOrderCart = await AsyncStorage.getItem('ORDER');
    let stgParsed = JSON.parse(fetchOrderCart);

    const fetchOrderCartTakeAway = await AsyncStorage.getItem('ORDER_TAKEAWAY');
    let takeAwayParsed = JSON.parse(fetchOrderCartTakeAway);

    // const fetchOrder = await AsyncStorage.getItem('DATA_ORDER');
    // let fetchOrderParsed = JSON.parse(fetchOrder);

    // console.log('fetchOrderParsed', fetchOrderParsed);
    console.log('ORDER parsed: ', stgParsed);

    stgParsed.map(menu => {
      // alert(menu.menu_price);
      total += menu.menu_price * menu.menu_quantity;
    });

    if (takeAwayParsed !== null) {
      takeAwayParsed.map(menu => {
        // alert(menu.menu_price);
        totalTakeAway += menu.menu_price * menu.menu_quantity;
      });
    }
    totalTakeAway = takeAwayParsed !== null ? totalTakeAway : 0;
    total = total + totalTakeAway;
    setAmountOrder(total);
    setAmountOrderDisplay(
      total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    );

    taxOrder = total * 0.06;
    setTax(taxOrder);
    setTaxDisplay(taxOrder.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));

    const fetchDiscount = await AsyncStorage.getItem('DISCOUNT_ORDER');
    let fetchDiscountParsed = JSON.parse(fetchDiscount);

    discountOrder = fetchDiscountParsed
      ? fetchDiscountParsed.discountAmount
      : 0;

    console.log('discountOrder', discountOrder);

    // if (total > outlet_discount) {
    //   discountOutlet = total * outlet_discountPercent;
    //   setOutletDiscount(discountOutlet);
    // } else {
    //   setOutletDiscount(0);
    // }

    // if (linkMembershipNo != '' || membershipNo != '') {
    //   discountMembership = total * membership_discountPercent;
    //   setMembershipDiscount(discountMembership);
    // } else {
    //   setMembershipDiscount(0);
    // }

    totalAmount =
      total + taxOrder - discountOrder - discountOutlet - discountMembership;
    let withComma = totalAmount
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    console.log('totalAmountcomma', withComma);
    setTotalAmountOrder(totalAmount);
    setTotalAmountOrderDisplay(withComma);
    // alert(total);

    return totalAmount;
  };

  const _confirmDiscount = async () => {
    let total = 0;
    let totalTakeAway = 0;
    let totalAmount = 0;
    let discountOrder = 0;
    let taxOrder = 0;

    const fetchOrderCart = await AsyncStorage.getItem('ORDER');
    let stgParsed = JSON.parse(fetchOrderCart);

    const fetchOrderTakeAway = await AsyncStorage.getItem('ORDER_TAKEAWAY');
    let takeawayParsed = JSON.parse(fetchOrderTakeAway);

    console.log('ORDER parsed: ', stgParsed);

    stgParsed.map(menu => {
      // alert(menu.menu_price);
      total += menu.menu_price * menu.menu_quantity;
    });

    if (takeawayParsed !== null) {
      takeawayParsed.map(menu => {
        // alert(menu.menu_price);
        totalTakeAway += menu.menu_price * menu.menu_quantity;
      });
    }

    total = total + totalTakeAway;

    if (discountType == 'percent') {
      discountOrder = total * (textInputDiscount / 100);
      discountOrder = Number(discountOrder);

      setDiscountInput(textInputDiscount);
      setAmountDiscount(discountOrder);
      setAmountDiscountDisplay(
        discountOrder.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      );
    } else if (discountType == 'amount') {
      discountOrder = textInputDiscount;
      discountOrder = Number(discountOrder);

      if (discountOrder > total) {
        alert('Discount amount is greater than total amount');
        setTextInputDiscount(0);
        setDiscountInput(0);
        setAmountDiscount(0);
        setAmountDiscountDisplay(0);
        setDiscountType('');
        setDiscountTypeSelect('');
        return;
      } else {
        setDiscountInput(textInputDiscount);
        setAmountDiscount(discountOrder);
        setAmountDiscountDisplay(
          discountOrder.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        );
      }
    } else {
      const fetchDiscount = await AsyncStorage.getItem('DISCOUNT_ORDER');
      let fetchDiscountParsed = JSON.parse(fetchDiscount);

      if (fetchDiscountParsed) {
        discountOrder = fetchDiscountParsed.discountAmount;
        discountOrder = Number(discountOrder);

        setDiscountInput(discountOrder);
        setAmountDiscount(discountOrder);
        setAmountDiscountDisplay(
          discountOrder.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        );

        // setDiscountType('amount');
        // setTextInputDiscount(discountOrder);
        // textInputDiscount = discountOrder;
      } else {
        discountOrder = 0;
        discountOrder = Number(discountOrder);

        setDiscountInput(0);
        setAmountDiscount(discountOrder);
        setAmountDiscountDisplay(
          discountOrder.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        );
      }
    }

    let data = {};
    data = {
      discountAmount: discountOrder,
      discountType: discountType,
      discountInput: textInputDiscount,
    };

    if (discountType == '') {
      setToggleEnable(false);
    } else {
      setToggleEnable(true);
    }

    console.log('data', data);

    await AsyncStorage.setItem('DISCOUNT_ORDER', JSON.stringify(data));

    setDiscountConfirm(discountOrder);
    await _calculateTotal();
  };

  const _checkDiscount = async () => {
    const fetchDiscount = await AsyncStorage.getItem('DISCOUNT_ORDER');
    let fetchDiscountParsed = JSON.parse(fetchDiscount);

    console.log('fetchDiscountParsed', fetchDiscountParsed);
    setDiscountType(fetchDiscountParsed.discountType);
    setDiscountTypeSelect(fetchDiscountParsed.discountType);
    setDiscountInput(fetchDiscountParsed.discountInput);
    setTextInputDiscount(fetchDiscountParsed.discountInput);
    setAmountDiscount(fetchDiscountParsed.discountAmount);
    setAmountDiscountDisplay(
      fetchDiscountParsed.discountAmount
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    );
  };

  const _discountType = async type => {
    if (type === 'percent') {
      setDiscountTypeSelect('percent');
      setDiscountType('percent');
    } else {
      setDiscountTypeSelect('amount');
      setDiscountType('amount');
    }
  };

  const _checkout = async () => {
    // console.log('asd');
    let orderNo = route.params.data;
    let orderNoEdit = orderNo;
    // alert(orderNoEdit);

    let fetchStaff = await AsyncStorage.getItem('STAFF');
    let staffParsed = JSON.parse(fetchStaff);

    let fetchOrder = await AsyncStorage.getItem('ORDER');
    let orderParsed = JSON.parse(fetchOrder);

    let fetchCustomer = await AsyncStorage.getItem('CUSTOMER');
    let customerParsed = JSON.parse(fetchCustomer);

    let fetchOrderTakeAway = await AsyncStorage.getItem('ORDER_TAKEAWAY');
    let takeAwayParsed = JSON.parse(fetchOrderTakeAway);

    let data = {};
    let orderTypeId = null;
    let customerDetails = customerParsed;

    console.log('customerDetails', customerDetails);
    console.log('customerParsed', customerParsed);

    console.log('orderparsed', orderParsed);
    // link membership w customer
    if (orderParsed == null || orderParsed.length == 0) {
      if (plusTakeway == true) {
        alert('Dine in cart is empty');
      } else {
        alert('Cart is empty');
      }
      return;
    }

    orderTypeId = customerParsed.order_typeId;

    // if (customerParsed != null) {
    //   orderTypeId = customerParsed.order_typeId;
    //   customerDetails = customerParsed;
    // } else {
    //   orderTypeId = selectOrderTypeId;
    //   customerDetails = customerParsed;
    // }

    console.log('orderParsed', orderParsed);

    data = {
      order: orderParsed,
      orderTypeId: orderTypeId,
      orderTakeAway: takeAwayParsed ? takeAwayParsed : [],
      amt: amountOrder,
      totalAmt: totalAmountOrder,
      discount: amountDiscount,
      discountInput: discountInput,
      counter: counterPOS,
      customer: customerDetails,
      discountType: discountType,
      tax: tax,
      serviceCharge: serviceCharge,
      staff: staffParsed.staffId,
      membershipDiscount: membershipDiscount > 0 ? true : false,
      tableId: customerParsed.table_id,
    };

    console.log('data', data);

    if (orderNoEdit) {
      data.order_no = orderNoEdit;
      data.type = 'edit';

      await axios
        .post(url + '/pos/updateOrder', data)
        .then(async function (resp) {
          await AsyncStorage.setItem(
            'ORDER_NO',
            JSON.stringify(resp.data.data),
          );
          await AsyncStorage.setItem('DATA_ORDER', JSON.stringify(data));

          _screenCheckout();
        })
        .catch(async function (error) {
          console.log('Order Failed', error);
          alert('Order Failed');
        });
    } else {
      data.type = 'add';
      await axios
        .post(url + '/pos/insertOrder', data)
        .then(async function (resp) {
          await AsyncStorage.setItem(
            'ORDER_NO',
            JSON.stringify(resp.data.data),
          );
          await AsyncStorage.setItem('DATA_ORDER', JSON.stringify(data));

          // console.log('order no', resp.data.data);
          _screenCheckout();

          // fetch order no
          // alert('Order Successful');
        })
        .catch(async function (error) {
          console.log('Order Failed', error);
          alert('Order Failed');
          // await AsyncStorage.removeItem('STAFF');
        });
    }
  };

  const _screenCheckout = async () => {
    let fetchOrderNo = await AsyncStorage.getItem('ORDER_NO');
    let orderNoParsed = JSON.parse(fetchOrderNo);
    console.log('ORDER_NO', orderNoParsed);
    // alert(orderNoParsed);

    const fetchOrderUser = await AsyncStorage.getItem('DATA_ORDER');
    let orderParsed = JSON.parse(fetchOrderUser);

    console.log('orderParsed data order', orderParsed);
    // navigation.push('Checkout', {
    //   data: orderNoParsed,
    // });
    // return;

    navigation.push('Checkout', {
      data: orderNoParsed,
    });
  };

  const _searchMenu = async search => {
    let fetchMenu = await AsyncStorage.getItem('MENU');
    let menuParsed = JSON.parse(fetchMenu);
    let menuSearch = menuParsed.filter(menu => {
      return (
        menu.menu_name.toLowerCase().includes(search.toLowerCase()) ||
        menu.menu_code.toLowerCase().includes(search.toLowerCase())
      );
    });

    // console.log('menu search', menuSearch);
    setMenu(menuSearch);
  };

  const _filterByCategory = async category_id => {
    let fetchMenu = await AsyncStorage.getItem('MENU');
    let menuParsed = JSON.parse(fetchMenu);
    let aa = [];
    let result = [];
    let result_filter = [];
    // let categoryParsed = JSON.parse(menuParsed.menu_category);

    if (category_id === 0) {
      // setActiveCategory(true);
      setMenu(menuParsed);
      setActiveAllCategory(true);
      setActiveCategory('');
    } else {
      setActiveAllCategory(false);
      setActiveCategory(category_id);
      let menuFilter = menuParsed.filter(menu => {
        let categoryParsed = JSON.parse(menu.menu_category);

        result = categoryParsed.map(category => {
          if (category.category_id === category_id) {
            return menu;
          }
        });
        // aa.push(result.filter(Boolean));

        if (result.length > 0) {
          result_filter = result.filter(Boolean);
          // console.log('result', result.filter(Boolean));
          aa.push(result_filter[0]);
          // aa = result.filter(Boolean);
          // aa.push(result.filter(Boolean));
        }
      });
      setMenu(aa.filter(Boolean));
      // console.log('aa', );
    }
  };

  const _endScroll = () => {
    if (endScroll == false) {
      scrollView.current.scrollToEnd({animated: true});
      setEndScroll(true);
    } else {
      scrollView.current.scrollTo({animated: true});
      setEndScroll(false);
    }
  };

  const _clickPlusTakeway = async () => {
    setPlusTakeway(true);
  };

  const _applyMembership = async () => {
    await axios
      .post(url + '/pos/getMembership', {membership_no: textInputMembershipNo})
      .then(resp => {
        if (resp.data.status == 200) {
          alert('Membership Applied!');
          setMembershipNo(String(textInputMembershipNo));
        } else {
          alert('Membership Not Found!');
          setMembershipNo('');
        }
      });
  };

  const _linkMembership = async () => {
    if (textInputLinkMember) {
      await axios
        .post(url + '/pos/getMembership', {membership_no: textInputLinkMember})
        .then(async resp => {
          if (resp.data.status == 200) {
            let data = resp.data.data;
            // console.log('resp', resp.data.data);
            setLinkMembershipNo(data.membership_no);
            setLinkMembershipName(data.name);
            setLinkMembershipPoint(data.point);
            setLinkMembershipExpiry(data.expiry_date);

            // alert('Membership Linked!');
            setLinkMembershipNo(String(textInputLinkMember));
            setLinkMembership(true);

            Alert.alert(
              'Membership Linked!',
              'Membership No: ' + data.membership_no,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    _calculateTotal();
                  },
                },
              ],
              {cancelable: false},
            );

            // await _calculateTotal();
            // members
          } else {
            alert('Membership Not Found!');
            setLinkMembershipNo('');
            setLinkMembership(false);
          }
        });

      // await _calculateTotal();
    } else {
      alert('Please Enter Membership No');
      return;
    }

    _calculateTotal();
  };

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        // backgroundColor: modalVisible == true ? 'blue' : color.background,
        // position: modalVisible == true ? 'absolute' : null,
        // alignItems: modalVisible == true ? 'center' : null,
        // justifyContent: modalVisible == true ? 'center' : null,
        // // flex: modalVisible == true ? 1 : null,
        // display: modalVisible == true ? 'flex' : null,
        // // flex: modalVisible == true ? 1 : 1,
        // height: modalVisible == true ? '100%' : null,
        // width: modalVisible == true ? '100%' : null,
      }}>
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
        <View style={styles.mainContainer}>
          <Drawer navigation={navigation} />
          <View style={styles.box1}>
            {/* ROW FIRST */}
            <View
              style={{
                flexDirection: 'row',
                height: 'auto',
                alignItems: 'center',
              }}>
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
              <View style={{...styles.inputSearch, flexDirection: 'row'}}>
                <Icon
                  name={'search'}
                  type="feather"
                  size={24}
                  // style={{position: 'absolute', margin: 100}}
                />
                <View style={{flex: 1, paddingRight: 10}}>
                  <TextInput
                    style={{
                      ...styles.textInput,
                      width: '100%',
                      flexDirection: 'row',
                    }}
                    placeholder="Search menu"
                    placeholderTextColor={color.textGray}
                    onChangeText={text => _searchMenu(text)}
                    // defaultValue={staffNo}
                  />
                </View>
              </View>
            </View>

            {/* ROW SECOND */}
            <View
              style={{
                flexDirection: 'row',
                height: 'auto',
                alignItems: 'center',
                marginRight: 20,
              }}>
              <TouchableOpacity
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 0,
                  // marginBottom:0,
                  // backgroundColor:'pink'
                }}
                onPress={() => {
                  _endScroll();
                }}>
                <View style={{width: 20}}>
                  <Icon
                    name={
                      endScroll == true ? 'chevrons-left' : 'chevrons-right'
                    }
                    type="feather"
                    size={24}
                    // style={{position: 'absolute', margin: 100}}
                  />
                </View>
              </TouchableOpacity>

              <ScrollView horizontal={true} ref={scrollView}>
                <TouchableOpacity
                  style={{
                    ...styles.boxCategory,
                    backgroundColor:
                      activeAllCategory == true ? color.primary : color.white,
                  }}
                  onPress={() => {
                    _filterByCategory(0);
                  }}>
                  <View>
                    <Text
                      style={{
                        ...styles.textInput,
                        color: activeAllCategory == true ? color.white : null,
                      }}>
                      All
                    </Text>
                  </View>
                </TouchableOpacity>
                {menuCategory.map((data, key) => {
                  return (
                    <TouchableOpacity
                      style={{
                        ...styles.boxCategory,
                        backgroundColor:
                          activeCategory == data.category_id
                            ? color.primary
                            : color.white,
                      }}
                      key={key}
                      onPress={() => {
                        _filterByCategory(data.category_id);
                      }}>
                      <View>
                        <Text
                          style={{
                            ...styles.textInput,
                            color:
                              activeCategory == data.category_id
                                ? color.white
                                : color.black,
                          }}>
                          {data.category_name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* ROW THIRD */}
            <View
              style={{
                flexDirection: 'row',
                // height: '68%',
                // backgroundColor:'pink',
                justifyContent: 'center',
                // alignItems: 'center',
                alignContent: 'center',
                flex: 4,
                marginRight: 0,
                paddingLeft: 21,
                // width:'100%'
                // flex:1
              }}>
              <ScrollView
                style={{
                  marginTop: 20,
                  zIndex: 50,
                  // marginHorizontal:20,
                  // marginLeft: 20,
                }}
                // horizontal={true}
                contentContainerStyle={{
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  // backgroundColor:'black'
                  // flex: 1,
                }}>
                {menu.map((data, key) => {
                  let img = JSON.parse(data.menu_image);
                  let variant = JSON.parse(data.menu_variant);
                  if (variant == null) {
                    variant = [];
                  }

                  if (img) {
                    var image = img[0].image1;
                    // console.log('image', image);
                  } else {
                    var image = null;
                  }
                  return (
                    <>
                      <TouchableOpacity
                        key={key}
                        // testID={data.id}
                        style={{...styles.boxMenu, marginRight: 20}}
                        onPress={() => {
                          // code use state item
                          setMenuId(data.menu_id);
                          setMenuName(data.menu_name);
                          setMenuPrice(data.menu_price);
                          setMenuVariant(variant);
                          // setMenuItem(data.menuItem);
                          // setMenuAddon(data.menuAddon);
                          setMenuImage(
                            img
                              ? image
                              : 'https://s3.ap-southeast-1.amazonaws.com/cdn.toyyibfnb.com/images/food.png',
                          );
                          _showModal('order');
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            margin: 5,
                            alignItems: 'center',
                            backgroundColor: color.background,
                            height: 100,
                            // width:50
                          }}>
                          <Image
                            style={{
                              width: '100%',
                              height: '100%',
                              justifyContent: 'center',
                            }}
                            source={{
                              uri: img
                                ? image
                                : 'https://s3.ap-southeast-1.amazonaws.com/cdn.toyyibfnb.com/images/food.png',
                            }}
                          />
                        </View>
                        <View style={{height: '21%'}}>
                          <Text style={styles.textInputMenu}>
                            {data.menu_code} {}
                            {data.menu_name}
                          </Text>
                        </View>

                        <Text style={styles.textInputPrice}>
                          RM {data.menu_price.toFixed(2)}
                        </Text>
                        <View
                          style={{flexDirection: 'row', alignItem: 'center'}}>
                          <Text style={styles.textInputDiscount}>
                            RM {data.menu_price.toFixed(2)}
                          </Text>

                          <View
                            style={{
                              alignSelf: 'center',
                              height: 13,
                              width: 1,
                              backgroundColor: color.textGray,
                            }}
                          />
                          <Text style={styles.textInputQuantity}>50 Left</Text>
                        </View>
                      </TouchableOpacity>
                    </>
                  );
                })}

                {/* <View style={styles.boxMenu}></View>
              <View style={styles.boxMenu}></View>
              <View style={styles.boxMenu}></View> */}
              </ScrollView>
            </View>

            <View style={styles.centeredView}>
              <Modal
                id={menuId}
                animationType="fade"
                visible={modalVisible}
                // onRequestClose={() => {
                //   Alert.alert('Modal has been closed.');
                //   setModalVisible(!modalVisible);
                // }}
                style={{
                  // backgroundColor: 'red',
                  // justifyContent: 'flex-start',
                  // flex: 1,
                  // alignContent:'center',
                  borderWidth: 0.5,
                  // margin: 100,
                  width: 1 * containerStyle.width,
                  // height:'50%',
                  marginLeft: 'auto',
                  marginBottom:
                    menuVariant.length > 0
                      ? 'auto'
                      : plusTakeway == true
                      ? (5 / 100) * containerStyle.height
                      : (5 / 100) * containerStyle.height,
                  marginTop:
                    menuVariant.length > 0
                      ? 'auto'
                      : plusTakeway == true
                      ? (5 / 100) * containerStyle.height
                      : (5 / 100) * containerStyle.height,
                  marginRight: 'auto',
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
                }}>
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
                      setModalVisible(!modalVisible);
                      setMenuQuantity(1);
                      setSelectDineInOrTakeAway(0);

                      setMenuVariantId('');
                      setMenuVariantPrice2(0);
                      setMenuVariantType('');
                      setMenuVariantSelected([]);

                      setMenuVariantId2('');
                      setMenuVariantPrice2(0);
                      setMenuVariantType2('');
                      setMenuVariantSelected2({});
                    }}
                    // style={{position: 'absolute', margin: 100}}
                  />
                </View>

                <View
                  style={{
                    alignItems: 'center',
                    // justifyContent: 'center',
                    // justifyContent: 'flex-start',

                    // backgroundColor: 'black',
                  }}>
                  <Text style={{fontSize: 16, fontFamily: fonts.medium}}>
                    Choose Variant
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    width: '70%',
                    // backgroundColor: 'black',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    height: 'auto',
                    flex: 1,
                    marginBottom: 20,
                    // justifyContent:'space-around'
                  }}>
                  <View style={{flex: 6}}>
                    <View style={{...styles.modalVariant, paddingTop: 20}}>
                      <TextInput
                        style={{
                          ...styles.inputMembership,
                          flex: 8,
                          backgroundColor: color.white,
                        }}
                        placeholder="Membership No."
                        keyboardType="numeric"
                        placeholderTextColor={color.textGray}
                        defaultValue={String(textInputMembershipNo)}
                        onChangeText={text => {
                          setTextInputMembershipNo(String(text));
                        }}
                        editable={membershipNo ? false : true}
                        selectTextOnFocus={membershipNo ? false : true}
                      />
                      <TouchableOpacity
                        style={{
                          ...styles.btnMembership,
                          flex: 3,
                          borderWidth: 1,
                          borderColor: color.primary,
                          backgroundColor: color.white,
                        }}
                        onPress={() => {
                          setMembershipNo('');
                          setTextInputMembershipNo('');
                        }}>
                        <Text style={styles.textInput}>Clear</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{...styles.btnMembership, flex: 3}}
                        onPress={() => {
                          _applyMembership();
                        }}>
                        <Text style={{...styles.textInput, color: color.white}}>
                          Apply
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        ...styles.modalVariant,
                        justifyContent: 'space-between',
                      }}>
                      <View style={{ width:30/100 *containerStyle.width}}>
                        <Text
                          style={{fontFamily: fonts.semibold, fontSize: 24}}>
                          {menuName}
                        </Text>
                      </View>

                      <Text style={{fontFamily: fonts.semibold, fontSize: 24}}>
                        RM {menuPrice.toFixed(2)}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          // marginRight: 5,
                        }}>
                        <TouchableOpacity
                          style={{
                            height: 40,
                            backgroundColor: color.primary,
                            width: 40,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          onPress={() => _reduceMenuQuantity()}>
                          <Icon
                            name={'minus'}
                            type="feather"
                            size={24}
                            color={color.white}

                            // style={{position: 'absolute'}}
                          />
                        </TouchableOpacity>

                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 15,
                            marginRight: 15,
                          }}>
                          <Text style={{fontFamily: fonts.regular}}>
                            {menuQuantity}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={{
                            height: 40,
                            backgroundColor: color.primary,
                            width: 40,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            // marginRight:5
                          }}
                          onPress={() => _addMenuQuantity()}>
                          <Icon
                            name={'plus'}
                            type="feather"
                            size={24}
                            color={color.white}

                            // style={{position: 'absolute'}}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {menuVariant.length == 0 || menuVariant == null ? null : (
                      <>
                        <View
                          style={{
                            ...styles.modalVariant,
                            height: menuVariant[1] == null ? '30%' : null,
                            // backgroundColor: 'pink',
                          }}>
                          <View style={{flexDirection: 'column', flex: 1}}>
                            <View>
                              <Text
                                style={{
                                  fontFamily: fonts.semibold,
                                  fontSize: 16,
                                }}>
                                {menuVariant[0].type.charAt(0).toUpperCase() +
                                  menuVariant[0].type.slice(1)}
                              </Text>
                            </View>

                            <ScrollView style={{}}>
                              {menuVariant[0].data.map((item, index) => {
                                return (
                                  <TouchableOpacity
                                    style={{
                                      // flex: 8,
                                      height: 40,
                                      backgroundColor:
                                        menuVariantId == item.id &&
                                        menuVariantType == menuVariant[0].type
                                          ? color.primary
                                          : color.white,
                                      alignItems: 'center',
                                      flexDirection: 'row',
                                      // borderWidth:0.5,
                                      borderRadius: 5,
                                      marginTop: 5,
                                    }}
                                    onPress={() => {
                                      setMenuVariantId(item.id);
                                      setMenuVariantPrice(
                                        item.price + menuPrice,
                                      );
                                      setMenuVariantType(menuVariant[0].type);

                                      setMenuVariantSelected({
                                        id: item.id,
                                        name: item.name,
                                        price: item.price + menuPrice,
                                        type: menuVariant[0].type,
                                      });

                                      setMenuVariantId2('');
                                      setMenuVariantPrice2(0);
                                      setMenuVariantType2('');
                                      setMenuVariantSelected2({});

                                      // setMenuPrice(data.price + menuPrice);
                                    }}>
                                    <View
                                      style={{
                                        height: 30,
                                        width: 30,
                                        margin: 5,
                                        borderRadius: 5,
                                        backgroundColor:
                                          menuVariantId == item.id &&
                                          menuVariantType == menuVariant[0].type
                                            ? color.white
                                            : color.background,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}>
                                      {menuVariantId == item.id &&
                                      menuVariantType == menuVariant[0].type ? (
                                        <Icon
                                          name={'check'}
                                          type="feather"
                                          size={24}
                                        />
                                      ) : null}
                                    </View>
                                    <View
                                      style={{
                                        marginLeft: 5,
                                        marginRight: 5,
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                        flex: 1,
                                      }}>
                                      <Text
                                        style={{
                                          fontFamily: fonts.regular,
                                          color:
                                            menuVariantId == item.id &&
                                            menuVariantType ==
                                              menuVariant[0].type
                                              ? color.white
                                              : null,
                                        }}>
                                        {item.name.charAt(0).toUpperCase() +
                                          item.name.slice(1)}
                                      </Text>
                                      <Text
                                        style={{
                                          fontFamily: fonts.regular,
                                          color:
                                            menuVariantId == item.id &&
                                            menuVariantType ==
                                              menuVariant[0].type
                                              ? color.white
                                              : null,
                                        }}>
                                        ( + RM {item.price.toFixed(2)} )
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                );
                              })}
                            </ScrollView>
                          </View>
                        </View>

                        {menuVariant[1] == null ? null : (
                          <View
                            style={{
                              ...styles.modalVariant,
                              height: '27%',
                              // backgroundColor: 'pink',
                            }}>
                            <View style={{flexDirection: 'column', flex: 1}}>
                              <View>
                                <Text
                                  style={{
                                    fontFamily: fonts.semibold,
                                    fontSize: 16,
                                  }}>
                                  {menuVariant[1].type.charAt(0).toUpperCase() +
                                    menuVariant[1].type.slice(1)}
                                </Text>
                              </View>

                              <ScrollView style={{}}>
                                {menuVariant[1].data.map((item, index) => {
                                  return (
                                    <TouchableOpacity
                                      style={{
                                        // flex: 8,
                                        height: 40,
                                        backgroundColor:
                                          menuVariantId2 == item.id &&
                                          menuVariantType2 ==
                                            menuVariant[1].type
                                            ? color.primary
                                            : color.white,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        // borderWidth:0.5,
                                        borderRadius: 5,
                                        marginTop: 5,
                                      }}
                                      onPress={() => {
                                        setMenuVariantId2(item.id);
                                        setMenuVariantPrice2(
                                          item.price + menuPrice,
                                        );
                                        setMenuVariantType2(
                                          menuVariant[1].type,
                                        );

                                        setMenuVariantSelected2({
                                          id: item.id,
                                          name: item.name,
                                          price: item.price + menuPrice,
                                          type: menuVariant[1].type,
                                        });
                                        // setMenuPrice(data.price + menuPrice);
                                      }}>
                                      <View
                                        style={{
                                          height: 30,
                                          width: 30,
                                          margin: 5,
                                          borderRadius: 5,
                                          backgroundColor:
                                            menuVariantId2 == item.id &&
                                            menuVariantType2 ==
                                              menuVariant[1].type
                                              ? color.white
                                              : color.background,
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        {menuVariantId2 == item.id &&
                                        menuVariantType2 ==
                                          menuVariant[1].type ? (
                                          <Icon
                                            name={'check'}
                                            type="feather"
                                            size={24}
                                          />
                                        ) : null}
                                      </View>
                                      <View
                                        style={{
                                          marginLeft: 5,
                                          marginRight: 5,
                                          justifyContent: 'space-between',
                                          flexDirection: 'row',
                                          flex: 1,
                                        }}>
                                        <Text
                                          style={{
                                            fontFamily: fonts.regular,
                                            color:
                                              menuVariantId2 == item.id &&
                                              menuVariantType2 ==
                                                menuVariant[1].type
                                                ? color.white
                                                : null,
                                          }}>
                                          {item.name.charAt(0).toUpperCase() +
                                            item.name.slice(1)}
                                        </Text>
                                        <Text
                                          style={{
                                            fontFamily: fonts.regular,
                                            color:
                                              menuVariantId2 == item.id &&
                                              menuVariantType2 ==
                                                menuVariant[1].type
                                                ? color.white
                                                : null,
                                          }}>
                                          ( + RM {item.price.toFixed(2)} )
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  );
                                })}
                              </ScrollView>
                            </View>
                          </View>
                        )}
                      </>
                    )}

                    {/* <View style={{...styles.modalVariant}}>
                    <View style={{flexDirection: 'column', flex: 1}}>
                      <View>
                        <Text
                          style={{fontFamily: fonts.semibold, fontSize: 16}}>
                          Kuah
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={{
                          // flex: 8,
                          height: 40,
                          backgroundColor: color.primary,
                          alignItems: 'center',
                          flexDirection: 'row',
                          // borderWidth:0.5,
                          borderRadius: 5,
                        }}>
                        <View
                          style={{
                            height: 30,
                            width: 30,
                            margin: 5,
                            borderRadius: 5,
                            backgroundColor: color.white,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Icon
                            name={'check'}
                            type="feather"
                            size={24}
                          />
                        </View>
                        <View style={{marginLeft: 5}}>
                          <Text style={{fontFamily: fonts.regular}}>
                            Blackpepper
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          // flex: 8,
                          height: 40,
                          backgroundColor: color.white,
                          alignItems: 'center',
                          flexDirection: 'row',
                          // borderWidth:0.5,
                          borderRadius: 5,
                          marginTop: 5,
                        }}>
                        <View
                          style={{
                            height: 30,
                            width: 30,
                            margin: 5,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: color.background,
                          }}></View>
                        <View style={{marginLeft: 5}}>
                          <Text style={{fontFamily: fonts.regular}}>Kari</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View> */}

                    {/* <View style={{...styles.modalVariant}}>
                    <View style={{flexDirection: 'column', flex: 1}}>
                      <View>
                        <Text
                          style={{fontFamily: fonts.semibold, fontSize: 16}}>
                          Add on
                        </Text>
                      </View>

                      <ScrollView style={{height: 100}}>
                        <View
                          style={{
                            // flex: 8,
                            height: 40,
                            // backgroundColor: color.white,
                            alignItems: 'center',
                            flexDirection: 'row',
                            // borderWidth:0.5,
                            borderRadius: 5,
                            justifyContent: 'space-between',
                          }}>
                          <View style={{margin: 5}}>
                            <Text style={{fontFamily: fonts.regular}}>
                              Nasi Tambah
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginRight: 5,
                            }}>
                            <TouchableOpacity
                              style={{
                                height: 40,
                                backgroundColor: color.primary,
                                width: 40,
                                borderRadius: 5,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              onPress={() => _reduceQuantity()}>
                              <Icon
                                name={'minus'}
                                type="feather"
                                size={24}
                                color="white"

                                // style={{position: 'absolute'}}
                              />
                            </TouchableOpacity>

                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft: 15,
                                marginRight: 15,
                              }}>
                              <Text style={{fontFamily: fonts.regular}}>
                                {itemQuantity}
                              </Text>
                            </View>

                            <TouchableOpacity
                              style={{
                                height: 40,
                                backgroundColor: color.primary,
                                width: 40,
                                borderRadius: 5,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              onPress={() => _addQuantity()}>
                              <Icon
                                name={'plus'}
                                type="feather"
                                size={24}
                                color="white"

                                // style={{position: 'absolute'}}
                              />
                            </TouchableOpacity>

                            <Text style={{fontFamily: fonts.regular}}>
                              {} RM {itemQuantity}.00
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            // flex: 8,
                            height: 40,
                            // backgroundColor: 'pink',
                            alignItems: 'center',
                            flexDirection: 'row',
                            // borderWidth:0.5,
                            borderRadius: 5,
                            marginTop: 5,
                            justifyContent: 'space-between',
                          }}>
                          <View style={{margin: 5}}>
                            <Text style={{fontFamily: fonts.regular}}>
                              Nasi Tambah
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginRight: 5,
                            }}>
                            <TouchableOpacity
                              style={{
                                height: 40,
                                backgroundColor: color.primary,
                                width: 40,
                                borderRadius: 5,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              onPress={() => _reduceQuantity()}>
                              <Icon
                                name={'minus'}
                                type="feather"
                                size={24}
                                color="white"

                                // style={{position: 'absolute'}}
                              />
                            </TouchableOpacity>

                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft: 15,
                                marginRight: 15,
                              }}>
                              <Text style={{fontFamily: fonts.regular}}>
                                {itemQuantity}
                              </Text>
                            </View>

                            <TouchableOpacity
                              style={{
                                height: 40,
                                backgroundColor: color.primary,
                                width: 40,
                                borderRadius: 5,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              onPress={() => _addQuantity()}>
                              <Icon
                                name={'plus'}
                                type="feather"
                                size={24}
                                color="white"

                                // style={{position: 'absolute'}}
                              />
                            </TouchableOpacity>

                            <Text style={{fontFamily: fonts.regular}}>
                              {} RM {itemQuantity}.00
                            </Text>
                          </View>
                        </View>
                      </ScrollView>
                    </View>
                  </View> */}

                    {plusTakeway == true ? (
                      <View style={{flexDirection: 'row', marginTop: 20}}>
                        <TouchableOpacity
                          style={{
                            marginLeft: 10,
                            height: 40,
                            backgroundColor:
                              selectDineInOrTakeAway == 1
                                ? color.primary
                                : color.white,
                            width: 130,
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: color.primary,
                            borderWidth: 1,
                          }}
                          onPress={() => {
                            setSelectDineInOrTakeAway(1);
                          }}>
                          <Text
                            style={{
                              fontFamily: fonts.medium,
                              fontSize: 16,
                              color:
                                selectDineInOrTakeAway == 1
                                  ? color.white
                                  : null,
                            }}>
                            Dine In
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            marginLeft: 20,
                            height: 40,
                            backgroundColor:
                              selectDineInOrTakeAway == 2
                                ? color.primary
                                : color.white,
                            width: 130,
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: color.primary,
                            borderWidth: 1,
                          }}
                          onPress={() => {
                            setSelectDineInOrTakeAway(2);
                          }}>
                          <Text
                            style={{
                              fontFamily: fonts.medium,
                              fontSize: 16,
                              color:
                                selectDineInOrTakeAway == 2
                                  ? color.white
                                  : null,
                            }}>
                            Take Away
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}

                    <View
                      style={{
                        ...styles.modalVariant,
                        paddingTop: 0,
                        marginTop: 20,
                        marginBottom: 20,
                      }}>
                      <View style={{flexDirection: 'column', flex: 1}}>
                        <View>
                          <Text
                            style={{
                              fontFamily: fonts.semibold,
                              fontSize: 16,
                            }}>
                            Remark
                          </Text>
                        </View>

                        <View
                          style={{
                            backgroundColor: color.white,
                            width: '100%',
                            height: 70,
                            marginTop: 5,
                            borderRadius: 5,
                          }}>
                          <TextInput
                            style={{
                              // borderRadius: 5,
                              width: '100%',
                              // height: 40,
                              paddingLeft: 10,
                              fontFamily: fonts.medium,
                              fontSize: 16,
                              flex: 1,
                              // backgroundColor: 'pink',
                            }}
                            multiline={true}
                            placeholder="Enter your remark here"
                            keyboardType="numeric"
                            placeholderTextColor={color.textGray}
                            defaultValue={remark}
                            onChangeText={text => {
                              setRemark(text);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      ...styles.modalVariant,
                      // marginTop: 20,
                      // flex: 1,
                      // backgroundColor: 'green',
                    }}>
                    <TouchableOpacity
                      style={{
                        height: 40,
                        borderRadius: 5,
                        backgroundColor: color.primary,
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        if (plusTakeway == true) {
                          if (selectDineInOrTakeAway == 0) {
                            alert('Please select dine in or take away');
                            return;
                          }

                          _addToCart();
                          setModalVisible(!modalVisible);
                          setMenuQuantity(1);
                          setSelectDineInOrTakeAway(0);
                        } else {
                          _addToCart();
                          setModalVisible(!modalVisible);
                          setMenuQuantity(1);
                        }

                        setRemark('');

                        setMenuVariantId('');
                        setMenuVariantType('');
                        setMenuVariantPrice(0);
                        setMenuVariantSelected([]);

                        setMenuVariantId2('');
                        setMenuVariantType2('');
                        setMenuVariantPrice2(0);
                        setMenuVariantSelected2({});
                      }}>
                      <View>
                        <Text
                          style={{
                            fontFamily: fonts.medium,
                            fontSize: 16,
                            color: color.white,
                          }}>
                          Add To Cart
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>

            {/* { MODAL FOR SET DISCOUNT} */}

            <Modal
              id={menuId}
              animationType="fade"
              visible={modalDiscount}
              // onRequestClose={() => {
              //   Alert.alert('Modal has been closed.');
              //   setModalVisible(!modalVisible);
              // }}
              style={{...styles.modalViewDiscount}}>
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
                    setModalDiscount(!modalDiscount);
                    setTextInputDiscount(0);
                    setDiscountType('');
                  }}
                  // style={{position: 'absolute', margin: 100}}
                />
              </View>

              <View
                style={{
                  alignItems: 'center',
                  // justifyContent: 'center',
                  // justifyContent: 'flex-start',

                  // backgroundColor: 'black',
                }}>
                <Text style={{fontSize: 16, fontFamily: fonts.medium}}>
                  Discount
                </Text>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  height: 160,
                  // flex: 1,
                  // backgroundColor: 'white',
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    width: '70%',
                    // backgroundColor: 'black',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    // height: 200,
                    // justifyContent:'space-around'
                    // justifyContent: 'center',
                    // backgroundColor: 'white',
                    alignItems: 'center',
                  }}>
                  <View style={{...styles.modalVariant, marginTop: 20}}>
                    <TextInput
                      style={{
                        ...styles.inputMembership,
                        flex: 8,
                        backgroundColor: 'white',
                      }}
                      placeholder="Enter Discount"
                      keyboardType="numeric"
                      placeholderTextColor={color.textGray}
                      onChangeText={value => {
                        setTextInputDiscount(value);
                      }}
                      defaultValue={textInputDiscount}
                    />
                    <TouchableOpacity
                      style={{
                        ...styles.btnMembership,
                        flex: 2,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        backgroundColor:
                          discountTypeSelect == 'amount'
                            ? color.primary
                            : color.white,
                      }}
                      onPress={() => {
                        _discountType('amount');
                      }}>
                      <Text
                        style={{
                          ...styles.textInput,
                          color:
                            discountTypeSelect == 'amount'
                              ? color.white
                              : color.black,
                        }}>
                        MYR
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        ...styles.btnMembership,
                        backgroundColor:
                          discountTypeSelect == 'percent'
                            ? color.primary
                            : color.white,
                        marginLeft: 0,
                        flex: 2,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }}
                      onPress={() => {
                        _discountType('percent');
                      }}>
                      <Text
                        style={{
                          ...styles.textInput,
                          color:
                            discountTypeSelect == 'percent'
                              ? color.white
                              : color.black,
                        }}>
                        %
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      ...styles.modalVariant,
                      // bottom: 0,
                      marginTop: 15,
                    }}>
                    <TouchableOpacity
                      style={{
                        height: 40,
                        borderRadius: 5,
                        backgroundColor: color.white,
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: color.primary,
                        marginRight: 10,
                      }}
                      onPress={async () => {
                        let data = {};
                        let discountOrder = 0;
                        setDiscountInput(0);
                        setAmountDiscount(0);
                        setAmountDiscountDisplay(
                          discountOrder
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        );
                        setTextInputDiscount(0);
                        setDiscountType('');
                        setDiscountTypeSelect('');

                        data = {
                          discountAmount: 0,
                          discountType: '',
                          discountInput: '',
                        };
                        setToggleEnable(false);
                        console.log('data', data);

                        await AsyncStorage.setItem(
                          'DISCOUNT_ORDER',
                          JSON.stringify(data),
                        );

                        setDiscountConfirm(0);
                        await _calculateTotal();
                      }}>
                      <View style={{margin: 5}}>
                        <Text
                          style={{
                            fontFamily: fonts.medium,
                            fontSize: 16,
                          }}>
                          Clear
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        height: 40,
                        borderRadius: 5,
                        backgroundColor: color.primary,
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        // _addToCart();
                        // alert(discount)
                        if (textInputDiscount == '') {
                          alert('Enter discount');
                          return;
                        } else if (discountTypeSelect == '') {
                          alert('Choose discount type');
                          return;
                        } else {
                          // setDiscount(textInputDiscount);
                          setModalDiscount(!modalDiscount);
                        }
                        // _calculateTotal();
                        _confirmDiscount();
                      }}>
                      <View style={{margin: 5}}>
                        <Text
                          style={{
                            fontFamily: fonts.medium,
                            fontSize: 16,
                            color: color.white,
                          }}>
                          Confirm
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* ROW FOURTH */}
            <View style={styles.boxBottom}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: '100%',
                  // backgroundColor: 'pink',
                }}>
                {linkMembership == true ? (
                  <View
                    style={{
                      flexDirection: 'column',
                      // alignItems: 'center',
                      width: '60%',
                      // justifyContent: 'flex-end',
                      marginBottom: 10,
                      marginTop: 10,
                      marginRight: 10,
                      marginLeft: 10,
                      // backgroundColor: 'blue',
                    }}>
                    <View>
                      <Text
                        style={{
                          ...styles.textFamily,
                          fontFamily: fonts.semibold,
                        }}>
                        {linkMembershipName}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 3,
                      }}>
                      <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                        {linkMembershipNo}
                      </Text>
                      <View
                        style={{
                          alignSelf: 'center',
                          height: '100%',
                          width: 3,
                          backgroundColor: color.background,
                          marginLeft: 5,
                          marginRight: 5,
                        }}
                      />
                      <View
                        style={{
                          height: 20,
                          width: 60,
                          backgroundColor: 'grey',
                          borderRadius: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: fonts.medium,
                            fontSize: 14,
                            color: color.white,
                          }}>
                          Basic
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 5,
                        marginBottom: 10,
                      }}>
                      <Text style={{fontFamily: fonts.regular, fontSize: 14}}>
                        {moment(linkMembershipExpiry).format('DD-MM-YYYY')}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        width: '100%',
                        // justifyContent:'center',
                        // marginTop:'10%',
                        // height:'100%',
                        // backgroundColor: 'green',
                        flex: 1,
                        marginRight: 5,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          // alignContent:'center',
                          // backgroundColor: color.background,
                          borderRadius: 5,
                          width: '100%',
                          height: 40,
                          // paddingLeft: 10,
                          fontFamily: fonts.medium,
                          fontSize: 16,
                          flex: 1,
                        }}>
                        <Text
                          style={{fontFamily: fonts.semibold, fontSize: 16}}>
                          {linkMembershipPoint} pts
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={{...styles.btnMembership, width: '30%'}}
                        onPress={() => {
                          setLinkMembershipNo('');
                          setLinkMembership(false);
                          setTextInputLinkMember('');
                          _calculateTotal();
                        }}>
                        <Text style={{...styles.textInput, color: color.white}}>
                          Unlink
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'column',
                      // alignItems: 'center',
                      width: '60%',
                      // justifyContent: 'flex-end',
                      marginBottom: 10,
                      marginTop: 10,
                      marginRight: 10,
                      marginLeft: 10,
                      // backgroundColor: 'green',
                      // height:'100%',
                      // flex: 1,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        width: '100%',
                        // justifyContent:'center',
                        // marginTop:'10%',
                        // height:'100%',
                        // backgroundColor: 'blue',
                        flex: 1,
                        marginRight: 5,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          // alignContent:'center',
                          backgroundColor: color.background,
                          borderRadius: 5,
                          width: '100%',
                          height: 40,
                          paddingLeft: 10,
                          fontFamily: fonts.medium,
                          fontSize: 16,
                          flex: 1,
                        }}>
                        <TextInput
                          style={{...styles.textInput}}
                          placeholder="Membership No."
                          keyboardType="numeric"
                          placeholderTextColor={color.textGray}
                          defaultValue={String(textInputLinkMember)}
                          onChangeText={value => {
                            setTextInputLinkMember(value);
                          }}
                        />
                      </View>

                      <TouchableOpacity
                        style={{...styles.btnMembership, width: '30%'}}
                        onPress={async () => {
                          _linkMembership();
                        }}>
                        <Text style={{...styles.textInput, color: color.white}}>
                          Link
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <View
                  style={{
                    alignSelf: 'center',
                    height: '90%',
                    width: 5,
                    backgroundColor: color.background,
                  }}
                />
                <View style={{flexDirection: 'row', flex: 1}}>
                  <ScrollView horizontal={true}>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {dataReward.map((data, key) => {
                        return (
                          <>
                            <TouchableOpacity style={{...styles.btnReward}}>
                              <View>
                                <Text style={styles.textInput}>
                                  {data.rewardName}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnReward}>
                              <View>
                                <Text style={styles.textInput}>
                                  {data.rewardName}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </>
                        );
                      })}
                    </View>

                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {dataReward.map((data, key) => {
                        return (
                          <>
                            <TouchableOpacity style={styles.btnReward}>
                              <View>
                                <Text style={styles.textInput}>
                                  {data.rewardName}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnReward}>
                              <View>
                                <Text style={styles.textInput}>
                                  {data.rewardName}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </>
                        );
                      })}
                    </View>

                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {dataReward.map((data, key) => {
                        return (
                          <>
                            <TouchableOpacity style={styles.btnReward}>
                              <View>
                                <Text style={styles.textInput}>
                                  {data.rewardName}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnReward}>
                              <View>
                                <Text style={styles.textInput}>
                                  {data.rewardName}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>

                {/* <View style={{flexDirection: 'row'}}>
                <Text>discount</Text>
                <Text>hahwa</Text>
              </View> */}
              </View>
            </View>
          </View>

          <View style={{...styles.box2, marginLeft: 0}}>
            <View
              style={{
                flexDirection: 'column',
                height: (44 / 100) * containerStyle.height,
                // backgroundColor: 'green',
              }}>
              <View style={{height: '100%'}}>
                {/* {ROW FIRST} */}
                <View
                  style={{
                    flexDirection: 'row',
                    height: 'auto',
                    alignItems: 'center',
                    // backgroundColor: 'pink',
                  }}>
                  {selectOrderTypeId == 1 && plusTakeway == false ? (
                    <TouchableOpacity
                      style={{
                        ...styles.inputBox2,
                        marginLeft: 10,
                        justifyContent: 'center',
                        paddingLeft: 0,
                        marginRight: 0,
                        // backgroundColor: 'black',
                      }}
                      onPress={() => {
                        _clickPlusTakeway();
                      }}>
                      <Icon
                        name={'plus'}
                        type="feather"
                        size={24}
                        // style={{position: 'absolute', margin: 100}}
                      />
                    </TouchableOpacity>
                  ) : plusTakeway == true ? null : null}

                  {/* <DropDownPicker containerStyle={{flex: 6,height:20}} style={{paddingVertical:80}}/> */}

                  <View
                    style={{
                      ...styles.inputBox2,
                      flex: 6,
                      paddingLeft: 0,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginLeft: 10,
                    }}>
                    <View>
                      <Text style={styles.textFamily}>{selectOrderType}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={{
                      ...styles.inputBox2,
                      // marginLeft: 10,
                      justifyContent: 'center',
                      paddingLeft: 0,
                      // backgroundColor: 'black',
                    }}
                    onPress={() => {
                      Alert.alert('Clear', 'Are you sure want to clear cart?', [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => {
                            // console.log('OK Pressed');

                            // if (plusTakeway == true) {
                            //   setOrderCart([]);
                            //   AsyncStorage.removeItem('ORDER');
                            //   _calculateTotal();
                            // } else {
                            setOrderCart([]);
                            AsyncStorage.removeItem('ORDER');
                            AsyncStorage.removeItem('DATA_ORDER');
                            AsyncStorage.removeItem('DISCOUNT_ORDER');
                            setOrderCartTakeAway([]);
                            AsyncStorage.removeItem('ORDER_TAKEAWAY');

                            setPlusTakeway(false);
                            setSelectOrderTypeId(1);

                            setTextInputDiscount(0);
                            setDiscountInput(0);
                            setDiscountType('');
                            setDiscountTypeSelect('');

                            setTax(0);
                            setAmountOrder(0);
                            setServiceCharge(0);
                            setAmountDiscount(0);
                            setTotalAmountOrder(0);
                            setOutletDiscount(0);
                            setMembershipDiscount(0);

                            setTaxDisplay('');
                            setAmountOrderDisplay('');
                            setServiceChargeDisplay('');
                            setAmountDiscountDisplay('');
                            setTotalAmountOrderDisplay('');
                            // }
                          },
                        },
                      ]);
                    }}>
                    <Icon
                      name={'trash-2'}
                      type="feather"
                      size={24}
                      // style={{position: 'absolute', margin: 100}}
                    />
                  </TouchableOpacity>
                </View>

                {/* {ROW SECOND} */}
                {selectOrderTypeId == 1 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 'auto',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        ...styles.inputBox2,
                        marginLeft: 10,
                        // marginTop: 5,
                        justifyContent: 'center',
                        paddingLeft: 0,
                        marginTop: 10,
                        // marginRight:0
                        // alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: fonts.medium,
                        }}>
                        {selectTable}
                      </Text>
                    </View>
                  </View>
                ) : null}

                {/* {ROW THIRD} */}
                <View style={{height: '100%', flex: 1}}>
                  <ScrollView
                    // style={{backgroundColor: 'pink'}}
                    contentContainerStyle={
                      {
                        // height: setPlusTakeway == true ? '50%' : '100%',
                        // backgroundColor: 'pink',
                      }
                    }>
                    {orderCart.map((data, key) => {
                      return (
                        <View
                          style={{
                            marginTop: 5,
                            flexDirection: 'row',
                            height: 'auto',
                            alignItems: 'center',
                            // backgroundColor: 'blue',
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
                              height: 60,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              style={{
                                width: '100%',
                                height: '60%',
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
                              flexDestination: 'column',
                              height: 70,
                              justifyContent: 'space-between',
                              // backgroundColor: 'black',
                            }}>
                            <View>
                              <View style={{marginBottom: 10}}>
                                <Text style={styles.textInputAddToCart}>
                                  {data.menu_name}
                                </Text>
                              </View>

                              <View style={{flexDirection: 'row'}}>
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

                              <View style={{flexDirection: 'row'}}>
                                {data.menu_remark ? (
                                  <Text
                                    style={{
                                      fontFamily: fonts.medium,
                                      fontSize: 12,
                                      color: color.textGray,
                                    }}>
                                    - {data.menu_remark}
                                  </Text>
                                ) : null}
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
                              justifyContent: 'space-between',
                              // backgroundColor: 'black',
                            }}>
                            <View
                              style={{
                                justifyContent: 'center',
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
                                marginRight: 10,
                                justifyContent: 'space-evenly',
                                // backgroundColor:'black'
                              }}>
                              <TouchableOpacity
                                style={{
                                  height: 35,
                                  backgroundColor: color.primary,
                                  width: 35,
                                  borderRadius: 5,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                onPress={() =>
                                  _reduceMenuCartQuantity(
                                    data.menu_id,
                                    data.membership_no,
                                    data.menu_variant,
                                    data.menu_remark,
                                  )
                                }>
                                <Icon
                                  name={'minus'}
                                  type="feather"
                                  size={19}
                                  color="white"

                                  // style={{position: 'absolute'}}
                                />
                              </TouchableOpacity>

                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginLeft: 15,
                                  marginRight: 15,
                                }}>
                                <Text style={{fontFamily: fonts.regular}}>
                                  {data.menu_quantity}
                                </Text>
                              </View>

                              <TouchableOpacity
                                style={{
                                  height: 35,
                                  backgroundColor: color.primary,
                                  width: 35,
                                  borderRadius: 5,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                onPress={() =>
                                  _addMenuCartQuantity(
                                    data.menu_id,
                                    data.membership_no,
                                    data.menu_variant,
                                    data.menu_remark,
                                  )
                                }>
                                <Icon
                                  name={'plus'}
                                  type="feather"
                                  size={19}
                                  color="white"

                                  // style={{position: 'absolute'}}
                                />
                              </TouchableOpacity>

                              {/* <Text style={{fontFamily: fonts.regular}}>
                          {} RM {itemQuantity}.00
                        </Text> */}
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>

                  {plusTakeway == true ? (
                    <View style={{height: '50%'}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: 'auto',
                          alignItems: 'center',
                          backgroundColor: 'white',
                        }}>
                        <TouchableOpacity
                          style={{
                            ...styles.inputBox2,
                            marginLeft: 10,
                            justifyContent: 'center',
                            paddingLeft: 0,
                            marginRight: 0,
                            marginTop: 10,
                            // backgroundColor: 'black',
                          }}
                          onPress={() => {
                            setSelectDineInOrTakeAway(0);
                            setPlusTakeway(false);
                            setOrderCartTakeAway([]);
                            AsyncStorage.removeItem('ORDER_TAKEAWAY');
                            _calculateTotal();
                            _confirmDiscount();
                          }}>
                          <Icon
                            name={'minus'}
                            type="feather"
                            size={24}
                            // style={{position: 'absolute', margin: 100}}
                          />
                        </TouchableOpacity>
                        <View
                          style={{
                            ...styles.inputBox2,
                            flex: 6,
                            paddingLeft: 0,
                            justifyContent: 'center',
                            alignSelf: 'center',
                            marginTop: 10,
                            marginLeft: 10,
                          }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: fonts.medium,
                            }}>
                            Takeaway
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={{
                            ...styles.inputBox2,
                            // marginLeft: 10,
                            justifyContent: 'center',
                            paddingLeft: 0,
                            marginTop: 10,
                            // backgroundColor: 'black',
                          }}
                          onPress={() => {
                            Alert.alert(
                              'Clear',
                              'Are you sure want to clear cart?',
                              [
                                {
                                  text: 'Cancel',
                                  onPress: () => console.log('Cancel Pressed'),
                                  style: 'cancel',
                                },
                                {
                                  text: 'OK',
                                  onPress: () => {
                                    setOrderCartTakeAway([]);
                                    AsyncStorage.removeItem('ORDER_TAKEAWAY');
                                    _calculateTotal();
                                    _confirmDiscount();
                                  },
                                },
                              ],
                            );
                          }}>
                          <Icon
                            name={'trash-2'}
                            type="feather"
                            size={24}
                            // style={{position: 'absolute', margin: 100}}
                          />
                        </TouchableOpacity>
                      </View>

                      <ScrollView>
                        {orderCartTakeAway.map((data, index) => {
                          return (
                            <View
                              style={{
                                marginTop: 5,
                                flexDirection: 'row',
                                height: 'auto',
                                alignItems: 'center',
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
                                  height: 60,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  style={{
                                    width: '100%',
                                    height: '60%',
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
                                  flexDestination: 'column',
                                  height: 70,
                                  justifyContent: 'space-between',
                                  // backgroundColor: 'black',
                                }}>
                                <View>
                                  <View style={{marginBottom: 10}}>
                                    <Text style={styles.textInputAddToCart}>
                                      {data.menu_name}
                                    </Text>
                                  </View>
                                  <View style={{flexDirection: 'row'}}>
                                    {data.menu_variant
                                      ? data.menu_variant.map(
                                          (variant, key) => {
                                            return (
                                              <Text
                                                style={{
                                                  fontFamily: fonts.medium,
                                                  fontSize: 12,
                                                  color: color.textGray,
                                                }}>
                                                {data.menu_variant.length ==
                                                key + 1
                                                  ? variant.name
                                                  : variant.name + ', '}
                                              </Text>
                                            );
                                          },
                                        )
                                      : null}
                                  </View>

                                  <View style={{flexDirection: 'row'}}>
                                    {data.menu_remark ? (
                                      <Text
                                        style={{
                                          fontFamily: fonts.medium,
                                          fontSize: 12,
                                          color: color.textGray,
                                        }}>
                                        - {data.menu_remark}
                                      </Text>
                                    ) : null}
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
                                  justifyContent: 'space-between',
                                  // backgroundColor: 'black',
                                }}>
                                <View
                                  style={{
                                    justifyContent: 'center',
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
                                    marginRight: 10,
                                    justifyContent: 'space-evenly',
                                    // backgroundColor:'black'
                                  }}>
                                  <TouchableOpacity
                                    style={{
                                      height: 35,
                                      backgroundColor: color.primary,
                                      width: 35,
                                      borderRadius: 5,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                    onPress={() =>
                                      _reduceMenuCartQuantityTakeaway(
                                        data.menu_id,
                                        data.membership_no,
                                        data.menu_variant,
                                        data.menu_remark,
                                      )
                                    }>
                                    <Icon
                                      name={'minus'}
                                      type="feather"
                                      size={19}
                                      color="white"

                                      // style={{position: 'absolute'}}
                                    />
                                  </TouchableOpacity>

                                  <View
                                    style={{
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      marginLeft: 15,
                                      marginRight: 15,
                                    }}>
                                    <Text style={{fontFamily: fonts.regular}}>
                                      {data.menu_quantity}
                                    </Text>
                                  </View>

                                  <TouchableOpacity
                                    style={{
                                      height: 35,
                                      backgroundColor: color.primary,
                                      width: 35,
                                      borderRadius: 5,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                    onPress={() =>
                                      _addMenuCartQuantityTakeaway(
                                        data.menu_id,
                                        data.membership_no,
                                        data.menu_variant,
                                        data.menu_remark,
                                      )
                                    }>
                                    <Icon
                                      name={'plus'}
                                      type="feather"
                                      size={19}
                                      color="white"

                                      // style={{position: 'absolute'}}
                                    />
                                  </TouchableOpacity>

                                  {/* <Text style={{fontFamily: fonts.regular}}>
                              {} RM {itemQuantity}.00
                            </Text> */}
                                </View>
                              </View>
                            </View>
                          );
                        })}
                      </ScrollView>
                    </View>
                  ) : null}
                </View>
              </View>

              <View
                style={{
                  // marginTop:100,
                  justifyContent: 'flex-end',
                  flexDirection: 'column',
                  // backgroundColor: 'pink',
                  height: 'auto',
                  // marginTop: 10,
                  // marginBottom:20
                  // flex: 1,
                }}>
                {/* {calculation section} */}
                <View
                  style={{
                    marginTop: 5,
                    marginLeft: 10,
                    marginRight: 10,
                    backgroundColor: color.background,
                    height: 'auto',
                    // backgroundColor: 'green',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // margin: 5,
                      // backgroundColor:'red'
                    }}>
                    <Text style={styles.textCart}>Subtotal</Text>
                    <Text style={styles.textCart}>
                      {amountOrderDisplay ? amountOrderDisplay : (0).toFixed(2)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // margin: 5,
                      alignItems: 'center',
                      // backgroundColor:'red'
                    }}
                    onPress={() => {
                      _showModal('discount');
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={{...styles.textCart}}>
                        Discount{' '}
                        {discountType == 'amount'
                          ? '(MYR)'
                          : discountType == 'percent'
                          ? '(' + textInputDiscount + '%)'
                          : null}
                      </Text>
                      <Switch
                        trackColor={{false: color.primary, true: color.success}}
                        thumbColor={color.white}
                        ios_backgroundColor={color.primary}
                        onValueChange={() => {
                          _toggleSwitchDiscount('discount');
                        }}
                        value={toggleEnable}
                        style={{
                          transform: [{scaleX: 0.5}, {scaleY: 0.5}],
                        }}
                      />
                    </View>

                    <Text style={styles.textCart}>
                      {' '}
                      {amountDiscountDisplay
                        ? amountDiscountDisplay
                        : (0).toFixed(2)}
                    </Text>
                  </TouchableOpacity>

                  {linkMembership == true || membershipDiscount > 0 ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        margin: 5,
                      }}>
                      <Text style={styles.textCart}>
                        Membership Discount 7%
                      </Text>
                      <Text style={styles.textCart}>
                        {membershipDiscount
                          ? membershipDiscount
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          : (0).toFixed(2)}
                      </Text>
                    </View>
                  ) : null}

                  {outletDiscount > 0 ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        margin: 5,
                      }}>
                      <Text style={styles.textCart}>Outlet Discount 10%</Text>
                      <Text style={styles.textCart}>
                        {outletDiscount
                          ? outletDiscount
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          : (0).toFixed(2)}
                      </Text>
                    </View>
                  ) : null}

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // margin: 5,
                    }}>
                    <Text style={styles.textCart}>Tax 6%</Text>
                    <Text style={styles.textCart}>
                      {taxDisplay ? taxDisplay : (0).toFixed(2)}
                    </Text>
                  </View>
                  {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: 5,
                  }}>
                  <Text style={styles.textCart}>Service Charges 10%</Text>
                  <Text style={styles.textCart}>0.00</Text>
                  </View> */}

                  {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: 5,
                    backgroundColor: 'white',
                    borderWidth: 0.9,
                    borderColor: '#A3A3A3',
                    borderStyle: 'dashed',
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={styles.textCart}>Add Voucher Code</Text>
                  </View> */}

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // margin: 5,
                      // marginTop: 15,
                    }}>
                    <Text style={{fontFamily: fonts.semibold, fontSize: 18}}>
                      Total
                    </Text>
                    <Text style={{fontFamily: fonts.semibold, fontSize: 18}}>
                      RM{' '}
                      {totalAmountOrderDisplay
                        ? totalAmountOrderDisplay
                        : (0).toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View style={{}}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      margin: 10,
                      // marginTop: 15,
                      backgroundColor: color.primary,
                      borderRadius: 5,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      // alert('test');

                      _checkout();
                      // navigation.navigate('Checkout');
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.medium,
                        fontSize: 16,
                        color: color.white,
                      }}>
                      Proceed
                    </Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      margin: 10,
                      marginTop: 0,
                      backgroundColor: 'white',
                      borderRadius: 5,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: color.primary,
                      borderWidth: 1,
                    }}
                    onPress={() => navigation.goBack()}>
                    <Text style={{fontFamily: fonts.medium, fontSize: 16}}>
                      Back
                    </Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // backgroundColor: color.background,
    // flexDirection: 'row',
  },

  mainContainer: {
    // backgroundColor: '#F8F8',
    flexDirection: 'row',
    flex: 1,
  },

  box1: {
    // backgroundColor: '#D33',
    flex: 0.9,
  },

  box2: {
    // backgroundColor: '#CCC',
    flex: 0.43,
    marginLeft: 20,
    backgroundColor: color.white,
  },

  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    // marginLeft: 20,
    fontSize: 16,
    fontFamily: fonts.medium,
  },

  textInputMenu: {
    margin: 5,
    marginLeft: 15,
    fontSize: 16,
    fontFamily: fonts.medium,
  },

  textInputPrice: {
    marginTop: 0,
    marginLeft: 15,
    fontSize: 16,
    fontFamily: fonts.medium,
    color: color.primary,
  },

  textInputDiscount: {
    // marginTop: 5,
    marginLeft: 15,
    marginRight: 10,
    textDecorationLine: 'line-through',
    fontSize: 12,
    fontFamily: fonts.medium,
    // position: 'absolute',
    color: '#A3A3A3',
  },

  textInputQuantity: {
    // marginTop: 5,
    marginLeft: 10,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: '#A3A3A3',
  },

  inputSearch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // alignContent:'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    // width: '50%',
    height: 40,
    paddingLeft: 10,
    // marginTop:22,
    marginRight: 40,
    // justifyContent: 'center',
    // backgroundColor:"black"
    // marginBottom: 400,
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  boxCategory: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 40,
    borderRadius: 5,
    marginRight: 15,
    width: 190,
  },

  boxMenu: {
    backgroundColor: 'white',
    margin: 'auto',
    // height: 200,
    width: (30 / 100) * containerStyle.width,
    borderRadius: 5,
    height: 235,
    marginRight: 20,
    marginBottom: 20,
  },

  boxBottom: {
    // flexDirection: 'row',
    flex: 1,
    // width:'100%',
    // alignItems: 'center',
    margin: 10,
    marginTop: 10,
    marginLeft: 20,
    backgroundColor: color.white,
    borderRadius: 5,
    marginRight: 0,
    marginRight: 20,
  },

  inputMembership: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // alignContent:'center',
    backgroundColor: color.background,
    borderRadius: 5,
    width: '100%',
    height: 40,
    paddingLeft: 10,
    fontFamily: fonts.medium,
    fontSize: 16,

    // marginTop: 22,
    // marginLeft: ,
  },

  btnMembership: {
    // flex: 1,
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.primary,
    borderRadius: 5,
    width: '50%',
    height: 40,
    marginLeft: 10,
    // marginTop:22,
    // marginRight: 40,
  },

  btnReward: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.background,
    height: 40,
    borderRadius: 5,
    marginLeft: 15,
    margin: 5,
    width: 150,
  },

  centeredView: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // width: '100%',
    // height: '100%',
    // flex: 1,
    // alignSelf:'center',
    // height:'100%',
    // width:'100%',
    // justifyContent: 'center',
    // alignItems: 'center',
    // // marginTop: 22,
    // // top: 0,
    // position:'absolute',
    // backgroundColor:'blue'
  },

  modalView: {
    justifyContent: 'flex-start',
    flex: 1,
    // alignContent:'center',
    // margin: 100,
    width: 800,
    // height:'50%',
    marginLeft: 'auto',
    marginBottom: 280,
    marginTop: 250,
    marginRight: 'auto',
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

  modalView2: {
    justifyContent: 'flex-start',
    flex: 1,
    // alignContent:'center',
    // margin: 100,
    width: 800,
    // height:'50%',
    marginLeft: 'auto',
    marginBottom: 'auto',
    marginRight: 'auto',
    // backgroundColor: 'pink',
    // margin: 50,
    backgroundColor: 'pink',
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

  modalViewDiscount: {
    justifyContent: 'flex-start',
    flex: 1,
    alignContent: 'center',
    // margin: 100,
    width: 1 * containerStyle.width,
    // height:'50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: (5 / 100) * containerStyle.height,
    marginBottom: (5 / 100) * containerStyle.height,
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

  modalVariant: {
    // padding: 10,
    paddingTop:10,
    // backgroundColor: 'black',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },

  inputBox2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // alignContent:'center',
    backgroundColor: color.background,
    borderRadius: 5,
    // width: '50%',
    height: 40,
    paddingLeft: 10,
    marginTop: 20,
    marginRight: 10,
    // justifyContent: 'center',
    // backgroundColor:"black"
    // marginBottom: 400,
    // justifyContent: 'center',
    // alignItems: 'center',
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

  textCart: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: '#A3A3A3',
  },

  dropdown: {
    // margin: 16,
    height: 40,
    // width: 150,
    // backgroundColor: 'yellow',
    borderRadius: 5,
    flex: 6,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: fonts.medium,
    fontSize: 16,
    alignContent: 'center',
    alignSelf: 'center',
  },
  imageStyle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },

  textFamily: {
    fontFamily: fonts.medium,
    fontSize: 16,
  },
});

//make this component available to the app
export default MenuOrder;
