import {
  Header,
  Icon,
  ListTextButton,
  SafeAreaView,
  TabSlider,
  Tag,
} from '@components';
import {BaseStyle, useTheme, BaseColor} from '@config';
import {
  HomeChannelData,
  HomeListData,
  HomePopularData,
  HomeTopicData,
  PostListData,
} from '@data';
import * as Utils from '@utils';
import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useState, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {haveChildren} from '@utils';
import {
  FlatList,
  ScrollView,
  View,
  ActivityIndicator,
  Animated,
  ImageBackground,
  Text,
  TextInput,
  RefreshControl,
} from 'react-native';
import {FFriends} from '@data';
import {TouchableOpacity} from 'react-native-gesture-handler';
import styles from './styles';
import LottieView from 'lottie-react-native';

import getProject from '../../../selectors/ProjectSelector';
import {useSelector, useDispatch} from 'react-redux';
import getUser from '../../../selectors/UserSelectors';
import {useNavigation} from '@react-navigation/native';

import {SceneMap} from 'react-native-tab-view';
import numFormat from '../../../components/numFormat';
import {Divider} from 'react-native-paper';

const History = () => {
  const {t, i18n} = useTranslation();
  const {colors} = useTheme();
  const [keyword, setKeyword] = useState('');
  const [friends, setFriends] = useState(FFriends);
  const [spinner, setSpinner] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const projectSelector = useSelector(state => getProject(state));
  const user = useSelector(state => getUser(state));

  const [dataHistory, setDataHistory] = useState([]);
  const [dataHistoryFilter, setDataHistoryFilter] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      getDataHistory();
      searchFilterFunction();
    }, 1000);
  }, []);

  const searchFilterFunction = text => {
    console.log('text', text);
    // console.log('arrayholder', arrayholder);
    // const newData = dataHistory.filter(item => {
    //   const itemData =
    //     `${item.bill_no.toUpperCase()}` || `${item.bill_name.toUpperCase()}`;

    //   console.log('itemdata', itemData);
    //   const textData = text;
    //   //   return itemData.indexOf(textData) > -1;
    //   return itemData?.includes(textData);
    // });

    const newData = dataHistory.filter(
      item =>
        haveChildren(item.bill_no, text) || haveChildren(item.bill_name, text),
    );
    setDataHistoryFilter(newData);
  };

  const getDataHistory = () => {
    const entity_cd = projectSelector.Data[0].entity_cd;
    console.log('entity', entity_cd);
    const project_no = projectSelector.Data[0].project_no;
    const email = user.user;

    console.log(
      'url data history',
      `http://34.87.121.155:2121/apiwebpbi/api/pos/getStatusMobile?entity_cd=${entity_cd}&project_no=${project_no}&email=${email}`,
    );
    axios
      .get(
        `http://34.87.121.155:2121/apiwebpbi/api/pos/getStatusMobile?entity_cd=${entity_cd}&project_no=${project_no}&email=${email}`,
      )
      .then(res => {
        const data = res.data.Data;

        const filterDataStatusC = data
          .filter(item => item.bill_status === 'C')
          .map(items => items);

        const filterDataStatusX = data
          .filter(item => item.bill_status === 'X')
          .map(items => items);

        const joinDataHistoryAwal = [
          ...filterDataStatusC,
          ...filterDataStatusX,
        ];

        if (res.data.Error == false) {
          const datas = res.data;
          const arrLocation = datas.Data;

          const filterDataStatusC = arrLocation
            .filter(item => item.bill_status === 'C')
            .map(items => items);

          const filterDataStatusX = arrLocation
            .filter(item => item.bill_status === 'X')
            .map(items => items);

          console.log('status X', filterDataStatusX);

          const joinDataHistory = [...filterDataStatusC, ...filterDataStatusX];

          console.log(' filterData', joinDataHistory);

          setDataHistoryFilter(joinDataHistory);
          setSpinner(false);
        } else {
          setSpinner(false);
        }

        setDataHistory(joinDataHistoryAwal);
      });
  };

  const renderItemContent = ({item, index}) => {
    return (
      <View
        key={index}
        style={
          {
            //   borderWidth: 1,
            //   borderColor: 'black',
            //   borderStyle: 'solid',
          }
        }>
        <View>
          <Text>{moment(item.audit_date).format('MMM DD YYYY, hh:mm:ss')}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 14}}>
            {item.bill_name}
          </Text>
          <Text>{numFormat(item.total_amt)}</Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: 14,
              // color: BaseColor.grayColor
              color: colors.primary,
            }}>
            {item.bill_no}
          </Text>
        </View>
        <View>
          <Text>{item.lot_no}</Text>
        </View>
        <Divider style={{marginVertical: 15}} />
      </View>
    );
  };

  return (
    <View style={{flex: 1, paddingHorizontal: 20}}>
      <View
        style={{
          paddingTop: 15,
          paddingBottom: 20,
        }}>
        <View style={[BaseStyle.textInput, {backgroundColor: colors.card}]}>
          <TextInput
            placeholder="Search Name or Bill No"
            style={{
              flex: 1,
              height: '100%',
              color: colors.text,
              paddingTop: 5,
              paddingBottom: 5,
            }}
            onChangeText={text => searchFilterFunction(text.toUpperCase())}
            autoCorrect={false}
          />
        </View>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 0,
        }}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={() => {}}
          />
        }
        data={dataHistoryFilter}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItemContent}
      />
    </View>
  );
};

const Payment = () => {
  const {t, i18n} = useTranslation();
  const {colors} = useTheme();
  const [keyword, setKeyword] = useState('');
  const [friends, setFriends] = useState(FFriends);
  const [spinner, setSpinner] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const projectSelector = useSelector(state => getProject(state));
  const user = useSelector(state => getUser(state));

  const [dataPayment, setDataPayment] = useState([]);
  const [dataPaymentFilter, setDataPaymentFilter] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      getDataPayment();
      searchFilterFunction();
    }, 1000);
  }, []);

  const searchFilterFunction = text => {
    console.log('text', text);
    // console.log('arrayholder', arrayholder);
    // const newData = dataPayment.filter(item => {
    //   const itemData = `${item.bill_name.toUpperCase()}` || `${item.bill_no}`;
    //   console.log('itemdata', itemData);
    //   const textData = text;
    //   return itemData.indexOf(textData) > -1;
    // });
    const newData = dataPayment.filter(
      item =>
        haveChildren(item.bill_no, text) || haveChildren(item.bill_name, text),
    );
    console.log('new data', newData);
    setDataPaymentFilter(newData);
  };

  const getDataPayment = () => {
    const entity_cd = projectSelector.Data[0].entity_cd;
    console.log('entity', entity_cd);
    const project_no = projectSelector.Data[0].project_no;
    const email = user.user;

    console.log(
      'url data history',
      `http://34.87.121.155:2121/apiwebpbi/api/pos/getStatusMobile?entity_cd=${entity_cd}&project_no=${project_no}&email=${email}`,
    );
    axios
      .get(
        `http://34.87.121.155:2121/apiwebpbi/api/pos/getStatusMobile?entity_cd=${entity_cd}&project_no=${project_no}&email=${email}`,
      )
      .then(res => {
        const data = res.data.Data;

        const filterDataStatusN = data
          .filter(item => item.bill_status === 'N')
          .map(items => items);

        const filterDataStatusD = data
          .filter(item => item.bill_status === 'D')
          .map(items => items);

        const joinDataPaymentAwal = [
          ...filterDataStatusN,
          ...filterDataStatusD,
        ];

        if (res.data.Error == false) {
          const datas = res.data;
          const arrLocation = datas.Data;

          const filterDataStatusN = arrLocation
            .filter(item => item.bill_status === 'N')
            .map(items => items);

          const filterDataStatusD = arrLocation
            .filter(item => item.bill_status === 'D')
            .map(items => items);

          const joinDataPaymentAwal = [
            ...filterDataStatusN,
            ...filterDataStatusD,
          ];

          console.log(' filterData', joinDataPaymentAwal);

          setDataPaymentFilter(joinDataPaymentAwal);
          setSpinner(false);
        } else {
          setSpinner(false);
        }

        setDataPayment(joinDataPaymentAwal);
      });
  };

  const renderItemContent = ({item, index}) => {
    return (
      <View
        key={index}
        style={
          {
            //   borderWidth: 1,
            //   borderColor: 'black',
            //   borderStyle: 'solid',
          }
        }>
        <View>
          <Text>{moment(item.audit_date).format('MMM DD YYYY, hh:mm:ss')}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 14}}>
            {item.bill_name}
          </Text>
          <Text>{numFormat(item.total_amt)}</Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: 14,
              // color: BaseColor.grayColor
              color: colors.primary,
            }}>
            {item.bill_no}
          </Text>
        </View>
        <View>
          <Text>{item.lot_no}</Text>
        </View>
        <Divider style={{marginVertical: 15}} />
      </View>
    );
  };

  return (
    <View style={{flex: 1, paddingHorizontal: 20}}>
      <View
        style={{
          paddingTop: 15,
          paddingBottom: 20,
        }}>
        <View style={[BaseStyle.textInput, {backgroundColor: colors.card}]}>
          <TextInput
            placeholder="Search Name or Bill No"
            style={{
              flex: 1,
              height: '100%',
              color: colors.text,
              paddingTop: 5,
              paddingBottom: 5,
            }}
            onChangeText={text => searchFilterFunction(text.toUpperCase())}
            autoCorrect={false}
          />
        </View>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={() => {}}
          />
        }
        data={dataPaymentFilter}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItemContent}
      />
    </View>
  );
};

export default function RiwayatPesanan() {
  const {t, i18n} = useTranslation();
  const {colors} = useTheme();
  const [loading, setLoading] = useState('');
  const navigation = useNavigation();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'payment', title: 'Pending'},
    {key: 'history', title: 'History'},
  ]);
  const renderScene = SceneMap({
    history: History,
    payment: Payment,
  });

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <Header
        title={t('Riwayat Pesanan')}
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
      <TabSlider
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />
    </SafeAreaView>
  );
}
