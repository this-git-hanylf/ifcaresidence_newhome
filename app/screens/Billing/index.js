import {
  CardReport03,
  CardReport08,
  CardReport07,
  ProfileGridSmall,
  SafeAreaView,
  Text,
  Header,
  Transaction2Col,
  Icon,
  Tag,
  Price3Col,
  ListTransactionExpand,
  Button,
} from '@components';
import {BaseStyle, useTheme} from '@config';
import {FRecentTransactions, FHotNews} from '@data';
import {useNavigation, useRoute} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {enableExperimental} from '@utils';

import moment from 'moment';
import Modal from 'react-native-modal';

import {
  ScrollView,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import HeaderHome from './HeaderHome';
import styles from './styles';
import HeaderCard from './HeaderCard';
import getUser from '../../selectors/UserSelectors';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import numFormat from '../../components/numFormat';
import CurrencyFormatter from '../../components/CurrencyFormatter';
import ModalDropdown_debtor from '@components/ModalDropdown_debtor';

const Billing = ({
  isCenter = false,
  isPrimary = false,
  style = {},
  onPress = () => {},
  disabled = false,
}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(state => getUser(state));
  const [hasError, setErrors] = useState(false);
  const [bill, setBill] = useState([]);
  const [data, setData] = useState([]);
  const [dataCurrent, setDataCurrent] = useState([]);
  console.log('user,', user);

  const [dataTowerUser, setdataTowerUser] = useState([]);
  const [arrDataTowerUser, setArrDataTowerUser] = useState([]);

  const [email, setEmail] = useState(user.user);

  // const [urlApi, seturlApi] = useState(client);
  const [checkedEntity, setCheckedEntity] = useState(false);
  const [dataDebtor, setDataDebtor] = useState([]);
  const [entity, setEntity] = useState('');
  const [project_no, setProjectNo] = useState('');
  const [db_profile, setDb_Profile] = useState('');
  const [spinner, setSpinner] = useState(true);

  const [debtor, setDebtor] = useState('');
  const [textDebtor, settextDebtor] = useState('');
  const [textNameDebtor, settextNameDebtor] = useState('');
  const [loading, setLoading] = useState(true);
  const [tenant_no, setTenantNo] = useState('');
  const [attachment, setAttachment] = useState('');
  const [modalSuccessVisible, showModalSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const TABS = [
    {
      id: 1,
      title: t('Due Date'),
    },
    {
      id: 2,
      title: t('Not Due'),
    },
  ];
  const [tab, setTab] = useState(TABS[0]);

  useEffect(() => {
    const id = route?.params?.id;
    if (id) {
      TABS.forEach(tab => {
        tab.id == id && setTab(tab);
      });
    }
  }, [route?.params?.id]);
  //-----FOR GET ENTITY & PROJJECT
  const getTower = async () => {
    const data = {
      email: email,
      //   email: 'haniyya.ulfah@ifca.co.id',
      app: 'O',
    };

    const config = {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        // token: "",
      },
    };

    await axios
      .get(
        // `http://103.111.204.131/apisysadmin/api/getProject/${data.email}`,
        `http://103.111.204.131/apiwebpbi/api/getData/mysql/${data.email}/${data.app}`,
        {
          config,
        },
      )
      .then(res => {
        const datas = res.data;

        const arrDataTower = datas.Data;
        // let dataArr = {};
        arrDataTower.map(dat => {
          if (dat) {
            console.log('data trower', dat.entity_cd);
            setdataTowerUser(dat);
            setEntity(dat.entity_cd);
            setProjectNo(dat.project_no);
            // const jsonValue = JSON.stringify(dat);
            //   setdataFormHelp(saveStorage);
            // console.log('storage', saveStorage);
            // dataArr.push(jsonValue);
            getDebtor(dat);
          }
        });
        // AsyncStorage.setItem('@DataTower', dataArr);
        setArrDataTowerUser(arrDataTower);

        setSpinner(false);
        // return res.data;
      })
      .catch(error => {
        console.log('error get tower api', error);
        alert('error get');
      });
  };

  const getDebtor = async data => {
    console.log('data for debtor', data);

    const params =
      '?' +
      'entity_cd=' +
      data.entity_cd +
      '&' +
      'project_no=' +
      data.project_no +
      '&' +
      'email=' +
      email;

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
        setDataDebtor(dataDebtors);

        // return res.data;
      })
      .catch(error => {
        console.log('error get tower api', error.response);
        alert('error get');
      });
  };

  useEffect(() => {
    getTower(user);
    setLoading(false);
    // setTimeout(() => {
    //   setLoading(false);
    //   getTower(user);
    //   // setSpinner(false);
    // }, 3000);
  }, []);

  const handleChangeModal = ({data, index}) => {
    console.log('index,', index);

    setDebtor(index.debtor_acct);
    setTenantNo(index.tenant_no);
    settextDebtor(index.debtor_acct + ' - ' + index.name);
    // getAttachment(index);
    setSpinner(false);
  };

  // Make function to call the api
  async function fetchData() {
    try {
      const res = await axios.get(
        `http://34.87.121.155:2121/apiwebpbi/api/getDataDue/IFCAPB/${user.user}`,
      );
      setDataCurrent(res.data.Data);
      console.log('DATA DUE DATE -->', res.data.Data);
    } catch (error) {
      setErrors(error.ressponse.data);
      // alert(hasError.toString());
    }
  }

  // ----- ini gak kepake kan? ga ada yang panggil const sum
  const sum =
    dataCurrent != null
      ? dataCurrent.reduceRight((max, bills) => {
          return (max += parseInt(bills.mbal_amt));
        }, 0)
      : null;
  console.log('sum', sum);

  async function fetchDataCurrent() {
    try {
      const res = await axios.get(
        `http://34.87.121.155:2121/apiwebpbi/api/getDataCurrent/IFCAPB/${user.user}`,
      );
      setData(res.data.Data);
      console.log('data', data);
    } catch (error) {
      setErrors(error.ressponse.data);
      // alert(hasError.toString());
    }
  }

  useEffect(() => {
    fetchData();
    fetchDataCurrent();
  }, []);

  // const getAttachment = async data => {
  //   const entity_cd = entity;
  //   const project = project_no;
  //   const debtor_acct = data.debtor_acct;
  //   setDebtor(debtor_acct);
  //   console.log('entity', entity_cd);
  //   console.log('project', project);
  //   console.log('debtor', debtor_acct);

  //   // console.log('params api attach', 'http://103.111.204.131/apiwebpbi/api/getDataAttach/IFCAPB/${entity_cd}/${project_no}/${debtor_acct}')
  //   try {
  //     const res = await axios.get(
  //       `http://103.111.204.131/apiwebpbi/api/getDataAttach/IFCAPB/${entity_cd}/${project_no}/${debtor_acct}`,
  //     );
  //     console.log('res atatchment billing', res.data.Data);
  //     setAttachment(res.data.Data);
  //   } catch (error) {
  //     console.log('error attach get', error);
  //     setErrors(error);
  //     // alert(hasError.toString());
  //   }
  // };

  // const clickAttach = data => {
  //   console.log('data params attach', data);
  //   if (debtor == '') {
  //     // alert('Please choose debtor first');
  //     setMessage('Please choose debtor first');
  //     showModalSuccess(true);
  //   } else {
  //     if (data == '' || data == null) {
  //       // alert('no pdf here');
  //       setMessage('File Attachment not found for this debtor account.');
  //       showModalSuccess(true);
  //     } else {
  //       console.log('url pdf', data[0].link_url);
  //       const url_attach = data[0].link_url;
  //       openAttachment(url_attach);
  //     }
  //   }
  // };

  // const openAttachment = url_attach => {
  //   navigation.navigate('AttachmentBilling', url_attach);
  // };

  const onCloseModal = () => {
    showModalSuccess(false);
  };

  return (
    <SafeAreaView
      style={[BaseStyle.safeAreaView, {flex: 1}]}
      edges={['right', 'top', 'left']}>
      <Header
        title={t('Billing')}
        renderLeft={() => {
          return (
            <Icon
              name="angle-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {TABS.map((item, index) => (
            <View key={index} style={{flex: 1, paddingHorizontal: 20}}>
              <Tag
                primary
                style={{
                  backgroundColor:
                    tab.id == item.id ? colors.primary : colors.background,
                }}
                onPress={() => {
                  enableExperimental();
                  setTab(item);
                }}>
                <Text
                  body1={tab.id != item.id}
                  light={tab.id != item.id}
                  whiteColor={tab.id == item.id}>
                  {item.title}
                </Text>
              </Tag>
            </View>
          ))}
        </View>
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {tab.id == 1 && dataCurrent != null
            ? dataCurrent.map(item => (
                <ListTransactionExpand
                  onPress={() => navigation.navigate('FHistoryDetail')}
                  key={item.id}
                  tower={item.tower}
                  name={item.name}
                  trx_type={item.trx_type}
                  doc_no={item.doc_no}
                  doc_date={moment(item.doc_date).format('DD MMMM YYYY')}
                  descs={item.descs}
                  due_date={moment(item.due_date).format('DD MMMM YYYY')}
                  mbal_amt={`${numFormat(`${item.mbal_amt}`)}`}
                  lot_no={item.lot_no}
                  debtor_acct={item.debtor_acct}
                  entity_cd={entity}
                  project_no={project_no}
                />
              ))
            : tab.id == 1 && (
                <View
                  style={{
                    flex: 1,
                    // height: '100%',
                    marginTop: '70%',
                    // justifyContent: 'center',
                    // alignContent: 'center',
                    // alignItems: 'center',
                    // alignSelf: 'center',
                  }}>
                  {/* <IconFontisto
                    name="holiday-village"
                    size={40}
                    color={colors.primary}
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}></IconFontisto> */}
                  <Text
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      fontSize: 16,
                      marginTop: 10,
                    }}>
                    Sorry! Data not available.
                  </Text>
                </View>
              )}
        </View>
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {tab.id == 2 && data != null
            ? data.map(item => (
                <ListTransactionExpand
                  onPress={() => navigation.navigate('FHistoryDetail')}
                  key={item.id}
                  tower={item.tower}
                  name={item.name}
                  trx_type={item.trx_type}
                  doc_no={item.doc_no}
                  doc_date={moment(item.doc_date).format('DD MMMM YYYY')}
                  descs={item.descs}
                  due_date={moment(item.due_date).format('DD MMMM YYYY')}
                  mbal_amt={`${numFormat(`${item.mbal_amt}`)}`}
                  lot_no={item.lot_no}
                  debtor_acct={item.debtor_acct}
                  entity_cd={entity}
                  project_no={project_no}
                />
              ))
            : tab.id == 2 && (
                <View
                  style={{
                    flex: 1,
                    // height: '100%',
                    marginTop: '70%',
                    // justifyContent: 'center',
                    // alignContent: 'center',
                    // alignItems: 'center',
                    // alignSelf: 'center',
                  }}>
                  {/* <IconFontisto
                    name="holiday-village"
                    size={40}
                    color={colors.primary}
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}></IconFontisto> */}
                  <Text
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      fontSize: 16,
                      marginTop: 10,
                    }}>
                    Sorry! Data not available.
                  </Text>
                </View>
              )}
        </View>

        <View>
          <Modal
            isVisible={modalSuccessVisible}
            style={{height: '100%'}}
            onBackdropPress={() => showModalSuccess(false)}>
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
                  {'Warning!'}
                </Text>
                <Text>{message}</Text>
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
                  <Text style={{fontSize: 13}}>{t('OK')}</Text>
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Billing;
