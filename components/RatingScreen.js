import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import axios from 'axios';
import { BASE_URL } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RatingScreen = ({ route, navigation }) => {
  const { idCancion, nombreCancion, imagen} = route.params;
  const [score, setScore] = useState(0);
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    // Lógica al cargar la pantalla, si es necesario
  }, []);

  const enviarCalificacion = async () => {
    try {
      // Obtén el token de autenticación desde AsyncStorage
      const token = await AsyncStorage.getItem('token');

      // Verifica si el token existe
      if (!token) {
        Alert.alert('Error', 'No se ha encontrado el token de autenticación. Inicia sesión nuevamente.');
        return;
      }

      // Realiza una solicitud POST al endpoint correspondiente en tu servidor
      const response = await axios.post(
        `${BASE_URL}/rate/${idCancion}`,
        { score, descripcion },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Respuesta del servidor:', response.data); // Agrega esta línea para verificar la respuesta del servidor

      // Verifica la respuesta del servidor
      if (response.data && response.data.code === 201) {
        // Calificación enviada con éxito
        Alert.alert('Éxito', 'Calificación enviada correctamente');
        // Puedes realizar acciones adicionales aquí si es necesario
      } else {
        Alert.alert('Error', 'No se pudo enviar la calificación. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al enviar la calificación:', error);
      Alert.alert('Error', 'Ocurrió un error al enviar la calificación. Inténtalo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calificar Canción</Text>
      <Text style={styles.songName}>{`Canción: ${nombreCancion}`}</Text>
      <Image
          source={{ uri: `asset:/imgs/cover/${imagen}`}}
          style={styles.bannerImage}
      />

      <AirbnbRating
        count={5}
        defaultRating={score}
        size={30}
        showRating={false}
        onFinishRating={(value) => setScore(value)}
      />
      <Text style={styles.descriptionLabel}>Descripción:</Text>
      <TextInput
        style={styles.descriptionInput}
        multiline
        numberOfLines={4}
        onChangeText={(text) => setDescripcion(text)}
        value={descripcion}
      />
      <TouchableOpacity style={styles.button} onPress={enviarCalificacion}>
        <Text style={styles.buttonText}>Enviar Calificación</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222', // Fondo negro
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  songName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  descriptionLabel: {
    fontSize: 16,
    color: 'white',
    marginTop: 15,
  },
  descriptionInput: {
    width: '100%',
    height: 100,
    backgroundColor: 'white', // Color de fondo del cuadro de entrada
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#E53C3C', // Color del botón
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RatingScreen;