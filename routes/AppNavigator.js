import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/login";
import About from "../screens/about";


function LoginScreen({ navigation }) {
    return <Login navigation={navigation}/>
}

function DetailsScreen({ route, navigation }) {
    return <About route={route} navigation={navigation}/>
}

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Cadastro" component={DetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}