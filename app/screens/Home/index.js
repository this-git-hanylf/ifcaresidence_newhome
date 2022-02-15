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
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import getUser from '../../selectors/UserSelectors';
import HeaderCard from './HeaderCard';
import HeaderHome from './HeaderHome';
import styles from './styles';
import Swiper from 'react-native-swiper';
import Categories from './Categories';
import axios from 'axios';
import * as Utils from '@utils';
import numFormat from '../../components/numFormat';

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
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const scrollY = useRef(new Animated.Value(0)).current;
  const [getDataDue, setDataDue] = useState([]);
  const [hasError, setErrors] = useState(false);
  const [data, setData] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

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
      console.log('data', getDataDue);
    } catch (error) {
      setErrors(error.ressponse.data);
      alert(hasError.toString());
    }
  }

  const galery = [...data];

  //TOTAL
  const sum = getDataDue.reduceRight((max, bills) => {
    return (max += parseInt(bills.mbal_amt));
  }, 0);
  console.log('sum', sum);

  //LENGTH
  const onSelect = indexSelected => {};

  const unique = [...new Set(getDataDue.map(item => item.doc_no))];
  console.log('sumss', unique);

  const invoice = unique.length;

  useEffect(() => {
    console.log('galery', galery);

    console.log('datauser', user);
    console.log('about', data);
    setTimeout(() => {
      fetchDataDue();
      // fetchAbout();
      setLoading(false);
    }, 1000);
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
          <View style={{paddingTop: 10}}>
            <Swiper
              dotStyle={{
                backgroundColor: BaseColor.dividerColor,
                marginBottom: 8,
                padding: 0,
              }}
              activeDotStyle={{
                marginBottom: 8,
              }}
              paginationStyle={{bottom: 0}}
              loop={false}
              style={{
                height: (Utils.getWidthDevice() * 3) / 5,
                width: '100%',
              }}
              activeDotColor={colors.primary}
              removeClippedSubviews={false}
              onIndexChanged={index => onSelect(index)}>
              {data.map((item, key) => {
                return (
                  <Image
                    key={key}
                    style={{
                      flex: 1,
                      width: '100%',
                      // borderRadius: 10,
                    }}
                    source={{uri: item.pict}}
                  />
                );
              })}
            </Swiper>
          </View>

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
                title="Invoice Due"
                // price="$0.68"
                percent={invoice}
                onPress={() => navigation.navigate('Billing')}
              />
            </View>
            <View style={{flex: 1, paddingLeft: 7}}>
              <CardReport06
                style={{backgroundColor: colors.primary, borderRadius: 25}}
                icon="arrow-up"
                title="Total"
                // price="$0.68"
                percent={numFormat(sum)}
                onPress={() => navigation.navigate('Billing')}
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
