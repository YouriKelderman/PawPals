import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {ScrollView, View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import {Image} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import {ThemeContext} from "./ThemeContext"; // Ensure the correct path
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FavoriteContext} from "./FavoriteContext";
import {useTranslation} from "react-i18next";

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const BottomSheetParkList = ({parkData, onChange, changeRegion}) => {
    const {t} = useTranslation();
    const bottomSheetRef = useRef(null);
    const {theme, toggleTheme} = useContext(ThemeContext);
    const handleSheetChanges = useCallback((index) => {
        onChange(index);
    }, [onChange]);

    const saveData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
            console.log('Data saved');
        } catch (error) {
            console.log('Error saving data', error);
        }
    };
    const {favoritedItems, toggleFavorite} = useContext(FavoriteContext);

    const isFavorited = (itemId) => {
        return favoritedItems.includes(itemId);
    };

    const closeBottomSheet = () => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.snapToIndex(0);
        }
    };

    const tagColors = [
        { label: t('global.tags.social'), color: "#59a221" },
        { label: t('global.tags.nonsocial'), color: "#7A0012" },
        { label: t('global.tags.bigDogs'), color: "#6f4616" },
        { label: t('global.tags.smallDogs'), color: "#936025" },
        { label: t('global.tags.gated'), color: "#3B67EA" },
        { label: t('global.tags.open'), color: "#0F276D" }
    ];

    return (
        <BottomSheet
            snapPoints={[30, '70%', '100%']}
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
        >
            <BottomSheetView style={{
                flex: 1,
                alignItems: 'center',
                padding: 16,
                backgroundColor: theme.colors.div,
            }}>
                <Text style={{color: theme.colors.textColor}}>Hotspots</Text>
                <FlatList
                    style={{flex: 1, width: '100%'}}
                    data={parkData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                        <View style={{
                            width: '100%',
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <TouchableOpacity onPress={() => {
                                changeRegion(item);
                                closeBottomSheet()
                            }} style={styles.itemContainer}>
                                <Image
                                    style={styles.image}
                                    source={{uri: item.url}}
                                    resizeMode="cover"
                                />
                                <View>
                                    <Text style={{
                                        fontSize: 20,
                                        marginBottom: 0,
                                        fontWeight: '900',
                                        color: theme.colors.lighterText,
                                    }}>{item.name}</Text>
                                    <Text style={{
                                        fontStyle: 'italic',
                                        marginBottom: 14,
                                        color: theme.colors.textColor
                                    }}>{item.description}</Text>
                                    <ScrollView horizontal={true}
                                                style={{flexWrap: 'wrap', width: 190, position: 'relative'}}>
                                        <FlatList
                                            data={item.tags}
                                            keyExtractor={(tag, index) => index.toString()}
                                            horizontal
                                            renderItem={({item}) => (
                                                <Text style={{
                                                    fontSize: 12,
                                                    backgroundColor: tagColors[item[1]].color,
                                                    color: '#fff',
                                                    borderRadius: 5,
                                                    padding: 3,
                                                    margin: 2
                                                }}>{tagColors[item[1]].label}</Text>
                                            )}
                                        />
                                    </ScrollView>
                                    <LinearGradient
                                        colors={[theme.colors.div, 'transparent']}
                                        locations={[0, 0.9]}
                                        style={styles.gradient}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleFavorite(item.id)}
                                              style={{
                                                  flex: 1,
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                  height: 100
                                              }}>
                                <Image source={
                                    isFavorited(item.id)
                                        ? require('../../img/icons/favorite_48dp_FILL1_wght400_GRAD0_opsz48.png')
                                        : require('../../img/icons/favorite_48dp_FILL0_wght400_GRAD0_opsz48.png')
                                }
                                       style={{width: 40, height: 40}}/>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </BottomSheetView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        marginBottom: 10,
        flexDirection: "row",
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    gradient: {
        position: 'absolute',
        right: 0,
        top: 56,
        transform: [{rotate: '90deg'}],
        bottom: 0,
        width: 30, // Adjust this width to cover the fading area
        height: 50
    },
});

export default BottomSheetParkList;
