import {
  Button,
  CardBooking,
  Header,
  Icon,
  ModalFilter,
  // ProductCard1,
  SafeAreaView,
  TextInput,
  Text,
  FormCounterSelect,
} from '@components';
import Checkout from '../Checkout';
import {BaseColor, BaseStyle, useTheme} from '@config';
import {ProductsData} from '@data';
import React, {Fragment, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, RefreshControl, View} from 'react-native';

import getProject from '../../../selectors/ProjectSelector';
import {useSelector, useDispatch} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';

const sortOptionInit = [
  {
    value: 'remove',
    icon: 'sort-amount-up',
    text: 'remove',
  },
  {
    value: 'share_this_article',
    icon: 'sort-amount-down',
    text: 'share_this_article',
  },
  {
    value: 'view_detail',
    icon: 'sort-amount-up',
    text: 'view_detail',
  },
  {
    value: 'reset_all',
    icon: 'sort-amount-up',
    text: 'reset_all',
  },
];

const CartStore = props => {
  const {navigation, route} = props;
  console.log('route from list store', route.params.itemsforCheckout);

  const params = route.params.itemsforCheckout;
  const [dataListCheckout, setDataListCheckout] = useState(params);

  //  const storage_cart = await AsyncStorage.getItem('@storage_cart');
  //   const parse_storage = JSON.parse(storage_cart);

  //   console.log('store storage', parse_storage);

  const projectSelector = useSelector(state => getProject(state));
  // console.log('project selector', projectSelector);
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState(ProductsData);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState(sortOptionInit);

  const [tambahItem, setTambahItem] = useState(false);

  const [promotionCode, setPromotionCode] = useState('');
  const [totalHarga, setTotal] = useState(0);
  // const [totalHargaAll, setTotalAll] = useState(0);
  const [totalQty, setQty] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      // getData();
    }, 1000);
  }, []);

  // const getData = async () => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem('jsonValusse');
  //     console.log('store storage', jsonValue);
  //     return jsonValue != null ? JSON.parse(jsonValue) : null;

  //     // const parse = JSON.parse(jsonValue);
  //     // console.log('parse store', parse);
  //     // return parse;
  //   } catch (e) {
  //     // error reading value
  //   }
  // };

  // const itemFortotal = dataListCheckout.filter(dataListCheckout=>dataListCheckout.totalHarga)

  const itemFortotal = dataListCheckout.reduceRight((max, bills) => {
    // return (max += parseInt(bills.totalHarga));
    return (max += parseInt(bills.default_price));
    // default_price
  }, 0);
  // const itemForQuantity = dataListCheckout.reduceRight((max, bills) => {
  //   return (max += parseInt(bills.quantity));
  // }, 0);

  useEffect(() => {
    setTambahItem(false);
    tambahItem == false ? setTotal(itemFortotal) : setTotal(totalHarga);
    // tambahItem == false ? setQty(itemForQuantity) : setQty(totalQty);
  });

  // console.log('item for total', itemFortotal);

  const onSelectFilter = selected => {
    setSortOption(
      sortOption.map(item => {
        return {
          ...item,
          checked: item.value == selected.value,
        };
      }),
    );
  };

  const onApply = () => {
    let itemSelected = null;
    for (const item of sortOption) {
      if (item.checked) {
        itemSelected = item;
      }
    }
    if (itemSelected) {
      setModalVisible(false);
      setSortOption(sortOptionInit);
    }
  };

  const onDelete = () => {
    var myArray = dataListCheckout;
    var myIndex = myArray.indexOf(dataListCheckout.trx_code);
    console.log('myindex', myIndex);
    if (myIndex !== -1) {
      myArray.splice(myIndex, 1);
    }
    console.log('myarray', myArray);
  };

  const changeQty = (value, default_price) => {
    setTambahItem(true);
    // console.log('value qty', value);

    // console.log('databut default price', default_price);
    // console.log('set total harga', value * default_price);
    // const total_harga = dataListCheckout.map(item => {
    //   return {
    //     total_update: value * item.default_price,
    //   };
    // });
    // const quantity = dataListCheckout.map(item => {
    //   return {
    //     qty_update: value,
    //   };
    // });
    // console.log('qty_update', quantity);
    // console.log('total_uptade', total_harga[0].total_update);
    setQty(value);
    setTotal(totalQty * default_price);
  };

  const renderContent = () => {
    return (
      <View style={{flex: 1}}>
        <Header
          title={t('checkout')}
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
        <View style={[{flex: 1, paddingHorizontal: 20, paddingBottom: 10}]}>
          {/* <View style={{flexDirection: 'row', marginBottom: 20}}>
            <TextInput
              style={{flex: 1}}
              onChangeText={text => setPromotionCode(text)}
              autoCorrect={false}
              placeholder={t('promotion_code')}
              placeholderTextColor={BaseColor.grayColor}
              value={promotionCode}
              selectionColor={colors.primary}
              onSubmitEditing={() => {
                navigation.goBack();
              }}
            />
            <Button small style={{height: 45, marginLeft: 8}}>
              {t('check')}
            </Button>
          </View> */}

          <FlatList
            // contentContainerStyle={{ paddingVertical: 12 }}
            showsHorizontalScrollIndicator={true}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={() => {}}
              />
            }
            data={dataListCheckout}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              // <View>
              //   <FormCounterSelect
              //     isRow={true}
              //     label={''}
              //     detail={''}
              //     style={{
              //       marginTop: 8,
              //       backgroundColor: 'transparent',
              //       padding: 0,
              //       justifyContent: 'center',
              //       flex: 0,
              //     }}
              //     onChange={value =>
              //       changeQty(value, item.default_price, item, index)
              //     }
              //   />
              // </View>

              <Checkout
                loading={loading}
                style={{marginTop: 10}}
                title={item.descs}
                // image={item.image}
                image={require('@assets/images/logo.png')} //image di component checkoutnya sengaja di tutup, karena tidak pakai url uri
                salePrice={item.default_price}
                // description={item.description}
                // secondDescription={item.secondDescription}
                onDelete={() =>
                  setDataListCheckout(
                    dataListCheckout.filter(
                      dataListCheckout =>
                        dataListCheckout.trx_code != item.trx_code,
                    ),
                  )
                }
                // onDelete={() => onDelete()}
                // onChange={total => console.log('total', total)}
                onChange={value => changeQty(value, item.default_price)}
                // CurrentValue={item.quantity}
              />
            )}
          />

          <ModalFilter
            options={sortOption}
            isVisible={modalVisible}
            onSwipeComplete={() => {
              setModalVisible(false);
              setSortOption(sortOptionInit);
            }}
            onApply={onApply}
            onSelectFilter={onSelectFilter}
          />
        </View>
        <CardBooking
          loading={loading}
          description={t('total_price')}
          price={totalHarga}
          // price={'1000'}
          secondDescription={'Tax included'}
          textButton={t('checkout')}
          onPress={() => navigation.navigate('EShipping')}
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      {renderContent()}
    </SafeAreaView>
  );
};

export default CartStore;
