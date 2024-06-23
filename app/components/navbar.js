import React, {useCallback, useContext, useState} from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text } from 'react-native';

/* Screen Imports */
import homeScreen from '../screens/homeScreen';
import mapScreen from '../screens/mapScreen';
import settingsScreen from '../screens/settingsScreen';

/* Icons with no fill (inactive) */
import {mapIconNF} from '../../img/icons/map_24dp_FILL0_wght400_GRAD0_opsz24.png';
import {ThemeContext} from "./ThemeContext";
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

export default function Navbar() {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useContext(ThemeContext);

 return(

    <NavigationContainer theme={theme}>
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: [
                    {
                        borderTop: 0,
                        height: 50,
                        display: 'flex',
                        backgroundColor: theme.colors.nav,
                        color: 'yellow'
                    },
                    null,
                ],
                tabBarLabelStyle: {
                    color: 'white', // Set the text color based on focus
                    paddingBottom: 5,
                },
                tabBarItemStyle: {
                  paddingTop: 5,
                },
                tabBarIcon: ({ focused }) => {
                    let iconComponent;

                    if (route.name === 'Home') {
                        iconComponent = focused ? (
                            <Image source={require('../../img/icons/favorite_24dp_FILL1_wght400_GRAD0_opsz24.png')} style={{ width: 24, height: 24 }} />
                        ) : (
                            <Image source={require('../../img/icons/favorite_24dp_FILL0_wght400_GRAD0_opsz24.png')} style={{ width: 24, height: 24 }} />
                        );
                    } else if (route.name === 'Map') {
                        iconComponent = focused ? (
                            <Image source={require('../../img/icons/map_24dp_FILL1_wght400_GRAD0_opsz24.png')} style={{ width: 24, height: 24 }} />
                        ) : (
                            <Image source={require('../../img/icons/map_24dp_FILL0_wght400_GRAD0_opsz24.png')} style={{ width: 24, height: 24 }} />
                        );
                    } else if (route.name === 'Settings') {
                        iconComponent = focused ? (
                            <Image source={require('../../img/icons/settings_24dp_FILL1_wght400_GRAD0_opsz24.png')} style={{ width: 24, height: 24 }} />
                        ) : (
                            <Image source={require('../../img/icons/settings_24dp_FILL0_wght400_GRAD0_opsz24.png')} style={{ width: 24, height: 24 }} />
                        );
                    }

                    return iconComponent;
                },
            })}
        >

            <Tab.Screen
                name="Home"
                component={homeScreen}
                options={{ tabBarLabel: t('global.favorites') }}

            />

            <Tab.Screen
                name="Map"
                component={mapScreen}
                options={{ tabBarLabel: t('global.map') }}
            />
            <Tab.Screen
                name="Settings"
                component={settingsScreen}
                options={{ tabBarLabel: t('global.settings') }}
            />
        </Tab.Navigator>
    </NavigationContainer>
 )
}