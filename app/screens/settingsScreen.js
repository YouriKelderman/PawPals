// SettingsScreen.js

import React, {useContext, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, Pressable} from 'react-native';
import {ThemeContext} from '../components/ThemeContext';
import {useTranslation} from 'react-i18next';
import i18n from '../components/i18n'; // Adjust the import path as needed

export default function SettingsScreen() {
    const {t} = useTranslation();
    const languages = [
        {label: 'Dutch', value: 'nl'},
        {label: 'English', value: 'en'},
        {label: 'German', value: 'de'},
        // Add more languages as needed
    ];
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language); // Initialize with current language
    const {theme, toggleTheme} = useContext(ThemeContext);

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
                <Text style={{
                    color: 'white',
                    marginTop: 60,
                    padding: 5,
                    backgroundColor: 'blue',
                    borderRadius: 4,
                    marginBottom: 5
                }}>{t('settings.theme')}</Text>
            </Pressable>
            <Text>{t('language')}</Text>
            <FlatList
                data={languages}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => setSelectedLanguage(item.value)}>
                        <Text style={{margin: 4, fontSize: 15}}>{item.label}</Text>
                    </TouchableOpacity>
                )}
            />
            <View>
                <TouchableOpacity
                    onPress={() => {
                        i18n.changeLanguage(selectedLanguage); // Correct usage to change language
                    }}
                    style={{
                        borderRadius: 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#2352D8',
                    }}>
                    <Text style={{
                        color: '#F7F9FA',
                        fontStyle: '10',
                        padding: 5
                    }}>
                        {t('settings.save')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
