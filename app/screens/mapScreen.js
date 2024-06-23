import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions'; // Import MapViewDirections
import BottomSheetParkList from '../components/BottomSheetParkList';
import { ThemeContext } from '../components/ThemeContext';

const MapScreen = ({ route, navigation }) => {
    const darkModeMap = [/* Your dark mode map style */];
    const [location, setLocation] = useState(null);
    const [parkData, setParkData] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null); // State to track selected marker
    const mapRef = useRef(null);
    const { theme, toggleTheme } = useContext(ThemeContext);

    // Function to handle marker press and set selected marker
    const handleMarkerPress = useCallback((park) => {
        setSelectedMarker(park);
    }, []);

    // Function to change region of the map based on given coordinates
    const changeRegion = useCallback((coords) => {
        console.log(coords);
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: parseFloat(coords.latitude),
                longitude: parseFloat(coords.longitude),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
            setSelectedMarker(null); // Clear selected marker after setting region
        } else {
            console.error('Map reference is null');
        }
    }, []);


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            Location.watchPositionAsync({ accuracy: Location.Accuracy.High }, (newLocation) => {
                setLocation(newLocation);
            });

            try {
                const response = await fetch(`http://yourikelderman.nl/data.json?timestamp=${new Date().getTime()}`);
                const data = await response.json();

                setParkData(data);
            } catch (error) {
                console.error('Error fetching park data:', error);
            }

        })();
    }, []);

    useEffect(() =>{
        if(route.params !== undefined) {
            const {lng, lat} = route.params;
            if (lng !== undefined) {
                changeRegion({
                    longitude: lng,
                    latitude: lat,
                })
            }
        }
    }, [route.params])

    if (!location || !location.coords) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                customMapStyle={(theme.colors.theme === 'dark') ? darkModeMap : undefined}
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }}
                    title="You are here"
                />

                {parkData.map((park, index) => (
                    <Marker
                        key={index}
                        onPress={() => handleMarkerPress(park)}
                        coordinate={{
                            latitude: parseFloat(park.latitude),
                            longitude: parseFloat(park.longitude),
                        }}
                        title={park.name}
                    />
                ))}

                {/* Render MapViewDirections if selectedMarker is set */}
                {selectedMarker && (
                    <MapViewDirections
                        origin={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        destination={{
                            latitude: parseFloat(selectedMarker.latitude),
                            longitude: parseFloat(selectedMarker.longitude),
                        }}
                        apikey="nope"
                        strokeWidth={4}
                        strokeColor="red"
                        mode="DRIVING" // Set mode to desired travel mode (DRIVING, WALKING, BICYCLING, TRANSIT)
                    />
                )}
            </MapView>

            {/* Render BottomSheetParkList */}
            <BottomSheetParkList
                parkData={parkData}
                onChange={(index) => changeRegion(parkData[index])}
                changeRegion={changeRegion}
                navigation={navigation}
                setSelectedMarker={setSelectedMarker} // Pass down setSelectedMarker function
            />
        </View>
    );
};

export default MapScreen;

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
});
