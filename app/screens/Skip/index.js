import {
  Card,
  Header,
  Icon,
  Image,
  ProfileDescription,
  SafeAreaView,
  Text,
  ProductBlock,
} from '@components';
import {BaseColor, BaseStyle, useTheme} from '@config';
import {Images} from '@config';
import {AboutUsData} from '@data';
import * as Utils from '@utils';
import React, {useState, useEffect} from 'react';
import {ScrollView, View, FlatList} from 'react-native';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import moment from 'moment';
// import {ProductBlock} from '../../components';

const Skip = props => {
  const {navigation} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [rent, setRent] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get('http://34.87.121.155:8000/ifcaprop-api/api/about/01/01')
      .then(({data}) => {
        console.log('data', data);
        setData(data[0]);
      })
      .catch(error => console.error(error));
    // .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios
      .get('http://34.87.121.155:2121/apiwebpbi/api/rsentryMobile')
      .then(({data}) => {
        console.log('defaultApp -> data', rent);
        setRent(data);
      })
      .catch(error => console.error(error));
    // .finally(() => setLoading(false));
  }, []);

  const goProductDetail = item => {
    navigation.navigate('EProductDetail', {item: item});
  };

  useEffect(() => {
    console.log('datauser', data);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <Header
        title={t('about_us')}
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
      <ScrollView>
        <View>
          {/* <Image source={Images.trip4} style={{width: '100%', height: 135}} /> */}
          <Image
            source={require('../../assets/images/pakubuwono.png')}
            style={{
              height: 60,
              width: 180,
              alignItems: 'center',
              marginHorizontal: 100,
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          />
          <View style={styles.titleAbout}>
            {/* <Text title1 semibold whiteColor>
              {t('about_us')}
            </Text> */}
            <Text
              subhead
              greyColor
              style={{marginTop: 70, textAlign: 'center'}}>
              {/* {t('slogan_about_us')} */}
              {data.about_title}
            </Text>
          </View>
        </View>
        <View style={{padding: 20}}>
          <Text headline semibold style={{textAlign: 'center'}}>
            {/* {t('who_we_are')} */}
            {data.about_title}
          </Text>
          <View>
            <Text
              body2
              style={{
                paddingTop: 10,
                paddingBottom: 10,
              }}
              numberOfLines={100}>
              {data.about_us?.replace(/<\/?[^>]+(>|$;)/gi, '')}
            </Text>
          </View>
          <View style={styles.address}>
            <Text
              semibold
              style={{
                fontSize: 18,
                paddingBottom: 15,
              }}>
              Contact Us
            </Text>
            <Text body>{data.address}</Text>
            <Text
              semibold
              style={{
                paddingTop: 20,
                paddingBottom: 10,
                fontSize: 15,
              }}>
              {data.contact_name}
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Icon name="mobile" size={20} />
              <Text> {data.contact_no}</Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Icon name="envelope" size={20} />
              <Text> {data.contact_email}</Text>
            </View>
          </View>
        </View>

        <View style={{flex: 1}}>
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={styles.paddingFlatList}
            data={rent}
            renderItem={({item, index}) => (
              <ProductBlock
                loading={loading}
                description={item.description}
                subject={item.subject}
                style={{marginVertical: 8}}
                images={item.images[0].pict}
                avatar={item.avatar}
                email={item.email}
                bath_room={item.bath_room}
                bed_room={item.bed_room}
                land_area={item.land_area}
                build_area={item.build_area}
                agent_name={item.agent_name}
                publish_date={moment(item.publish_date).format('H:mm:ss')}
                price_descs={item.price_descs}
                onPress={() => goProductDetail(item)}
                isFavorite={item.isFavorite}
                salePercent={item.salePercent}
              />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Skip;
