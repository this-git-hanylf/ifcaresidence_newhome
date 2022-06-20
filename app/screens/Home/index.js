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
  SearchInput,
  TextInput,
} from '@components';
import {BaseColor, BaseStyle, useTheme, Typography, FontWeight} from '@config';
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
import messaging from '@react-native-firebase/messaging';
import apiCall from '../../config/ApiActionCreator';
// import {TextInput} from '../../components';

import LinearGradient from 'react-native-linear-gradient';
import ModalSelector from 'react-native-modal-selector';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Home = props => {
  const {navigation, route} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [topics, setTopics] = useState(HomeTopicData);
  const [channels, setChannels] = useState(HomeChannelData);
  const [popular, setPopular] = useState(HomePopularData);
  const [list, setList] = useState(HomeListData);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => getUser(state));
  const notif = useSelector(state => getNotifRed(state));
  console.log('cobanotif di home', notif);
  // const email = user.user;
  const [email, setEmail] = useState(user != null ? user.user : '');
  console.log('user di home', user);
  const [fotoprofil, setFotoProfil] = useState(
    user != null
      ? {uri: user.pict}
      : require('../../assets/images/image-home/Main_Image.png'),
  );
  const [name, setName] = useState(user != null ? user.name : '');
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const scrollY = useRef(new Animated.Value(0)).current;
  const [getDataDue, setDataDue] = useState([]);
  const [getDataNotDue, setDataNotDue] = useState([]);
  const [hasError, setErrors] = useState(false);
  const [data, setData] = useState([]);
  const {width} = Dimensions.get('window');
  const [getDataHistory, setDataHistory] = useState([]);

  const [dataTowerUser, setdataTowerUser] = useState([]);
  const [arrDataTowerUser, setArrDataTowerUser] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [entity_cd, setEntity] = useState('');
  const [project_no, setProjectNo] = useState('');
  const [lotno, setLotno] = useState([]);
  console.log('lotno array 0', lotno[1].lot_no);
  const [text_lotno, setTextLotno] = useState('');

  const [keyword, setKeyword] = useState('');

  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      navigation.navigate('Notification', remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          navigation.navigate('Notification', remoteMessage);
        }
        setLoading(false);
      });
  }, []);

  //untuk load badge notif
  useEffect(() => {
    dispatch(
      apiCall(
        `http://34.87.121.155:8181/apiwebpbi/api/notification?email=${email}&entity_cd=01&project_no=01`,
      ),
    );
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
            console.log('entity dari tower map', dat.entity_cd);
            console.log('project dari tower map', dat.project_no);
            notifUser(dat.entity_cd, dat.project_no);
          }
        });
        setArrDataTowerUser(arrDataTower);
        setSpinner(false);
        getLotNo();
        // return res.data;
      })
      .catch(error => {
        console.log('error get tower api', error);
        // alert('error get');
      });
  };

  const getLotNo = async () => {
    const entity = entity_cd;
    const project = project_no;
    try {
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
      const res = await axios.get(
        'http://34.87.121.155:2121/apiwebpbi/api/facility/book/unit?entity=' +
          entity_cd +
          '&' +
          'project=' +
          project_no +
          '&' +
          'email=' +
          email,
      );
      if (res) {
        const resLotno = res.data.data;
        console.log('reslotno', resLotno);

        // console.log('reslotno', resLotno[0].lot_no);
        setLotno(resLotno);
        // setTimeDate(data[0]);

        setSpinner(false);
      }
      return res;
    } catch (err) {
      console.log('error lotno ya', err.response);
    }
  };
  // useEffect(() => {
  //   getLotNo();
  // }, []);

  const notifUser = useCallback(
    (entity_cd, project_no) =>
      dispatch(notifikasi_nbadge(email, entity_cd, project_no)),
    [email, entity_cd, project_no, dispatch],
  );
  // const notifUser = () => {
  //   console.log('entity dari tower', entity_cd);
  //   console.log('project dari tower', project_no);
  // };

  // useEffect(() => {
  //   axios
  //     .get('http://34.87.121.155:8000/ifcaprop-api/api/about/01/01')
  //     .then(({data}) => {
  //       console.log('data images?', data[0]);
  //       setData(data[0].images);
  //     })
  //     .catch(error => console.error(error))
  //     .finally(() => setLoading(false));
  // }, []);

  const dataImage = async () => {
    await axios
      .get(`http://34.87.121.155:2121/apiwebpbi/api/about/image`)
      .then(res => {
        console.log('res image', res.data.data);
        // console.log('data images', res.data[0].images);
        setData(res.data.data);
        // return res.data;
      })
      .catch(error => {
        console.log('error get about us image', error);
        // alert('error get');
      });
  };

  async function fetchDataDue() {
    try {
      const res = await axios.get(
        `http://34.87.121.155:2121/apiwebpbi/api/getDataDueSummary/IFCAPB/${user.user}`,
      );
      setDataDue(res.data.Data);
      console.log('data get data due', res.data.Data);
    } catch (error) {
      setErrors(error);
      // alert(hasError.toString());
    }
  }

  async function fetchDataNotDue() {
    try {
      const res = await axios.get(
        `http://34.87.121.155:2121/apiwebpbi/api/getDataCurrentSummary/IFCAPB/${user.user}`,
      );
      setDataNotDue(res.data.Data);
      console.log('data get data not due', res.data.Data);
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
      // console.log('data get history', res.data.Data);
    } catch (error) {
      setErrors(error);
      // alert(hasError.toString());
    }
  }

  const galery = [...data];

  //TOTAL DATE DUE
  const sum =
    getDataDue == 0
      ? 0
      : getDataDue.reduceRight((max, bills) => {
          return (max += parseInt(bills.mbal_amt));
        }, 0);

  console.log('sum', sum);

  //TOTAL DATE NOT DUE
  const sumNotDue =
    getDataNotDue == 0 || getDataNotDue == null
      ? 0
      : getDataNotDue.reduceRight((max, bills) => {
          return (max += parseInt(bills.mbal_amt));
        }, 0);

  console.log('sumNotDue', sumNotDue);

  const math_total = Math.floor(sumNotDue) + Math.floor(sum);
  console.log('math total', math_total);

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

  const uniqueNotDue =
    getDataNotDue == 0 || getDataNotDue == null
      ? 0
      : [...new Set(getDataNotDue.map(item => item.doc_no))];
  console.log('uniqueNotDue', uniqueNotDue);

  const invoice = unique == 0 ? 0 : unique.length;
  console.log('invoice', invoice);

  const invoiceNotDue = uniqueNotDue == 0 ? 0 : uniqueNotDue.length;
  console.log('invoiceNotDue', invoiceNotDue);

  const total_outstanding = Math.floor(invoice) + Math.floor(invoiceNotDue);
  console.log('total_outstanding', total_outstanding);

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
    dataImage();
    console.log('datauser', user);
    console.log('about', data);
    fetchDataDue();
    fetchDataNotDue();
    fetchDataHistory();
    getTower();
    // fetchAbout();
    setLoading(false);
    // setTimeout(() => {
    //   fetchDataDue();
    //   fetchDataHistory();
    //   getTower();
    //   // fetchAbout();
    //   setLoading(false);
    // }, 1000);
  }, []);

  // useEffect(() => {
  //   notifUser();
  // }, []);

  const goPostDetail = item => () => {
    navigation.navigate('PostDetail', {item: item});
  };

  const onChangeText = text => {
    setKeyword(text);
    // setCategory(
    //   text
    //     ? category.filter(item => item.title.includes(text))
    //     : CategoryData,
    // );
  };

  const onChangelot = lot => {
    console.log('lot', lot);
    setTextLotno(lot);
  };

  const renderContent = () => {
    const mainNews = PostListData[0];

    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView, {flex: 1}]}
        edges={['right', 'top', 'left']}>
        {user == null || user == '' ? (
          <Text>data user dihome null</Text>
        ) : // <HeaderHome />
        null}

        <ScrollView
          // contentContainerStyle={styles.paddingSrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={{flex: 1}}>
            <ImageBackground
              // source={require('../../assets/images/image-home/Main_Image.png')}
              source={require('../../assets/images/image-home/Pakubuwono.jpeg')}
              style={
                {
                  // height: '100%',
                  // height: 400,
                  // width: '100%',
                  // flex: 1,
                  // resizeMode: 'cover',
                  // borderBottomLeftRadius: 500,
                  // borderBottomRightRadius: 175,
                }
              }
              imageStyle={{
                height: 400,
                width: '100%',
                borderBottomLeftRadius: 175,
                borderBottomRightRadius: 175,
              }}>
              <LinearGradient
                colors={['rgba(73, 73, 73, 0)', 'rgba(73, 73, 73, 1)']}
                // colors={['#4c669f', '#3b5998', '#192f6a']}
                // {...otherGradientProps}
                style={{
                  height: 400,
                  // height: '85%',
                  width: '100%',

                  flexDirection: 'column',
                  // flex: 1,
                  justifyContent: 'center',
                  // top: 30,
                  borderBottomLeftRadius: 175,
                  borderBottomRightRadius: 175,
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'center',
                    top: 30,
                  }}>
                  {/* ------- TEXT WELCOME HOME ------- */}
                  <View
                    style={{
                      // flex: 1,
                      alignItems: 'center',

                      left: 47,
                      justifyContent: 'center',

                      width: '50%',
                    }}>
                    <Text
                      style={{
                        fontSize: 50,
                        color: 'white',
                        fontFamily: 'DMSerifDisplay',
                        lineHeight: 55,
                      }}>
                      Welcome Home
                    </Text>
                  </View>
                  {/* ------- CLOSE TEXT WELCOME HOME ------- */}

                  {/* ----- SEARCH INPUT ----- */}
                  {/* <View
                    style={{
                      // flex: 1,
                      alignItems: 'center',
                      left: 47,
                      justifyContent: 'center',
                      width: '80%',
                    }}>
                    <SearchInput
                      style={[BaseStyle.textInput, Typography.body1]}
                      onChangeText={onChangeText}
                      autoCorrect={false}
                      placeholder={t('Explore your luxury lifestyle')}
                      placeholderTextColor={BaseColor.grayColor}
                      value={keyword}
                      selectionColor={colors.primary}
                      onSubmitEditing={() => {}}
                      icon={
                        <Icon
                          name="search"
                          solid
                          size={24}
                          color={colors.primary}
                        />
                      }
                    />
                  </View> */}

                  <View style={{alignItems: 'center', top: 15}}>
                    <Image
                      style={{
                        height: 70,
                        width: '50%',
                      }}
                      source={require('../../assets/images/image-home/vector-logo-pbi.png')}></Image>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginLeft: 35,
              marginTop: 10,
              marginBottom: 10,
            }}>
            <Image
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
              }}
              // source={require('../../assets/images/image-home/Main_Image.png')}
              source={fotoprofil}></Image>
            <View style={{alignSelf: 'center', marginLeft: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    marginVertical: 3,
                    fontFamily: 'DMSerifDisplay',
                  }}>
                  {/* Nama pemilik */}
                  {name}
                </Text>
                <Icon
                  name="star"
                  solid
                  size={18}
                  color={colors.primary}
                  style={{marginHorizontal: 5}}
                />
              </View>

              <View
                style={{
                  backgroundColor: '#315447',
                  height: 30,
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  borderRadius: 10,
                }}>
                <View style={{flexDirection: 'row', paddingLeft: 10}}>
                  <Text
                    style={{
                      color: '#fff',
                      alignSelf: 'center',
                      fontSize: 14,
                      justifyContent: 'center',
                      paddingRight: 10,

                      fontWeight: '800',
                      fontFamily: 'KaiseiHarunoUmi',
                    }}>
                    Unit
                  </Text>

                  <ModalSelector
                    style={{justifyContent: 'center', alignSelf: 'center'}}
                    data={lotno}
                    optionTextStyle={{color: '#333'}}
                    selectedItemTextStyle={{color: '#3C85F1'}}
                    accessible={true}
                    keyExtractor={item => item.lot_no}
                    labelExtractor={item => item.lot_no} //khusus untuk lotno
                    cancelButtonAccessibilityLabel={'Cancel Button'}
                    onChange={option => {
                      onChangelot(option);
                    }}>
                    <Text
                      style={{
                        color: '#CDB04A',
                        alignSelf: 'center',
                        fontSize: 16,
                        // top: 10,
                        // flex: 1,
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontFamily: 'KaiseiHarunoUmi',
                      }}>
                      {text_lotno.lot_no == null
                        ? lotno[0].lot_no
                        : text_lotno.lot_no}
                    </Text>
                  </ModalSelector>

                  <Icon
                    name="caret-down"
                    solid
                    size={26}
                    // color={colors.primary}
                    style={{marginLeft: 5}}
                    color={'#CDB04A'}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.paddingContent}>
            {user == null || user == '' ? (
              <Text>user not available</Text>
            ) : (
              <Categories style={{marginTop: 10}} />
            )}
          </View>
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
