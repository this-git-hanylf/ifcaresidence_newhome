import {
  CardChannelGrid,
  CardSlide,
  CategoryList,
  CardReport06,
  News43,
  Price2Col,
  Icon,
  PlaceholderLine,
  Placeholder,
  NewsList,
  SafeAreaView,
  Text,
  Transaction2Col,
} from '@components';
import {BaseColor, BaseStyle, useTheme} from '@config';
import {
  HomeChannelData,
  HomeListData,
  HomePopularData,
  HomeTopicData,
  PostListData,
} from '@data';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  ScrollView,
  View,
  Image,
  Animated,
  ImageBackground,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
import getUser from '../../selectors/UserSelectors';
import HeaderCard from './HeaderCard';
import HeaderHome from './HeaderHome';
import styles from './styles';
import Swiper from 'react-native-swiper';
import Categories from './Categories';
import axios from 'axios';
import * as Utils from '@utils';
import numFormat from '../../components/numFormat';

import {notifikasi_nbadge, actionTypes} from '../../actions/NotifActions';
import getNotifRed from '../../selectors/NotifSelectors';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Home = props => {
  const {navigation} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [topics, setTopics] = useState(HomeTopicData);
  const [channels, setChannels] = useState(HomeChannelData);
  const [popular, setPopular] = useState(HomePopularData);
  const [list, setList] = useState(HomeListData);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => getUser(state));
  const cobanotif = useSelector(state => getNotifRed(state));
  console.log('cobanotif di home', cobanotif);
  const email = user.user;
  console.log('user di home', user);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const scrollY = useRef(new Animated.Value(0)).current;
  const [getDataDue, setDataDue] = useState([]);
  const [hasError, setErrors] = useState(false);
  const [data, setData] = useState([]);
  const {width} = Dimensions.get('window');
  const [getDataHistory, setDataHistory] = useState([]);

  const [dataTowerUser, setdataTowerUser] = useState([]);
  const [arrDataTowerUser, setArrDataTowerUser] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [entity_cd, setEntity] = useState('');
  const [project_no, setProjectNo] = useState('');

  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getTower = async () => {
    const data = {
      email: user.user,
      app: 'O',
    };
    console.log('params for tower', data);
    const config = {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        // token: "",
      },
    };

    await axios
      .get(
        `http://34.87.121.155:2121/apiwebpbi/api/getData/mysql/${data.email}/${data.app}`,
      )
      .then(res => {
        const datas = res.data;

        const arrDataTower = datas.Data;
        arrDataTower.map(dat => {
          if (dat) {
            setdataTowerUser(dat);
            setEntity(dat.entity_cd);
            setProjectNo(dat.project_no);
          }
        });
        setArrDataTowerUser(arrDataTower);
        setSpinner(false);

        // return res.data;
      })
      .catch(error => {
        console.log('error get tower api', error);
        alert('error get');
      });
  };

  const notifUser = useCallback(
    () => dispatch(notifikasi_nbadge(email, entity_cd, project_no)),
    [email, entity_cd, project_no, dispatch],
  );

  useEffect(() => {
    axios
      .get('http://34.87.121.155:8000/ifcaprop-api/api/about/01/01')
      .then(({data}) => {
        console.log('data', data[0]);
        setData(data[0].images);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  async function fetchDataDue() {
    try {
      const res = await axios.get(
        `http://34.87.121.155:2121/apiwebpbi/api/getDataDue/IFCAPB/${user.user}`,
      );
      setDataDue(res.data.Data);
      console.log('data get data due', getDataDue);
    } catch (error) {
      setErrors(error);
      // alert(hasError.toString());
    }
  }
  async function fetchDataHistory() {
    try {
      const res = await axios.get(
        `http://34.87.121.155:2121/apiwebpbi/api/getSummaryHistory/IFCAPB/${user.user}`,
      );
      setDataHistory(res.data.Data);
      // console.log('data get history', getDataHistory);
    } catch (error) {
      setErrors(error.ressponse.data);
      alert(hasError.toString());
    }
  }

  const galery = [...data];

  //TOTAL
  const sum =
    getDataDue == 0
      ? 0
      : getDataDue.reduceRight((max, bills) => {
          return (max += parseInt(bills.mbal_amt));
        }, 0);

  console.log('sum', sum);

  const sumHistory =
    getDataHistory == null
      ? 0
      : getDataHistory.reduceRight((max, bills) => {
          return (max += parseInt(bills.mdoc_amt));
        }, 0);

  console.log('sumHistory', sumHistory);

  //LENGTH
  const onSelect = indexSelected => {};

  const unique =
    getDataDue == 0 ? 0 : [...new Set(getDataDue.map(item => item.doc_no))];
  console.log('unique', unique);

  const invoice = unique.length;
  console.log('invoice', invoice);

  const uniqueHistory =
    getDataHistory == null
      ? 0
      : [...new Set(getDataHistory.map(item => item.doc_no))];
  // console.log('uniqueHistory', uniqueHistory);

  const invoiceHistory = uniqueHistory.length;
  console.log('invoiceHistory', invoiceHistory);

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [BaseColor.whiteColor, colors.text],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });

  //For header image opacity
  const headerImageOpacity = scrollY.interpolate({
    inputRange: [0, 250 - heightHeader - 20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });

  //artist profile image position from top
  const heightViewImg = scrollY.interpolate({
    inputRange: [0, 250 - heightHeader],
    outputRange: [250, heightHeader],
    useNativeDriver: true,
  });

  useEffect(() => {
    console.log('galery', galery);

    console.log('datauser', user);
    console.log('about', data);
    setTimeout(() => {
      fetchDataDue();
      fetchDataHistory();
      getTower();
      // fetchAbout();
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    notifUser();
  }, []);

  const goPostDetail = item => () => {
    navigation.navigate('PostDetail', {item: item});
  };

  const renderContent = () => {
    const mainNews = PostListData[0];

    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView, {flex: 1}]}
        edges={['right', 'top', 'left']}>
        {user == null || user == '' ? (
          <Text>data user dihome null</Text>
        ) : (
          <HeaderHome />
        )}

        <ScrollView
          // contentContainerStyle={styles.paddingSrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {/* <Image
            source={require('../../assets/images/pakubuwono.png')}
            style={{
              height: 60,
              width: 180,
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 80,
              marginBottom: 15,
              marginTop: -15,
              flexDirection: 'row',
              alignSelf: 'center',
            }}
          /> */}
          {/* <V style={{paddingTop: 10}}> */}

          {/* </ScrollView> */}

          <Animated.View
            style={[
              styles.headerImageStyle,
              {
                opacity: headerImageOpacity,
                height: heightViewImg,
                padding: 0,
                flex: 1,
              },
            ]}>
            <Swiper
              height={240}
              onMomentumScrollEnd={(e, state, context) =>
                console.log('index:', state.index)
              }
              autoplay={true}
              autoplayTimeout={5}
              dot={
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,.2)',
                    width: 5,
                    height: 5,
                    borderRadius: 4,
                    marginLeft: 3,
                    marginRight: 3,
                    marginTop: 3,
                    marginBottom: 3,
                  }}
                />
              }
              activeDot={
                <View
                  style={{
                    backgroundColor: colors.primary,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginLeft: 3,
                    marginRight: 3,
                    marginTop: 3,
                    marginBottom: 3,
                  }}
                />
              }
              paginationStyle={{
                bottom: -18,
                // left: null,
                // right: 10,
              }}
              loop>
              {data.map((item, key) => {
                return (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      backgroundColor: 'transparent',
                    }}>
                    <Image
                      key={key}
                      // key={'fast-' + `${item.id}`}
                      // key={item.length}
                      style={{
                        flex: 1,
                        width,
                        // borderRadius: 10,
                      }}
                      source={{uri: item.pict}}
                    />
                  </View>
                );
              })}
            </Swiper>
          </Animated.View>

          {/* <News43
            loading={loading}
            onPress={goPostDetail(mainNews)}
            style={{marginTop: 1}}
            title={mainNews.title}
          /> */}
          <View style={{flexDirection: 'row', marginVertical: 15, padding: 20}}>
            <View style={{flex: 1, paddingRight: 7}}>
              <CardReport06
                style={{backgroundColor: colors.primary, borderRadius: 25}}
                icon="arrow-up"
                title="Invoice Outstanding"
                price={invoice == undefined ? 0 : invoice}
                percent={numFormat(sum)}
                onPress={() => navigation.navigate('Billing')}
              />
            </View>
            <View style={{flex: 1, paddingLeft: 7}}>
              <CardReport06
                style={{backgroundColor: colors.primary, borderRadius: 25}}
                icon="arrow-up"
                title="Invoice History"
                price={invoiceHistory == undefined ? 0 : invoiceHistory}
                percent={numFormat(sumHistory)}
                onPress={() => navigation.navigate('BillingHistory')}
              />
            </View>
          </View>
          <View style={styles.paddingContent}>
            {user == null || user == '' ? (
              <Text>user not available</Text>
            ) : (
              <Categories style={{marginTop: 10}} />
            )}
          </View>

          {/* {loading ? renderPlaceholder() : renderContent()} */}
        </ScrollView>
      </SafeAreaView>
    );
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'top', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
};

export default Home;
