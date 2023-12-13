import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

import { BASE_URL } from '../api/client';

const UpdatePhotoProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);
      } catch (error) {
        console.error('Error al obtener el token de acceso:', error);
      }
    };

    getToken();
  }, []);

  const handleChoosePhoto = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      if (!image.cancelled) {
        setSelectedImage(image);
      }
    } catch (error) {
      console.log('Error al seleccionar la imagen:', error);
    }
  };

  const handleUpdateProfilePic = async () => {
    try {
      setLoading(true);

      const userName = await AsyncStorage.getItem('nombreUsuario');

      const base64ImageData = await RNFS.readFile(selectedImage.path, 'base64');
      const imageType = selectedImage.mime;

      const response = await axios.patch(
        `${BASE_URL}/profile/${userName}`,
        { profilePic: `data:${imageType};base64,${base64ImageData}` },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('¡Foto de perfil actualizada correctamente!');
        navigation.navigate('ProfileScreen');
      } else {
        Alert.alert('Error al actualizar la foto de perfil');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualizar Foto de Perfil</Text>

      {selectedImage && (
        <Image
          source={{ uri: selectedImage.path }}
          style={{ width: 200, height: 200, marginBottom: 20 }}
        />
      )}

      <TouchableOpacity
        onPress={handleChoosePhoto}
        style={[styles.button, styles.choosePhotoButton]}
      >
        <Text style={styles.buttonText}>Seleccionar Foto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleUpdateProfilePic}
        style={styles.button}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Actualizar Foto de Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'white',
  },
  button: {
    backgroundColor: '#E53C3C',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    marginBottom: 20,
  },
  choosePhotoButton: {
    backgroundColor: '#E53C3C',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default UpdatePhotoProfileScreen;
