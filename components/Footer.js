// FooterComponent.js
import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

// Componente funcional para el pie de página de la aplicación

const FooterComponent = () => {
  // Estado para el icono seleccionado

  const [selectedIcon, setSelectedIcon] = useState("home");

  // Hooks de navegación y ruta de la pantalla actual

  const navigation = useNavigation();
  const route = useRoute();

  // Maneja el evento de presionar un icono y navega a la pantalla correspondiente

  const handleIconPress = async (iconName) => {
    setSelectedIcon(iconName);

    // Navegamos a la pantalla correspondiente
    switch (iconName) {
      case "home":
        navigation.navigate("HomeScreen");
        break;
      case "search":
        navigation.navigate("SearchScreen");
        break;
      case "heart":
        navigation.navigate("FeedScreen");
        break;
      case "user":
        navigation.navigate('ProfileScreen');
        break;
      case "logOut":
        navigation.navigate("SignIn");
        break;
      default:
        break;
    }
  };

  // Función para obtener el color de fondo según la pantalla actual
  const getIconBackgroundColor = (iconName) => {
    const currentScreen = route.name;
    return selectedIcon === iconName || currentScreen === iconName ? "red" : "transparent";
  };

  // Renderiza el componente Footer

  return (
    <View style={styles.footer}>
      <View style={styles.container}>
        {/* Icono de Home */}
        <TouchableOpacity
          style={[
            styles.iconContainer,
            { backgroundColor: getIconBackgroundColor("home") },
          ]}
          onPress={() => handleIconPress("home")}
        >
          <Image
            source={require('../assets/icons/hogar.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>Home</Text>
        </TouchableOpacity>

        {/* Icono de Buscar */}
        <TouchableOpacity
          style={[
            styles.iconContainer,
            { backgroundColor: getIconBackgroundColor("search") },
          ]}
          onPress={() => handleIconPress("search")}
        >
          <Image
            source={require('../assets/icons/lupa.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>Buscar</Text>
        </TouchableOpacity>

        {/* Icono de Feed */}
        <TouchableOpacity
          style={[
            styles.iconContainer,
            { backgroundColor: getIconBackgroundColor("heart") },
          ]}
          onPress={() => handleIconPress("heart")}
        >
          <View>
            <Image
              source={require('../assets/icons/amigos.png')}
              style={styles.iconImage}
            />
            <Text style={styles.iconText}>Amigos</Text>
          </View>
        </TouchableOpacity>

        {/* Icono de Perfil */}
        <TouchableOpacity
          style={[
            styles.iconContainer,
            { backgroundColor: getIconBackgroundColor("user") },
          ]}
          onPress={() => handleIconPress("user")}
        >
          <Image
            source={require('../assets/icons/usuario-de-perfil.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>Perfil</Text>
        </TouchableOpacity>

        {/* Icono de Log out */}
        <TouchableOpacity
          style={[
            styles.iconContainer,
            { backgroundColor: getIconBackgroundColor("logOut") },
          ]}
          onPress={() => handleIconPress("logOut")}
        >
          <Image
            source={require('../assets/icons/cerrar-sesion.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Estilos para el componente Footer

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#525252",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#464646",
    width: "105%",
    position: "absolute",
    bottom: 0,
    borderRadius: 20,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  iconText: {
    marginTop: 5,
    color: "black",
  },
  footer: {
    height: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    color: 'white',
    fontSize: 14,
  },
});


// Exporta el componente FooterComponent para su uso en otros archivos

export default FooterComponent;
