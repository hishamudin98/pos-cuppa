//import liraries
import React, {Component, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

// create a component
const QrScan = () => {
  const [dataScan, setDataScan] = useState('');

  const onSuccess = async e => {
    setDataScan(e.data);
    // console.log(e.data);
    // alert(e.data);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>{dataScan}</Text>
        <Text style={styles.text}>Scan QR Code</Text>
      </View>
      <View style={{width: 20}}>
        <QRCodeScanner
          // reactivate={true}
          onRead={read => onSuccess(read)}
          flashMode={RNCamera.Constants.FlashMode.torch}
          topContent={
            <Text style={styles.centerText}>
              Go to{' '}
              <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
              your computer and scan the QR code.
            </Text>
          }
          bottomContent={
            <TouchableOpacity style={styles.buttonTouchable}>
              <Text style={styles.buttonText}>OK. Got it!</Text>
            </TouchableOpacity>
          }
        />
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

//make this component available to the app
export default QrScan;
