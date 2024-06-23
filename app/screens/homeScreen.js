import React, { useContext, useEffect, useState, useRef } from "react";
import { ImageBackground, FlatList, Image, StyleSheet, Text, View, ScrollView } from "react-native";
import { ThemeContext } from '../components/ThemeContext';
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import customData from "../../data.json";
import { FavoriteContext } from "../components/FavoriteContext";
import { LinearGradient } from "expo-linear-gradient";
import BottomSheetParkDetails from "../components/BottomSheetParkDetails";
import {useTranslation} from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';

export default function HomeScreen({ navigation }) {
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);
    const { favoritedItems } = useContext(FavoriteContext);
    const [suggestedList, setSuggested] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const bottomSheetRef = useRef(null);
    let data;



    //get data from API, date is to prevent cache issues
    const getData = async () => {
        try {
            const response = await fetch(`http://yourikelderman.nl/data.json?timestamp=${new Date().getTime()}`);
            data = await response.json();
        } catch (error) {
            console.error('Error fetching park data:', error);
        }
    };

    //get items that the user has not yet favorited but might want to favorite.
    const getSuggested = async () => {
        let suggested = [];
        if (data === undefined) {
            await getData();
        }
        for (let item of data) {
            if (!favoritedItems.includes(item.id)) {
                suggested.push(item);
            }
        }
        console.log("done");
        setSuggested(suggested);
    };

    useEffect(() => {
        getSuggested();

    }, [favoritedItems]);


    const findItemNameById = (itemId) => {
        const foundItem = customData.find(item => item.id === itemId);
        return foundItem ? foundItem : 'Item not found';
    };

    const tagColors = [
        { label: t('global.tags.social'), color: "#59a221" },
        { label: t('global.tags.nonsocial'), color: "#7A0012" },
        { label: t('global.tags.bigDogs'), color: "#6f4616" },
        { label: t('global.tags.smallDogs'), color: "#936025" },
        { label: t('global.tags.gated'), color: "#3B67EA" },
        { label: t('global.tags.open'), color: "#0F276D" }
    ];

    //send params to map page to zoom in on that part
    function goToPlace(longitude, latitude) {
        console.log(longitude)
        navigation.navigate('Map', {
            lng: longitude,
            lat: latitude,
        });
    }

    const handlePressItem = (item) => {
        setSelectedItem(null); // Reset selected item
        setTimeout(() => {
            setSelectedItem(item);
            if (bottomSheetRef.current) {
                bottomSheetRef.current.expand(); // Expand the bottom sheet
            }
        }, 100); // Delay to ensure state reset
    };

    return (
        <View style={{ backgroundColor: theme.colors.backgroundColor, padding: 15 }}>
            <Text style={{ marginTop: 50, fontSize: 30, fontWeight: '800', color: theme.colors.lighterText }}>{t('home.suggestedParks')}</Text>
            <ScrollView horizontal>
                {suggestedList.map((prop, key) => {
                    return (
                        <TouchableOpacity
                            onPress={() => goToPlace(prop.longitude, prop.latitude)}
                            key={key} style={styles.suggestedDiv}>
                            <ImageBackground source={{ uri: prop.url }} style={styles.imageBackground} resizeMode="cover">
                                <LinearGradient
                                    colors={['rgba(255,255,255,0)', 'rgba(2,2,2,0.4)', 'rgba(3,3,3,0.62)']}
                                    style={styles.gradient}>
                                    <Text style={styles.text}>{prop.name}</Text>
                                    <View style={styles.tagHolder}>
                                        {prop.tags.map((tag, index) => (
                                            <Text key={index} style={{
                                                fontSize: 12,
                                                backgroundColor: tagColors[tag[1]].color,
                                                color: '#fff',
                                                borderRadius: 5,
                                                padding: 3,
                                                margin: 2
                                            }}>{tagColors[tag[1]].label}</Text>
                                        ))}
                                    </View>
                                </LinearGradient>
                            </ImageBackground>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            <Text style={{
                color: theme.colors.lighterText,
                fontSize: 23,
                fontWeight: '700',
                marginBottom: 10,
                marginTop: 30
            }}>{t('home.favoriteParks')}</Text>
            <View>
                {favoritedItems.map((prop, key) => {
                    const item = findItemNameById(prop);
                    return (
                        <TouchableOpacity
                            onPress={() => handlePressItem(item)}
                            key={key} style={{
                            marginBottom: 10,
                            flexDirection: "row",
                        }}>
                            <Image
                                style={{ width: 80, height: 80, marginRight: 8 }}
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
                                <FlatList
                                    data={item.tags}
                                    keyExtractor={(tag, index) => index.toString()}
                                    horizontal
                                    style={{ width: 200 }}
                                    renderItem={({ item }) => (
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
                                <Text style={{color: theme.colors.textColor}}>{t('home.viewOnMap')}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <BottomSheetParkDetails
                ref={bottomSheetRef}
                parkData={selectedItem}
                onChange={(index) => {
                    if (index === -1) {
                        setSelectedItem(null);
                    }
                }}
                navigation={navigation}
                onClose={() => setSelectedItem(null)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    suggestedDiv: {
        width: 220,
        height: 300,
        marginRight: 10,
        overflow: 'hidden',
    },
    imageBackground: {
        flex: 1,
    },
    text: {
        color: "white",
        fontSize: 20,
        zIndex: 4,
        fontWeight: "bold",
        textAlign: "center",
    },
    gradient: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: 10,
    },
    tagHolder: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
