import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {BluetoothEscposPrinter} from 'react-native-bluetooth-escpos-printer';
import {cuppaLogo} from '../assets/logo/logo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const Receipt = () => {
  const _printReceipt = async () => {
    let fetchStaff = await AsyncStorage.getItem('STAFF');
    let staffParsed = JSON.parse(fetchStaff);

    let fetchOrder = await AsyncStorage.getItem('RESP_PAYMENT');
    let orderParsed = JSON.parse(fetchOrder);

    let menuOrder = JSON.parse(orderParsed.dataOrder[0].order_detail);
    console.log('menuOrder', menuOrder);

    console.log('orderParsed', orderParsed);
    let menu_variant = menuOrder[0].menu_variant;

    console.log('menu_variant', menu_variant);

    let isVariant = '';
    let arrVariant = [];
    let textVariant = '';

    if (menu_variant !== undefined) {
      for (
        let variant = 0;
        variant < menu_variant.length;
        variant++
      ) {
        if (menu_variant.length > 1) {
          menu_variant.length == variant + 1
            ? (isVariant = menu_variant[variant].name + ')')
            : (isVariant =
                '(' + menu_variant[variant].name + ', ');
          arrVariant.push(isVariant);
        } else {
          isVariant = '(' + menu_variant[variant].name + ')';
          arrVariant.push(isVariant);
        }
      }
    }

    for (let i = 0; i < arrVariant.length; i++) {
      textVariant = textVariant + arrVariant[i];
    }

    let paymentMethod =
      orderParsed.dataPayment[0].payment_method == 1
        ? 'Cash'
        : orderParsed.dataPayment[0].payment_method == 2
        ? 'FPX'
        : orderParsed.dataPayment[0].payment_method == 3
        ? 'Credit/Debit Card'
        : 'QR Payment';

    let columnWidths = [4, 17, 12];
    try {
      //   await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.printPic(cuppaLogo, {
        width: 150,
        left: 110,
      });
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.printText('\r\n', {});

      await BluetoothEscposPrinter.printText('Cuppa 365 Coffee', {
        widthtimes: 1,
      });

      await BluetoothEscposPrinter.printText('\r\n', {});

      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['Kolej Universiti Islam'],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['Antarabangsa Selangor'],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['KUIS Persiaran Putra,'],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['Bandar Seri Putra,'],
        {},
      );

      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['43000 Kajang, Selangor'],
        {},
      );

      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['012-3234312'],
        {},
      );

      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['(SST ID : B15-2018-1012312)'],
        {},
      );

      await BluetoothEscposPrinter.printText('\r\n', {});

      await BluetoothEscposPrinter.printText('INVOICE', {
        widthtimes: 1,
      });

      await BluetoothEscposPrinter.printText('\r\n\r\n', {});

      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        [orderParsed.dataOrder[0].order_customerName],
        {},
      );

      //   await BluetoothEscposPrinter.printText('#Hisham', {
      //     widthtimes: 1,
      //   });

      //   await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText('\r\n\r\n', {});

      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        [
          'Date : ' +
            moment(orderParsed.dataPayment[0].transaction_datetime).format(
              'DD-MM-YYYY HH:mm:ss',
            ),
        ],
        {},
      );

      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        ['Rec.No: ' + orderParsed.dataPayment[0].transaction_invoiceNo],
        {},
      );

      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        ['Cashier : ' + staffParsed.staffName],
        {},
      );

      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        ['Counter : ' + orderParsed.dataOrder[0].counter_name],
        {},
      );

      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        ['Payment : ' + paymentMethod],
        {},
      );

      await BluetoothEscposPrinter.printText('\r\n', {});

      await BluetoothEscposPrinter.printText(
        '===============================',
        {},
      );
      await BluetoothEscposPrinter.printText('\n\r', {});

      await menuOrder.map((item, index) => {
        
        BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            item.menu_quantity + 'x',
            item.menu_name + " " + textVariant,
            (item.menu_quantity * item.menu_price).toFixed(2),
          ],
          {},
        );
      });

      await BluetoothEscposPrinter.printText(
        '===============================',
        {},
      );
      await BluetoothEscposPrinter.printText('\n\r', {});

      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Subtotal  ' + orderParsed.dataOrder[0].order_amount.toFixed(2)],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Discount  ' + orderParsed.dataOrder[0].order_discount.toFixed(2)],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.RIGHT],
        ['SST 6%  ' + orderParsed.dataOrder[0].order_tax.toFixed(2)],
        {},
      );

      await BluetoothEscposPrinter.printText(
        '===============================',
        {},
      );
      await BluetoothEscposPrinter.printText('\n\r', {});

      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Total  ' + orderParsed.dataOrder[0].order_totalAmount.toFixed(2)],
        {},
      );

      await BluetoothEscposPrinter.printText('\n\r\n\r', {});

      await BluetoothEscposPrinter.printText('THANK YOU', {
        widthtimes: 1,
      });

      await BluetoothEscposPrinter.printText('\n\r\n\r', {});

      // await BluetoothEscposPrinter.printColumn(
      //   [24, 24],
      //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      //   ['Customer', 'Tester'],
      //   {},
      // );
      //   await BluetoothEscposPrinter.printColumn(
      //     [24, 24],
      //     [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      //     ['Tax', '6%'],
      //     {},
      //   );
      //   await BluetoothEscposPrinter.printColumn(
      //     [24, 24],
      //     [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      //     ['Delivery', 'Take Away'],
      //     {},
      //   );
      //   await BluetoothEscposPrinter.printText(
      //     '================================================',
      //     {},
      //   );
      //   await BluetoothEscposPrinter.printText('Products\r\n', { widthtimes: 1 });
      //   await BluetoothEscposPrinter.printText(
      //     '================================================',
      //     {},
      //   );
      //   await BluetoothEscposPrinter.printColumn(
      //     columnWidths,
      //     [
      //       BluetoothEscposPrinter.ALIGN.LEFT,
      //       BluetoothEscposPrinter.ALIGN.LEFT,
      //       BluetoothEscposPrinter.ALIGN.RIGHT,
      //     ],
      //     ['1x', 'Green Tea', 'RM 13.00'],
      //     {},
      //   );
      //   await BluetoothEscposPrinter.printColumn(
      //     columnWidths,
      //     [
      //       BluetoothEscposPrinter.ALIGN.LEFT,
      //       BluetoothEscposPrinter.ALIGN.LEFT,
      //       BluetoothEscposPrinter.ALIGN.RIGHT,
      //     ],
      //     ['1x', 'Green Tea', 'RM 13.00'],

      //     {},
      //   );
      //   await BluetoothEscposPrinter.printColumn(
      //     columnWidths,
      //     [
      //       BluetoothEscposPrinter.ALIGN.LEFT,
      //       BluetoothEscposPrinter.ALIGN.LEFT,
      //       BluetoothEscposPrinter.ALIGN.RIGHT,
      //     ],
      //     ['1x', 'Green Tea', 'RM 13.00'],

      //     {},
      //   );
      //   await BluetoothEscposPrinter.printText(
      //     '================================================',
      //     {},
      //   );
      //   await BluetoothEscposPrinter.printColumn(
      //     [24, 24],
      //     [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      //     ['Subtotal', 'RM 39.00'],
      //     {},
      //   );
      //   await BluetoothEscposPrinter.printColumn(
      //     [24, 24],
      //     [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      //     ['Tax', 'RM 0.00'],
      //     {},
      //   );
      //   await BluetoothEscposPrinter.printColumn(
      //     [24, 24],
      //     [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      //     ['Delivery', 'RM 0.00'],
      //     {},
      //   );
      //   await BluetoothEscposPrinter.printText(
      //     '================================================',
      //     {},
      //   );
      //   await BluetoothEscposPrinter.printColumn(
      //     [24, 24],
      //     [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      //     ['Total', 'RM 0.00'],
      //     {},
      //   );
      //   await BluetoothEscposPrinter.printText('\r\n\r\n', {});
      //   await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      //   await BluetoothEscposPrinter.printQRCode(
      //     'DP0837849839',
      //     280,
      //     BluetoothEscposPrinter.ERROR_CORRECTION.L,
      //   );
      //   await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      //   await BluetoothEscposPrinter.printColumn(
      //     [48],
      //     [BluetoothEscposPrinter.ALIGN.CENTER],
      //     ['DP0837849839'],
      //     { widthtimes: 2 },
      //   );
      //   await BluetoothEscposPrinter.printText(
      //     '================================================',
      //     {},
      //   );
      //   await BluetoothEscposPrinter.printColumn(
      //     [48],
      //     [BluetoothEscposPrinter.ALIGN.CENTER],
      //     ['Jumaat, 10 January 2022 - 09:00 AM'],
      //     {},
      //   );
      //   await BluetoothEscposPrinter.printText(
      //     '================================================',
      //     {},
      //   );
      await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
      //   await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
    } catch (e) {
      alert(e.message || 'ERROR');
    }
  };

  return (
    <View>
      {/* <Text>Sample Print Instruction</Text> */}
      {/* <View style={styles.btn}>
        <Button
          onPress={async () => {
            await BluetoothEscposPrinter.printBarCode(
              '123456789012',
              BluetoothEscposPrinter.BARCODETYPE.JAN13,
              3,
              120,
              0,
              2,
            );
            await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
          }}
          title="Print BarCode"
        />
      </View> */}
      {/* <View style={styles.btn}>
        <Button
          onPress={async () => {
            await BluetoothEscposPrinter.printQRCode(
              'https://hsd.co.id',
              280,
              BluetoothEscposPrinter.ERROR_CORRECTION.L,
            ); //.then(()=>{alert('done')},(err)=>{alert(err)});
            await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
          }}
          title="Print QRCode"
        />
      </View> */}

      {/* <View style={styles.btn}>
        <Button
          onPress={async () => {
            await BluetoothEscposPrinter.printerUnderLine(10);
            await BluetoothEscposPrinter.printText('Prawito Hudoro\r\n', {
              encoding: 'GBK',
              codepage: 0,
              widthtimes: 0,
              heigthtimes: 0,
              fonttype: 1,
            });
            await BluetoothEscposPrinter.printerUnderLine(0);
            await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
          }}
          title="Print UnderLine"
        />
      </View> */}

      <View style={styles.btn}>
        <Button
          title="Print Test"
          onPress={async () => {
            _printReceipt();
          }}
        />
      </View>
    </View>
  );
};

export default Receipt;

const styles = StyleSheet.create({
  btn: {
    marginBottom: 8,
  },
});
