import React, { useState } from "react";
import { View } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

const DateTimePickerMemoized = React.memo((props) => (
  <DateTimePicker {...props} />
));

const DatePickerComponent = (props) => {
  const [date, setDate] = useState(new Date());
  const [mode] = useState(props.mode || "date");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    props.onChange(currentDate, event);
  };

  return (
    <View>
      {props.show && (
        <DateTimePickerMemoized
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export { DatePickerComponent };
