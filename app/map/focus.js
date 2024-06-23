import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList } from 'react-native';

export default function Focus({ parkData, onParkSelect, onClose }) {
    const [modalVisible, setModalVisible] = useState(true);

    const handleParkSelect = (park) => {
        onParkSelect(park);
        setModalVisible(true);
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
                onClose();
                setModalVisible(false);
            }}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Parks</Text>
                    <FlatList
                        data={parkData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleParkSelect(item)}>
                                <Text style={{ fontSize: 16, marginBottom: 5 }}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
                        <Text style={{ color: 'blue', fontSize: 16 }}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
