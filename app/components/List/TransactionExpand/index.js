import {Text, Button} from '@components';
import ListTransaction from '@components/List/Transaction';
import PropTypes from 'prop-types';
import React, {useState, Fragment} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import styles from './styles';
import {useTheme} from '@config';
import numFormat from '../../numFormat';
import {useNavigation, useRoute} from '@react-navigation/core';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';

const TransactionExpand = ({
  style = {
    paddingTop: 5,
  },
  tradingPairTitle = '',
  tradingPairValue = '',
  priceTitle = '',
  price = '',
  name = '',
  doc_no = '',
  descs = '',
  mbal_amt = '',
  trx_type = '',
  due_date = '',
  doc_date = '',
  tower = '',
  lot_no = '',
  feeTitle = '',
  feeValue = '',
  costTitle = '',
  costValue = '',
  changeTitle = '',
  changeValue = '',
  currentTitle = '',
  currentValue = '',
  debtor_acct = '',
  entity_cd = '',
  project_no = '',
  ListTransactionProps = {
    icon: 'exchange-alt',
    name: name,
    tower: tower,
    descs: descs,
    due_date: due_date,
    doc_no: doc_no,
    mbal_amt: mbal_amt,
    disabled: true,
    lot_no: lot_no,
    debtor_acct: debtor_acct,
    entity_cd: entity_cd,
    project_no: project_no,
  },
  isExpandInit = false,
}) => {
  const {colors} = useTheme();
  const [isExpand, setIsExpand] = useState(isExpandInit);
  const navigation = useNavigation();
  const [modalSuccessVisible, showModalSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [hasError, setErrors] = useState(false);
  const {t} = useTranslation();

  const clickAttachment = data => {
    console.log('data fior attach', data);
    const params = {
      entity_cd: data.entity_cd,
      project_no: data.project_no,
      debtor_acct: debtor_acct,
      doc_no: doc_no,
    };
    console.log('params for click attach], params');
    navigation.navigate('AttachmentBilling', params);
    // if (data.debtor_acct == '') {
    //   // alert('Please Choose Debtor First');
    //   setMessage('Please choose debtor first');
    //   showModalSuccess(true);
    // } else {

    // }
  };

  const onCloseModal = () => {
    showModalSuccess(false);
  };

  return (
    <View style={style}>
      <ListTransaction
        style={StyleSheet.flatten([
          {
            borderBottomWidth: 1,
            paddingBottom: 1,
            borderBottomColor: colors.background,
          },
          !isExpand && {
            borderBottomWidth: 1,
            paddingBottom: 1,
            borderBottomColor: colors.border,
          },
        ])}
        {...ListTransactionProps}
        onPress={() => setIsExpand(!isExpand)}
      />
      {isExpand && (
        <View
          style={StyleSheet.flatten([
            {paddingBottom: 20},
            isExpand && {
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            },
          ])}>
          <View style={[styles.container, style.paddingTop]}>
            <View>
              <Text subhead blod style={styles.title}>
                {doc_no}
              </Text>
              <Text subhead thin style={styles.title}>
                {doc_date}
              </Text>
              <Text
                Bold
                footnote
                grayColor
                numberOfLines={2}
                style={styles.content}>
                {descs}
              </Text>
            </View>
            <View style={styles.viewRight}>
              <Text subhead Bold style={styles.title}>
                Total
              </Text>
              <Text headline>{mbal_amt}</Text>

              <TouchableOpacity
                onPress={() =>
                  clickAttachment({entity_cd, project_no, debtor_acct})
                }>
                <Text
                  style={{color: colors.primary, fontSize: 15, paddingTop: 10}}
                  bold>
                  Attachment
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* <View style={[styles.container, style]}>
            <View>
              <Text subhead light style={styles.title}>
                {feeTitle}
              </Text>
              <Text headline>{feeValue}</Text>
            </View>
            <View style={styles.viewRight}>
              <Text subhead light style={styles.title}>
                {costTitle}
              </Text>
              <Text headline>{costValue}</Text>
            </View>
          </View>
          <View style={[styles.container, style]}>
            <View>
              <Text subhead light style={styles.title}>
                {changeTitle}
              </Text>
              <Text headline>{changeValue}</Text>
            </View>
            <View style={styles.viewRight}>
              <Text subhead light style={styles.title}>
                {currentTitle}
              </Text>
              <Text headline>{currentValue}</Text>
            </View>
          </View> */}
        </View>
      )}
    </View>
  );
};

TransactionExpand.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  tradingPairTitle: PropTypes.string,
  tradingPairValue: PropTypes.string,
  priceTitle: PropTypes.string,
  price: PropTypes.string,
  lot_no: PropTypes.string,
  debtor_acct: PropTypes.string,
  entity_cd: PropTypes.string,
  project_no: PropTypes.string,
  feeTitle: PropTypes.string,
  feeValue: PropTypes.string,
  costTitle: PropTypes.string,
  costValue: PropTypes.string,
  changeTitle: PropTypes.string,
  changeValue: PropTypes.string,
  currentTitle: PropTypes.string,
  currentValue: PropTypes.string,
};

export default TransactionExpand;
