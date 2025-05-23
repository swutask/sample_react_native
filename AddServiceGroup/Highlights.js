import {StyleSheet, Text, View, TouchableOpacity,FlatList, Image} from 'react-native';
import React, { useRef, useState } from 'react';
import { FONTS, ICONS } from '../../../../assets';
import { COLORS } from '../../../../theme/colors';
import SlideSheet from '../../../../components/global/SlideSheet';
import SelectField from '../../../../components/ui/SelectField';
import InputField from '../../../../components/ui/InputField';
import { Images } from '../../../../assets/Images';
import Button from '../../../../components/global/Button';
import { useServiceFormData } from '../FormContext';

// Initial Data
const initialDataList = [];

const showList = [{ label: 'Yes' }, { label: 'No' }];

// List Item Component
const Item = ({ data, onDelete }) => (
  <View style={styles.listItem}>
    <View style={styles.listItemWrap}>
      <Text style={styles.listItemTitle}>{data.name}</Text>
    </View>
    <View
      style={[styles.listItemWrap, { alignItems: 'center', justifyContent: 'center' }]}>
      {data.type === 'EDIT_TEXT' ? (
        <Text style={styles.listItemValue}>{data.value}</Text>
      ) : (
        <>{data.value ? <ICONS.Checked /> : <ICONS.UnCheck />}</>
      )}
    </View>
    <View style={[styles.listItemWrap, { alignItems: 'flex-end' }]}>
      <TouchableOpacity onPress={onDelete}>
        <ICONS.Close />
      </TouchableOpacity>
    </View>
  </View>
);

// Add Highlight Form Component
const AddHighlight = ({ onSave, isList, setIsList, handleHighlightList}) => {
  const [checkSelected, setCheckSelected] = useState();
  const [showType, setShowType] = useState('Yes');
  const [highlightName, setHighlightName] = useState('');
  const [addEditText, setAddEditText] = useState('');

  const onSelect = (item) => {
    setCheckSelected(item.title);
  };

 const handleAdd = () => {
  if (!highlightName || !checkSelected) return;
  const lastId = isList.length > 0 ? isList[isList.length - 1].id : 0;
  const newItem = {
    // id: lastId + 1,
    name: highlightName,
    type: checkSelected === "Edittext" ? 'EDIT_TEXT' : 'SHOW_ONLY',
    value: checkSelected === 'Edittext' ? addEditText : showType === 'Yes',
    // editText: checkSelected === 'Edittext' ? addEditText : '',
  };
  // setIsList((prev) => [...prev, newItem]);
   const updatedList = [...isList, newItem];
    setIsList(updatedList);

    // ✅ Dispatch to context
    handleHighlightList(updatedList);
  // Reset fields
  setHighlightName('');
  setAddEditText('');
  setCheckSelected(null);
  setShowType('Yes');
  onSave();
};
  return (
    <View style={styles.addHighlight}>
      <View style={{ flex: 1, gap: 24 }}>
        <Text style={styles.addHighlightTitle}>Add Highlight</Text>
        <Text style={styles.addHighlightDes}>
          Please select your method of delivery. On location can only be selected individually and cannot be selected together.
        </Text>
        <SelectField
          onSelect={onSelect}
          label="Highlight Type"
          placeholder="Select type"
          data={[{ title: 'Show Only' }, { title: 'Edittext' }]}
        />
        <InputField
          label="Highlight Name"
          placeholder="Enter here"
          value={highlightName}
          onChangeText={setHighlightName}
        />
        {checkSelected === 'Edittext' ? (
          <InputField
            label="Add Edittext"
            placeholder="Enter here"
            value={addEditText}
            onChangeText={setAddEditText}
          />
        ) : (
          <View style={styles.checkList}>
            <Text style={styles.checkListTitle}>Show Only As</Text>
            {showList.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => setShowType(item.label)}>
                <View style={styles.checkListItem}>
                  <Text style={styles.checkListLabel}>{item.label}</Text>
                  <Image
                    style={styles.checkListIcon}
                    tintColor={
                      item.label === showType ? COLORS.primary : COLORS.placeHolderColor
                    }
                    source={
                      item.label === showType
                        ? Images.CheckedIconn
                        : Images.UncheckedIconn
                    }
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Button buttonTitle="Save" small onPress={handleAdd} />
    </View>
  );
};

export default function Highlights() {
  const [isList, setIsList] = useState(initialDataList);
  const addHighlightModal = useRef();
  const {state, dispatch} = useServiceFormData()
  const onDelete = (item) => {
    // setIsList((prev) => prev.filter((v) => v.id !== item.id));
  const updatedList = isList.filter((v) => v.name !== item.name);
  setIsList(updatedList);
  handleHighlightList(updatedList);
  };
  const handleHighlightList = (updatedList) => {
    dispatch({
    type: 'UPDATE_FORM',
    formName: 'Highlights',
    payload: {Highlight: updatedList}
  })
  }
  return (
    <View style={styles.wrapper}>
      <View style={styles.addServiceGroupContainer}>
        <Text style={styles.textStyle}>Add Highlight Text</Text>
        <TouchableOpacity onPress={() => addHighlightModal.current.open()}>
          <ICONS.AddButton height={40} width={40} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={isList}
        renderItem={({ item, index }) => (
          <Item data={item} onDelete={() => onDelete(item)} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <SlideSheet ref={addHighlightModal} setHeight={'70%'}>
        <AddHighlight
          onSave={() => addHighlightModal.current.close()}
          isList={isList}
          setIsList={setIsList}
          handleHighlightList={handleHighlightList}
        />
      </SlideSheet>
    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    gap: 24,
  },
  addServiceGroupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textStyle: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.Regular400,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  listItemTitle: {
    fontSize: 14,
    fontFamily: FONTS.Medium500,
    color: COLORS.textSecondary,
  },
  listItemWrap: {
    flex: 1
  },
  listItemValue: {
    padding: 12,
    paddingBottom: 10,
    textAlign: 'center',
    color: COLORS.lightGrey,
    fontFamily: FONTS.Regular400,
    fontSize: 16,
    backgroundColor: COLORS.iconBtnBgColor,
    borderRadius: 6,
    minWidth: 42
  },
  addHighlight: {
    gap: 24,
    flex: 1,
    paddingBottom: 60
  }, 
  addHighlightTitle: {
    fontFamily: FONTS.SemiBold600,
    fontSize: 20,
    color: COLORS.white,
    textAlign: 'center',
  },
  addHighlightDes: {
    fontSize: 12,
    fontFamily: FONTS.SemiBold600,
    color: COLORS.lightGrey,
    lineHeight: 16
  },
  checkList: {
    gap: 24
  },
  checkListTitle: {
    textAlign: 'center',
    color: COLORS.lightGrey,
    fontSize: 12,
    fontFamily: FONTS.Regular400
  },
  checkListItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  checkListLabel: {
    color: COLORS.lightGrey,
    fontSize: 12,
    fontFamily: FONTS.Regular400,
    minWidth: 38
  },
  checkListIcon: {
    width: 16,
    height: 16,
    objectFit: 'contain',
  }
});
