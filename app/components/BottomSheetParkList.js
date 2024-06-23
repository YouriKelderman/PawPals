import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from "./ThemeContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteContext } from "./FavoriteContext";
import { useTranslation } from "react-i18next";

const tagColors = [
    { label: 'Social', color: "#59a221" },
    { label: 'Non-social', color: "#7A0012" },
    { label: 'Big Dogs', color: "#6f4616" },
    { label: 'Small Dogs', color: "#936025" },
    { label: 'Gated', color: "#3B67EA" },
    { label: 'Open', color: "#0F276D" }
];

const BottomSheetParkList = ({ parkData, onChange, changeRegion, navigation, setSelectedMarker }) => {
    const { t } = useTranslation();
    const bottomSheetRef = useRef(null);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { favoritedItems, toggleFavorite } = useContext(FavoriteContext);

    const isFavorited = (itemId) => {
        return favoritedItems.includes(itemId);
    };

    const handleSheetChanges = useCallback((index) => {
        
    }, [onChange]);

    const closeBottomSheet = () => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.snapToIndex(0);
        }
    };

    // Function to zoom to a specific location on the map
    const goToPlace = (longitude, latitude) => {
        setSelectedMarker(null); // Clear selected marker when selecting from list
        changeRegion({ longitude, latitude });
        closeBottomSheet();
    };

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
                <Text style={{ color: theme.colors.textColor }}>Hotspots</Text>
                <FlatList
                    style={{ flex: 1, width: '100%' }}
                    data={parkData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{
                            width: '100%',
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <TouchableOpacity onPress={() => goToPlace(item.longitude, item.latitude)} style={styles.itemContainer}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: item.url }}
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
                                    <ScrollView horizontal={true} style={{ flexWrap: 'wrap', width: 190, position: 'relative' }}>
                                        {item.tags.map((tag, index) => (
                                            <Text key={index} style={{
                                                fontSize: 12,
                                                backgroundColor: tagColors[tag[1]].color,
                                                color: '#fff',
                                                borderRadius: 5,
                                                padding: 3,
                                                margin: 2
                                            }}>{tagColors[tag[1]].label}</Text>
                                        ))}
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
                                       style={{ width: 40, height: 40 }} />
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
        transform: [{ rotate: '90deg' }],
        bottom: 0,
        width: 30, // Adjust this width to cover the fading area
        height: 50
    },
});

export default BottomSheetParkList;
