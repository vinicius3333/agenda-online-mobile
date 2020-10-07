import React from "react";
import { StyleSheet, View } from "react-native";
import { Title } from "react-native-paper";

export default function App() {
  return (
    <View style={styles.container}>
      <Title style={{ textAlign: "center", color: "red" }}>adm</Title>
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
});
