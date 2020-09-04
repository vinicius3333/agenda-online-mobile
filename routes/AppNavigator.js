import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/login";
import About from "../screens/about";
import Cadastro from "../screens/cadastro";

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
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Teste" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
