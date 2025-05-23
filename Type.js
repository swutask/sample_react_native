import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../../../theme/colors';
import {FONTS} from '../../../assets';
import Button from '../../../components/global/Button';
import apiService from '../../../api/apiService';
import LoaderContainer from '../../../components/ui/LoaderContainer';
import {useQuery} from '@tanstack/react-query';
import {useServiceFormData} from './FormContext';


export default function Type({onNext}) {
  const {dispatch} = useServiceFormData();
  const [selected, setSelected] = useState();

  // React Query
  const {
    data: fetchedServiceTypes,
    error,
    isLoading
  } = useQuery({
    queryKey: ['serviceTypes'],
    queryFn:  apiService.serviceType
  }); 

  if (isLoading) {
    return <LoaderContainer color="white" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
 
  return (
    <View style={{flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.textStyle}>Select Service Type</Text>
        <View style={styles.container}>
          {fetchedServiceTypes.data.map(item => (
            <TouchableOpacity
              key={item._id}
              onPress={() => {
                dispatch({
                  type: 'UPDATE_FORM',
                  formName: 'type',
                  payload: {service_type: item._id},
                });
                setSelected(item._id);
              }}>
              <View
                style={[
                  styles.card,
                  selected === item._id
                    ? {backgroundColor: COLORS.primary}
                    : null,
                ]}>
                <View style={styles.cardContent}>
                  <View style={styles.imageStyle}>
                    <Image
                      source={{uri: item.image}}
                      style={{width: 48, height: 48}}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.label}>{item.serviceType}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={{paddingTop: 16}}>
        <Button small buttonTitle="Next" onPress={onNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 24,
    marginTop: 48,
  },
  textStyle: {
    fontFamily: FONTS.SemiBold600,
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    width: 160,
    height: 177,
    borderRadius: 6,
    backgroundColor: COLORS.iconBtnBgColor,
    padding: 20,
    gap: 24,
  },
  imageStyle: {
    height: 96,
    width: 96,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  label: {
    color: COLORS.white,
    fontFamily: FONTS.Regular400,
    fontSize: 24,
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.white,
    fontSize: 16,
  },
});
