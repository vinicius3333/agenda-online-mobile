import React from "react";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import theme from "../shared/themes/baseTheme";
import Login from "../screens/Login/login";
import Cadastro from "../screens/CadastroPrestador/cadastro";
import Home from "../screens/home";
import CadastroCliente from "../screens/CadastroCliente/cadastroCliente";
import PaginaAdm from "../screens/PaginaAdm/paginaAdm";
import PaginaUsuario from "../screens/PaginaUsuario/paginaUsuario";
import Loading from "../screens/loading";
import EditarCliente from '../screens/EditarCliente/editarCliente'
import EditarPrestador from '../screens/EditarPrestador/editarPrestador'

import { MenuHeader, ModalLoading } from "../shared/componentes/index";

import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-community/async-storage";
import usuarioService from "../shared/service/usuarioService";
import ImagePicker from 'react-native-image-picker';
import { navigationRef } from './RootNavigation';

export default function App(props) {
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
    return <PaginaAdm idUsuario={idUsuario} userName={userNameState} />;
  }

  function PaginaUsuarioScreen() {
    return <PaginaUsuario idUsuario={idUsuario} userName={userNameState} />;
  }

  function LoadingScreen() {
    return <Loading />;
  }

  function EditarClienteScreen ({navigation}) {
    return <EditarCliente navigation={navigation} idUsuario={idUsuario} userName={userNameState} onExcluirUsuario={() => sair()}/>
  }

  function EditarPrestadorScreen ({ navigation }) {
    return <EditarPrestador navigation={navigation} idUsuario={idUsuario} userName={userNameState} onExcluirUsuario={() => sair()} />
  }

  const Stack = createStackNavigator();

  let [token, setToken] = React.useState("");
  let [role, setRole] = React.useState("");
  let [idUsuario, setIdUsuario] = React.useState("");
  const [uriImagem, setUriImagem] = React.useState(null)
  const [userNameState, setUserNameState] = React.useState("")
  const [iniciado, setIniciado] = React.useState(false)
  const [loading, setLoading] =  React.useState(false)

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("@tokenBeaer");
      const userName = await AsyncStorage.getItem("@userName");
      if ([null, undefined, ""].includes(userName)) {
        setUserNameState("")
        setToken(null)
        return
      }
      if (value !== null) {
        const infoToken = jwt_decode(value);
        let res = await usuarioService.getUsuario(infoToken.UserId);
        if (res.data === "user not found") {
          await AsyncStorage.removeItem("@tokenBeaer");
          setToken(null);
          return;
        }
        setUserNameState(userName)
        setRole(infoToken.role);
        setIdUsuario(infoToken.UserId);
        getImagemPerfil(infoToken.UserId)
          .finally(() => {
            setToken(value);
          })
        return;
      }
      setToken(null);
    } catch (e) {
      console.log(e)
      setUserNameState("")
      setToken(null);
      return;
    }
  };

  const imagePicker = () => {
    ImagePicker.showImagePicker((response) => {
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const formData = new FormData()
        formData.append('file', {type: "image/jpeg", name: response.fileName, uri: response.uri })
        formData.append('idUser', idUsuario)
        usuarioService.postUploadImagemPerfil(formData)
          .then(() => {
            //props.onSucesso('Upload feito com sucesso!')
            setUriImagem('data:image/jpeg;base64,' + response.data)
          })
          .catch((err) => {
            console.log(err.response)
          })
      }
    });    
  }

  function getImagemPerfil(idUsuario) {
    return new Promise((resolve) => {
      usuarioService.getImagemPerfilService(idUsuario)
        .then((res) => {
          if (['user not found', 'user without image'].includes(res.data)) return
          setUriImagem('data:image/jpeg;base64,' + res.data)
        })
        .catch((err) => console.log(err.response))
        .finally(() => resolve());
    });
  }

  async function sair () {
    await AsyncStorage.removeItem("@tokenBeaer");
    setToken(null);
  }

  React.useEffect(() => {
    if (iniciado) return
    setIniciado(true)
    setTimeout(() => {
      console.log('oi')
      getToken();
    }, 1000);
  }, [])

  if (token === "") {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef} >
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
                uri={uriImagem}
                trocarImagem={() => {
                  imagePicker()
                }}
                editarPerfil={() => {
                  if (role === 'User') {
                    navigationRef.current.navigate("Editar perfil")
                  } else {
                    navigationRef.current.navigate("Editar prestador")
                  }
                }}
                sair={() => {
                  sair()
                }}
              />
            ),
          }}
        >
          {role === "Adm" && (
            <Stack.Screen
              name="Pagina do prestador"
              component={PaginaAdmScreen}
            />
          )}
          {role === "Adm" && (
            <Stack.Screen
              name="Editar prestador"
              component={EditarPrestadorScreen}
            />
          )}
          { role === 'User' && (
            <Stack.Screen
              name="Página do usuário"
              component={PaginaUsuarioScreen}
            />
          )}
          { role === 'User' && 
            <Stack.Screen
              name="Editar perfil"
              component={EditarClienteScreen}
            /> 
          }
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
