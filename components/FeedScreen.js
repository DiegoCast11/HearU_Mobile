// Importa las bibliotecas y componentes necesarios de React y React Native

import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FooterComponent from './Footer';
import { AirbnbRating } from 'react-native-ratings';

// Define el componente de la pantalla de Feed
const FeedScreen = ({ navigation }) => {
  // Estado para almacenar los datos del feed
  const [feedData, setFeedData] = useState([]);

  // Efecto de carga para obtener los datos del feed al montar el componente
  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        // Obtiene el token de AsyncStorage

        const token = await AsyncStorage.getItem('token');
        // Realiza una solicitud HTTP para obtener los datos del feed

        const response = await axios.get(`${BASE_URL}/feed`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Actualiza el estado con los datos del feed

        setFeedData(response.data.message);
      } catch (error) {
        console.error('Error fetching feed data:', error);
      }
    };
    // Llama a la función de obtención de datos del feed

    fetchFeedData();
  }, []);
  // Función de renderizado para un elemento de la lista de publicaciones en el feed

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.commentButton}
      onPress={() => navigation.navigate('PostScreen', { postId: item.idPublicacion })}
    >
      <View style={styles.feedItem}>
        <Image source={{ uri: `asset:/imgs/profilePic/${item.profilepic}` }} style={styles.profileImage} />
        <View style={styles.feedContent}>
          <Text style={styles.userName}>{item.nombreUsuarioPublicacion}</Text>
          <Text style={styles.songTitle}>{item.tituloCancion}</Text>
          <Image source={{ uri: `asset:/imgs/cover/${item.portadaAlbum}` }} style={styles.albumCover} />
          <AirbnbRating
            count={5}
            showRating={false}
            defaultRating={item.score} // Puedes ajustar el valor del rating aquí
            size={20}
            isDisabled
          />





        </View>
      </View>

    </TouchableOpacity>

  );

  // Renderiza la interfaz de usuario de la pantalla de Feed

  return (
    <View style={styles.container}>
      <FlatList
        data={feedData}
        keyExtractor={(item) => item.idPublicacion.toString()}
        renderItem={renderItem}
        style={styles.flatList}
      />
      <FooterComponent />
    </View>
  );
};

// Estilos para la pantalla de Feed

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 16,
  },
  flatList: {
    flex: 1,
    marginBottom: 100,
  },
  feedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  feedContent: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'white',
  },
  songTitle: {
    fontSize: 14,
    marginBottom: 4,
    color: 'white',
  },
  albumCover: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 4,
  },
  score: {
    fontSize: 14,
    color: 'green',
  },
  commentButton: {
    backgroundColor: '#E53C3C',
    padding: 10,
    borderRadius: 5,
    marginTop: 8,
  },
  commentButtonText: {
    color: 'white',
    textAlign: 'center',
  },
};

// Exporta el componente FeedScreen para su uso en otros archivos

export default FeedScreen;
