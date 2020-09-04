import React from "react";
import { StyleSheet, View } from "react-native";
import { Title, Button, Subheading } from "react-native-paper";
import TextInput from "../shared/componentes/TextInput";
import { Formik } from "formik";
import Yup from "../shared/validators/validator";

export default function App() {
  const [iconeSenha, setIconeSenha] = React.useState("eye-outline"),
    [mostrarSenha, setMostrarSenha] = React.useState(true);

  const schema = Yup.object({
    nomeCompleto: Yup.string().required().min(3),
    email: Yup.string().email().required(),
    empresa: Yup.string().required().min(2),
    segmento: Yup.string().required().min(5),
    cidade: Yup.string().required().min(5),
    aberturaEstabelecimento: Yup.string().required().min(5),
  });

  function trocarTipoSenha() {
    setMostrarSenha(!mostrarSenha);
    setIconeSenha(mostrarSenha ? "eye-off-outline" : "eye-outline");
  }

  return (
    <Formik
      initialValues={{ Usuario: "", Senha: "" }}
      validationSchema={schema}
      onSubmit={(data) => {
        console.log("Submit: ", data);
      }}
    >
      {({ values, errors, handleChange, handleBlur }) => (
        <View style={styles.container}>
          <Title style={{ textAlign: "center" }}>Cadastro de usuário</Title>
          <TextInput
            value={values.nomeCompleto}
            error={errors.nomeCompleto}
            onChangeText={handleChange("nomeCompleto")}
            onBlur={handleBlur("nomeCompleto")}
            label="Nome completo"
          />
          <TextInput
            value={values.email}
            error={errors.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            label="Email"
          />
          <TextInput
            value={values.empresa}
            error={errors.empresa}
            onChangeText={handleChange("empresa")}
            onBlur={handleBlur("empresa")}
            label="Empresa"
          />
          <TextInput
            value={values.segmento}
            error={errors.segmento}
            onChangeText={handleChange("segmento")}
            onBlur={handleBlur("segmento")}
            label="Segmento"
          />
          <TextInput
            value={values.cidade}
            error={errors.cidade}
            onChangeText={handleChange("cidade")}
            onBlur={handleBlur("cidade")}
            label="Cidade"
          />
          <TextInput
            value={values.aberturaEstabelecimento}
            error={errors.aberturaEstabelecimento}
            onChangeText={handleChange("aberturaEstabelecimento")}
            onBlur={handleBlur("aberturaEstabelecimento")}
            label="Abertura do estabelecimento"
          />
        </View>
      )}
    </Formik>
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
