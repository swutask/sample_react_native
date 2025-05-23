import {
  SectionList,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FONTS} from '../../../assets';
import {COLORS} from '../../../theme/colors';
import Search from '../../../components/services/Search';
import {Images} from '../../../assets/Images';
import Button from '../../../components/global/Button';
import apiService from '../../../api/apiService';
import LoaderContainer from '../../../components/ui/LoaderContainer';
import {useQuery} from '@tanstack/react-query';
import {useServiceFormData} from './FormContext';

export default function Category({onNext, onSearchScreen = false}) {
  const {state, dispatch} = useServiceFormData();
  const [searchCategory, setSearchCategory] = useState('');
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const saveCardData = async item => {
    dispatch({
      type: 'UPDATE_FORM',
      formName: 'category',
      payload: {category: item},
    });
  };

  // React Query serviceCategory API
  const {
    data: fetchedServiceCategory,
    isLoading,
  } = useQuery({
    queryKey: ['serviceCategory'],
    queryFn: () => apiService.serviceCategory(state.type?.service_type),
  });

  const transformed = fetchedServiceCategory?.data.map(category => ({
    title: category.name,
    data: category.subcategories,
  }));
  const filteredSectionstitle = transformed?.filter(section =>
    section.title.toLowerCase().includes(searchCategory.toLowerCase()),
  );
  console.log("fetchedServiceCategory ", fetchedServiceCategory)

  const handleSelection = (text, selectItem) => {
    setSearchCategory(text);
    setTitle(text);
    setSelected(selectItem);
  };

  // React Query serviceSubCategory API
  const {
    data: fetchedSubCategory,
    isLoading: subCategoryLoading,
    refetch,
  } = useQuery({
    queryKey: ['serviceSubCategory', selectedId],
    queryFn: () => {
      if (!selectedId) throw new Error('No selected ID');
      return apiService.serviceSubCategory(selectedId);
    },
    enabled: false, // don't auto-run
  });

  useEffect(() => {
    if (!selectedId) return;
    refetch();
  }, [selectedId]);

  if (isLoading) {
    return <LoaderContainer color={COLORS.white} />;
  }
  return (
    <>
      {searchCategory !== title || title === '' ? (
        <View style={{flex: 1}}>
          {onSearchScreen ? null : (
            <Search onSearchChange={setSearchCategory} />
          )}
          <Text
            style={[styles.HeaderTitle, onSearchScreen ? {marginTop: 0} : {}]}>
            Select Category
          </Text>
          <SectionList
            sections={filteredSectionstitle}
            keyExtractor={(item, index) => item + index}
            renderItem={({item, section, index}) => (
              <TouchableOpacity
                onPress={() => {
                  handleSelection(section.title, item);
                  setSelectedId(item._id);
                }}>
                <View style={styles.section}>
                  <Text style={styles.sectionItem}>{item.name}</Text>
                  <Image
                    source={Images.CaretRight}
                    style={{height: 16, width: 16}}
                  />
                </View>
              </TouchableOpacity>
            )}
            renderSectionHeader={({section: {title}}) => (
              <Text style={[styles.header]}>{title}</Text>
            )}
          />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View style={styles.row}>
              <Text style={styles.selectedCategoryText}>{searchCategory}</Text>
              <TouchableOpacity onPress={() => setSearchCategory('')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {transformed.map((section, index) => {
              if (section.title === searchCategory) {
                return (
                  <View key={index} style={{paddingBottom: 120}}>
                    <View style={{marginBottom: 24}}>
                      <FlatList
                        horizontal={true}
                        data={section.data}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item}) => (
                          <TouchableOpacity
                            onPress={() => {
                              setSelected(item), setSelectedId(item._id);
                            }}>
                            <Text
                              style={[
                                styles.selectedCategoryItem,
                                item === selected
                                  ? {
                                      backgroundColor: COLORS.primary,
                                      color: COLORS.white,
                                      borderColor: COLORS.primary,
                                    }
                                  : null,
                              ]}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        )}
                        keyExtractor={(item, idx) => idx.toString()}
                      />
                    </View>

                    <FlatList
                      columnWrapperStyle={{
                        justifyContent: 'space-between',
                        gap: 8,
                      }}
                      contentContainerStyle={{height:subCategoryLoading?'100%':null}}
                      numColumns={2}
                      data={fetchedSubCategory?.data}
                      ListEmptyComponent={subCategoryLoading?<LoaderContainer color={COLORS.white} />:null}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={[
                            styles.gridViewStyle,
                            selectedBusiness === item.name
                              ? {backgroundColor: COLORS.primary}
                              : null,
                          ]}
                          onPress={() => {
                            setSelectedBusiness(item.name), saveCardData(item);
                          }}>
                          <Image
                            source={{uri: item.image}}
                            style={styles.gridImage}
                          />
                          <Text
                            style={[
                              styles.gridText,
                              selectedBusiness === item.name
                                ? {color: COLORS.white}
                                : null,
                            ]}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={item => item._id}
                    />
                  </View>
                );
              } else {
                return null;
              }
            })}
          </View>
          <Button small buttonTitle="Next" onPress={onNext} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  HeaderTitle: {
    fontFamily: FONTS.Regular400,
    color: COLORS.textSecondary,
    marginTop: 24,
    fontSize: 16,
  },
  selectedCategoryText: {
    fontFamily: FONTS.SemiBold600,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: FONTS.SemiBold600,
    color: COLORS.primary,
  },
  header: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: FONTS.Regular400,
    marginBottom: 24,
    paddingTop: 24,
    backgroundColor: COLORS.background,
  },
  sectionItem: {
    fontSize: 12,
    fontFamily: FONTS.Regular400,
    color: COLORS.textSecondary,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderColor: '#2E2E2E',
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  selectedCategoryItem: {
    marginEnd: 8,
    color: COLORS.lightGrey,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 2,
    fontFamily: FONTS.Medium500,
  },
  gridViewStyle: {
    borderRadius: 6,
    backgroundColor: COLORS.iconBtnBgColor,
    padding: 10,
    gap: 12,
    flex: 1 / 2,
    marginBottom: 8,
  },
  gridImage: {
    height: 140,
    width: '100%',
    borderRadius: 4,
  },
  gridText: {
    fontFamily: FONTS.Medium500,
    fontSize: 14,
    lineHeight: 16,
    color: COLORS.lightGrey,
  },
  button: {
    backgroundColor: COLORS.primary, // Custom background color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white, // Text color
    fontSize: 14,
    fontWeight: FONTS.SemiBold600,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
});
