import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import axios from 'axios';
import { BASE_URL } from "../api/client";
import { AirbnbRating } from "react-native-ratings";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SongScreen = ({ route, navigation }) => {
  const { song } = route.params || {};
  const [songDetails, setSongDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/song/${song.idCancion}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSongDetails(response.data.message);

        // Verificar si la canción está en favoritos al cargar los detalles
        if (response.data.message.song[0].enFavoritos === 1) {
          setIsFavorite(true);
        }
      } catch (error) {
        console.error('Error fetching song details:', error);
      }
    };

    fetchSongDetails();
  }, [song.idCancion]);

  const handleRateSong = () => {
    if (songDetails && songDetails.song && songDetails.song.length > 0) {
      navigation.navigate('RatingScreen', {
        idCancion: songDetails.song[0].idCancion,
        nombreCancion: songDetails.song[0].nombreCancion,
        imagen: songDetails.song[0].portadaAlbum,
      });
    } else {
      Alert.alert('Error', 'No se pudieron obtener los detalles de la canción. Inténtalo de nuevo.');
    }
  };

  const handleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/favorites`,
        {
          idCancion: song.idCancion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 201) {
        setIsFavorite(true);
      } else if (response.data.code === 200) {
        setIsFavorite(false);
      } else {
        // Handle other response codes as needed
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
    }
  };

  const handleRemoveFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          idCancion: song.idCancion,
        },
      });

      if (response.data.code === 200) {
        setIsFavorite(false);
      } else if (response.data.code === 404) {
        // Puedes manejar la lógica aquí para el caso en que la canción no se encuentra en favoritos
      } else {
        // Handle other response codes as needed
      }
    } catch (error) {
      console.error('Error handling remove favorite:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>&lt; Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalles de la Canción</Text>
      </View>

      <View style={styles.content}>
        {songDetails && songDetails.song && songDetails.song.length > 0 && (
          <>
            <Image source={{ uri: `asset:/imgs/cover/${songDetails.song[0].portadaAlbum}` }} style={styles.songImage} />
            <Text style={styles.songTitle}>{songDetails.song[0].nombreCancion}</Text>
            <Text style={styles.artist}>{songDetails.song[0].autor}</Text>
            <Text style={styles.album}>Duración: <Text style={styles.albumText}>{songDetails.song[0].duracion}</Text></Text>
            <Text style={styles.album}>Género: <Text style={styles.albumText}>{songDetails.song[0].genero}</Text></Text>


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

            <TouchableOpacity style={styles.favoriteButton} onPress={isFavorite ? handleRemoveFavorite : handleFavorite}>
              <Image
                source={isFavorite ? require('../assets/icons/corazonLleno.png') : require('../assets/icons/corazonVacio.png')}
                style={styles.favoriteIcon}
              />
            </TouchableOpacity>

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
  favoriteButton: {
    marginVertical: 10,
  },
  favoriteIcon: {
    width: 30,
    height: 30,
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
  albumText: {
    color: "white",
    fontSize: 16,
  }
  
});

export default SongScreen;
