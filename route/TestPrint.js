import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import ItemList from '../ItemList';
// import SamplePrint from '../SamplePrint';
import Receipt from './Receipt';
import { cuppaLogo } from '../assets/logo';

// import { styles } from '../styles';

const TestPrint = () => {
  const [pairedDevices, setPairedDevices] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [boundAddress, setBoundAddress] = useState('');

  useEffect(() => {
    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        setBleOpend(Boolean(enabled));
        setLoading(false);
      },
      err => {
        err;
      },
    );

    if (Platform.OS === 'ios') {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, rsp => {
        deviceAlreadPaired(rsp);
      });
      bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, rsp => {
        deviceFoundEvent(rsp);
      });
      bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
        setName('');
        setBoundAddress('');
      });
    } else if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, rsp => {
        deviceAlreadPaired(rsp);
      });
      DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, rsp => {
        deviceFoundEvent(rsp);
      });
      DeviceEventEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
        setName('');
        setBoundAddress('');
      });
      DeviceEventEmitter.addListener(BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, () => {
        ToastAndroid.show('Device Not Support Bluetooth !', ToastAndroid.LONG);
      });
    }
    if (pairedDevices.length < 1) {
      scan();
    }
  }, [boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan]);

  const deviceAlreadPaired = useCallback(
    rsp => {
        console.log('rsp 444: ', rsp);
      var ds = null;
      if (typeof rsp.devices === 'object') {
        ds = rsp.devices;
        console.log('ds : ',ds);
      } else {
        try {
            console.log('rsp12 :', rsp);
          ds = JSON.parse(rsp.devices);
        } catch (e) {
            console.log('e12 : ', e);
        }
      }
      console.log('ds12 : ', ds);
      if (ds && ds.length) {
        let pared = pairedDevices;
        if (pared.length < 1) {
          pared = pared.concat(ds || []);
        }
        setPairedDevices(pared);
      }
    },
    [pairedDevices],
  );

  const deviceFoundEvent = useCallback(
    rsp => {
      var r = null;
      try {
        if (typeof rsp.device === 'object') {
            console.log('rsp: ',rsp);
          r = rsp.device;
        } else {
          r = JSON.parse(rsp.device);
        }
      } catch (e) {
        // ignore error
        console.log('e : ', e);
      }

      if (r) {
        let found = foundDs || [];
        console.log('found 12: ', found);
        console.log('r : ', r);
        if (found.findIndex) {
          let duplicated = found.findIndex(function (x) {
            return x.address == r.address;
          });

          console.log('duplicated : ', duplicated);
          if (duplicated == -1) {
            found.push(r);
            // console.log('found 12: ', found);
            setFoundDs(found);
          }
        }
      }
    },
    [foundDs],
  );

  const connect = row => {
    setLoading(true);
    console.log('row : ', row);
    BluetoothManager.connect(row.address).then(
      s => {
        console.log('connect : ', s);
        setLoading(false);
        setBoundAddress(row.address);
        setName(row.name || 'UNKNOWN');
      },
      e => {
        setLoading(false);
        alert(e);
      },
    );
  };

  const unPair = address => {
    setLoading(true);
    BluetoothManager.unpaire(address).then(
      s => {
        setLoading(false);
        setBoundAddress('');
        setName('');
      },
      e => {
        setLoading(false);
        alert(e);
      },
    );
  };

  const scanDevices = useCallback(() => {
    setLoading(true);
    BluetoothManager.scanDevices().then(
      s => {
        // const pairedDevices = s.paired;
        console.log('scanDevices : ', s);
        let aa = JSON.parse(s);
        // console.log('found : ', aa.found);
        var found = aa.found;

        // console.log('found : ', found);
        try {

          found = found; //@FIX_it: the parse action too weired..
        } catch (e) {
          //ignore
        //   console.log(e);
        }
        var fds = foundDs;
        if (found && found.length) {
          fds = found;
        }

        console.log('fds : ', fds);
        setFoundDs(fds);
        setAllDevices(fds);
        setLoading(false);
      },
      er => {
        setLoading(false);
        // ignore
      },
    );
  }, [foundDs]);

  const scan = useCallback(() => {
    try {
      async function blueTooth() {
        const permissions = {
          title: 'HSD bluetooth meminta izin untuk mengakses bluetooth',
          message: 'HSD bluetooth memerlukan akses ke bluetooth untuk proses koneksi ke bluetooth printer',
          buttonNeutral: 'Lain Waktu',
          buttonNegative: 'Tidak',
          buttonPositive: 'Boleh',
        };

        const bluetoothConnectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          permissions,
        );
        if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
          const bluetoothScanGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            permissions,
          );
          if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
            scanDevices();
            console.log('haiiii');
          }
        } else {
          // ignore akses ditolak
        }
      }
      blueTooth();
    } catch (err) {
      console.warn(err);
    }
  }, [scanDevices]);

  return (
      <ScrollView style={styles.container}>
        <View style={styles.bluetoothStatusContainer}>
          <Text style={styles.bluetoothStatus(bleOpend ? '#47BF34' : '#A8A9AA')}>
            Bluetooth {bleOpend ? 'Active' : 'Non Active'}
          </Text>
        </View>
        {!bleOpend && <Text style={styles.bluetoothInfo}>Mohon aktifkan bluetooth anda</Text>}
        <Text style={styles.sectionTitle}>Connected Printer:</Text>
        
        {boundAddress.length > 0 && (
          <ItemList
            label={name}
            value={boundAddress}
            onPress={() => unPair(boundAddress)}
            actionText="Disconnect"
            color="#E9493F"
          />
        )}
        {boundAddress.length < 1 && (
          <Text style={styles.printerInfo}>No connected device</Text>
        )}
        <Text style={styles.sectionTitle}>List Bluetooth Device :</Text>
        {loading ? <ActivityIndicator animating={true} /> : null}
        <View style={styles.containerList}>
          {allDevices.map((item, index) => {
            return (
              <ItemList
                key={index}
                onPress={() => connect(item)}
                label={item.name}
                value={item.address}
                connected={item.address === boundAddress}
                actionText="Connect"
                color="#00BCD4"
              />
            );
          })}
        </View>
        <Receipt />
        <View style={{height: 100}} />
      </ScrollView>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 40,
      paddingHorizontal: 20,
    },
    containerList: { flex: 1, flexDirection: 'column' },
    bluetoothStatusContainer: { justifyContent: 'flex-end', alignSelf: 'flex-end' },
    bluetoothStatus: color => ({
      backgroundColor: color,
      padding: 8,
      borderRadius: 2,
      color: 'white',
      paddingHorizontal: 14,
      marginBottom: 20,
    }),
    bluetoothInfo: { textAlign: 'center', fontSize: 16, color: '#FFC806', marginBottom: 20 },
    sectionTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 12 },
    printerInfo: { textAlign: 'center', fontSize: 16, color: '#E9493F', marginBottom: 20 },
  });

export default TestPrint;