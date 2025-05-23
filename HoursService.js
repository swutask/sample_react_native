import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Image, TextInput } from 'react-native';
import { FONTS } from '../../../assets';
import Button from '../../../components/global/Button';
import { COLORS } from '../../../theme/colors';
import { DAYS } from '../../../constants';
import SelectField from '../../../components/ui/SelectField';
import { Images } from '../../../assets/Images';
import SlideSheet from '../../../components/global/SlideSheet';
import InputField from '../../../components/ui/InputField';

const generateRandomId = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

const LockedInput = (props) => {
  const [locked, setLocked] = useState(true);
  return <TextInput readOnly={locked} onPress={() => setLocked(false)} onBlur={() => setLocked(true)} style={styles.listInput} placeholderTextColor={COLORS.placeHolderTextColor} {...props} />
}

const TimeCard = () => {
  const [data, setData] = useState([{ id: generateRandomId(), startTime: '', endTime: '', discount: '' }]);

  const onDelete = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  }
  const onAdd = () => {
    setData((prev) => [...prev, { id: generateRandomId(), startTime: '', endTime: '', discount: '' }]);
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Start Time</Text>
        <Text style={styles.headerCell}>End Time</Text>
        <Text style={styles.headerCell}>% discount</Text>
        <View style={styles.headerCta}>
          <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
            <Image source={Images.PlusIcon} style={styles.addBtnIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        {data.map((item, idx) => (
          <View key={idx} style={styles.row}>
            <View style={styles.cell}>
              <LockedInput defaultValue={item.startTime} placeholder='00:00 AM' />
            </View>
            <View style={styles.cell}>
              <LockedInput defaultValue={item.endTime} placeholder='00:00 PM' />
            </View>
            <View style={styles.cell}>
              <LockedInput defaultValue={item.discount} placeholder='0% Off' />
            </View>
            <View style={styles.headerCta}>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
                <Image source={Images.closeIcon} style={styles.deleteBtnIcon} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

    </View>
  );
}

export default function HoursService({ onNext }) {
  const refRBSheet = useRef()
  const [addDay, setAddDay] = useState([])
  const [selectDay, setSelectDay] = useState('')
  const [reRenderSelect, setReRenderSelect] = useState(null)
  const [isAvailableType, setIsAvailableType] = useState('')
  const [isAvailableValue, setIsAvailableValue] = useState('')


  const onDatSelect = (item) => {
    setSelectDay(item.title);
  }
  const onAddDay = () => {
    if (selectDay) {
      setAddDay((prev) => {
        if (prev.some(item => item.title === selectDay)) {
          Alert.alert('already exist')
          return prev
        }
        setSelectDay('');
        setReRenderSelect(new Date().getTime())
        return [...prev, { title: selectDay }]
      })
    } else {
      return Alert.alert('Please Select Day')
    }
  }
  const onDeleteDay = (index) => {
    setAddDay(prev => prev.filter((_, idx) => idx !== index))
  }

  const onAvailableType = (val) => {
    setIsAvailableType(val?.title);
    setIsAvailableValue('')
  }
  const onAvailableValue = () => {

  }

  return (
    <View style={styles.wrapper}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: 36, marginBottom: 24 }}>
          <View>
            <View style={styles.fieldGroup}>
              <Text style={styles.groupTitle}>Hours of Operation</Text>
              <Text style={styles.groupHelper}>Please select you method of delivery. On location can only be  selected invidually and cannot be selected with other delivery option.</Text>
              <SelectField placeholder='Select Field' data={[{ title: 'Load saved' }]} />
            </View>
            <View style={{ height: 1, marginVertical: 24, backgroundColor: COLORS.grey, }} />
            <View style={styles.fieldGroup}>
              <Text style={styles.groupTitle}>Availability Block</Text>
              <Text style={styles.groupHelper}>Available times will show start times at this frequency. For example, your service will have start times every 30 minutes.</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <View style={{ flex: 1 }}>
                  <SelectField onSelect={onAvailableType} defaultValue={isAvailableType} placeholder='Select type' data={[{ title: 'Mins' }, { title: 'Hours' }]} />
                </View>
                <View style={{ flex: 1 }}>
                  <SelectField onSelect={onAvailableValue} key={isAvailableType} placeholder='Select value' data={Array.from({ length: isAvailableType === 'Mins' ? 60 : 24 }, (_, index) => ({ title: (index + 1).toString() }))} />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.groupTitle}>Add Days of Week</Text>
            <Text style={styles.groupHelper}>Please select you method of delivery. On location can only be  selected invidually and cannot be selected with other delivery option.</Text>
            <SelectField key={reRenderSelect} placeholder='Select Day' defaultValue={selectDay} onSelect={onDatSelect} data={DAYS} />
          </View>
          <Button buttonTitle="Add" small onPress={onAddDay} />
        </View>
        {addDay.length ? (
          <View style={{ gap: 12, marginBottom: 24 }}>
            {addDay.map((item, i) => (
              <View key={i} style={styles.dayCard}>
                <View style={styles.dayCardHeader}>
                  <Text style={styles.dayCardTitle}>{item.title}</Text>
                  <TouchableOpacity style={styles.dayCardDelete} onPress={() => onDeleteDay(i)}>
                    <Image source={Images.closeIcon} style={{ width: 16, height: 16 }} />
                  </TouchableOpacity>
                </View>
                <TimeCard />
              </View>
            ))}
          </View>
        ) : null}
        <View style={{ gap: 24 }}>
          <View style={{ width: '50%', alignSelf: 'center' }}>
            <Button buttonTitle="Save Availability" onPress={() => refRBSheet.current.open()} outline small />
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Button buttonTitle="Save" type='danger' small />
            </View>
            <View style={{ flex: 1 }}>
              <Button buttonTitle="Move to Publish" small onPress={onNext} />
            </View>
          </View>
        </View>
      </ScrollView>
      <SlideSheet ref={refRBSheet} setHeight={'40%'}>
        <Text style={styles.headerText}>
          Save Availability 
        </Text>
        <Text style={styles.descriptionText}>
          You will be able to use this time block to use with your other offerings. Please provide a name
        </Text>
        <View style={{gap: 24}}>
          <InputField
            label="Availability Name"
            placeholder="Enter name"
          />
          <Button
            buttonTitle={'Save'}
            small
            onPress={() => refRBSheet.current.close()}
          />
        </View>
      </SlideSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  fieldGroup: {
    gap: 12
  },
  groupTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.Regular400,
  },
  groupHelper: {
    fontSize: 12,
    fontFamily: FONTS.SemiBold600,
    color: COLORS.lightGrey,
    marginTop: -6
  },
  dayCard: {
    backgroundColor: COLORS.iconBtnBgColor,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 24,
    gap: 24
  },
  dayCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: COLORS.grey,
    paddingBottom: 20
  },
  dayCardTitle: {
    color: COLORS.textSecondary,
    fontSize: 24,
    fontFamily: FONTS.SemiBold600
  },
  dayCardDelete: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.danger,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },

  headerRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center'
  },
  headerCell: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.Regular400,
    color: COLORS.lightGrey,
    textAlign: 'center',
  },
  headerCta: {
    width: 30,
    alignItems: 'flex-end'
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.Medium500,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  addBtn: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addBtnIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.white
  },
  deleteBtn: {
    width: 16,
    height: 16,
    backgroundColor: COLORS.danger,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteBtnIcon: {
    width: 12,
    height: 12,
    tintColor: COLORS.white
  },
  listInput: {
    textAlign: 'center',
    color: COLORS.white,
  },
  headerText: {
    color: COLORS.white,
    fontStyle: FONTS.SemiBold600,
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: -0.48,
    marginBottom: 12
  },
  descriptionText: {
    color: COLORS.lightGrey,
    fontFamily: FONTS.SemiBold600,
    fontSize: 12,
    marginBottom: 36,
  },
});