import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../../../../theme/colors';
import { FONTS } from '../../../../assets';
import { INDIVIDUALDATA, TEAMS } from '../../../../constants';
import { Images } from '../../../../assets/Images';
import Tabbar from '../../../../components/ui/Tabbar';
import Button from '../../../../components/global/Button';
import { goBack } from '../../../../utils/navigations';
import { useServiceFormData } from '../FormContext';
import { useRoute } from '@react-navigation/native';

// Team Card
const TeamCard = ({data, selected}) => {
  return (
    <View style={[styles.teamCard, selected === data.id ? { borderColor: COLORS.primary} : null]}>
      <View style={styles.teamCardImage}>
        <Image source={data.teamImage} style={styles.teamCardImageImg} />
      </View>
      <View style={styles.teamCardText}>
        <Text style={styles.teamCardTitle}>{data.teamName}</Text>
        <Text style={styles.teamCardDes} numberOfLines={3}>{data.description}</Text>
        <View style={styles.teamCardCta}>
          <Image style={styles.teamCardIcn} source={Images.usersIcon} />
          <Text style={styles.teamCardNumber}>{data.members}</Text>
          {selected === data.id && <Text style={styles.teamCardSelect}>Selected</Text>}
        </View>
      </View>
    </View>
  )
}

// Team Tab
const TeamTab = () => {
  const [isSelected, setIsSelected] = useState('')
  const {state, dispatch} = useServiceFormData()
  useEffect(()=> {
    const teamTabInfo = { 
    type: 'TEAM',
      id: Number(isSelected.replace(/[^0-9.]/g, ''))
    }
    updateData(teamTabInfo)
  },[isSelected])
  const updateData = (updateData) => {
  dispatch({
      type: 'UPDATE_FORM',
      formName: 'Members',
      payload: updateData
    })
  }
  return (
    <FlatList
      data={TEAMS}
      style={{ paddingTop: 24 }}
      renderItem={({item})=> <TouchableOpacity onPress={() => setIsSelected(item.id)}><TeamCard data={item} selected={isSelected} /></TouchableOpacity>} />
  )
}

// Individuals Card
const IndividualCard = ({data, selected}) => {
  return (
    <View style={styles.indiCard}>
      <Image source={data.img} style={styles.indiCardImg} />
      <View style={styles.indiCardText}>
        <Text style={styles.indiCardTitle}>{data.name}</Text>
        <Text style={styles.indiCardDes}>Last Seen: {data.lastSeen}</Text>
      </View>
      <View style={[styles.indiCardSelect, selected === data.id ? { borderColor: COLORS.transparent, backgroundColor: '#4990E233'} : null]}>
        {selected === data.id && <View style={styles.indiCardSelectDot} />}
      </View>
    </View>
  )
}

// Individuals Tab
const IndividualsTab = () => {
  const [isSelected, setIsSelected] = useState('')
  const {state, dispatch} = useServiceFormData()
   useEffect(()=> {
    const IndividualsTabInfo = { 
    type: 'INDIVIDUAL',
      id: isSelected
  }
  updateData(IndividualsTabInfo)
  },[isSelected])
  const updateData = (updateData) => {
  dispatch({
      type: 'UPDATE_FORM',
      formName: 'Members',
      payload: updateData
    })
  }
  return (
    <View style={{flex:1}}>
      <FlatList
        data={INDIVIDUALDATA}
        style={{ paddingTop: 24 }}
        renderItem={({item})=> <TouchableOpacity onPress={() => setIsSelected(item.id)}><IndividualCard data={item} selected={isSelected} /></TouchableOpacity>} />
        {/* <Button buttonTitle='Save & Next' small onPress={()=> goBack()}/> */}
    </View>
  )
}

const routes = [
  { key: 'teams', title: 'Teams' },
  { key: 'individuals', title: 'Individuals' },
];


export default function Members() {
  const {params} = useRoute();
  const {state, dispatch} = useServiceFormData()
  return (
    <>
    <Tabbar
      routes={routes}
      scenes={{
        teams: TeamTab,
        individuals: IndividualsTab,
      }}
    />
    <Button buttonTitle='Save & Next' small onPress={()=> {
          params?.onSave(state)
          goBack()
          }}/>
    </>
  )
}

const styles = StyleSheet.create({
  teamCard: {
    borderWidth: 2,
    borderColor: COLORS.transparent,
    backgroundColor: COLORS.iconBtnBgColor,
    borderRadius: 8,
    flex: 1,
    gap: 8,
    flexDirection: 'row',
    padding: 10,
    marginBottom: 16
  },
  teamCardImage: {
    flexShrink: 0,
    width: 90,
    minHeight: 90,
  },
  teamCardImageImg: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    borderRadius: 6
  },
  teamCardText: {
    flex: 1,
  },
  teamCardTitle: {
    fontSize: 14,
    fontFamily: FONTS.SemiBold600,
    color: COLORS.white,
    marginBottom: 12
  },
  teamCardDes: {
    fontSize: 14,
    fontFamily: FONTS.Regular400,
    color: COLORS.textSecondary,
    marginBottom: 10
  },
  teamCardCta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    gap: 4
  },
  teamCardIcn: {
    width: 16,
    height: 16,
    tintColor: COLORS.white
  },
  teamCardNumber: {
    fontSize: 16,
    fontFamily: FONTS.Regular400,
    color: COLORS.skylight
  },
  teamCardSelect: {
    marginLeft: 'auto',
    fontSize: 12,
    fontFamily: FONTS.Regular400,
    color: COLORS.primary
  },
  indiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    gap: 12,
    borderColor: COLORS.lineColor,
    marginBottom: 16,
    paddingBottom: 12,
  },
  indiCardImg: {
    width: 36,
    height: 36,
  },
  indiCardText: {
    flex: 1,
  }, 
  indiCardTitle: {
    fontSize: 12,
    fontFamily: FONTS.Medium500,
    color: COLORS.white,
    marginBottom: 4,
  },
  indiCardDes: {
    fontSize: 10,
    fontFamily: FONTS.Regular400,
    color: COLORS.lightGrey
  },
  indiCardSelect: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: COLORS.grey,
    padding: 6
  },
  indiCardSelectDot: {
    width: '100%',
    height: '100%',
    borderRadius: '100%',
    backgroundColor: COLORS.primary
  }
})