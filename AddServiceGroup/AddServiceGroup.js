import { ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react'
import Info from './Info';
import Highlights from './Highlights';
import Members from './Members';
import { COLORS } from '../../../../theme/colors';
import { FONTS } from '../../../../assets';
import Header from '../../../../components/ui/Header';
import Button from '../../../../components/global/Button';
import { goBack, navigate } from '../../../../utils/navigations';
import { FormDataProvider } from '../FormContext';

const steps = [
  {label: 'Info', content: Info},
  {label: 'Highlight', content: Highlights},
  {label: 'Members', content: Members},
];

const AddServiceGroup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const handleTabChange = (index) => {
    setCurrentStep(index);
  };

  return (
    <FormDataProvider>
    <View style={{flex:1}}>
      <Header isBack title="Add Service" />
      <View style={styles.wrapper}>
        <View style={styles.tabBar}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {steps.map((step, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleTabChange(idx)}
              >
                <Text
                  style={[
                    styles.tabBarCta,
                    currentStep === idx ? {color: COLORS.white, backgroundColor: COLORS.primary }: null]}>
                  {step.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{flex: 1, paddingBottom: -10}}>
          {steps.map(({content: Content}, idx) => {
            if (currentStep === idx) {
              return <Content key={idx} />; // Display the correct content based on the currentStep
            }
            return null;
          })}
        </View>
        {/* <Button buttonTitle="Save & Next" small onPress={()=> currentStep > 1 ? navigate('AddServices') : setCurrentStep(currentStep + 1)} /> */}
      </View>
    </View>
    </FormDataProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  tabBar: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 24,
  },
  tabBarCta: {
    backgroundColor: COLORS.iconBtnBgColor,
    borderRadius: 6,
    color: COLORS.lightGrey,
    fontSize: 14,
    fontFamily: FONTS.Medium500,
    marginEnd: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default AddServiceGroup