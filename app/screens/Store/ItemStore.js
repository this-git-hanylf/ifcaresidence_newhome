import {
  FilterESort,
  ProductBlock,
  ProductGrid2,
  SafeAreaView,
  Tag,
  Header,
  Icon,
  Text,
  Button,
  FormCounterSelect,
} from '@components';
import ProductList from './List';
import numFormat from '../../components/numFormat';
import {BaseColor, BaseStyle, useTheme} from '@config';
// Load sample data
import {EPostListData, ESortOption} from '@data';
import {useNavigation} from '@react-navigation/native';
import * as Utils from '@utils';
import React, {Fragment, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  View,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import styles from './styles';
import getProject from '../../selectors/ProjectSelector';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {ActivityIndicator} from 'react-native-paper';

import Modal from 'react-native-modal';
import {TouchableOpacity} from 'react-native-gesture-handler';

let timeoutChangeMode = null;

const initialLayout = {width: Dimensions.get('window').width};

const Product = params => {
  console.log('routes di product', params.params);
  const [dataMember, setDataMember] = useState(params.params);

  const navigation = useNavigation();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [modeView, setModeView] = useState('list');
  const [list, setList] = useState(EPostListData);
  const [loading, setLoading] = useState(true);
  const [spinner, setSpinner] = useState(true);

  const [dataItemStore, setItemStore] = useState([]);
  const [dataItemStoreFilter, setItemStoreFilter] = useState([]);
  const projectSelector = useSelector(state => getProject(state));
  //   console.log('project selector di product', projectSelector);

  const [modalVisible, setModalVisible] = useState(false);

  const [dataBuy, setDataBuy] = useState([]);
  const [total, setTotal] = useState(0);
  const [qty, setQty] = useState(0);

  const [showAddQuantity, setShowAddQuantity] = useState(false);
  const [showButtonToCart, setButtonToCart] = useState(false);

  const [ArrayDataBuy, setArrayDataBuy] = useState([]);

  //   const {navigation, route} = props;

  const getItemStore = () => {
    const entity_cd = projectSelector.Data[0].entity_cd;
    console.log('entity', entity_cd);
    const project_no = projectSelector.Data[0].project_no;
    console.log(
      'url menu store di product',
      `http://34.87.121.155:2121/apiwebpbi/api/pos/getProducts?entity_cd=${entity_cd}&project_no=${project_no}&trx_class=H`,
    );
    axios
      .get(
        `http://34.87.121.155:2121/apiwebpbi/api/pos/getProducts?entity_cd=${entity_cd}&project_no=${project_no}&trx_class=H`,
      )
      .then(res => {
        console.log(res.data.Error);
        if (res.data.Error == false) {
          const datas = res.data;
          const arrLocation = datas.Data;

          //   console.log('bank arrLocationsdsa', arrLocation);

          setItemStoreFilter(arrLocation);
          setSpinner(false);
        } else {
          setSpinner(false);
        }

        setItemStore(res.data.Data);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      getItemStore();
      searchFilterFunction();
    }, 1000);
  }, []);

  const goProductDetail = item => {
    navigation.navigate('EProductDetailStore', {item: item});
  };

  const goStore = item => {
    navigation.goBack();
  };

  const searchFilterFunction = text => {
    console.log('text', text);
    // console.log('arrayholder', arrayholder);
    const newData = dataItemStore.filter(item => {
      const itemData = `${item.descs.toUpperCase()}`;
      //   console.log('itemdata', itemData);
      const textData = text;
      return itemData.indexOf(textData) > -1;
    });
    console.log('new data', newData);
    setItemStoreFilter(newData);
  };

  const pressBuy = item => {
    console.log('cek quantity', qty);

    // setShowAddQuantity(true);
    // console.log('databuy', item);
    // console.log('trx_code', item.trx_code);
    // console.log('total awal', item.default_price);
    //   setTotal(item.default_price);
    const id = item.trx_code;
    // console.log('id', id);

    // ArrayDataBuy.map((item, index) =>
    //   id === item.trx_code ? setQty(qty + item.quantity) : setQty(qty),
    // );

    // const dataBuyNow = {
    //   totalHarga: total,
    //   quantity: qty,
    //   ...item,
    //   ...dataMember,
    // };

    // const array = [...ArrayDataBuy, dataBuyNow];
    // console.log('array', array);

    // var index = array.indexOf(id);
    // console.log('index of', index);

    // if (index !== -1) {
    //   console.log('index', index);
    //   array[index] = setQty(qty + item.quantity);
    // }

    // setArrayDataBuy(array);

    setButtonToCart(true);
  };

  const toCheckout = () => {
    console.log('to checkout', ArrayDataBuy);
    navigation.navigate('CartStore', {itemsforCheckout: ArrayDataBuy});
  };

  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <ProductList
          loading={loading}
          // description={item.descs}
          title={item.descs}
          style={{marginVertical: 8}}
          // image={item.picture}
          image={require('@assets/images/logo.png')}
          // costPrice={item.default_price}
          salePrice={item.default_price}
          //   pressBuy={() => pressBuy(item)}
          //   quantity={qty}
          // onPress={() => goProductDetail(item)}
          // isFavorite={item.isFavorite}
          // salePercent={'30%'}
        />
        <View style={{alignItems: 'flex-end'}}>
          <TouchableOpacity
            onPress={() => (qty == 0 ? alert('press add') : pressBuy(item))}
            style={{
              backgroundColor: Utils.parseHexTransparency(colors.primary, 30),

              padding: 15,
              width: 70,
              borderRadius: 10,

              alignItems: 'center',
            }}>
            <Icon solid name="cart-plus" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View>
          <FormCounterSelect
            isRow={true}
            label={''}
            detail={''}
            style={{
              marginTop: 8,
              backgroundColor: 'transparent',
              padding: 0,
              justifyContent: 'center',
              flex: 0,
            }}
            onChange={value => changeQty(value, item.default_price, item)}
          />
        </View>
      </View>
    );
  };

  const renderList = () => {
    return spinner ? (
      <ActivityIndicator color={colors.primary} />
    ) : (
      <View style={{flex: 1}}>
        <TextInput
          placeholder="Search"
          style={{
            color: '#555',
            fontSize: 14,
            borderColor: '#000',
            borderWidth: 0.5,
            borderRadius: 10,
            marginHorizontal: 20,
          }}
          // onChangeText={this.handleSearch}
          onChangeText={text => searchFilterFunction(text.toUpperCase())}
          autoCorrect={false}
        />
        <Button
          onPress={() => toCheckout()}
          medium
          style={{
            marginTop: 10,
            marginBottom: 20,
            // flex: 1,
            // bottom: 0,
          }}>
          {t('check')}
        </Button>
        <FlatList
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
          scrollEventThrottle={1}
          data={dataItemStoreFilter}
          key={1}
          numColumns={1}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    );
  };

  const changeQty = (value, default_price, item) => {
    // console.log('value qty', value);

    // console.log('databut default price', default_price);
    // console.log('set total harga', value * default_price);

    //   console.log('item change add', item);

    const dataBuyNow = {
      totalHarga: total,
      quantity: qty,
      ...item,
      ...dataMember,
    };

    const array = [...ArrayDataBuy, dataBuyNow];
    console.log('array di change qty', array);

    setArrayDataBuy(array);

    // const array_coba = array.filter(
    //   element => element.trx_code == item.trx_code,
    // );
    const array_coba = array.filter(car => car.trx_code === item.trx_code);
    console.log(array_coba);

    // console.log('uni', unique);

    setQty(value);
    setTotal(value * default_price);
  };

  const buyNow = () => {
    // setModalVisible(false); // harus di nyalain kalo mau abis klik buy now modal hilang

    const dataBuyNow = {
      totalHarga: total,
      quantity: qty,
      data_buy: dataBuy,
    };
    console.log('data buynow', dataBuyNow);
    // navigation.navigate('CartStore', {itemsdataBuyNow: dataBuyNow}); // ini tidak ngambil dari params route, ini pasti ada data yang udah di set
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Fragment>{renderList()}</Fragment>

        {/* <Modal
          isVisible={modalVisible}
          animationType={'slide'}
          swipeDirection={['down']}
          style={styles.bottomModal}
          onSwipeComplete={() => setModalVisible(!modalVisible)}
          onBackdropPress={() => setModalVisible(!modalVisible)}>
          <View
            style={[
              styles.contentFilterBottom,
              {backgroundColor: colors.card},
            ]}>
            <View style={styles.contentSwipeDown}>
              <View style={styles.lineSwipeDown} />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: 8,
                marginTop: 20,
                justifyContent: 'space-between',
              }}>
              <View>
                <Text body1>{t('quantity').toUpperCase()}</Text>
                <FormCounterSelect
                  isRow={true}
                  label={''}
                  detail={''}
                  style={{
                    marginTop: 8,
                    backgroundColor: 'transparent',
                    padding: 0,
                    justifyContent: 'center',
                    flex: 0,
                  }}
                  onChange={value => changeQty(value)}
                />
              </View>
              <View>
                <Text body1 style={{textAlign: 'right'}}>
                  {t('total').toUpperCase()}
                </Text>
                <Text title3 style={{textAlign: 'right', marginTop: 12}}>
                  {`${numFormat(`${total}`)}`}
                </Text>
              </View>
            </View>

            <Button
              full
              style={{marginTop: 10, marginBottom: 20}}
              onPress={() => buyNow()}>
              {t('Add To Cart')}
            </Button>
          </View>
        </Modal>
       */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default function ItemStore({route}) {
  const {colors} = useTheme();
  console.log('routeee', route);
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'all', title: 'All'},
    // {key: 'feedback', title: 'Feedback'},
  ]);
  console.log('rputes', routes);
  const renderScene = SceneMap({
    all: Product,
    // feedback: Product,
  });
  const renderTabBar = props => (
    <TabBar
      {...props}
      renderIndicator={() => null}
      scrollEnabled
      style={[styles.tabbar, {backgroundColor: colors.background}]}
      tabStyle={styles.tab}
      activeColor={BaseColor.whiteColor}
      inactiveColor={colors.text}
      renderLabel={({route, focused, color}) => (
        <Tag
          primary={true}
          style={{
            backgroundColor: focused ? colors.primary : colors.background,
          }}
          textStyle={{
            color: color,
          }}>
          {route.title}
        </Tag>
      )}
    />
  );

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <Header
        title={'Items Store'}
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
      <Product params={route.params} />

      {/* Kalo mau pake tab dibuka aja ini, tapi harus ada kondisi id / kode buat filter tab nya */}
      {/* <TabView
        scrollEnabled={true}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      /> */}
    </SafeAreaView>
  );
}
