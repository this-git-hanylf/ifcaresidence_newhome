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
          navigation.goBack();
          // navigation.navigate('home');
        }}
      />
    </SafeAreaView>
  );
};

export default Notification;
