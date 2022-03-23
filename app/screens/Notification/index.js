import {Header, Icon, ListThumbCircleNotif, SafeAreaView} from '@components';
import {BaseColor, BaseStyle, useTheme} from '@config';
// Load sample data
import {NotificationData} from '@data';
import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import getUser from '../../selectors/UserSelectors';
import axios from 'axios';
import {API_URL} from '@env';
import styles from './styles';
import NotifService from '../../NotifService';

const Notification = props => {
  const {navigation, route, notification} = props;
  console.log('route props', route);
  console.log('route notification', notification);
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  // const [notification, setNotification] = useState(NotificationData);
  const users = useSelector(state => getUser(state));
  const [email, setEmail] = useState(users.user);
  const [loading, setLoading] = useState(true);
  const [dataTowerUser, setdataTowerUser] = useState([]);
  const [arrDataTowerUser, setArrDataTowerUser] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [urlApi, seturlApi] = useState(API_URL);
  const [dataNotif, setDataNotif] = useState([]);

  // http://34.87.121.155:2121/apiwebpbi/api/notification

  // POST
  // body : email, entity_cd, project_no, device (hardcode aja valuenya Mobile)
  //-----FOR GET ENTITY & PROJJECT
  const notif = new NotifService(onNotif);

  const onNotif = notif => {
    console.log('notif di screen notification', notif);
    // navigation.navigate('Notification', notif);
    console.log('notif data screen notification', notif.data.title);
    console.log('notif data screen notification', notif.data.body);
    // Alert.alert('di index.app on notif');
  };

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
            getNotification(dat);
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

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      getTower(users);
    }, 3000);
  }, []);

  const getNotification = async data => {
    const formData = {
      email: email,
      entity_cd: data.entity_cd,
      project_no: data.project_no,
      device: 'Mobile',
    };

    console.log('form data notif', formData);

    const config = {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        token: '',
      },
    };

    console.log(
      `http://34.87.121.155:8181/apiwebpbi/api/notification?email=${formData.email}&device=${formData.device}&entity_cd=${formData.entity_cd}&project_no=${formData.project_no}`,
    );

    await axios
      .post(
        `http://34.87.121.155:8181/apiwebpbi/api/notification?email=${formData.email}&device=${formData.device}&entity_cd=${formData.entity_cd}&project_no=${formData.project_no}`,
      )
      .then(res => {
        // console.log('res tiket multi', res.data);
        const resNotif = res.data;

        // console.log('resNotif', res);
        setDataNotif(resNotif);
        setSpinner(false);
        // return res.data;
      })
      .catch(error => {
        console.log('err data notif', error);
        // alert('error nih');
      });
  };
  const goNotifDetail = item => () => {
    navigation.navigate('NotificationDetail', {item: item});
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <Header
        title={t('notification')}
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
          // navigation.goBack();
          navigation.navigate('MainStack');
        }}
      />
      <FlatList
        contentContainerStyle={{paddingHorizontal: 20}}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={() => {}}
          />
        }
        data={dataNotif}
        keyExtractor={(item, index) => item.NotificationID}
        renderItem={({item, index}) => (
          <ListThumbCircleNotif
            // image={item.image}
            txtLeftTitle1={item.Report_no}
            txtLeftTitle2={item.NotificationCd}
            txtContent={item.Remarks}
            txtRight={item.NotificationDate}
            onPress={goNotifDetail(item)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Notification;
