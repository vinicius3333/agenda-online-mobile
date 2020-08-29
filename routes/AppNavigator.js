import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/home";
import About from "../screens/about";


function HomeScreen({ navigation }) {
    return <Home navigation={navigation}/>
}

function DetailsScreen({ route, navigation }) {
    return <About route={route} navigation={navigation}/>
}

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={HomeScreen} />
                <Stack.Screen name="Cadastro" component={DetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}