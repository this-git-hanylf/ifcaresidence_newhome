import {
  Header,
  Icon,
  ListThumbCircleNotif,
  SafeAreaView,
  Text,
} from '@components';
import {BaseColor, BaseStyle, useTheme} from '@config';
// Load sample data
// import {NotificationData} from '@data';
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
// import getUser from '../../selectors/UserSelectors';
import Pdf from 'react-native-pdf';

const PDFAttach = props => {
  const {navigation, route} = props;
  console.log('route params', route);
  const url_attachment = route.params;
  const {t} = useTranslation();
  const {colors} = useTheme();
  //   const [refreshing, setRefreshing] = useState(false);
  //   const [notification, setNotification] = useState(NotificationData);
  //   const users = useSelector(state => getUser(state));
  //   const [email, setEmail] = useState(users.user);
  //   const [loading, setLoading] = useState(true);
  //   const [dataTowerUser, setdataTowerUser] = useState([]);
  //   const [arrDataTowerUser, setArrDataTowerUser] = useState([]);
  //   const [spinner, setSpinner] = useState(true);
  //   const [dataNotif, setDataNotif] = useState([]);

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <Header
        title={t('Attachment Billing')}
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
      <View style={{flex: 1}}>
        <Pdf
          source={{
            uri: url_attachment,
            cache: true,
          }}
          // source={require('@assets/termsconditions/Facility_Booking_System_Regulation.pdf')}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          password={'220359'}
          style={stylesCurrent.pdf}
          fitWidth={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default PDFAttach;

const stylesCurrent = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
