
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, FlatList, Pressable, View, TextInput, TouchableOpacity, Platform } from 'react-native';
import AppWrapper from '../../../components/global/AppWrapper';
import { FONTS, ICONS } from '../../../assets';
import { COLORS } from '../../../theme/colors';

export default function AddHighLights() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Show Only');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isvalue, setIsValue] = useState('Revisions')

  const options = [
    { label: 'Show Only', value: 'Revisions' },
    { label: 'Edittext', value: 'Routes' },
  ];

  const handleSelectOption = (option) => {
    setSelectedOption(option.label);
    setIsModalVisible(false); // Close the modal after selecting an option
    setIsValue(option.value)
  };

  return (
    <AppWrapper>
      {/* Main Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.textStyle}>Add Highlight</Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: FONTS.SemiBold600,
                color: COLORS.lightGrey,
                marginVertical: 27,
              }}>
              Please select your method of delivery. On location can only be
              selected individually and cannot be selected together.
            </Text>
            <Text style={styles.label}>Highlight Type</Text>
            <View>
              {/* TextInput to trigger the inner modal */}
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <View style={styles.dayInputView}>
                  <TextInput
                    style={styles.dayInputStyle}
                    value={selectedOption}
                    inputMode="text"
                    editable={false}
                    placeholderTextColor={COLORS.placeHolderColor}
                    fontSize={14}
                  />
                  <ICONS.CaretRight />
                </View>
              </TouchableOpacity>

              {/* Inner Modal for selecting an option */}
              <Modal
                visible={isModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}>
                <TouchableOpacity
                  style={styles.modalBackground}
                  onPress={() => setIsModalVisible(false)} // Close modal when clicking outside
                >
                  <View style={styles.innerModalContent}>
                    <FlatList
                      data={options}
                      keyExtractor={item => item.value}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={styles.option}
                          onPress={() => handleSelectOption(item)} // Select option when pressed
                        >
                          <Text style={styles.optionText}>{item.label}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
            <View
              style={{height: 1, backgroundColor: 'white', marginVertical: 22}}
            />
            <Text style={styles.label}>Highlight Name</Text>
            <View style={styles.dayInputView}>
              <TextInput
                style={styles.dayInputStyle}
                value={isvalue}
                inputMode="text"
                placeholderTextColor={COLORS.placeHolderColor}
                fontSize={14}
              />
            </View>

            {selectedOption === 'Show Only' ? (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{marginTop: 27}}>
                  <Text style={styles.label}>Show Only As</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 27,
                    }}>
                    <Text style={styles.label}>Yes</Text>
                    <ICONS.Checked />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 27,
                    }}>
                    <Text style={styles.label}>No</Text>
                    <ICONS.UnCheck />
                  </View>
                </View>
              </View>
            ) : (
              <>
                <Text style={[styles.label, {marginTop: 27}]}>
                  Add Edittext
                </Text>
                <View style={styles.dayInputView}>
                  <TextInput
                    style={styles.dayInputStyle}
                    value="42"
                    inputMode="numeric"
                    placeholderTextColor={COLORS.placeHolderColor}
                    fontSize={14}
                  />
                </View>
              </>
            )}
            <View style={{marginTop: 27, justifyContent:'center', alignItems:'center'}}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.buttonTextStyle}>Save</Text>
              </Pressable>
            </View>
            {/* <Text style={[styles.label, { marginTop: 27 }]}>Add Edittext</Text>
            <View style={styles.dayInputView}>
              <TextInput
                style={styles.dayInputStyle}
                value="42"
                inputMode="numeric"
                placeholderTextColor={COLORS.placeHolderColor}
                fontSize={14}
              />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ marginVertical: 27 }}>
                <Text style={styles.label}>Show Only As</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 27,
                  }}>
                  <Text style={styles.label}>Yes</Text>
                  <ICONS.Checked />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 27,
                  }}>
                  <Text style={styles.label}>No</Text>
                  <ICONS.UnCheck />
                </View>
              </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Save</Text>
              </Pressable>
            </View> */}
          </View>
        </View>
      </Modal>

      {/* Button to show the main modal */}
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonTextStyle}>Show Modal</Text>
      </Pressable>
    </AppWrapper>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayInputStyle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.SemiBold600,
    padding: 2
  },
  dayInputView: {
    backgroundColor: COLORS.secondary,
    height: 40,
    borderRadius: 6,
    marginTop: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical:Platform.OS === 'ios'? 15: 10
  },
  label: {
    fontFamily: FONTS.Regular400,
    fontSize: 12,
    color: COLORS.lightGrey,
    marginTop: 0,
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.black,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.white,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 3.84,
    elevation: 10,
  },
  button: {
    height: 40,
    width: 140,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 15,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: COLORS.primary,
  },
  textStyle: {
    fontFamily: FONTS.SemiBold600,
    fontSize: 20,
    color: COLORS.white,
    textAlign: 'center',
  },
  buttonTextStyle: {
    fontFamily: FONTS.SemiBold600,
    fontSize: 12,
    color: COLORS.white,
    textAlign: 'center',
  },
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black background
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerModalContent: {
    backgroundColor: 'white',
    width: 300,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  option: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  optionText: {
    color: 'white',
  },
});
