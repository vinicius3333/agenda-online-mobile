import React from "react";
import { TextInput } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";
import { DatePickerComponent } from "./DatePicker";

const TextInputComponent = (props) => {
  const [showTimer, setShowTimer] = React.useState(false);
  return (
    <View>
      <DatePickerComponent
        mode="time"
        show={showTimer}
        onChange={(date = new Date(), event) => {
          if (event.type === "dismissed") {
            setShowTimer(false);
            return;
          }
          setShowTimer(false);
          if (!props.onChangeTimer) return;
          props.onChangeTimer(date);
        }}
      />
      <TextInput
        right={
          props.nomeIcone && (
            <TextInput.Icon
              name={props.nomeIcone}
              onPress={props.funcaoIcone}
            />
          )
        }
        {...props}
        style={{ marginVertical: 4 }}
        mode="flat"
        onFocus={() => {
          if (!props.mostrarCalendario) return;
          setShowTimer(true);
        }}
      />
      {props.error && <Text style={styles.errorText}>{props.error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
    textAlign: "left",
  },
});

export default TextInputComponent;
