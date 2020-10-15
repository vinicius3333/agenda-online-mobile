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

import { MenuHeader } from "../shared/componentes/index";

import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-community/async-storage";
import usuarioService from "../shared/service/usuarioService";

export default function App() {
  function HomeScreen({ navigation }) {
    return <Home navigation={navigation} />;
  }

  function LoginScreen({ navigation }) {
    return <Login navigation={navigation} logar={() => getToken()} />;
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
    return <PaginaUsuario idUsuario={idUsuario} mostrando={role === "User"} />;
  }

  function LoadingScreen() {
    return <Loading />;
  }

  const Stack = createStackNavigator();

  let [token, setToken] = React.useState("");
  let [role, setRole] = React.useState("");
  let [idUsuario, setIdUsuario] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("@tokenBeaer");
      if (value !== null) {
        const infoToken = jwt_decode(value);
        let res = await usuarioService.getUsuario(infoToken.UserId);
        if (res.data === "user not found") {
          await AsyncStorage.removeItem("@tokenBeaer");
          setToken(null);
          return;
        }
        setRole(infoToken.role);
        setIdUsuario(infoToken.UserId);
        setToken(value);
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
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Prestadores de serviço" component={HomeScreen} />
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
            headerRight: () => (
              <MenuHeader
                trocarImagem={() => console.log("trocando")}
                editarPerfil={() => console.log("editarPerfil")}
                sair={async () => {
                  await AsyncStorage.removeItem("@tokenBeaer");
                  setToken(null);
                }}
              />
            ),
          }}
        >
          {role === "Adm" ? (
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
