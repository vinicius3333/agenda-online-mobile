import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Button } from "react-native-paper";
import theme from "../shared/themes/baseTheme";
import Login from "../screens/login";
import Cadastro from "../screens/cadastro";
import Home from "../screens/home";

function HomeScreen({ navigation }) {
  return <Home navigation={navigation} />;
}

function LoginScreen({ navigation }) {
  return <Login navigation={navigation} />;
}

function CadastroScreen() {
  return <Cadastro />;
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
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
