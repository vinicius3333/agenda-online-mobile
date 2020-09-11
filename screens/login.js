import React from "react";
import { StyleSheet, View } from "react-native";
import { Title, Button, Subheading } from "react-native-paper";
import TextInput from "../shared/componentes/TextInput";
import { Formik } from "formik";
import Yup from "../shared/validators/validator";

export default function App({ navigation }) {
  const [iconeSenha, setIconeSenha] = React.useState("eye-outline"),
    [mostrarSenha, setMostrarSenha] = React.useState(true);

  const schema = Yup.object({
    Usuario: Yup.string().required().min(3),
    Senha: Yup.string().required().min(3),
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
      {({ errors, values, handleChange, handleBlur, handleSubmit }) => (
        <View style={styles.container}>
          <Title style={{ textAlign: "center" }}>Por favor</Title>
          <TextInput
            value={values.Usuario}
            error={errors.Usuario}
            onChangeText={handleChange("Usuario")}
            onBlur={handleBlur("Usuario")}
            nomeIcone="alert-circle-outline"
            label="Usuário"
          />
          <TextInput
            value={values.Senha}
            error={errors.Senha}
            mode="outlined"
            nomeIcone={iconeSenha}
            funcaoIcone={trocarTipoSenha}
            label="Senha"
            secureTextEntry={mostrarSenha}
            onChangeText={handleChange("Senha")}
            onBlur={handleBlur("Senha")}
          />
          <Button
            mode="contained"
            onPress={handleSubmit}
            contentStyle={styles.button}
            style={{ marginTop: 4 }}
            labelStyle={{ color: "white" }}
          >
            ENTRAR
          </Button>
          <Subheading style={{ paddingVertical: 12, textAlign: "center" }}>
            Não tem login? Cadastre-se abaixo
          </Subheading>
          <Button mode="text" onPress={() => navigation.goBack()}>
            Lista de Empresas
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.navigate("Cadastro Prestador")}
          >
            Cadastro de prestador de serviço
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.navigate("Cadastro Cliente")}
          >
            Cadastro de cliente
          </Button>
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
