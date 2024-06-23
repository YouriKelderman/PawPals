// FavoriteContext.js

import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoriteContext = createContext();

const FavoriteProvider = ({children}) => {
    const [favoritedItems, setFavoritedItems] = useState([]);

    useEffect(() => {
        const loadFavoritedItems = async () => {
            try {
                const storedItems = await AsyncStorage.getItem('favoritedItems');
                if (storedItems !== null) {
                    const parsedItems = JSON.parse(storedItems);
                    setFavoritedItems(parsedItems);
                } else {
                    setFavoritedItems([]);
                }
            } catch (error) {
                console.error('Error loading favorited items:', error);
            }
        };

        loadFavoritedItems();
    }, []);


    const updateFavorites = async (updatedItems) => {
        try {
            await AsyncStorage.setItem('favoritedItems', JSON.stringify(updatedItems));
            setFavoritedItems(updatedItems);
        } catch (error) {
            console.error('Error updating favorites:', error);
        }
    };
//toggle a favorite based on if it currently is or not.
    const toggleFavorite = async (itemId) => {
        if (favoritedItems.includes(itemId)) {
            const updatedItems = favoritedItems.filter(id => id !== itemId);
            updateFavorites(updatedItems);
        } else {
            const updatedItems = [...favoritedItems, itemId];
            updateFavorites(updatedItems);
        }
    };

    return (
        <FavoriteContext.Provider value={{favoritedItems, toggleFavorite}}>
            {children}
        </FavoriteContext.Provider>
    );
};

export {FavoriteProvider, FavoriteContext};
