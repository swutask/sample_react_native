import React, {useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FONTS } from '../../../assets';
import { COLORS } from '../../../theme/colors';
import Category from './Category';
import Detail from './Detail';
import HoursService from './HoursService';
import MediaService from './MediaService';
import PublishService from './PublishService';
import Services from './Services';
import Type from './Type';
import Header from '../../../components/ui/Header';
import Chip from '../../../components/ui/Chip';
import { FormDataProvider } from './FormContext';

const steps = [
  {label: 'Type', content: Type},
  {label: 'Category', content: Category},
  {label: 'Detail', content: Detail},
  {label: 'Services', content: Services},
  {label: 'Media', content: MediaService},
  {label: 'Hours', content: HoursService},
  {label: 'Publish', content: PublishService},
];
const isDev = process.env.NODE_ENV === "development"

export default function AddServices() {
  const [currentStep, setCurrentStep] = useState(0);
  const [header, setHeader] = useState('Add Service');
  const scrollViewRef = useRef(null);
  console.log(process.env)

  const handleScrollToActivePill = () => {
    scrollViewRef.current.scrollTo({
      x: currentStep * 120,
      animated: true,
    });
  };

  const handleNext = () => {
    setCurrentStep(prevStep => {
      const nextStep = prevStep < steps.length - 1 ? prevStep + 1 : 0;

      // Update header based on the new step
      // setHeader(nextStep === 0 ? 'Add Service' : nextStep === 3 ? 'Service Group' : 'Add Services');
      
      return nextStep;
    });
    if (currentStep === 6) {
      scrollViewRef.current.scrollTo({
        x: 0, // Scroll to the "Type" pill (first pill)
        animated: true,
      });
    } else {
      handleScrollToActivePill(); // Otherwise, scroll to the active pill
    }
  };

  return (
    <FormDataProvider>
    <View style={{flex: 1}}>
      <Header isBack title={header} />
      <View style={styles.tabView}>
        <ScrollView
          style={{paddingHorizontal: 16}}
          ref={scrollViewRef}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {steps.map((step, idx) => (
            <TouchableOpacity key={idx} style={{ marginRight: 12}} onPress={() => (currentStep >= idx ||isDev) ? setCurrentStep(idx) : null}>
              <Chip label={step.label} active={currentStep === idx} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={{flex: 1, paddingHorizontal: 16, paddingBottom: 21}}>
        {steps.map(({content: Content}, idx) => {
          console.log(idx, currentStep);
          if (currentStep === idx) {
            // Pass handleNext to every content component
            return <Content key={idx} onNext={handleNext} />;
          }
          return null;
        })}
      </View>
    </View>
    </FormDataProvider>
  );
}

const styles = StyleSheet.create({
  tabView: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 24,
  },
});
