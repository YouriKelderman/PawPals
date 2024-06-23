import React, { useCallback, useContext, useEffect, useRef, useState, forwardRef } from "react";
import { ThemeContext } from "./ThemeContext";
import { Text, View, TouchableOpacity, Image, Alert } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from "expo-local-authentication";
import {useTranslation} from "react-i18next";
import NetInfo from "@react-native-community/netinfo";

const BottomSheetParkDetails = forwardRef(({ parkData, onChange, navigation }, ref) => {
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);
    const [photoUri, setPhotoUri] = useState(null);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);
        })();
    }, []);

    useEffect(() => {
        if (ref && ref.current) {
            ref.current.expand();
        }
        if (parkData) {
            loadImage(parkData.id); // Load image based on parkData ID
        }
    }, [parkData, ref]);

    const handleSheetChanges = useCallback((index) => {
        onChange(index);
        if (index === 0) {
            handleBottomSheetClose();
        }
    }, [onChange]);

    const handleBottomSheetClose = () => {
        console.log("closing");
        setPhotoUri(null);
    };

    function goToPlace(longitude, latitude) {
        console.log(longitude)
        navigation.navigate('Map', {
            lng: longitude,
            lat: latitude,
        });
    }

    const closeBottomSheet = () => {
        if (ref && ref.current) {
            ref.current.snapToIndex(0);
        }
    };

    const promptPicture = async () => {
        if (isBiometricSupported) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Authenticate to access the camera",
            });
            if (result.success) {
                await launchCamera();
            } else {
                console.log("Authentication failed or cancelled");
            }
        } else {
            await launchCamera();
        }
    };

    const launchCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status === 'granted') {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.cancelled && result.assets.length > 0 && result.assets[0].uri) {
                await saveImage(result.assets[0].uri);
                setPhotoUri(result.assets[0].uri);
            } else {
                console.log("Camera cancelled or no URI returned");
            }
        } else {
            alert("Camera permissions are required to take a picture.");
        }
    };

    const saveImage = async (uri) => {
        if (!uri) {
            console.error("Attempted to save a null or undefined URI");
            return;
        }
        try {
            await AsyncStorage.setItem(`${parkData.id}_photo`, uri);
        } catch (error) {
            console.error("Error saving image", error);
        }
    };

    const loadImage = async (id) => {
        try {
            const uri = await AsyncStorage.getItem(`${id}_photo`);
            if (uri) {
                setPhotoUri(uri);
            } else {
                setPhotoUri(null);
            }
        } catch (error) {
            console.error("Error loading image", error);
        }
    };

    const deletePicture = () => {
        setPhotoUri(null);
    };

    return (
        <BottomSheet
            ref={ref}
            snapPoints={['1%', '70%']}
            onChange={handleSheetChanges}
        >
            <BottomSheetView style={{
                flex: 1,
                alignItems: 'center',
                padding: 16,
                backgroundColor: theme.colors.div,
            }}>
                {parkData && (
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.textColor }}>{parkData.name}</Text>
                        <TouchableOpacity onPress={() => goToPlace(parkData.longitude, parkData.latitude)}>
                            <Text style={{ color: theme.colors.textColor, margin: 10 }}>Hello</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={promptPicture}>
                            <Text style={{ color: theme.colors.textColor, margin: 10 }}>{t('home.picturePrompt')}</Text>
                        </TouchableOpacity>
                        {photoUri && (
                            <Image source={{ uri: photoUri }} style={{ width: 200, height: 200, marginTop: 10 }} />
                        )}
                        {photoUri && (
                            <TouchableOpacity onPress={deletePicture}>
                                <Text style={{ color: theme.colors.textColor, margin: 10 }}>{t('home.deletePicture')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </BottomSheetView>
        </BottomSheet>
    );
});

export default BottomSheetParkDetails;
