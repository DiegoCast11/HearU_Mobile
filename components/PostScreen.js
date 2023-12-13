// PostScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AirbnbRating } from 'react-native-ratings';


// Pantalla de detalles de una publicación

const PostScreen = ({ route }) => {
    // Extraer el ID de la publicación de los parámetros de la ruta

    const { postId } = route.params;

    // Estados para los datos de la publicación, comentarios y texto del comentario

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');

    // Función para obtener datos de la publicación y sus comentarios

    const fetchPostData = async () => {
        try {

            // Obtener el token de AsyncStorage

            const token = await AsyncStorage.getItem('token');
            // Obtener datos de la publicación mediante una solicitud GET

            const response = await axios.get(`${BASE_URL}/post/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Establecer datos de la publicación y comentarios en los estados correspondientes

            setPost(response.data.message.post[0]);
            setComments(response.data.message.comments);
        } catch (error) {
            console.error('Error fetching post data:', error);
        }
    };

    // Efecto para cargar los datos de la publicación al montar la pantalla

    useEffect(() => {
        fetchPostData();
    }, [postId]);


    // Función para agregar un comentario

    const handleAddComment = async (refreshCallback) => {
        try {

            // Obtener el token de AsyncStorage

            const token = await AsyncStorage.getItem('token');
            // Enviar una solicitud POST para agregar un comentario

            const response = await axios.post(
                `${BASE_URL}/post/${postId}`,
                {
                    comment: commentText,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

                        // Verificar si la solicitud fue exitosa

            if (response.status === 200) {
                                // Actualizar la lista de comentarios con el nuevo comentario

                setComments([...comments, response.data.message]);
                setCommentText('');

                // Mostrar alerta de éxito
                Alert.alert('¡Comentario publicado con éxito!');

                // Llamar a la función de devolución de llamada para refrescar la página
                refreshCallback();
            } else {
                console.error('Error adding comment:', response.data.message);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

        // Renderiza la interfaz de usuario de la pantalla de detalles de la publicación

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: '#333', padding: 16 }}
        >
            <FlatList
                style={{ flex: 1 }}
                ListHeaderComponent={() => (
                    <>
                        {post && (
                            <>
                                <Image source={{ uri: `asset:/imgs/profilePic/${post.profilepic}` }} style={styles.profileImage} />
                                <Text style={styles.userName}>{post.nombreUsuario}</Text>
                                <Text style={styles.albumTitle}>Fecha de publicación: {post.fechaPublicacion}</Text>
                                <Text style={styles.albumTitle}>Álbum: {post.nombreAlbum}</Text>
                                <Text style={styles.albumTitle}>Canción de {post.autor}</Text>
                                <View style={styles.centeredContainer}>
                                    <Image source={{ uri: `asset:/imgs/cover/${post.portadaAlbum}` }} style={styles.songImage} />
                                </View>
                                <AirbnbRating count={5} showRating={false} defaultRating={post.score} size={20} isDisabled />
                                <Text style={styles.description}>Comentario de {post.nombreUsuario}...</Text>
                                <View style={[styles.redBackground, styles.centeredContainer]}>
                                    <Text style={styles.ComentarioPricipal}>"{post.descripcion}"</Text>
                                </View>
                            </>
                        )}
                        <Text style={styles.commentsTitle}>Comentarios</Text>
                    </>
                )}
                data={comments}
                keyExtractor={(item) => (item.idComentario ? item.idComentario.toString() : '')}
                renderItem={({ item }) => (
                    <View style={styles.commentItem}>
                        <Text style={styles.commentUserName}>{item.nombreUsuario}</Text>
                        <Text style={styles.commentText}>"{item.texto}"</Text>
                    </View>
                )}
            />
            <View>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Añade un comentario..."
                    value={commentText}
                    onChangeText={(text) => setCommentText(text)}
                />
                <TouchableOpacity style={styles.commentButton} onPress={() => handleAddComment(fetchPostData)}>
                    <Text style={styles.commentButtonText}>Comentar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};
const styles = {
    centeredContainer: {
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    songImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white',
    },
    albumTitle: {
        fontSize: 16,
        marginBottom: 8,
        color: 'white',
    },
    ComentarioPricipal: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white',
    },
    description: {
        fontSize: 16,
        marginBottom: 16,
        color: 'white',
    },
    commentsTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white',
    },
    redBackground: {
        backgroundColor: '#E53C3C',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    commentItem: {
        marginBottom: 8,
    },
    commentUserName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    commentText: {
        fontSize: 16,
        color: 'white',
    },
    commentInput: {
        backgroundColor: '#eee',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        fontSize: 16,
        color: '#333',
    },
    commentButton: {
        backgroundColor: '#E53C3C',
        padding: 14,
        borderRadius: 8,
        marginBottom: 16,
    },
    commentButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
};

export default PostScreen;
