// OtherUserProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { AirbnbRating } from 'react-native-ratings';
import { BASE_URL } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Componente para la pantalla de perfil de otro usuario

const OtherUserProfileScreen = ({ route, navigation }) => {

  // Extraer el nombre de usuario del parámetro de la ruta
  const { userName } = route.params || {};

  // Estados para datos de perfil, estado de seguir y actualización de la página
  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);

  // Efecto para cargar los datos del perfil del usuario al montar la pantalla
  useEffect(() => {
    const fetchProfileData = async () => {
      try {

        // Obtener el token de AsyncStorage
        const token = await AsyncStorage.getItem('token');

        // Obtener datos del perfil del usuario mediante una solicitud GET
        const response = await axios.get(`${BASE_URL}/profile/${userName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Obtener el valor de seguir del perfil y actualizar el estado correspondiente

        const onfollowValue = response.data.message.onfollow[0].onfollow;
        setIsFollowing(onfollowValue === 1);

        // Almacenar el estado de seguir en AsyncStorage

        await AsyncStorage.setItem('isFollowing', JSON.stringify(onfollowValue === 1));

        // Establecer los datos del perfil en el estado

        setProfileData(response.data.message);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    // Llamar a la función para cargar datos del perfil

    fetchProfileData();
  }, [userName, refreshPage]);


  // Maneja el botón de seguir/deseguir

  const handleFollowButton = async () => {
    try {

      // Obtener el token de AsyncStorage

      const token = await AsyncStorage.getItem('token');

      // Cambiar el estado de seguir

      const newIsFollowing = !isFollowing;
      setIsFollowing(newIsFollowing);

      // Enviar solicitud POST o DELETE según el estado de seguir

      if (newIsFollowing) {
        await axios.post(`${BASE_URL}/profile/${userName}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.delete(`${BASE_URL}/profile/${userName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Obtener el nuevo valor de seguir después de la actualización

      const onfollowResponse = await axios.get(`${BASE_URL}/profile/${userName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const onfollowValue = onfollowResponse.data.message.onfollow[0].onfollow;

      // Actualizar el estado de seguir

      setIsFollowing(onfollowValue === 1);

      // Almacenar el nuevo estado de seguir en AsyncStorage

      await AsyncStorage.setItem('isFollowing', JSON.stringify(onfollowValue === 1));

      // Forzar la actualización de la página para reflejar los cambios

      setRefreshPage((prevRefresh) => !prevRefresh);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };


  // Renderiza la interfaz de usuario de la pantalla de perfil de otro usuario

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {profileData?.profile && (
          <>
            <View style={styles.profileInfo}>
              <Image
                source={require('../assets/imgs/profilePic/default.jpg')}
                //source={{ uri: `asset:/imgs/profilePic/${profileData.profile.profilePic}` }}
                style={styles.profileImage}
              />
              <Text style={styles.userName}>Nombre de Usuario: {profileData.profile.nombreUsuario}</Text>
              <Text style={styles.followers}>Seguidores: {profileData.followers[0].followers}</Text>
              <Text style={styles.following}>Siguiendo: {profileData.following[0].following}</Text>
              <TouchableOpacity onPress={handleFollowButton}>
                <View style={styles.followButton}>
                  <Text style={styles.followButtonText}>
                    {isFollowing ? 'Dejar de seguir' : 'Seguir'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Publicaciones y Calificaciones:</Text>
            <FlatList
              data={profileData.rates}
              keyExtractor={(item) => item.idPublicacion.toString()}
              renderItem={({ item }) => (
                <View style={[styles.rateItem, { backgroundColor: '#E53C3C' }]}>
                  <Text style={{ color: 'white' }}>Canción: {item.nombreCancion}</Text>
                  <Text style={{ color: 'white' }}>Autor: {item.nombreAutor}</Text>
                  <Image
                    source={{ uri: `asset:/imgs/cover/${item.portadaAlbum}` }}
                    style={styles.albumCover}
                  />
                  <AirbnbRating
                    count={5}
                    reviews={['malo', 'Malo', 'Regular', 'Bueno', 'Excelente']}
                    defaultRating={item.rate}
                    size={20}
                    showRating={false}
                    isDisabled
                  />
                </View>
              )}
            />
          </>
        )}
      </View>
    </View>
  );
};


// Estilos para la pantalla de perfil de otro usuario

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileInfo: {
    alignItems: 'flex-start',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5,
  },
  followers: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  following: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rateItem: {
    marginBottom: 10,
    width: '100%',
  },
  followButton: {
    backgroundColor: '#E53C3C',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginVertical: 5,
  },
};

export default OtherUserProfileScreen;
