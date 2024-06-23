import React, { useState, useEffect } from 'react';
import { ThemeContext, themes } from './ThemeContext.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(themes.light);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem('appTheme');
                if (storedTheme !== null) {
                    setTheme(JSON.parse(storedTheme));
                }
            } catch (error) {
                console.error('Failed to load theme from storage', error);
            }
        };

        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = theme === themes.light ? themes.dark : themes.light;
        setTheme(newTheme);

        try {
            await AsyncStorage.setItem('appTheme', JSON.stringify(newTheme));
        } catch (error) {
            console.error('Failed to save theme to storage', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
