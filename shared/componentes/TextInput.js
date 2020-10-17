import React from "react";
import { TextInput } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";
import { DatePickerComponent } from "./DatePicker";
import CalendarPicker from './CalendarPicker';
import moment from 'moment'
import color from 'color'

const today = moment();

const TextInputComponent = (props) => {
  const [showTimer, setShowTimer] = React.useState(false);
  const [showDate, setShowDate] = React.useState(false)
  return (
    <View>
      <CalendarPicker
        show={showDate}
        onClose={() => setShowDate(false)}
        disabledDates={props.disabledDates}
        dateChange={(date) => {
          setShowDate(false)
          props.onChangeTimer(date)
        }}
      />
      <DatePickerComponent
        mode='time'
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
        dense
        style={{ marginBottom: 8, marginTop: 0, paddingTop: 0 }}
        mode="outlined"
        theme={{colors: { primary: "#007bff", background: "white" }}}
        onFocus={() => {
          if (!props.mostrarCalendario) return;
          if (props.mostrarCalendario && props.mode === 'time') {
            setShowTimer(true);
          } else if (props.mostrarCalendario && props.mode === 'date') {
            setShowDate(true)
          }
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
    marginBottom: 8,
    marginTop: 0,
    textAlign: "left",
  },
});

export default TextInputComponent;
