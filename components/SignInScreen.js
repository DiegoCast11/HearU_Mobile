// SignInScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../api/client';

const SignInScreen = () => {
  const navigation = useNavigation();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleLogin = async () => {
    try {
      console.log('Login details:', nombreUsuario, contrasena);

      const response = await axios.post(
        `${BASE_URL}/user/login`,
        {
          nombreUsuario,
          contrasena,
        }
      );

      console.log('Server response:', response); // Imprimimos toda la respuesta para depurar

      if (response.status === 200) {
        const authToken = response.data.message;
      
        console.log('Token:', authToken); // Imprime el token para verificar

        
        await AsyncStorage.setItem('nombreUsuario', nombreUsuario); // Guarda el nombre de usuario
        await AsyncStorage.setItem('token', authToken);
      
        Alert.alert('¡Inicio de sesión exitoso!' + nombreUsuario);
        navigation.replace('HomeScreen');
      } else {
        Alert.alert('Error al iniciar sesión: ' + response.data.message);
      }
      

    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../src/img/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        onChangeText={(text) => setNombreUsuario(text)}
        value={nombreUsuario}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry={true}
        onChangeText={(text) => setContrasena(text)}
        value={contrasena}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.navigate('RegisterScreen')}>
        ¿No tienes una cuenta? Regístrate aquí.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    backgroundColor: '#333',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 70,
    marginBottom: 20,
    paddingLeft: 10,
    color: 'white',
  },
  button: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 70,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  link: {
    marginTop: 30,
    color: 'white',
    textDecorationLine: 'underline',
  },
});

export default SignInScreen;
