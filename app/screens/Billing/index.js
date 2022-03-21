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
} from '@components';
import {BaseStyle, useTheme} from '@config';
import {FRecentTransactions, FHotNews} from '@data';
import {useNavigation, useRoute} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {enableExperimental} from '@utils';

import moment from 'moment';

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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Billing;
