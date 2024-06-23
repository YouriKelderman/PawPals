import { createContext } from 'react';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const themes = {
    light: {
        ...DefaultTheme,
        colors: {
            theme: 'light',
            backgroundColor: '#F2F4F3',
            nav: '#678D58',
            div: '#fff',
            textColor: '#2a2a2a',
            lighterText: '#858585',
            whiteText: '#ececec',
            inactive: '#fff',
        },
        values: {
            defaultPadding: 2,
            defaultMargin: 5,
            defaultBorderRadius: 4,
        }

    },
    dark: {
        ...DarkTheme,
        colors: {
            theme: 'dark',
            backgroundColor: '#121212',
            nav: '#212121',
            div: '#212121',
            textColor: '#e7e7e7',
            lighterText: '#e3e3e3',
            whiteText: '#ffffff',
            inactive: '#fff',
        },
        values: {
            defaultPadding: 2,
            defaultMargin: 5,
            defaultBorderRadius: 4,
        }
    },
};

export const ThemeContext = createContext(themes.light);