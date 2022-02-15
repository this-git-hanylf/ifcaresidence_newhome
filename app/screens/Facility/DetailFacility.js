import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  ScrollView,
  View,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  Picker,
  Text,
} from 'react-native';
import styles from './styles';
import {
  CardChannelGrid,
  CardSlide,
  CategoryList,
  News43,
  ListFacility,
  SafeAreaView,
  ProductSpecGrid,
  // Text,
  Header,
  Image,
  Icon,
  colors,
  PlaceholderLine,
  Placeholder,
} from '@components';
import axios from 'axios';
import Swiper from 'react-native-swiper';
import {BaseColor, BaseStyle, Images, useTheme} from '@config';
import * as Utils from '@utils';
import RNPickerSelect from '@react-native-picker/picker';
import {Button} from '../../components';

import {useSelector} from 'react-redux';
import getUser from '../../selectors/UserSelectors';

const DetailFacility = props => {
  const {navigation, route} = props;
  // const {params} = props;
  console.log('routes from facility menu', route.params);
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const scrollY = useRef(new Animated.Value(0)).current;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setErrors] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const users = useSelector(state => getUser(state));
  const [email, setEmail] = useState(users.user);
  const [dataTowerUser, setdataTowerUser] = useState([]);
  const [arrDataTowerUser, setArrDataTowerUser] = useState([]);

  const [spinner, setSpinner] = useState(true);

  // --- for get tower
  const getTower = async () => {
    const data = {
      email: email,
      app: 'O',
    };

    const config = {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        // token: "",
      },
    };
    axios
      .get(
        `http://34.87.121.155:2121/apiwebpbi/api/getData/mysql/${data.email}/${data.app}`,
        {
          config,
        },
      )
      .then(res => {
        const datas = res.data;
        // console.log('tower entity projek', datas);
        const arrDataTower = datas.Data;
        arrDataTower.map(dat => {
          if (dat) {
            // console.log('map arrdatatower', dat);
            setdataTowerUser(dat);
          }
        });
        setArrDataTowerUser(arrDataTower);

        setSpinner(false);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getTower();
    // getData();
  }, []);

  // useEffect(() => {
  //   console.log('arrdatatower', dataTowerUser);
  // }, [dataTowerUser]);

  useEffect(() => {
    // getTower();
    getData();
  }, [dataTowerUser]);

  useEffect(() => {}, []);

  const getData = async () => {
    console.log('dataTowerUser', dataTowerUser);
    const entity_cd = dataTowerUser.entity_cd;
    const project_no = dataTowerUser.project_no;
    const facility_cd = route.params.facility_cd;
    console.log(
      'url data detail facility',
      'http://34.87.121.155:2121/apiwebpbi/api/fb-facilitydetail/' +
        entity_cd +
        '/' +
        project_no +
        '/' +
        facility_cd,
    );
    const response = await axios(
      'http://34.87.121.155:2121/apiwebpbi/api/fb-facilitydetail/' +
        entity_cd +
        '/' +
        project_no +
        '/' +
        facility_cd,
    );
    console.log('response fasility detail: ', response.data);
    setData(response.data);
    setSpinner(false);
  };

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
  const detail = data?.map(post => {
    return (
      <View key={post.id}>
        <Text headline style={{marginTop: 0, fontSize: 20, fontWeight: 'bold'}}>
          {post.title}
        </Text>

        <View style={styles.specifications}>
          <Text style={{fontSize: 16}}>
            Status :{' '}
            <Text style={{color: colors.primary, fontWeight: 'bold'}}>
              Open
            </Text>{' '}
            /{' '}
            <Text style={{color: BaseColor.redColor, fontWeight: 'bold'}}>
              Close
            </Text>
          </Text>
          {/* <Text></Text> */}
          {/* <ProductSpecGrid
            style={{flex: 1, fontSize: 20}}
            description={'Status'}
            title={post.openjam}
          /> */}
        </View>

        <View style={[styles.specifications, {marginTop: 10}]}>
          <View style={{flexDirection: 'column'}}>
            <Text style={{fontSize: 16, color: BaseColor.grayColor}}>
              Phone
            </Text>
            <Text
              style={{fontSize: 16, color: colors.primary, fontWeight: 'bold'}}>
              {post.phone}
            </Text>
          </View>

          {/* <ProductSpecGrid
            style={{flex: 1}}
            description={'Phone'}
            title={post.phone}
          /> */}
        </View>
        <View style={{margin: 0, paddingBottom: 0}}>
          <Text
            style={{
              fontSize: 16,
              color: BaseColor.grayColor,
              paddingBottom: 5,
            }}>
            Description
          </Text>
          <Text
            style={{
              textAlign: 'justify',
              width: '100%',
              color: colors.primary,
              fontWeight: 'bold',
              fontSize: 16,
            }}>
            {post.description.replace(/<\/?[^>]+(>|$;)/gi, '')}
          </Text>
          {/* <Text style={{textAlign: 'justify'}}>{post.description}</Text> */}
        </View>
        <View style={styles.specifications}>
          <View style={{flexDirection: 'column'}}>
            <Text style={{flex: 1, fontSize: 16, color: BaseColor.grayColor}}>
              Location
            </Text>
            <Text
              style={{fontSize: 16, color: colors.primary, fontWeight: 'bold'}}>
              {post.location}
            </Text>
          </View>
          {/* <ProductSpecGrid
            style={{flex: 1}}
            description={'Location'}
            title={post.location}
          /> */}
        </View>

        <View style={styles.specifications}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TermsConditions', dataTowerUser);
            }}>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: BaseColor.grayColor,
                  fontWeight: 'bold',
                }}>
                Terms & Conditions
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  });
  return (
    <SafeAreaView
      style={[BaseStyle.safeAreaView, {flex: 1}]}
      edges={['right', 'top', 'left']}>
      <Header
        title={t('Detail Facility')}
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
      {spinner ? (
        <View>
          {/* <Spinner visible={this.state.spinner} /> */}
          <Placeholder style={{marginVertical: 4, paddingHorizontal: 10}}>
            <PlaceholderLine width={100} noMargin style={{height: 40}} />
          </Placeholder>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.paddingSrollView}
          height={'100%'}>
          <Animated.View
            style={[
              styles.headerImageStyle,
              {
                opacity: headerImageOpacity,
                height: heightViewImg,
              },
            ]}>
            <Swiper
              dotStyle={{
                backgroundColor: BaseColor.dividerColor,
                marginBottom: 8,
              }}
              activeDotStyle={{
                marginBottom: 8,
              }}
              paginationStyle={{bottom: 0}}
              loop={false}
              activeDotColor={colors.primary}
              removeClippedSubviews={false}
              onIndexChanged={index => onSelect(index)}>
              {data.map((item, key) => {
                return (
                  <TouchableOpacity
                    key={key}
                    style={{flex: 1}}
                    activeOpacity={1}
                    onPress={() =>
                      navigation.navigate('PreviewImage', {images: images})
                    }>
                    <Image
                      key={key}
                      style={{
                        width: '100%',
                        height: Utils.scaleWithPixel(150),
                      }}
                      source={{uri: `${item.images[0].pict}`}}
                    />
                  </TouchableOpacity>
                );
              })}
            </Swiper>
          </Animated.View>
          <View>{data && detail}</View>
        </ScrollView>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate('BookingFacility', route.params)}>
        <View
          style={{
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            height: 70,
            backgroundColor: colors.primary,
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>View Schedule</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DetailFacility;
