import {AuthActions} from '@actions';
import {Button, Header, Icon, SafeAreaView, Text, TextInput} from '@components';
import {BaseColor, BaseStyle, useTheme} from '@config';
import {Images} from '@config';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import getUser from '../../selectors/UserSelectors';
import errorsSelector from '../../selectors/ErrorSelectors';
import {isLoadingSelector} from '../../selectors/StatusSelectors';
import {login, actionTypes} from '../../actions/UserActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const SignIn = props => {
  const {navigation} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [token_firebase, setTokenFirebase] = useState('');
  const [token, setTokenBasic] = useState('');

  const user = useSelector(state => getUser(state));
  const isLoading = useSelector(state =>
    isLoadingSelector([actionTypes.LOGIN], state),
  );
  const errors = useSelector(state =>
    errorsSelector([actionTypes.LOGIN], state),
  );

  const loginUser = useCallback(
    () => dispatch(login(email, password, token_firebase)),
    [email, password, token_firebase, dispatch],
  );

  const passwordChanged = useCallback(value => setPassword(value), []);
  const emailChanged = useCallback(value => setEmail(value), []);

  useEffect(() => {
    if (user !== null) {
      props.navigation.navigate('MainStack');
    }
  });

  useEffect(() => {
    requestUserPermission();
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken();
      console.log('Authorization status:', authStatus);
    }
  };

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      console.log('Your Firebase Token is:', fcmToken);
      setTokenFirebase(fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <View style={{marginVertical: 50}} />
      <View>
        <Image
          source={require('../../assets/images/pakubuwono.png')}
          style={{
            height: 60,
            width: 180,
            alignSelf: 'center',
            marginHorizontal: 100,
            marginBottom: 15,
            marginTop: -15,
            flexDirection: 'row',
          }}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{
          flex: 1,
        }}>
        <View style={styles.contain}>
          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={emailChanged}
            autoCorrect={false}
            placeholder={t('input_id')}
            value={email}
            selectionColor={colors.primary}
          />
          <TextInput
            style={[BaseStyle.textInput, {marginTop: 10}]}
            onChangeText={passwordChanged}
            autoCorrect={false}
            placeholder={t('input_password')}
            secureTextEntry={true}
            value={password}
            selectionColor={colors.primary}
          />
          <View style={{width: '100%', marginVertical: 16}}>
            <Button
              full
              loading={loading}
              style={{marginTop: 20}}
              onPress={loginUser}>
              {t('sign_in')}
            </Button>
          </View>
          <View style={styles.contentActionBottom}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}>
              <Text body2 grayColor>
                {t('forgot_your_password')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Skip')}>
              <Text body2 primaryColor>
                {t('Skip Login')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
