import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import BottomSheet from "@gorhom/bottom-sheet";
import { ThemeContext } from "../components/ThemeContext";
import BottomSheetParkList from "../components/BottomSheetParkList";

export default function MapScreen({ route, navigation }) {
    const darkModeMap = [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#212121"
                }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#212121"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#bdbdbd"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#181818"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#1b1b1b"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#2c2c2c"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#8a8a8a"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#373737"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#3c3c3c"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#4e4e4e"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#3d3d3d"
                }
            ]
        }
    ];

    const [location, setLocation] = useState(null);
    const [heading, setHeading] = useState(0);
    const [parkData, setParkData] = useState([]);
    const mapRef = useRef(null);
    const { theme } = useContext(ThemeContext);

    const bottomSheetRef = useRef(null);

    const handleSheetChanges = useCallback((index) => {}, []);

    // Change region of map based on given longitude and latitude
    function changeRegion(item) {
        const newLatitude = parseFloat(item.latitude);
        const newLongitude = parseFloat(item.longitude);

        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: newLatitude,
                longitude: newLongitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }, 1000);
        } else {
            console.error('Map reference is null');
        }
    }

    useEffect(() => {
        (async () => {
            // Get permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            // Get current location
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            // Watch for location updates
            Location.watchPositionAsync({ accuracy: Location.Accuracy.High }, (newLocation) => {
                setLocation(newLocation);
            });

            // Watch for heading updates
            Location.watchHeadingAsync((newHeading) => {
                setHeading(newHeading.trueHeading);
            });

            // Get data from own webservice, date is to prevent cache issues
            try {
                const response = await fetch(`http://yourikelderman.nl/data.json?timestamp=${new Date().getTime()}`);
                const data = await response.json();
                setParkData(data);
            } catch (error) {
                console.error('Error fetching park data:', error);
            }
        })();
    }, []);

    // Set nice background while map is loading
    if (!location) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Aan het laden....</Text>
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
                    rotation={heading}
                    anchor={{ x: 0.5, y: 0.5 }}
                >
                    <View style={styles.markerContainer}>
                        <Text style={styles.markerText}>⇧</Text>
                    </View>
                </Marker>
                {parkData.map((park, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: parseFloat(park.latitude),
                            longitude: parseFloat(park.longitude),
                        }}
                        title={park.name}
                    />
                ))}
            </MapView>
            <BottomSheetParkList
                parkData={parkData}
                onChange={(index) => {}}
                changeRegion={changeRegion}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerText: {
        fontSize: 24,
        color: 'red',
    },
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
