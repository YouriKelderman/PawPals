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
        const clearFavorites = async () => {
            try {
                await AsyncStorage.removeItem('favoritedItems');
                setFavoritedItems([]);
            } catch (error) {
                console.error('Error clearing favorites:', error);
            }
        };
        console.log(favoritedItems)
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

    const toggleFavorite = async (item) => {
        const isFavorited = favoritedItems.some(favItem => favItem.id === item.id);
        if (isFavorited) {
            const updatedItems = favoritedItems.filter(favItem => favItem.id !== item.id);
            updateFavorites(updatedItems);
        } else {
            const updatedItems = [...favoritedItems, item];
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
