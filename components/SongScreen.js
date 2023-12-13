import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import axios from 'axios';
import { BASE_URL } from "../api/client";
import { AirbnbRating } from "react-native-ratings";
import AsyncStorage from '@react-native-async-storage/async-storage';


const SongScreen = ({ route, navigation }) => {
  // Obtener datos de la canción desde la ruta
  const { song } = route.params || {};
  const [songDetails, setSongDetails] = useState(null);

  useEffect(() => {
    // Función para obtener detalles adicionales de la canción desde la API
    const fetchSongDetails = async () => {
      try {
        // Obtener token almacenado en AsyncStorage
        const token = await AsyncStorage.getItem('token');

        // Realizar solicitud a la API para obtener detalles adicionales
        const response = await axios.get(`${BASE_URL}/song/${song.idCancion}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSongDetails(response.data.message);
      } catch (error) {
        console.error('Error fetching song details:', error);
      }
    };

    // Llamar a la función para obtener detalles cuando el componente se monta
    fetchSongDetails();
  }, [song.idCancion]);

  // Función para manejar la calificación de la canción
  const handleRateSong = () => {
    // Verificar si hay detalles de la canción antes de navegar
    if (songDetails && songDetails.song && songDetails.song.length > 0) {
      navigation.navigate('RatingScreen', {
        idCancion: songDetails.song[0].idCancion,
        nombreCancion: songDetails.song[0].nombreCancion,
        imagen: songDetails.song[0].portadaAlbum,
      });
    } else {
      // Manejar el caso en el que no se obtienen detalles de la canción
      Alert.alert('Error', 'No se pudieron obtener los detalles de la canción. Inténtalo de nuevo.');
    }
  };

  // Estructura básica de la pantalla
  return (
    <View style={styles.container}>
      {/* Encabezado de la pantalla */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>&lt; Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalles de la Canción</Text>
      </View>

      {/* Contenido de la pantalla */}
      <View style={styles.content}>
        {/* Detalles de la canción */}
        {songDetails && songDetails.song && songDetails.song.length > 0 && (
          <>
            {/* Imagen de la canción */}
            <Image source={{ uri: `asset:/imgs/cover/${songDetails.song[0].portadaAlbum}` }} style={styles.songImage} />
            <Text style={styles.songTitle}>{songDetails.song[0].nombreCancion}</Text>
            <Text style={styles.artist}>{songDetails.song[0].autor}</Text>
            <Text style={styles.album}>{`Duración: ${songDetails.song[0].duracion}`}</Text>
            <Text style={styles.album}>{`Género: ${songDetails.song[0].genero}`}</Text>

            {songDetails.song[0].promedioScore && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>Puntuación Promedio:</Text>
                <AirbnbRating
                  count={5}
                  defaultRating={songDetails.song[0].promedioScore}
                  size={20}
                  showRating={false}
                  isDisabled
                />
              </View>
            )}

            {/* Botón para calificar la canción */}
            <TouchableOpacity style={styles.rateButton} onPress={handleRateSong}>
              <Text style={styles.rateButtonText}>Calificar Canción</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

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
    justifyContent: "center",
    alignItems: "center",
  },
  songImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  songTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  artist: {
    color: "white",
    fontSize: 18,
    marginBottom: 5,
  },
  album: {
    color: "white",
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  ratingText: {
    color: 'white',
    marginRight: 10,
  },
  rateButton: {
    backgroundColor: '#E53C3C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  rateButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SongScreen;
