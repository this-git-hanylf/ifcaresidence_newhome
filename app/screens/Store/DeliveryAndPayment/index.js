import {
  Button,
  CheckBox,
  Header,
  Icon,
  SafeAreaView,
  Text,
  TextInput,
} from '@components';
import {BaseColor, BaseStyle, useTheme} from '@config';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import styles from './styles';
import {Picker} from '@react-native-picker/picker';
import {useSelector, useDispatch} from 'react-redux';
import getUser from '../../../selectors/UserSelectors';
import getProject from '../../../selectors/ProjectSelector';
import axios from 'axios';
import ModalDropdown_lotno from '@components/ModalDropdown_lotno';
import ModalDropdown_ListPayment from '../../../components/ModalDropdown_ListPayment';
import ModalDropdown_debtor from '../../../components/ModalDropdown_debtor';
import Modal from 'react-native-modal';

import {Divider} from 'react-native-paper';

export default function DeliveryAndPayment({route, navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [dataParams, setDataParams] = useState(route.params);
  const [dataParamsTransaction, setDataParamsTransaction] = useState(
    route.params.datadetail,
  );
  // console.log('data params', dataParams);

  const [refreshing, setRefreshing] = useState(false);
  const [spinner, setSpinner] = useState(true);

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postCode, setPostCode] = useState('');
  const [country, setCountry] = useState('');
  const [contactName, setContactName] = useState('');

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('home'); // home or office
  const [hasError, setErrors] = useState(false);
  const user = useSelector(state => getUser(state));
  // console.log('user cek debtor', user);

  const project = useSelector(state => getProject(state));

  const [email, setEmail] = useState(user != null ? user.user : '');

  const [lotNo, setLotno] = useState([]);
  const [entity_cd, setEntity] = useState(project.Data[0].entity_cd);
  const [project_no, setProjectNo] = useState(project.Data[0].project_no);
  const [default_text_lotno, setDefaultLotno] = useState(true);
  const [text_lotno, setTextLotno] = useState('');

  const [listPayment, setListPayment] = useState([]);
  const [textPayment, setTextPayment] = useState('');
  const [trxCode, setTrxCode] = useState('');

  const [amountPaid, setAmountPaid] = useState('');
  const [balancetoPay, setBalancetoPay] = useState('');

  const [debtor, setDebtor] = useState('');
  const [dataDebtor, setDataDebtor] = useState([]);
  const [textDebtor, settextDebtor] = useState('');
  const [textNameDebtor, settextNameDebtor] = useState('');
  const [defaultDebtor, setDefaultDebtor] = useState(false);

  const [showAlertMinusPayment, setShowAlertMinusPayment] = useState(false);

  const [modalSuccessPayment, setModalSuccessPayment] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');

  const [success] = useState({
    street: true,
    city: true,
    postCode: true,
    country: true,
    contactName: true,
    email: true,
    phone: true,
    amountPaid: true,
    balancetoPay: true,
  });

  useEffect(() => {
    getLotNo();
    getListPayment();
    getDebtor();
  }, []);

  const totalTax = dataParamsTransaction.reduce(
    (total, currentItem) =>
      (total = total + currentItem.count_tax_rate_per_item),
    0,
  );

  const totalHarga = dataParamsTransaction.reduce(
    (total, currentItem) => (total = total + currentItem.totalHarga),
    0,
  );

  const totalHargadenganTax = dataParamsTransaction.reduce(
    (total, currentItem) => (total = total + currentItem.total_harga_with_tax),
    0,
  );

  /**
   *
   * Called when process checkout
   */

  async function getLotNo() {
    console.log(
      'url api lotno',
      'http://34.87.121.155:2121/apiwebpbi/api/facility/book/unit?entity=' +
        entity_cd +
        '&' +
        'project=' +
        project_no +
        '&' +
        'email=' +
        email,
    );
    try {
      const res = await axios.get(
        `http://34.87.121.155:2121/apiwebpbi/api/facility/book/unit?entity=` +
          entity_cd +
          '&' +
          'project=' +
          project_no +
          '&' +
          'email=' +
          email,
      );
      const resLotno = res.data.data;
      console.log('reslotno', resLotno);

      setLotno(resLotno);

      if (default_text_lotno == true) {
        setTextLotno(resLotno[0]);
      }

      setSpinner(false);
    } catch (error) {
      setErrors(error);
      // alert(hasError.toString());
    }
  }

  async function getListPayment() {
    console.log(
      'url api lotno',
      'http://34.87.121.155:2121/apiwebpbi/api/pos/getPayment?entity_cd=' +
        entity_cd +
        '&' +
        'project_no=' +
        project_no,
    );
    try {
      const res = await axios.get(
        `http://34.87.121.155:2121/apiwebpbi/api/pos/getPayment?entity_cd=` +
          entity_cd +
          '&' +
          'project_no=' +
          project_no,
      );
      const resPayment = res.data.Data;
      resPayment.push({trx_code: 'others', descs: 'Others'});

      console.log('listpayment', resPayment);

      setListPayment(resPayment);

      setSpinner(false);
    } catch (error) {
      setErrors(error);
      // alert(hasError.toString());
    }
  }

  const chooseListPayment = ({data, index}) => {
    console.log('data list choose', data);
    console.log('index list choose', index);

    setTextPayment(index.descs);
    setTrxCode(index.trx_code);
  };

  //-----FOR GET DEBTOR
  const getDebtor = async data => {
    // console.log(object)
    console.log('data for debtor', data);

    const params =
      '?' +
      'entity_cd=' +
      entity_cd +
      '&' +
      'project_no=' +
      project_no +
      '&' +
      'email=' +
      email;

    console.log(
      'api debtor',
      'http://34.87.121.155:2121/apiwebpbi/api/csentry-getDebtor' + params,
    );

    console.log('data for', params);

    const config = {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        token: '',
      },
    };
    await axios
      .post(
        'http://34.87.121.155:2121/apiwebpbi/api/csentry-getDebtor' + params,
        {
          config,
        },
      )
      .then(res => {
        // console.log('res', res);
        const datas = res.data;
        const dataDebtors = datas.Data;
        console.log('res debtor', dataDebtors);
        console.log('ada berapa length debtor', dataDebtors.length);

        if (dataDebtors.length > 1) {
          setDefaultDebtor(false);
        } else {
          setDefaultDebtor(true);

          setDebtor(dataDebtors[0].debtor_acct);

          settextDebtor(
            dataDebtors[0].debtor_acct + ' - ' + dataDebtors[0].name,
          );
          settextNameDebtor(dataDebtors[0].name);

          setSpinner(false);
          // console.log('params for debtor tower default', params);
          // getDebtor(params);
        }

        setDataDebtor(dataDebtors);

        // return res.data;
      })
      .catch(error => {
        console.log('error get debtor api', error);
        // alert('error get');
      });
  };

  const handleChangeModal = ({data, index}) => {
    console.log('index,', index);
    // console.log('data chjange', data);
    // data.data.map(dat => {
    //   console.log('data for text debtor', dat);
    //   if (dat) {

    setDebtor(index.debtor_acct);
    // setTenantNo(index.tenant_no);
    settextDebtor(index.debtor_acct + ' - ' + index.name);
    settextNameDebtor(index.name);
    // getLot('', index.tenant_no);
    //   }
    // });
    setSpinner(false);
  };

  const changeBalancePay = items => {
    console.log('items amount paid', items);
    setAmountPaid(items);

    const balance = items - totalHargadenganTax;

    // const fixBalance = balance > 0 ? balance : 0;
    const fixBalance = balance > 0 ? balance : balance;

    // const showAlertMinusPayment = totalHargadenganTax > items ? false : true;

    console.log('kembalian', balance);
    // setShowAlertMinusPayment(showAlertMinusPayment);
    setBalancetoPay(fixBalance);
  };

  const onCloseModal = () => {
    setShowAlertMinusPayment(false);
  };

  const onCloseAlertPayment = () => {
    setModalSuccessPayment(false);
    navigation.navigate('Store');
  };

  const onCheckOut = () => {
    // const fixBalance = balance ;
    console.log('balance to pay = 0', balancetoPay);

    // check if number is greater than 0
    if (balancetoPay > 0) {
      setShowAlertMinusPayment(false);
    }

    // check if number is 0
    else if (balancetoPay == 0) {
      setShowAlertMinusPayment(false);
    }

    // if number is less than 0
    else {
      setShowAlertMinusPayment(true);
    }

    const formData = {
      entity_cd: dataParams.entity_cd, // udah dijelasin di sebelumnya ka
      project_no: dataParams.project_no, // udah dijelasin di sebelumnya ka
      facility_type: dataParams.facility_type, // udah dijelasin di sebelumnya ka
      member_id: dataParams.member_id, // udah dijelasin di sebelumnya ka
      member_name: dataParams.member_name, // udah dijelasin di sebelumnya ka
      payment_trx_code: trxCode, // ambil dari payment code ketika choose payment type
      payment_trx_descs: textPayment, // ambil dari payment descs ketika choose payment type
      debtor_acct: dataParams.tenant_no, // dapet dari choose member_id di screen index.js choose member id
      lot_no: text_lotno.lot_no, //
      audit_user: dataParams.audit_user, // udah dijelasin di sebelumnya ka
      cash: amountPaid == '' ? 0 : amountPaid, // ini tuh nominal kita bayar berapa ka
      return: balancetoPay == '' ? 0 : balancetoPay, // ini nominal kembaliannya
      datadetail: dataParams.datadetail, // udah dijelasin di sebelumnya ka
    };
    console.log('form data payment', formData);

    axios
      .post(
        'http://34.87.121.155:2121/apiwebpbi/api/pos/save/order_payment',
        formData,
      )
      .then(res => {
        if (res.data.Error == false) {
          setModalSuccessPayment(true);
          setMessageAlert(res.data.Pesan);
          // alert(res.data.Pesan);
        } else {
          setModalSuccessPayment(true);
          setMessageAlert(res.data.Pesan);
          // alert(res.data.Pesan);
        }
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        style={{flex: 1}}>
        <Header
          title={t('Delivery And Payment')}
          renderLeft={() => {
            return (
              <Icon
                name="angle-left"
                size={20}
                color={colors.text}
                enableRTL={true}
              />
            );
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        <ScrollView
          contentContainerStyle={{paddingHorizontal: 20, paddingTop: 20}}>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View
              style={{
                flex: 3,
                paddingTop: 10,
              }}>
              <Text style={{fontSize: 14}}>Delivery To : </Text>
            </View>
            <View style={[styles.inputItem]}>
              <ModalDropdown_lotno
                // label="Unit"
                data={lotNo}
                onChange={(itemValue, itemIndex) => setTextLotno(itemValue)}
                value={text_lotno.lot_no}
                icon={
                  <Icon
                    name="chevron-down"
                    size={12}
                    solid
                    color={BaseColor.grayColor}
                  />
                }
              />
            </View>
          </View>

          <ModalDropdown_debtor
            label="Debtor"
            data={dataDebtor}
            onChange={index => handleChangeModal({data: dataDebtor, index})}
            value={textDebtor}
            style={{marginBottom: 0, paddingBottom: 0}}
          />

          <Divider style={{marginVertical: 10}} />

          {/* ------- ITEMS CHECKOUT HERE ------- */}
          <View>
            {/* <Text>Items Checkout</Text> */}

            <View>
              <FlatList
                // contentContainerStyle={{ paddingVertical: 12 }}
                showsHorizontalScrollIndicator={true}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                    refreshing={refreshing}
                    onRefresh={() => {}}
                  />
                }
                data={dataParamsTransaction}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <View style={[styles.contain]} activeOpacity={0.9}>
                    <TouchableOpacity>
                      <ImageBackground
                        // source={image}
                        source={require('@assets/images/logo.png')}
                        style={styles.imageBackgroundCard1}
                        imageStyle={{borderRadius: 8}}
                      />
                    </TouchableOpacity>
                    <View style={{flex: 1, paddingVertical: 4}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          paddingHorizontal: 10,
                          flex: 1,
                        }}>
                        <View style={{flex: 1, paddingBottom: 4}}>
                          <View style={{flex: 1}}>
                            <View>
                              <Text semibold style={{fontSize: 16}}>
                                {item.trx_descs}
                              </Text>
                            </View>
                            <View>
                              <Text semibold style={{fontSize: 16}}>
                                {item.trx_qty} x {item.unit_price}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View>
                          <View>
                            <Text semibold style={{fontSize: 16}}>
                              {item.totalHarga}
                            </Text>
                          </View>
                        </View>
                        {/* <Text>{CurrentValue}</Text> */}
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
          {/* ------- CLOSE ITEMS CHECKOUT HERE ------- */}

          <Divider style={{marginVertical: 10}} />

          {/* ------- SUM TOTAL HERE -------- */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                alignSelf: 'flex-start',
                width: 150,
              }}>
              <Text
                style={{
                  fontSize: 16,

                  alignSelf: 'flex-start',
                }}>
                Total After Disc
              </Text>
            </View>
            <View style={{justifyContent: 'flex-end', width: 80}}>
              <Text semibold style={{fontSize: 16, alignSelf: 'flex-end'}}>
                {totalHarga}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <View
              style={{
                alignSelf: 'flex-start',
                width: 150,
              }}>
              <Text
                style={{
                  fontSize: 16,

                  alignSelf: 'flex-start',
                }}>
                Total Tax
              </Text>
            </View>
            <View style={{justifyContent: 'flex-end', width: 80}}>
              <Text semibold style={{fontSize: 16, alignSelf: 'flex-end'}}>
                {totalTax}
              </Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <View
              style={{
                // justifyContent: 'flex-start',
                alignSelf: 'flex-start',
                // paddingHorizontal: 20,

                width: 150,
              }}>
              <Text
                style={{
                  fontSize: 16,

                  alignSelf: 'flex-start',
                }}>
                Total
              </Text>
            </View>
            <View style={{justifyContent: 'flex-end', width: 80}}>
              <Text semibold style={{fontSize: 16, alignSelf: 'flex-end'}}>
                {totalHargadenganTax}
              </Text>
            </View>
          </View>
          {/* ------- CLOSE SUM TOTAL HERE -------- */}

          <Divider style={{marginVertical: 10}} />

          {/* ----- PAYMENT TYPE HERE ----- */}
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View
              style={{
                flex: 3,
                paddingTop: 10,
              }}>
              <Text style={{fontSize: 14}}>Payment Type : </Text>
            </View>
            <View style={[styles.inputItem]}>
              <ModalDropdown_ListPayment
                // label="Unit"
                data={listPayment}
                // onChange={(itemValue, itemIndex) =>
                //   setTextPayment(itemValue.trx_code)
                // }
                placeholder={'halo'}
                onChange={index =>
                  chooseListPayment({data: listPayment, index})
                }
                value={textPayment}
                icon={
                  <Icon
                    name="chevron-down"
                    size={12}
                    solid
                    color={BaseColor.grayColor}
                  />
                }
              />
            </View>
          </View>
          {/* ----- CLOSE PAYMENT TYPE HERE ----- */}

          {/* ------ AMOUNT PAID HERE ----- */}
          {textPayment.includes('CASH') ? (
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{flex: 3.5}}>
                <Text>Amount Paid</Text>

                <TextInput
                  // onChangeText={text => setAmountPaid(text)}
                  onChangeText={text => changeBalancePay(text)}
                  keyboardType="numeric"
                  placeholder={t('Amount Paid')}
                  // success={success.amountPaid}
                  value={amountPaid}
                />
              </View>
              <View style={styles.inputItem}>
                <Text>Balance to Pay</Text>
                <TextInput
                  // onChangeText={text => setBalancetoPay(text)}
                  // onChangeText={balancetoPay}
                  editable={false}
                  keyboardType="numeric"
                  placeholder={t('Balance to Pay')}
                  // success={success.postCode}
                  value={
                    balancetoPay.toString() <= '0'
                      ? '0'
                      : balancetoPay.toString()
                  }
                  // defaultValue={balancetoPay.toString()}
                />
                {/* <Text>{balancetoPay}</Text> */}
              </View>
            </View>
          ) : null}
          {/* ------ CLOSE AMOUNT PAID HERE ----- */}
        </ScrollView>

        {/* ---- BUTTON PAYMENT HERE ---- */}
        <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <Button
            loading={loading}
            full
            onPress={() => {
              onCheckOut();
            }}>
            {t('payment')}
          </Button>
        </View>
        {/* ---- CLOSE BUTTON PAYMENT HERE ---- */}
      </KeyboardAvoidingView>

      {/* ----- MODAL ALERT UNTUK BALANCE PAYMENT ----- */}
      <View>
        <Modal
          isVisible={showAlertMinusPayment}
          style={{height: '100%'}}
          onBackdropPress={() => onCloseModal()}>
          <View
            style={{
              // flex: 1,

              // alignContent: 'center',
              padding: 10,
              backgroundColor: '#fff',
              // height: ,
              borderRadius: 8,
            }}>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: colors.primary,
                  marginBottom: 10,
                }}>
                {'Alert'}
              </Text>
              <Text>Payment is Less than the Total Price</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <Button
                style={{
                  marginTop: 10,
                  // marginBottom: 10,

                  width: 70,
                  height: 40,
                }}
                onPress={() => onCloseModal()}>
                <Text style={{fontSize: 13, color: colors.whiteColor}}>
                  {t('OK')}
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
      {/* -----CLOSE MODAL ALERT UNTUK BALANCE PAYMENT ----- */}

      {/* ---- MODAL ALERT UNTUK SUKSES PAYMENT ---- */}
      <View>
        <Modal
          isVisible={modalSuccessPayment}
          style={{height: '100%'}}
          onBackdropPress={() => onCloseAlertPayment()}>
          <View
            style={{
              // flex: 1,

              // alignContent: 'center',
              padding: 10,
              backgroundColor: '#fff',
              // height: ,
              borderRadius: 8,
            }}>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: colors.primary,
                  marginBottom: 10,
                }}>
                {messageAlert.includes('success') ? 'Success' : 'Failed'}
              </Text>
              <Text>{messageAlert}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <Button
                style={{
                  marginTop: 10,
                  // marginBottom: 10,

                  width: 70,
                  height: 40,
                }}
                onPress={() => onCloseAlertPayment()}>
                <Text style={{fontSize: 13, color: colors.whiteColor}}>
                  {t('OK')}
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
      {/* ---- CLOSE MODAL ALERT UNTUK SUKSES PAYMENT ---- */}
    </SafeAreaView>
  );
}
