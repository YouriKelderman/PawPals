import * as React from 'react';

import Navbar from "./app/components/navbar.js";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import { ThemeContext } from './app/components/ThemeContext';
import {useContext} from "react";
import {ThemeProvider} from './app/components/ThemeProvider';
import { StatusBar } from 'expo-status-bar';
import { Appearance, useColorScheme } from 'react-native';
import {FavoriteProvider} from "./app/components/FavoriteContext";
import { useTranslation } from 'react-i18next';
import './app/components/i18n';

function App() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { t, i18n } = useTranslation();
    const colorScheme = useColorScheme(); // Detect the system theme
    console.log(colorScheme);

    return (
        <ThemeProvider>
            <FavoriteProvider>
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                    <Navbar/>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
            </FavoriteProvider>
        </ThemeProvider>
    );
}

export default App;