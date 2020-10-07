import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import theme from "../shared/themes/baseTheme";
import Login from "../screens/Login/login";
import Cadastro from "../screens/CadastroPrestador/cadastro";
import Home from "../screens/home";
import CadastroCliente from "../screens/CadastroCliente/cadastroCliente";
import PaginaAdm from "../screens/PaginaAdm/paginaAdm";
import PaginaUsuario from "../screens/PaginaUsuario/paginaUsuario";
import Loading from "../screens/loading";

import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-community/async-storage";

function HomeScreen({ navigation }) {
  return <Home navigation={navigation} />;
}

function LoginScreen({ navigation }) {
  return <Login navigation={navigation} />;
}

function CadastroPrestadorScreen({ navigation }) {
  return <Cadastro navigation={navigation} />;
}

function CadastroClienteScreen({ navigation }) {
  return <CadastroCliente navigation={navigation} />;
}

function PaginaAdmScreen() {
  return <PaginaAdm />;
}

function PaginaUsuarioScreen() {
  return <PaginaUsuario />;
}

function LoadingScreen() {
  return <Loading />;
}

const Stack = createStackNavigator();

export default function App() {
  let [token, setToken] = React.useState("");
  let [role, setRole] = React.useState("");
  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("@tokenBeaer");
      if (value !== null) {
        setToken(value);
        console.log(jwt_decode(value));
        setRole(jwt_decode(value).role);
        return;
      }
      setToken(null);
    } catch (e) {
      console.log(e);
    }
  };

  setTimeout(() => {
    getToken();
  }, 1000);

  if (token === "") {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {token === null ? (
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.header,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerTitleAlign: "left",
          }}
        >
          <Stack.Screen name="Prestadores de serviço" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="Cadastro Prestador"
            options={() => ({
              headerTitle: "Cadastro",
            })}
            component={CadastroPrestadorScreen}
          />
          <Stack.Screen
            name="Cadastro Cliente"
            options={() => ({
              headerTitle: "Cadastro",
            })}
            component={CadastroClienteScreen}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.header,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerTitleAlign: "left",
          }}
        >
          {role === "adm" ? (
            <Stack.Screen
              name="Pagina do prestador"
              component={PaginaAdmScreen}
            />
          ) : (
            <Stack.Screen
              name="Página do usuário"
              component={PaginaUsuarioScreen}
            />
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
