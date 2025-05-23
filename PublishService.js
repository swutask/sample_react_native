import { FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { PublishGridList } from '../../../constants'
import { COLORS } from '../../../theme/colors'
import { FONTS } from '../../../assets'
import SelectField from '../../../components/ui/SelectField'
import InputField from '../../../components/ui/InputField'
import { Images } from '../../../assets/Images'
import Button from '../../../components/global/Button'

export default function PublishService({onNext}) {
  return (
    <View style={{flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: 36 }}>
          <View style={styles.fieldGroup}>
            <Text style={styles.groupTitle}>Delivery Method</Text>
            <Text style={styles.groupHelper}>Please select you method of delivery. On location can only be  selected invidually and cannot be selected with other delivery option.</Text>
            <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 12 }}>
              <FlatList
                data={PublishGridList}
                numColumns={2}
                renderItem={({item}) => {
                  const {name, img: IconComponent} = item;
                  return (
                    <View style={styles.itemView}>
                      <View style={styles.image}>
                        <IconComponent height={24} width={24} />
                      </View>
                      <Text style={styles.itemTextStyle}>{name}</Text>
                    </View>
                  );
                }}
                keyExtractor={item => item.id}
              />
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.groupTitle}>Location & Coverage Area</Text>
          </View>
          <View style={{ gap: 24 }}>
            <View style={styles.fieldGroup}>
              <Text style={styles.groupTitle}><Text style={{ color: COLORS.danger}}>*</Text>Service Tracker</Text>
              <Text style={styles.groupHelper}>Choose between tracking your location to show your service within your city and state or based on the address below. You can revert to either option later.</Text>
              <SelectField placeholder='Select tracker' data={[{ title: 'Use Service address listed below'}]} />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.groupTitle}><Text style={{ color: COLORS.danger}}>*</Text>Service Visibility</Text>
              <Text style={styles.groupHelper}>Your service will be visible to customers who are physically located in the below City & State, as well as those who have manually set their location to the City & State listed below</Text>
            </View>
            <View style={styles.fieldGroup}>
              <InputField label="Physcial Service Address" placeholder="Write here" />
            </View>
          </View>
          <View style={{ gap: 24 }}>
            <Text style={styles.addressText}>City based on above address</Text>
            <Text style={styles.addressText}>New York CIty</Text>
            <Text style={styles.addressText}>State based on above address</Text>
            <Text style={styles.addressText}>New York</Text>
          </View>
          <View>
            <Image source={Images.map} style={{width: '100%', height: 230, objectFit: 'cover'}} />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.groupTitle}>Meet Up Range</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
                <View style={{ flex: 1 }}>
                  <SelectField placeholder='Select value' data={Array.from({ length: 60 }, (_, index) => ({ title: (index + 1).toString() }))} />
                </View>
                <View style={{ flex: 1 }}>
                  <SelectField placeholder='Select range' data={[{ title: 'Miles' }]} />
                </View>
              </View>
          </View>
          <View style={{gap: 24}}>
            <View style={styles.fieldGroup}>
              <Text style={styles.groupTitle}><Text style={{ color: COLORS.danger}}>*</Text>Terms & Conditions</Text>
              <Text style={styles.groupHelper}>Please select you method of delivery. On location can only be  selected invidually and cannot be selected with other delivery option.</Text>
            </View>
            <View style={styles.fieldGroup}>
              <InputField placeholder="Type Here" minHeight={155} multiline />
            </View>
            <Text  style={[styles.groupHelper, { textAlign: 'center'}]}>Or</Text>      
            <View style={{ width: '50%', alignSelf: 'center' }}>
              <Button buttonTitle="Click Here to upload" type='warning' small />
            </View>
          </View>
          <View style={{flexDirection: 'row', gap: 12}}>
            <View style={{ flex: 1 }}>
              <Button
                type='secondary' 
                buttonTitle={'Save'}
                small
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button 
                onPress={onNext}
                small
                type="success"
                buttonTitle={'Publish'}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 12
  },
  groupTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.SemiBold600,
  },
  groupHelper: {
    fontSize: 12,
    fontFamily: FONTS.Medium500,
    color: COLORS.lightGrey,
    marginTop: -6
  },
  addressText: {
    fontFamily: FONTS.Medium500, 
    fontSize: 12, 
    color: COLORS.white
  },
  image: {
    height: 48, 
    width: 48, 
    backgroundColor: COLORS.background, 
    borderRadius: 4, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  itemView: {
    width: 85,
    backgroundColor: COLORS.iconBtnBgColor,
    borderRadius: 6,
    padding: 10,
    marginHorizontal: 12,
    marginBottom: 24,
    gap: 10,
    alignItems: 'center'
  },
  itemTextStyle:{
    fontFamily: FONTS.Regular400,
    fontSize: 12,
    color: COLORS.white,
    textAlign: 'center',
  },
})