import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import axios from 'axios';

const FavoritesScreen = ({ navigation }) => {
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  useEffect(() => {
    // Llama a tu API para obtener la lista de canciones favoritas
    axios.get('http://192.168.68.104:3000/favorites')
      .then(response => setFavoriteSongs(response.data.message))
      .catch(error => console.error(error));
  }, []);

  return (
    <View>
      <Text>Canciones Favoritas</Text>
      <FlatList
        data={favoriteSongs}
        keyExtractor={(item) => item.idCancion.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Detalles', { song: item })}
          >
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default FavoritesScreen;
