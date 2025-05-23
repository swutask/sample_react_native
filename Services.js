import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FONTS, ICONS } from '../../../assets';
import { COLORS } from '../../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import Button from '../../../components/global/Button';
import InputField from '../../../components/ui/InputField';
import { useServiceFormData } from './FormContext';

const GroupCard = ({ item }) => {
  console.log(item)
  return (
    <View style={{ gap: 24}}>
      {item.name &&
      <View style={styles.groupHeader}>
        <Text style={styles.groupTitle}>{item.name}</Text>
        <TouchableOpacity>
          <ICONS.ThreeVerticalDots height={13} width={4} />
        </TouchableOpacity>
      </View>
      }
      {item.services.map((prev, index) => (
        <View key={index} style={[styles.card, item.services.length - 1 === index ? null : { borderBottomWidth: 1, borderColor: COLORS.placeHolderColor, paddingBottom: 12 }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>{prev.name}</Text>
            <View>
              <Text style={[styles.cardHeaderPrice, item.name ? null : { color: COLORS.textSecondary, fontSize: 16 }]}>{prev.price}</Text>
              <Text style={[styles.cardHeaderHours, item.name ? null : { color: COLORS.lightGrey }]}>{prev.duration.days}</Text>
            </View>
          </View>
          {prev.details && 
            <Text style={styles.cardHeaderDes}>
              {prev.details}
            </Text>
          }
          <View style={{ gap: 12 }}>
            {prev.highlight.map((list, index) => (
              <View key={index} style={styles.cardList}>
                <Text style={styles.cardListLabel}>{list.name}</Text>
                {list.value ? (
                  <ICONS.Checked height={16} width={16} />
                ) : (
                  <ICONS.UnCheck height={16} width={16} />
                )}
              </View>
            ))}
            {prev.rewardsPoint &&
              <Text style={styles.cardPontText}>
                Earn <Text style={styles.points}>{prev.rewardsPoint}</Text> Points for this
                purchase!
              </Text>
            }
          </View>
        </View>
      ))}
    </View>
  )
}

export default function Services({ onNext }) {
  const navigation = useNavigation()
  const [isAddGroupPress, setIsAddGroupPress] = useState(true)
  const {state, dispatch} = useServiceFormData();
  const [groupServiceName, setGroupServiceName] = useState('')
  const [items, setItems] = useState([]);

  const handleAddItem = () => {
  const serviceInfo = state.groupServiceTab?.groupServiceTab?.infoTab?.info;

  // Basic checks to ensure required fields are present
  const isValid = serviceInfo?.serviceName || serviceInfo?.price;

  if (!isValid) return; // Do not add empty or invalid item

  const newItem = {
    name: state.ServiceGroupName?.ServiceGroupName || '',
    services: [
      {
        name: serviceInfo.serviceName || '',
        duration: {
          days: Number(serviceInfo.days.replace(/[^0-9.]/g, '')) || '',
          hours: Number(serviceInfo.hours.replace(/[^0-9.]/g, '')) || '',
          minutes: Number(serviceInfo.minutes.replace(/[^0-9.]/g, '')) || '',
        },
        details: serviceInfo.detailText || '',
        price: Number(serviceInfo.price.replace(/[^0-9.]/g, '')) || '',
        strikeOutPrice: Number(serviceInfo.strikeOutPriceMSRP.replace(/[^0-9.]/g, '')) || '',
        rewardsPoint: Number(serviceInfo.rewardPointPrice.replace(/[^0-9.]/g, '')) || '',
        awardsPoint: Number(serviceInfo.awardsPoint.replace(/[^0-9.]/g, '')) || '',
        highlight: state.groupServiceTab?.groupServiceTab?.Highlights?.Highlight || [],
        member: state.groupServiceTab?.groupServiceTab?.Members || {},
      }
    ]
  };

  setItems(prev => [...prev, newItem]);
};

  const serviceGroupData = () => {  
    const ServiceGroupName  = groupServiceName || ''
    dispatch({
      type: 'UPDATE_FORM',
      formName: 'ServiceGroupName',
      payload: {ServiceGroupName: ServiceGroupName}
    })
  }
  const addServiceTabData = (groupServiceTab) => {
    dispatch({
      type: 'UPDATE_FORM',
      formName: 'groupServiceTab',
      payload: {groupServiceTab: groupServiceTab}
    })
  } 
  const addServiceData = () => {
    dispatch({
      type: 'UPDATE_FORM',
      formName: 'addServiceData',
      payload: {handleAddItem: items}
    })
  } 
  useEffect(()=> {
    handleAddItem()
  }, [state.groupServiceTab?.groupServiceTab])
  console.log(" handleAddItem ",items)
    return (
    <View style={{ flex: 1 }}>
      {isAddGroupPress ? (
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.addServiceGroupContainer}>
              <Text style={styles.textStyle}>Add Service Group</Text>
              <TouchableOpacity onPress={() => setIsAddGroupPress(false)}>
                <ICONS.AddButton height={40} width={40} />
              </TouchableOpacity>
            </View>
            <View style={styles.mainContainer}>
              {items.map((item, index) => (
                <View key={index} style={items.length -1 === index ? {} : { borderBottomWidth: item.name ? 1 : 0, borderColor: COLORS.placeHolderColor, paddingBottom: 12 }}>
                  <GroupCard item={item} />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.search}>
              <InputField defaultValue="Beginner" value={groupServiceName} onChangeText={(text)=> setGroupServiceName(text)} required label="Service Group Name" placeholder="Write here" />
            </View>
            <View style={[styles.addServiceGroupContainer, { borderBottomWidth: 1, borderColor: COLORS.placeHolderColor, paddingBottom: 24}]}>
              <Text style={styles.textStyle}>Add Service</Text>
              <TouchableOpacity onPress={() => {navigation.navigate('AddServiceGroup',{ onSave:(data)=>{
                addServiceTabData(data)
                // dispatch
              }}), serviceGroupData()}}>
                <ICONS.AddButton height={40} width={40} />
              </TouchableOpacity>
            </View>
            <View style={styles.mainContainer}>
              {items.length > 0 && (items.map((item, index) => (
                <View key={index} style={items.length -1 === index ? null : { borderBottomWidth: item.name ? 1 : 0, borderColor: COLORS.placeHolderColor, paddingBottom: 12 }}>
                  <GroupCard item={item} />
                </View>
              )))}
            </View>
          </ScrollView>
        </View>
      )}
      <Button
        small
        buttonTitle={'Next'}
        onPress={()=> {onNext(), addServiceData()}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20
  },
  addServiceGroupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  textStyle: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.Regular400,
  },
  mainContainer: {
    gap: 24,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#2E2E2E',
    paddingBottom: 12,
  },
  groupTitle: {
    fontSize: 16,
    fontFamily: FONTS.Medium500,
    color: COLORS.white,
  },
  card: {
    gap: 24
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHeaderTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.Regular400,
  },
  cardHeaderPrice: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.SemiBold600,
    marginBottom: 5,
    lineHeight: 15,
    textAlign: 'right',
  },
  cardHeaderHours: {
    fontFamily: FONTS.Regular400,
    fontSize: 12,
    color: COLORS.skylight,
    textAlign: "right"
  },
  cardHeaderDes: {
    color: COLORS.lightGrey,
    fontSize: 10,
    fontFamily: FONTS.SemiBold600,
    lineHeight: 11
  },
  cardList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardListLabel: {
    color: COLORS.white,
    fontFamily: FONTS.Regular400,
    fontSize: 12,
  },
  cardPontText: {
    color: COLORS.lightGrey,
    fontSize: 12,
    fontFamily: FONTS.Regular400,
  },
  points: {
    color: COLORS.success
  },
  search: {
    marginBottom: 24
  },
  searchLabel: {

  },
});