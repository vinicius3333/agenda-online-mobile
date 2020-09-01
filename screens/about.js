import React from "react";
import { View, Text } from "react-native";
import { Formik, Field } from "formik";
import { TextInput, Button } from "react-native-paper";
import * as Yup from "yup";

const schema = Yup.object({
  usuario: Yup.string().required().min(4),
});

export default function App() {
  return (
    <Formik
      initialValues={{ usuario: "teste" }}
      validationSchema={schema}
      onSubmit={(data) => {
        console.log("Submit: ", data);
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit }) => (
        <View>
          <TextInput
            value={values.usuario}
            onChangeText={handleChange("usuario")}
            onBlur={handleBlur("usuario")}
          />
          <Text>{JSON.stringify(values, null, 2)}</Text>
          <Button onPress={handleSubmit}>Oi</Button>
        </View>
      )}
    </Formik>
  );
}
