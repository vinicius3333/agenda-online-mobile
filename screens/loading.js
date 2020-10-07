import React from "react";
import { StyleSheet, View } from "react-native";
import { Title, ActivityIndicator } from "react-native-paper";

export default function App() {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} />
      <Title style={{ textAlign: "center" }}>Carregando</Title>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  button: {
    height: 50,
  },
});
