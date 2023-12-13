import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Button,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../api/client';
import { ScrollView } from 'react-native-gesture-handler';
import { AirbnbRating } from 'react-native-ratings';
import FooterComponent from './Footer';


const HomeScreen = ({ navigation }) => {
  const [bannerData, setBannerData] = useState([]);
  const [trendingData, setTrendingData] = useState([]);
  const [topRatedData, setTopRatedData] = useState([]);
  const [recommendedData, setRecommendedData] = useState([]);



  const baseUrl = `${BASE_URL}/home`; // URL base

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        // Obtener datos del banner
        const bannerResponse = await axios.get(`${baseUrl}/banner`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBannerData(bannerResponse.data.message);

        // Obtener datos de canciones trending
        const trendingResponse = await axios.get(`${baseUrl}/trending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrendingData(trendingResponse.data.message);

        // Obtener datos de canciones mejor valoradas
        const topRatedResponse = await axios.get(`${baseUrl}/toprated`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopRatedData(topRatedResponse.data.message);

        // Obtener datos de canciones recomendadas
        const recommendedResponse = await axios.get(`${baseUrl}/recommended`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecommendedData(recommendedResponse.data.message);
      } catch (error) {
        console.error('Error al obtener datos del servidor:', error);
      }
    };

    fetchData();
  }, []);




  return (
    <ScrollView style={styles.containerWithFooter}>
      <View style={styles.container}>

        {/*LOGO DE APP*/}
        <View style={styles.logoContainer}>
          <Image
            source={require('../src/img/logo.png')}
            style={styles.logoImage}
          />
        </View>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Text style={styles.sectionTitle}>Artista más Popular..</Text>
          <Text style={styles.bannerTitle}>{bannerData.nombreAutor}</Text>
          <Text style={styles.bannerInfo}>
            Publicaciones: {bannerData.totalPublicaciones}
          </Text>
          <Image
            source={require('../assets/imgs/artist/bbny.png')}
            //source={{ uri: `asset:/imgs/artist/${bannerData.foto}` }}
            style={styles.bannerImage}

          />
        </View>
        {console.log(`asset:/imgs/artist/${bannerData.foto}`)}


        {/* Trending songs */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Canciones Trending</Text>
          <FlatList
            data={trendingData}
            keyExtractor={(item) => item.idCancion.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.songItem}
                onPress={() => {
                  navigation.navigate('RatingScreen', { idCancion: item.idCancion, nombreCancion: item.nombreCancion, imagen: item.portadaAlbum });
                }}

              >
                <Image
                  source={{ uri: `asset:/imgs/cover/${item.portadaAlbum}` }}
                  style={styles.bannerImage}
                />
                <Text style={styles.songTitle}>{item.nombreCancion}</Text>
                <Text style={styles.songArtist}>{item.autorCancion}</Text>
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Top Rated songs  seccion*/}
        <View style={styles.trending}>
          <View style={styles.centerContainer}>
            <ScrollView
              style={{ width: '100%' }}  // Añade este estilo
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>⇊ Top rated ⇊</Text>
                {topRatedData.map((song) => (
                  <TouchableOpacity
                    key={song.idCancion}
                    style={styles.songItem}
                    onPress={() => {
                      navigation.navigate('RatingScreen', { idCancion: song.idCancion, nombreCancion: song.nombreCancion, imagen: song.portadaAlbum });
                    }}
                  >
                    <Image
                      source={{ uri: `asset:/imgs/cover/${song.portadaAlbum}` }}
                      style={styles.bannerImage}
                    />
                    <Text style={styles.songTitle}>{song.nombreCancion}</Text>
                    <Text style={styles.songArtist}>{song.nombreAutor}</Text>
                    <AirbnbRating
                      count={5}
                      defaultRating={song.promedioScore}
                      size={20}
                      showRating={false}
                      isDisabled
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>


        {/* Recommended songs */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Canciones Recomendadas</Text>
          <FlatList
            data={recommendedData}
            keyExtractor={(item) => item.idAlbum.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                }}
                style={styles.songItem}
              >
                <Image
                  source={{ uri: `asset:/imgs/cover/${item.portadaAlbum}` }}
                  style={styles.bannerImage}
                />
                <Text style={styles.songTitle}>{item.tituloAlbum}</Text>
                <Text style={styles.songArtist}>{item.nombreAutor}</Text>
                {item.promedioScore !== null && (
                  <AirbnbRating
                    count={5}
                    defaultRating={item.promedioScore}
                    size={20}
                    showRating={false}
                    isDisabled
                  />
                )}
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

      </View>

      <FooterComponent />
    </ScrollView>


  );
};


// Estilos
const styles = StyleSheet.create({

  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoImage: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 20,
    marginBottom: 100, // Agrega un margen inferior para dejar espacio al footer

  },

  trending:{
    
      alignItems: 'center',
      marginBottom: 10,
      backgroundColor: "#E53C3C", // Fondo rojo oscuro
      borderRadius: 20,
      overflow: "visible",
      margin: 15,
  },


  bannerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: "#E53C3C", // Fondo rojo oscuro
    borderRadius: 20,
    overflow: "visible",
    margin: 15,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  songItem: {
    marginRight: 15,
  },
  songImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  songTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 3,
  },
  songArtist: {
    color: 'gray',
    fontSize: 14,
  },
  bannerImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  bannerInfo: {
    fontSize: 16,
    color: 'gray',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerWithFooter: {
    flex: 1,
    backgroundColor: '#333',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 10,
    padding: 10,
  },



});
export default HomeScreen;
