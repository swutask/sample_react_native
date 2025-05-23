import { ScrollView, StyleSheet, Text, View} from 'react-native'
import React, {useState } from 'react'
import { FONTS } from '../../../assets';
import MediaPickerCard from '../../../components/services/MediaPickerCard';
import { COLORS } from '../../../theme/colors';
import Button from '../../../components/global/Button';
import InputField from '../../../components/ui/InputField';
import { useServiceFormData } from './FormContext';


export default function Detail({onNext}) {
    const {state, dispatch} = useServiceFormData();
  
  const [title, setTitle] = useState(state.category?.category || '')
  const [name, setName] = useState('');
  const [selectPic, setSelectPic] = useState('');
 
  const onSelectMedia = (val) => {
    setSelectPic(val)
  }
  
  const data = {
    subcategoryId: title._id,
    cardname: name,
    cardImage: selectPic
  }
  const dispatchDetailData = () =>{
     dispatch({
      type: 'UPDATE_FORM',
      formName: 'detail',
      payload: {detail: data},
    });
  } 

  console.log("Detail ", name, title.name, selectPic)

  return (
    <View style={styles.container}>
      <ScrollView style={{ marginBottom: 20}}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Your category name will be shown as
          </Text>
          <Text style={[styles.headerText, { color: COLORS.warning }]}>{title.name}</Text>
        </View>
        <View style={styles.wrapper}>
          <View style={styles.formGroup}>
            <Text style={styles.formGroupLabel}>Enter Custom Name</Text>
            <InputField 
            placeholder="Write here" 
            onChangeText={text => setName(text)}
            value={name}/>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formGroupLabel}>Card Image</Text>
            <MediaPickerCard onSelect={onSelectMedia}/>
          </View>
        </View>
      </ScrollView>
      <Button small buttonTitle="Next" onPress={()=> {onNext(), dispatchDetailData()}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    gap: 6,
    marginBottom: 24
  },
  headerText: {
    fontSize: 12,
    lineHeight: 22,
    color: COLORS.textSecondary,
    fontFamily: FONTS.Medium500,
    textAlign: 'center',
  },
  wrapper: {
    gap: 18
  },
  formGroup: {
    gap: 6
  },
  formGroupLabel: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: FONTS.Regular400,
  },
  cardImage: {
    height: 200,
    width: '100%',
    backgroundColor: '#252525',
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6
  },
})