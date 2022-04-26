import {
  CardChannelGrid,
  CardSlide,
  CategoryList,
  News43,
  ListFacility,
  SafeAreaView,
  Text,
  Header,
  Icon,
  colors,
} from '@components';
import {BaseStyle, useTheme} from '@config';
import {
  HomeChannelData,
  HomeListData,
  HomePopularData,
  HomeTopicData,
  PostListData,
} from '@data';
import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ScrollView, View, ActivityIndicator} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NewsList, NotFound, ProductGrid1} from '../../components';
import List from '../../components/Product/List';
import styles from './styles';
import LottieView from 'lottie-react-native';

const Store = props => {
  const {navigation} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setErrors] = useState(false);

  const getdata = () => {
    axios
      .get(
        `http://34.87.121.155:2121/apiwebpbi/api/pos/factype/user?entity_cd=01&project_no=01&userid=ANDI`,
      )
      .then(res => {
        console.log('ress :', res.data.data);
        setData(res.data.data);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    getdata();
  });

  const renderContent = () => {
    const mainNews = PostListData[0];
    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView, {flex: 1}]}
        edges={['right', 'top', 'left']}>
        <Header
          title={t('Store')}
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
        {/* <NotFound /> */}
        <View style={{flex: 1, padding: 15, paddingTop: 10}}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {/* <View>
                <Text>{data.title}</Text>
              </View> */}
            {data.map((item, index) => {
              return (
                <View key={index} style={{width: '50%', height: 50}}>
                  <ProductGrid1
                    key={index}
                    style={{
                      width: '100%',
                      paddingRight: index % 2 == 0 ? 10 : 0,
                      paddingLeft: index % 2 != 0 ? 10 : 0,
                    }}
                    // description={item.available}
                    title={item.descs}
                    // image={item.image}
                    // image={item.image}
                    image={require('@assets/images/logo.png')}
                    // costPrice={item.costPrice}
                    // salePrice={item.salePrice}
                    // isFavorite={item.isFavorite}
                    onPress={() => navigation.navigate('EProduct', item)}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* <ScrollView contentContainerStyle={styles.paddingSrollView}>
          {data.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={styles.paddingFlatList}
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) =>
                item.status == 'Active' ? (
                  <NewsList
                    loading={loading}
                    image={{uri: `${item.url_image}`}}
                    subtitle={item.news_descs}
                    title={item.news_title}
                    source={item.source}
                    date={moment(item.date_created).startOf('hour').fromNow()}
                    style={{
                      marginBottom: index == data.length - 1 ? 0 : 15,
                    }}
                    onPress={goPostDetail(item)}
                  />
                ) : null
              }
            />
          ) : loading ? (
            <View>
              <ActivityIndicator size="large" color="#37BEB7" />
            </View>
          ) : (
            <NotFound />
          )}
        </ScrollView> */}
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

export default Store;
