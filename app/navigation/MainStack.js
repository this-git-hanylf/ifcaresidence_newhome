import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {View, Text} from 'react-native';
import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import AboutUs from '@screens/AboutUs';
import ResetScreen from '../screens/ResetPassword';
import ChangeLanguage from '@screens/ChangeLanguage';
import ChangePassword from '@screens/ChangePassword';
import Setting from '@screens/Setting';
import ContactUs from '@screens/ContactUs';
import ThemeSetting from '@screens/ThemeSetting';
import ProfileEdit from '@screens/ProfileEdit';
import Review from '@screens/Review';
import SelectFontOption from '@screens/SelectFontOption';
import FCategory from '@screens/FCategory';

import {BottomTabNavigatorMazi, tabBarIcon} from './components';
import Billing from '../screens/Billing';
import AttachmentBilling from '../screens/Billing/AttachmentBilling';
import BillingHistory from '../screens/BillingHistory';
import HistoryBilling from '../screens/BillingHistory/HistoryBilling';
import PDFAttach from '../screens/Billing/PDFAttach';
import Facility from '../screens/Facility';
import Announce from '../screens/Announce';
import AnnounceDetail from '../screens/AnnouceDetail';
import PreviewImages from '../screens/AnnouceDetail/PreviewImages';
import News from '../screens/News';
import Rent from '../screens/Rent';
import EProductDetail from '../screens/EProductDetail';
import PostDetail from '../screens/PostDetail';
import MeterInfo from '../screens/MeterInfo';
import Search from '../screens/Search';
import PreviewImage from '../screens/PreviewImage';

import SelectDarkOption from '../screens/SelectDarkOption';
import EProductPageNotFound from '../screens/EProductPageNotFound';

import ModalLocation from '../screens/Helpdesk/ModalLocation';
import Package from '../screens/Package';
import PackageDetail from '../screens/Package/PackageDetail';
import Privacy from '../screens/Privacy';
import Skip from '../screens/Skip';
import Emergency from '../screens/Emergency';

import Helpdesk from '@screens/Helpdesk';
import SpecHelpDesk from '@screens/Helpdesk/SpecHelpDesk';
import CategoryHelp from '@screens/Helpdesk/CategoryHelp';
import SelectCategory from '@screens/Helpdesk/SelectCategory';
import SubmitHelpdesk from '../screens/Helpdesk/Submit';
import StatusHelp from '../screens/Helpdesk/StatusHelp';
import ViewHistoryStatus from '../screens/Helpdesk/ViewHistoryStatus';
import ViewHistoryDetail from '../screens/Helpdesk/ViewHistoryDetail';
import PreviewImageHelpdesk from '../screens/Helpdesk/PreviewImageHelpdesk';

import HouseRoles from '../screens/HouseRoles';

import Notification from '@screens/Notification';
import NotificationDetail from '../screens/Notification/notifDetail';
import DetailFacility from '../screens/Facility/DetailFacility';
import BookingFacility from '../screens/Facility/BookingFacility';
import BookingDetail from '../screens/Facility/BookingDetail';
import FSendMoney from '../screens/FSendMoney';
import ModalProduct from '../screens/Facility/ModalProduct';
import TermsConditions from '../screens/Facility/TermsCondition';

import BookingList from '../screens/Facility/BookingList';
import BookingListDetail from '../screens/Facility/BookingListDetail';

import ChoosePartner from '../screens/Facility/ChoosePartner';
import ChooseEditPartner from '../screens/Facility/ChooseEditPartner';

import {tabBarIconHaveNoty} from './components';

const Stack = createStackNavigator();

export const WalletTabScreens = {
  HomeScreen: {
    component: HomeScreen,
    options: {
      title: 'home',
      tabBarIcon: ({color}) => tabBarIcon({color, name: 'home'}),
    },
  },
  EmegerncyScreen: {
    component: Emergency,
    options: {
      title: 'Emergency',
      tabBarIcon: ({color}) => tabBarIcon({color, name: 'phone'}),
    },
  },
  NotificationScreen: {
    component: Notification,
    options: {
      title: 'Notification',
      tabBarIcon: ({color}) => tabBarIconHaveNoty({color, name: 'bell'}),
    },
  },
  ProfileScreen: {
    component: ProfileScreen,
    options: {
      title: 'account',
      tabBarIcon: ({color}) => tabBarIcon({color, name: 'cog'}),
    },
  },
};

export const WalletMenu = () => (
  <BottomTabNavigatorMazi tabScreens={WalletTabScreens} />
);

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={WalletMenu}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
        creenOptions={{presentation: 'modal'}}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Skip"
        component={Skip}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Package"
        component={Package}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangeLanguage"
        component={ChangeLanguage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ThemeSetting"
        component={ThemeSetting}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Review"
        component={Review}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SelectFontOption"
        component={SelectFontOption}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FCategory"
        component={FCategory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Billing"
        component={Billing}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Helpdesk"
        component={Helpdesk}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SpecHelpDesk"
        component={SpecHelpDesk}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SelectCategory"
        component={SelectCategory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ModalLocation"
        component={ModalLocation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CategoryHelp"
        component={CategoryHelp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SubmitHelpdesk"
        component={SubmitHelpdesk}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StatusHelp"
        component={StatusHelp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ViewHistoryStatus"
        component={ViewHistoryStatus}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ViewHistoryDetail"
        component={ViewHistoryDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PreviewImageHelpdesk"
        component={PreviewImageHelpdesk}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MeterInfo"
        component={MeterInfo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Facility"
        component={Facility}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ModalProduct"
        component={ModalProduct}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FSendMoney"
        component={FSendMoney}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DetailFacility"
        component={DetailFacility}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookingFacility"
        component={BookingFacility}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookingDetail"
        component={BookingDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Announce"
        component={Announce}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="News"
        component={News}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Rent"
        component={Rent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EProductDetail"
        component={EProductDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AnnouceDetail"
        component={AnnounceDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PreviewImage"
        component={PreviewImage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SelectDarkOption"
        component={SelectDarkOption}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HouseRoles"
        component={HouseRoles}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotificationDetail"
        component={NotificationDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookingList"
        component={BookingList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookingListDetail"
        component={BookingListDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChoosePartner"
        component={ChoosePartner}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChooseEditPartner"
        component={ChooseEditPartner}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TermsConditions"
        component={TermsConditions}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PackageDetail"
        component={PackageDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PreviewImages"
        component={PreviewImages}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AttachmentBilling"
        component={AttachmentBilling}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PDFAttach"
        component={PDFAttach}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BillingHistory"
        component={BillingHistory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HistoryBilling"
        component={HistoryBilling}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default MainStack;
