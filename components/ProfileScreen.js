import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { AirbnbRating } from 'react-native-ratings';
import FooterComponent from './Footer';

import { BASE_URL } from '../api/client';

const ProfileScreen = ({ route, navigation }) => {
  const { userName } = route.params || {};
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedUserName = await AsyncStorage.getItem('nombreUsuario');

        const response = await axios.get(`${BASE_URL}/profile/${storedUserName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data.message);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleUpdatePhotoPress = () => {
    navigation.navigate('UpdatePhotoProfileScreen');
  };

  if (!profileData) {
    return (
      <View>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>&lt; Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Perfil de Usuario</Text>
      </View>

      <View style={styles.content}>
        <Image
          source={require('../assets/imgs/profilePic/default.jpg') }
          //source={{ uri: `asset:/imgs/profilePic/${profileData.profile.profilePic}` }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>Nombre de Usuario: {profileData.profile.nombreUsuario}</Text>
        <Text style={styles.followers}>Seguidores: {profileData.followers[0].followers}</Text>
        <Text style={styles.following}>Siguiendo: {profileData.following[0].following}</Text>

        <TouchableOpacity onPress={handleUpdatePhotoPress} style={styles.button}>
          <Text style={styles.buttonText}>Actualizar Foto</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Publicaciones y Calificaciones:</Text>
        <FlatList
          data={profileData.rates}
          keyExtractor={(item) => item.idPublicacion.toString()}
          style={{ marginBottom: 55 }} // Ajusta el valor según sea necesario

          renderItem={({ item, index }) => (
            <View style={[styles.rateItem, { backgroundColor: '#E53C3C' }]}>
              <Text style={{ color: 'white' }}>Canción: {item.nombreCancion}</Text>
              <Text style={{ color: 'white' }}>Autor: {item.nombreAutor}</Text>
              <Image
                source={{ uri: `asset:/imgs/cover/${item.portadaAlbum}` }}
                style={styles.albumCover}
              />
              <AirbnbRating
                count={5}
                reviews={['Terrible', 'Malo', 'Regular', 'Bueno', 'Excelente']}
                defaultRating={item.rate}
                size={20}
                showRating={false}
                isDisabled
              />
            </View>
          )}
        />

        {/* Actualizar Foto Button */}
        <TouchableOpacity style={styles.updatePhotoButton}>
          <Text style={styles.updatePhotoButtonText}>Actualizar Foto</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Component */}
      <FooterComponent />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backButton: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 16,
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
    borderRadius: 10,

  },
  button: {
    backgroundColor: '#E53C3C',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color:'white',
  },
  updatePhotoButton: {
    backgroundColor: '#E53C3C',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  updatePhotoButtonText: {
    color: 'white',
    fontSize: 16,
  },
  albumCover: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginVertical: 5,
  },
};

export default ProfileScreen;
