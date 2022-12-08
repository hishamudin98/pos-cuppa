import {Dimensions} from 'react-native';

export const color = {
  transparent: 'transparent',
  primary: '#7e7e7e',
  secondary: '#353b48',
  white: '#ffffff',
  black: '#18191A',
  gray: '#747d8c',
  lightgray: '#ecf0f1',
  cloud: '#ffffff',
  danger: '#ff0000',
  warning: '#FDDA0D',
  success: '#4BB543',
  info: '#2980b9',
  babyblue: '#F7F9FD',
  darkbabyblue: '#96A0B5',
  placeholder: '#A3A3A3',
  textGray: '#A3A3A3',
  background: '#F8F8F8',
  // background:'#ECECEC',
};

export const system_configuration = {
  ENVIRONMENT: 'development',
  APP_TITLE: 'Malaya Grill',
  APP_COMPANY: 'MALAYA EMPIRE SDN BHD',
  counterSecretKey: '1234-1234', // sme bank
  // REACT_APP_DEV_MODE: 'http://192.168.0.176:3000',
  // REACT_APP_DEV_MODE: 'http://192.168.100.60:3000',
  // REACT_APP_DEV_MODE: 'http://localhost:3000',
  REACT_APP_DEV_MODE: 'https://stg-cuppa.toyyibfnb.com/api',
  REACT_APP_PROD_MODE: 'https://api-prod.application.com',
};

export const socmed = {
  website: 'https://malayagrill.com.my',
  facebook: 'https://www.facebook.com/malayagrill',
  instagram: 'https://www.instagram.com/malayagrillofficial',
  twitter: 'https://twitter.com/malayagrill',
  tiktok: 'https://www.tiktok.com/search?q=MALAYAGRILL',
  snapchat: '',
};

export const container = {
  width: Dimensions.get('screen').width,
  height: Dimensions.get('screen').height,
};

export const boxShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.25,
  shadowRadius: 1.8,
  elevation: 2,
  zIndex: 999999,
};

export const fonts = {
  light: 'Montserrat-Light',
  medium: 'Montserrat-Medium',
  regular: 'Montserrat-Regular',
  semibold: 'Montserrat-SemiBold',
  bold: 'Montserrat-Bold',
};

export const MG_CATEGORY_MENU = [
  'Nasi Arab Ayam',
  'Nasi Arab Kambing',
  'Nasi Arab Shank',
  'The King Of Lamb',
  'The King Of Chicken',
];



