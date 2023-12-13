// Importa las bibliotecas y componentes necesarios de React y React Native

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { AirbnbRating } from "react-native-ratings";
import axios from 'axios';
import { BASE_URL } from "../api/client";
import AsyncStorage from '@react-native-async-storage/async-storage';


// Define el componente de la pantalla de detalles del álbum

const AlbumScreen = ({ route, navigation }) => {
  // Obtiene el ID del álbum de las propiedades de la ruta

  const { idAlbum } = route.params || {};

  // Estado para almacenar los detalles del álbum

  const [albumDetails, setAlbumDetails] = useState(null);

  // Efecto de carga para obtener los detalles del álbum al montar el componente

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        // Obtiene el token de AsyncStorage

        const token = await AsyncStorage.getItem('token');
        // Realiza una solicitud HTTP para obtener los detalles del álbum

        const response = await axios.get(`${BASE_URL}/album/${idAlbum}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Actualiza el estado con los detalles del álbum

        setAlbumDetails(response.data.message);
      } catch (error) {
        console.error('Error fetching album details:', error);
      }
    };
    // Llama a la función de obtención de detalles del álbum

    fetchAlbumDetails();
  }, [idAlbum]);
  // Renderiza la interfaz de usuario de la pantalla de detalles del álbum

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>&lt; Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalles del Álbum</Text>
      </View>

      {albumDetails && albumDetails.album && albumDetails.album.length > 0 && (
        <View style={styles.content}>
          <Image source={{ uri: `asset:/imgs/cover/${albumDetails.album[0].portada}` }} style={styles.albumImage} />
          <Text style={styles.albumTitle}>{albumDetails.album[0].tituloAlbum}</Text>
          <Text style={styles.artist}>{albumDetails.album[0].nombreAutor}</Text>
          <Text style={styles.genre}>{albumDetails.album[0].nombreGenero}</Text>
          <Text style={styles.label}>Fecha de Lanzamiento:</Text>
          <Text style={styles.date}>{albumDetails.album[0].fechaLanzamiento}</Text>
          {albumDetails.album[0].promedioRateAlbum && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>Puntuación Promedio del Álbum:</Text>
              <AirbnbRating
                count={5}
                defaultRating={albumDetails.album[0].promedioRateAlbum}
                size={20}
                showRating={false}
                isDisabled
              />
            </View>
          )}

          <Text style={styles.label}>Canciones</Text>
          <FlatList
            data={albumDetails.canciones}
            keyExtractor={(item) => item.idCancion.toString()}
            renderItem={({ item }) => (
              <View style={styles.songItem}>
                <Text style={styles.songTitle}>{item.nombreCancion}</Text>
                <Text style={styles.songDuration}>{`Duración: ${item.duracionCancion}`}</Text>
                {item.promedioRateCancion && (
                  <View style={styles.songRatingContainer}>
                    <Text style={styles.songRatingText}>Puntuación Promedio:</Text>
                    <AirbnbRating
                      count={5}
                      defaultRating={item.promedioRateCancion}
                      size={15}
                      showRating={false}
                      isDisabled
                    />
                  </View>
                )}
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};
// Estilos para la pantalla de detalles del álbum

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  backButton: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  albumImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  albumTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  artist: {
    color: "white",
    fontSize: 18,
    marginBottom: 5,
  },
  genre: {
    color: "white",
    fontSize: 16,
  },
  label: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  date: {
    color: "white",
    fontSize: 16,
  },
  ratingContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "white",
    marginRight: 5,
  },
  songItem: {
    marginBottom: 20,
  },
  songTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  songDuration: {
    color: "white",
    fontSize: 16,
  },
  songRatingContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  songRatingText: {
    color: "white",
    marginRight: 5,
  },
});

// Exporta el componente AlbumScreen para su uso en otros archivos


export default AlbumScreen;
