import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import theme from "../shared/themes/baseTheme";
import Login from "../screens/Login/login";
import Cadastro from "../screens/CadastroPrestador/cadastro";
import Home from "../screens/home";
import CadastroCliente from "../screens/CadastroCliente/cadastroCliente";

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

const Stack = createStackNavigator();

export default function App() {
  let isLogado = false;
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}
