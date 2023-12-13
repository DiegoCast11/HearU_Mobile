// CommentScreen.js

// Importa las bibliotecas y componentes necesarios de React y React Native
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../api/client';

// Define el componente de la pantalla de comentarios


const CommentScreen = ({ route }) => {
  // Obtiene el ID de la publicación de las propiedades de la ruta

  const { postId } = route.params;
  // Estado para almacenar los comentarios

  const [comments, setComments] = useState([]);

  // Efecto de carga para obtener los comentarios al montar el componente

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Obtiene el token de AsyncStorage

        const token = await AsyncStorage.getItem('token');
        // Realiza una solicitud HTTP para obtener los comentarios de una publicación
        const response = await axios.get(`${BASE_URL}/comments/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Actualiza el estado con los comentarios

        setComments(response.data.message);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    // Llama a la función de obtención de comentarios


    fetchComments();
  }, [postId]);


  // Función de renderizado para un elemento de la lista de comentarios
  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentText}>{item.comment}</Text>
      {/* Puedes mostrar más detalles del comentario según tu estructura de datos */}
    </View>
  );

  // Renderiza la interfaz de usuario de la pantalla de comentarios

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comentarios</Text>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.commentId.toString()}
        renderItem={renderCommentItem}
      />
    </View>
  );
};

// Estilos para la pantalla de comentarios

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'white',
  },
  commentItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginBottom: 16,
    paddingBottom: 8,
  },
  commentText: {
    fontSize: 16,
    color: 'white',
  },
};

// Exporta el componente CommentScreen para su uso en otros archivos

export default CommentScreen;
