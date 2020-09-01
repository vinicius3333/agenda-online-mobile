import React from "react";
import { View, Text } from "react-native";
import { Formik } from "formik";
import { Button } from "react-native-paper";
import TextInput from "../shared/componentes/TextInput";
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
      {({ errors, values, handleChange, handleBlur, handleSubmit }) => (
        <View>
          <TextInput
            value={values.usuario}
            error={errors.usuario}
            onChangeText={handleChange("usuario")}
            onBlur={handleBlur("usuario")}
          />
          <Text>{JSON.stringify(errors, null, 2)}</Text>
          <Button onPress={handleSubmit}>Oi</Button>
        </View>
      )}
    </Formik>
  );
}
