import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { COLORS } from '../../../../theme/colors';
import { FONTS } from '../../../../assets';
import InputField from '../../../../components/ui/InputField';
import SelectField from '../../../../components/ui/SelectField';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useServiceFormData } from '../FormContext';

const selectDays = Array.from({ length: 31 }, (_, i) => ({ title: (i + 1).toString() }));
const selectHours = Array.from({ length: 24 }, (_, i) => ({ title: (i + 1).toString() }));
const selectMinutes = Array.from({ length: 60 }, (_, i) => ({ title: (i + 1).toString() }));

const intialValues = {
  serviceName: '',
        days: '',
        hours: '',
        minutes: '',
        detailText: '',
        price: '',
        strikeOutPriceMSRP: '',
        rewardPointPrice: '',
        awardsPoint: '',
      }
export default function Info() {
  const {state, dispatch} = useServiceFormData()
  return (
    <Formik
      initialValues={state?.infoTab?.info||intialValues}
      validate={(values) => {
        const errors = {};
        if (!values.serviceName) {
          errors.serviceName = 'Service name is required';
          if (values.days || values.hours || values.minutes) {
            errors.serviceName = 'Fill Service Name before duration';
          }
        }

        if (values.serviceName && (!values.days || !values.hours || !values.minutes)) {
          if (!values.days) errors.days = 'Select days';
          if (!values.hours) errors.hours = 'Select hours';
          if (!values.minutes) errors.minutes = 'Select minutes';
        }

        if (
          values.serviceName &&
          values.days &&
          values.hours &&
          values.minutes &&
          !values.detailText
        ) {
          errors.detailText = 'Enter details after duration';
        }

        if (
          values.detailText &&
          !values.price
        ) {
          errors.price = 'Enter price after details';
        }

       if(Object.keys(errors).length === 0) {
         dispatch({
          type: 'UPDATE_FORM',
          formName: 'infoTab',
          payload: {info: values || ''}
        })  
       }

        return errors;
      }}
      validateOnChange
      validateOnBlur
      onSubmit={() => {}}
    >
      {({ values, errors, touched, setFieldValue }) => {
        console.log('Form Values:', values);
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              {/* Service Name */}
              <View style={styles.fieldGroup}>
                <Text style={styles.groupTitle}>
                  <Text style={{ color: COLORS.danger }}>*</Text>Service Name
                </Text>
                <InputField
                  placeholder="Write here"
                  value={values.serviceName}
                  onChangeText={(val) => setFieldValue('serviceName', val)}
                />
                {errors.serviceName && (
                  <Text style={styles.errorText}>{errors.serviceName}</Text>
                )}
              </View>

              {/* Duration */}
              <View style={styles.fieldGroup}>
                <Text style={styles.groupTitle}>
                  <Text style={{ color: COLORS.danger }}>*</Text>Duration
                </Text>
              </View>

              <View style={styles.fieldGroup}>
                <SelectField
                  label="Days"
                  placeholder="Select Days"
                  data={selectDays}
                  onSelect={(val) => setFieldValue('days', val.title)}
                />
                {errors.days && <Text style={styles.errorText}>{errors.days}</Text>}
              </View>

              <View style={styles.fieldGroup}>
                <SelectField
                  label="Hours"
                  placeholder="Select Hours"
                  data={selectHours}
                  onSelect={(val) => setFieldValue('hours', val.title)}
                />
                {errors.hours && <Text style={styles.errorText}>{errors.hours}</Text>}
              </View>

              <View style={styles.fieldGroup}>
                <SelectField
                  label="Minutes"
                  placeholder="Select Minutes"
                  data={selectMinutes}
                  onSelect={(val) => setFieldValue('minutes', val.title)}
                />
                {errors.minutes && <Text style={styles.errorText}>{errors.minutes}</Text>}
              </View>

              {/* Details */}
              <View style={styles.fieldGroup}>
                <Text style={styles.groupTitle}>
                  <Text style={{ color: COLORS.danger }}>*</Text>Details
                </Text>
                <InputField
                  placeholder="Write here"
                  multiline
                  value={values.detailText}
                  onChangeText={(val) => setFieldValue('detailText', val)}
                />
                {errors.detailText && (
                  <Text style={styles.errorText}>{errors.detailText}</Text>
                )}
              </View>

              {/* Price */}
              <View style={styles.fieldGroup}>
                <Text style={styles.groupTitle}>
                  <Text style={{ color: COLORS.danger }}>*</Text>Price
                </Text>
                <InputField
                  placeholder="Add price"
                  value={values.price}
                  keyboardType="numeric"
                  onChangeText={(val) => {
                    // Remove non-digit characters and leading $
                    const numeric = val.replace(/[^0-9]/g, '');
                    const formatted = numeric ? `$${numeric}` : '';
                    setFieldValue('price', formatted);
                  }}
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
              </View>

              {/* Optional Fields */}
              <View style={styles.fieldGroup}>
                <Text style={styles.groupTitle}>Show MSRP Strikeout Price</Text>
                <Text style={styles.groupHelper}>
                  Will show the strikeout price of the service creating an instant deal
                </Text>
                <InputField
                  placeholder="Add MSRP strikeout price"
                  value={values.strikeOutPriceMSRP}
                  keyboardType="numeric"
                  onChangeText={(val) => {
                    // Remove non-digit characters and leading $
                    const numeric = val.replace(/[^0-9]/g, '');
                    const formatted = numeric ? `$${numeric}` : '';
                    setFieldValue('strikeOutPriceMSRP', formatted);
                  }}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.groupTitle}>Reward Points Price</Text>
                <Text style={styles.groupHelper}>
                  This will show the buyer how many points they need to purchase this service using points only.
                </Text>
                <InputField
                  placeholder="Add reward points price"
                  value={values.rewardPointPrice}
                  keyboardType="numeric"
                  onChangeText={(val) => {
                    // Remove non-digit characters and leading $
                    const numeric = val.replace(/[^0-9]/g, '');
                    const formatted = numeric ? `$${numeric}` : '';
                    setFieldValue('rewardPointPrice', formatted);
                  }}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.groupTitle}>Award Points</Text>
                <Text style={styles.groupHelper}>
                  Define how many points a customer will receive for purchasing your service.
                </Text>
                <InputField
                  placeholder="Add award points"
                  value={values.awardsPoint}
                  keyboardType="numeric"
                  onChangeText={(val) => {
                    // Remove non-digit characters and leading $
                    const numeric = val.replace(/[^0-9]/g, '');
                    const formatted = numeric ? `$${numeric}` : '';
                    setFieldValue('awardsPoint', formatted);
                  }}
                />
              </View>
            </View>
          </ScrollView>
        );
      }}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
  },
  fieldGroup: {
    gap: 12,
  },
  groupTitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: FONTS.Regular400,
  },
  groupHelper: {
    fontSize: 10,
    fontFamily: FONTS.SemiBold600,
    color: COLORS.lightGrey,
    marginTop: -6,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: -6,
  },
});
