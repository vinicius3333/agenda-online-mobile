import React from "react";
import { TextInput } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";

export default function App(props) {
  return (
    <View>
      <TextInput
        right={
          <TextInput.Icon name={props.nomeIcone} onPress={props.funcaoIcone} />
        }
        {...props}
        style={{ marginVertical: 4 }}
        mode="outlined"
      />
      {props.error && <Text style={styles.errorText}>{props.error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
    textAlign: "left",
  },
});
