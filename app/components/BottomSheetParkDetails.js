import {useEffect, useState, forwardRef, useCallback, useContext} from "react";
import {Text, View, TouchableOpacity, Image, StyleSheet} from "react-native";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import {ThemeContext} from '../components/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from "expo-local-authentication";
import {useTranslation} from "react-i18next";
import NetInfo from "@react-native-community/netinfo";
import * as Sharing from 'expo-sharing';

const BottomSheetParkDetails = forwardRef(({parkData, onChange, navigation}, ref) => {
    const {t} = useTranslation();
    const {theme} = useContext(ThemeContext);
    const [photoUri, setPhotoUri] = useState(null);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [isConnected, setIsConnected] = useState(null);

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

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            console.log('Network Status changed:', state.isConnected);
        });

        // Cleanup the listener on component unmount
        return () => unsubscribe();
    }, []);

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
        closeBottomSheet()
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
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
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
//save image to asynstorage
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
//load image from the asyncstorage based on the given ID
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
//delete picture from both the localstorage and the useState
    const deletePicture = async () => {
        setPhotoUri(null);
        console.log('deleted');
        try {
            await AsyncStorage.setItem(`${parkData.id}_photo`, '');
        } catch (error) {
            console.error("Error saving image", error);
        }
    };
    const shareImage = async () => {
        try {
            if (photoUri) {
                const message = "Check out this photo!";
                await Sharing.shareAsync(photoUri, {
                    dialogTitle: "Share your image with the world!",
                    mimeType: 'image/jpeg',
                    UTI: 'public.jpeg'
                });
            } else {
                console.log("No photo to share");
            }
        } catch (error) {
            console.error("Error sharing image", error);
        }
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
                textAlign: 'center',
                padding: 16,
                backgroundColor: theme.colors.div,
            }}>
                {parkData && (
                    <View>
                        <Text style={{
                            fontSize: 30,
                            fontWeight: '800',
                            color: theme.colors.ligherText
                        }}>{parkData.name}</Text>
                        {isConnected !== null && (
                            isConnected ? (
                                <TouchableOpacity onPress={() => goToPlace(parkData.longitude, parkData.latitude)}
                                                  style={styles.button}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            padding: 4,
                                            backgroundColor: 'green',
                                            borderRadius: 4,
                                            margin: 0
                                        }}>{t('home.viewOnMap')}</Text>
                                </TouchableOpacity>
                            ) : (
                                <Text>{t('home.noNetwork')}</Text>
                            )
                        )}
                        <TouchableOpacity onPress={promptPicture} style={styles.button}>
                            <Text style={{color: 'white',
                                padding: 4,
                                backgroundColor: 'blue',
                                borderRadius: 4,
                                margin: 0}}>{t('home.picturePrompt')}</Text>
                        </TouchableOpacity>
                        {photoUri && (
                            <Image source={{uri: photoUri}} style={{width: 200, height: 200, marginTop: 10}}/>
                        )}
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10, justifyContent: 'space-between'}}>
                        {photoUri && (
                            <TouchableOpacity onPress={() => deletePicture(parkData.id)}>
                                <Text
                                    style={{padding: 4,
                                        backgroundColor: 'red',
                                        borderRadius: 4,
                                        margin: 0, color: 'white'}}>{t('home.deletePicture')}</Text>
                            </TouchableOpacity>
                        )}
                        {photoUri && isConnected && (
                            <TouchableOpacity
                                onPress={shareImage}><Text style={{padding: 4,
                                backgroundColor: 'blue',
                                borderRadius: 4,
                                margin: 0, color: 'white'}}>{t('home.sharePicture')}</Text></TouchableOpacity>
                        )}
                        </View>
                    </View>
                )}
            </BottomSheetView>
        </BottomSheet>
    );
});
const styles = StyleSheet.create({
    button: {
        borderRadius: 4,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    }
})
export default BottomSheetParkDetails;

