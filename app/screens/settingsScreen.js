// SettingsScreen.js

import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { ThemeContext } from '../components/ThemeContext';
import { useTranslation } from 'react-i18next';
import i18n from '../components/i18n'; // Adjust the import path as needed

export default function SettingsScreen() {
    const { t } = useTranslation();
    const languages = [
        { label: 'Dutch', value: 'nl' },
        { label: 'English', value: 'en' },
        { label: 'German', value: 'de' },
        // Add more languages as needed
    ];
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language); // Initialize with current language
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <View style={{
            height: '100%',
            width: '100%',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.backgroundColor
        }}>
            <Pressable onPress={toggleTheme}>
                <Text style={{ color: theme.colors.textColor, marginTop: 60 }}>{t('settings.theme')}</Text>
            </Pressable>
            <Text>{t('language')}</Text>
            <FlatList
                data={languages}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setSelectedLanguage(item.value)}>
                        <Text>{item.label}</Text>
                    </TouchableOpacity>
                )}
            />
            <View>
                <TouchableOpacity
                    style={{
                        width: 143,
                        height: 48,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: '#FF5757',
                        borderStyle: 'solid',
                    }}>
                    <Text style={{
                        fontFamily: 'Manrope',
                        fontStyle: 'normal',
                        color: '#FF5757',
                    }}>
                        {t('CANCEL')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        i18n.changeLanguage(selectedLanguage); // Correct usage to change language
                    }}
                    style={{
                        width: 150,
                        height: 48,
                        borderWidth: 0.5,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#2352D8',
                    }}>
                    <Text style={{
                        color: '#F7F9FA',
                        fontFamily: 'Manrope',
                        fontStyle: 'normal',
                    }}>
                        {t('SAVE')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
