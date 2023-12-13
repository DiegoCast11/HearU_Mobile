// Importa las bibliotecas y componentes necesarios de React y React Native


import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AirbnbRating } from 'react-native-ratings';

import { BASE_URL } from '../api/client';


// Define el componente de la pantalla del artista

const ArtistScreen = ({ route }) => {
    // Obtiene el ID del artista de las propiedades de la ruta

    const { idAutor } = route.params || {};
    // Estado para almacenar los datos del artista

    const [artistData, setArtistData] = useState(null);
    // Efecto de carga para obtener los datos del artista al montar el componente

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                // Obtiene el token de AsyncStorage

                const token = await AsyncStorage.getItem('token');
                // Realiza una solicitud HTTP para obtener los datos del artista

                const response = await axios.get(`${BASE_URL}/artist/${idAutor}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Actualiza el estado con los datos del artista

                setArtistData(response.data.message);
            } catch (error) {
                console.error('Error fetching artist data:', error);
            }
        };
        // Llama a la función de obtención de datos del artista


        fetchArtistData();
    }, [idAutor]);


    // Función de renderizado para un elemento de la lista de canciones

    const renderItem = ({ item }) => (
        <View style={[styles.rateItem, { backgroundColor: 'red' }]}>
            <Text style={{ color: 'white' }}>Canción: {item.nombreCancion}</Text>
            <Text style={{ color: 'white' }}>Duración: {item.duracionCancion}</Text>
            <Image source={{ uri: `asset:/imgs/cover/${item.portadaAlbum}` }} style={styles.profileImage} />
            <AirbnbRating
                count={5}
                reviews={['malo', 'Malo', 'Regular', 'Bueno', 'Excelente']}
                defaultRating={item.likeness}
                size={20}
                showRating={false}
                isDisabled
            />
        </View>
    );
    // Función de renderizado para un elemento de la lista de álbumes

    const renderItemAlbums = ({ item }) => (
        <View style={[styles.rateItem, { backgroundColor: 'red' }]}>
            <Text style={{ color: 'white' }}>Título: {item.titulo}</Text>
            <Text style={{ color: 'white' }}>Disquera: {item.disquera}</Text>
            <Text style={{ color: 'white' }}>Fecha de lanzamiento: {item.fechaLanzamiento}</Text>
            <Image source={{ uri: `asset:/imgs/cover/${item.portada}` }} style={styles.profileImage} />
        </View>
    );
    // Renderiza la interfaz de usuario de la pantalla del artista

    return (
        <View style={styles.container}>
            {artistData && (
                <>
                    {/* Información del artista */}
                    <View style={styles.artistInfoContainer}>
                        <Image source={{ uri: `asset:/imgs/artist/${artistData.autor.foto}` }} style={styles.artistImage} />
                        <Text style={styles.artistName}>{artistData.autor.nombreAutor}</Text>
                    </View>

                    {/* Lista de canciones */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Canciones</Text>
                        <FlatList
                            data={artistData.canciones}
                            keyExtractor={(item) => item.idCancion}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingBottom: 40 }} // Ajusta este valor según sea necesario
                            style={{ height: 350 }} // Ajusta esta altura según sea necesario

                        />
                    </View>

                    {/* Lista de álbumes */}
                    {/* Lista de álbumes */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Álbumes</Text>
                        <View style={[styles.rateItem, { backgroundColor: 'red' }]}>
                            <Text style={{ color: 'white' }}>Título: {artistData.albums.titulo}</Text>
                            <Text style={{ color: 'white' }}>Disquera: {artistData.albums.disquera}</Text>
                            <Text style={{ color: 'white' }}>Fecha de lanzamiento: {artistData.albums.fechaLanzamiento}</Text>
                            <Image source={{ uri: `asset:/imgs/cover/${artistData.albums.portada}` }} style={styles.profileImage} />
                        </View>
                    </View>
                </>
            )}
        </View>
    );
};

// Estilos para la pantalla del artista

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
        padding: 16,
    },
    artistInfoContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    artistImage: {
        width: 100,
        height: 100,
        marginBottom: 8,
    },
    artistName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    sectionContainer: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white',
    },
    rateItem: {
        marginBottom: 10,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginBottom: 8,
    },
});

// Exporta el componente ArtistScreen para su uso en otros archivos

export default ArtistScreen;
