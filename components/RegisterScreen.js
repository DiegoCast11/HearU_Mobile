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
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../api/client';


const RegisterScreen = () => {
  const navigation = useNavigation();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleRegister = async () => {
    try {
      console.log('Register details:', nombreUsuario, nombre, correo, contrasena);

      const response = await axios.post(
        `${BASE_URL}/user/signup`,
        {
          nombreUsuario,
          nombre,
          correo,
          contrasena,
        }
      );

      console.log('Server response:', response); // Imprimimos toda la respuesta para depurar

      if (response.status === 201) {
        Alert.alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        navigation.navigate('SignIn');
      } else {
        Alert.alert('Error al registrarse: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../src/img/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        onChangeText={(text) => setNombreUsuario(text)}
        value={nombreUsuario}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre Completo"
        onChangeText={(text) => setNombre(text)}
        value={nombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        onChangeText={(text) => setCorreo(text)}
        value={correo}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry={true}
        onChangeText={(text) => setContrasena(text)}
        value={contrasena}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.navigate('SignIn')}>
        ¿Ya tienes una cuenta? Inicia sesión aquí.
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

export default RegisterScreen;
