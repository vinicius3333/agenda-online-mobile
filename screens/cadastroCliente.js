import React from "react";
import { StyleSheet, View } from "react-native";
import { Title, Button, Subheading } from "react-native-paper";
import TextInput from "../shared/componentes/TextInput";
import { Formik } from "formik";
import Yup from "../shared/validators/validator";
import { ScrollView } from "react-native-gesture-handler";
import theme from "../shared/themes/baseTheme";
import TextInputMask from "react-native-text-input-mask";

export default function App({ navigation }) {
  const [iconeSenha, setIconeSenha] = React.useState("eye-outline"),
    [mostrarSenha, setMostrarSenha] = React.useState(true),
    [iconeConfirmarSenha, setIconeConfirmarSenha] = React.useState(
      "eye-outline"
    ),
    [mostrarConfirmarSenha, setMostrarConfirmarSenha] = React.useState(true);

  const schema = Yup.object({
    nomeCompleto: Yup.string().required().min(3),
    celular: Yup.string().required().min(13),
    usuario: Yup.string().required().min(5),
    senha: Yup.string().required().min(5),
    confirmarSenha: Yup.string().required().min(5),
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
        <ScrollView>
          <View style={styles.container}>
            <Title style={{ textAlign: "center" }}>
              Cadastro de prestador de serviço
            </Title>
            <TextInput
              value={values.nomeCompleto}
              error={errors.nomeCompleto}
              onChangeText={handleChange("nomeCompleto")}
              onBlur={handleBlur("nomeCompleto")}
              label="Nome completo"
            />
            <TextInput
              value={values.celular}
              error={errors.celular}
              onChangeText={handleChange("celular")}
              onBlur={handleBlur("celular")}
              label="Celular"
              render={(props) => (
                <TextInputMask {...props} mask="[00] [00000]-[0000]" />
              )}
            />
            <TextInput
              value={values.usuario}
              error={errors.usuario}
              onChangeText={handleChange("usuario")}
              onBlur={handleBlur("usuario")}
              label="Usuário"
            />
            <TextInput
              value={values.senha}
              error={errors.senha}
              nomeIcone={iconeSenha}
              funcaoIcone={trocarTipoSenha}
              label="Senha"
              secureTextEntry={mostrarSenha}
              onChangeText={handleChange("senha")}
              onBlur={handleBlur("senha")}
            />
            <TextInput
              value={values.confirmarSenha}
              error={errors.confirmarSenha}
              nomeIcone={iconeSenha}
              funcaoIcone={() => {
                setMostrarConfirmarSenha(!mostrarConfirmarSenha);
                setIconeConfirmarSenha(
                  mostrarConfirmarSenha ? "eye-off-outline" : "eye-outline"
                );
              }}
              label="Confirmar senha"
              secureTextEntry={mostrarConfirmarSenha}
              onChangeText={handleChange("confirmarSenha")}
              onBlur={handleBlur("confirmarSenha")}
            />
            <Button
              mode="contained"
              theme={theme.colors.success}
              onPress={() => navigation.navigate("Login")}
              contentStyle={styles.button}
              style={{ marginTop: 4 }}
              labelStyle={{ color: "white" }}
            >
              ENTRAR
            </Button>
          </View>
        </ScrollView>
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
