import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import theme from "../shared/themes/baseTheme";
import Login from "../screens/login";
import About from "../screens/about";
import Cadastro from "../screens/cadastro";
import Home from "../screens/home";

function HomeScreen() {
  return <Home />;
}

function LoginScreen({ navigation }) {
  return <Login navigation={navigation} />;
}

function CadastroScreen() {
  return <Cadastro />;
}

function DetailsScreen() {
  return <About />;
}

const Stack = createStackNavigator();

export default function App() {
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
        }}
      >
        <Stack.Screen name="Prestadores de serviço" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Teste" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
