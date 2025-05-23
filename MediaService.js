import React, {useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FONTS } from '../../../assets'
import { Images } from '../../../assets/Images'
import Button from '../../../components/global/Button'
import MediaPickerCard from '../../../components/services/MediaPickerCard'
import MultiMediaPickerCard from '../../../components/services/MultiMediaPickerCard'
import InputField from '../../../components/ui/InputField'
import SelectField from '../../../components/ui/SelectField'
import { COLORS } from '../../../theme/colors'
import VideoPickerCard from '../../../components/services/VideoPickerCard'
import apiService from '../../../api/apiService'
import { useServiceFormData } from './FormContext'

export default function MediaService({onNext}) {
  const { state } = useServiceFormData();

  const [imageList, setImageList] = useState([]);
  const [uploadVideo, setUploadVideo] = useState(null);
  const [customFieldType, setCustomFieldType] = useState(null);
  const [customFieldName, setCustomFieldName] = useState('');
  const [customUploadFieldName, setCustomUploadFieldName] = useState('');
  const [customFieldDescription, setCustomFieldDescription] = useState('');
  const [customFieldImage, setCustomFieldNImage] = useState(null);
  const [createField, setCreateField] = useState([{ type: 'Text Field', label: '', value: '', file: '' }]);

  const onCreateField = () => {
    setCreateField(prev => [...prev, { type: 'Text Field', label: '', value: '', file: '' }]);
  };

  const onFieldType = (item, index) => {
    setCreateField(prev => {
      prev[index].type = item.title;
      return [...prev];
    });
    setCustomFieldType(item.title);
  };

const handleMediadraftData = async() => {
  const formData = new FormData();

  formData.append('subCategoryType', state.detail.detail?.subcategoryId.replace(/'/g, ''));
  formData.append('cardName', state.detail.detail?.cardname);
  formData.append('cardImage', {
    uri: state.detail.detail?.cardImage?.uri,
    name: state.detail.detail?.cardImage?.fileName || 'card.jpg',
    type: state.detail.detail?.cardImage?.type || 'image/jpeg',
  });

  formData.append('serviceGroups', JSON.stringify(state.addServiceData?.handleAddItem || []));

  // Images
  imageList?.forEach((img, index) => {
    formData.append('serviceImages', {
      uri: img.uri,
      name: img.fileName || `image${index}.jpg`,
      type: img.type || 'image/jpeg',
    });
  });

  // Video
  if (uploadVideo) {
    formData.append('serviceVideo', {
      uri: uploadVideo.uri,
      name: uploadVideo.fileName || 'video.mp4',
      type: uploadVideo.type || 'video/mp4',
    });
  }

  // Custom Fields
  formData.append('customFields[0][type]', customFieldType === "Upload Field" ? "UPLOAD": "TEXT");
  formData.append('customFields[0][name]', customFieldName);
  formData.append('customFields[0][value]', customFieldDescription);

  if (customFieldType === 'Upload Field' && customFieldImage) {
    formData.append('customFields[1][type]', customFieldType === "Upload Field" ? "UPLOAD": "TEXT");
    formData.append('customFields[1][name]', customFieldName);
    formData.append('customFields[1][value]', {
      uri: customFieldImage.uri,
      name: customFieldImage.fileName || 'upload.jpg',
      type: customFieldImage.type || 'image/jpeg',
    });
  }
  
  // const result = await apiService.saveServiceMediaDraft(formData)
  
};

  return (
    <View style={{ flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: 36}}>
          <View style={styles.fieldGroup}>
            <Text style={styles.groupTitle}><Text style={{ color: COLORS.danger}}>*</Text>Images</Text>
            <Text style={styles.groupHelper}>Upload a Images for your event: (.jpg, .gif, .png)</Text>
            <MultiMediaPickerCard showUploadBtn onSelect={(data)=> setImageList(data)}/>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.groupTitle}>Upload Video File <Text style={{ color: COLORS.lightGrey, fontFamily: FONTS.Regular400, fontSize: 14}}>(Optional)</Text></Text>
            <Text style={styles.groupHelper}>There is significant data that suggest videos will increase your conversation by double digits number. Create one now or upload from your albuim</Text>
            <VideoPickerCard showUploadBtn onSelect={(data)=> setUploadVideo(data)}/>
          </View>
          <View style={styles.fieldGroup}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={styles.groupTitle}>Create Custom Field</Text>
              <TouchableOpacity onPress={onCreateField}>
                <Image source={Images.AddImage} style={{ width: 16, height: 16}} />
              </TouchableOpacity>
            </View>
            <Text style={styles.groupHelper}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</Text>
            <View style={{ gap: 24, paddingTop: 12}}>
              {createField.map((item, index) => (
                <View key={index} style={[styles.groupInner, createField.length - 1 === index ? { borderBottom: 0, paddingBottom: 0} : null]}>
                  <SelectField defaultValue={item.type} placeholder='Text Field' onSelect={(event)=> onFieldType(event, index)} data={[{title: 'Text Field'}, {title: 'Upload Field'}]} />
                  {item.type === 'Text Field' ? (
                    <>
                      <InputField placeholder="Text Field Name" value={customFieldName} onChangeText={(text)=> setCustomFieldName(text)}/>
                      <InputField placeholder="Write here" multiline minHeight={140} value={customFieldDescription} onChangeText={(text)=> setCustomFieldDescription(text)}/>
                    </>
                  ) : null}
                  {item.type === 'Upload Field' ? (
                    <>
                      <InputField placeholder="Upload Field Name" value={customUploadFieldName} onChangeText={(text)=> setCustomUploadFieldName(text)}/>
                      <MediaPickerCard onSelect={(data)=> setCustomFieldNImage(data)}/>
                    </>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
          <View style={styles.ctaWrap}>
            <View style={styles.ctaWrapItem}>
              <Button buttonTitle="Save" small type="danger" onPress={handleMediadraftData} />
            </View>
            <View style={styles.ctaWrapItem}>
              <Button buttonTitle="Move to Hours" small onPress={onNext} />
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
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: FONTS.SemiBold600,
  },
  groupHelper: {
    fontSize: 12,
    fontFamily: FONTS.SemiBold600,
    color: COLORS.lightGrey,
    marginTop: -6
  },
  groupInner: {
    gap: 8,
    borderBottomWidth: 1,
    borderColor: COLORS.iconBtnBgColor,
    paddingBottom: 24,
  },
  ctaWrap: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 18
  },
  ctaWrapItem: {
    flex: 1
  },
});