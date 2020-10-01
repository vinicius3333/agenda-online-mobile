import React from "react";
import { StyleSheet, View } from "react-native";
import { Title, Button, Subheading } from "react-native-paper";
import TextInput from "../../shared/componentes/TextInput";
import { Formik } from "formik";
import Yup from "../../shared/validators/validator";
import { ScrollView } from "react-native-gesture-handler";
import theme from "../../shared/themes/baseTheme";
import TextInputMask from "react-native-text-input-mask";
import cadastroClienteService from "./cadastroClienteService";
import { ModalLoading, ModalSucesso } from "../../shared/componentes/index";

export default function App({ navigation }) {
  const [iconeSenha, setIconeSenha] = React.useState("eye-outline"),
    [mostrarSenha, setMostrarSenha] = React.useState(true),
    [iconeConfirmarSenha, setIconeConfirmarSenha] = React.useState(
      "eye-outline"
    ),
    [mostrarConfirmarSenha, setMostrarConfirmarSenha] = React.useState(true),
    [loading, setLoading] = React.useState(false),
    [sucesso, setSucesso] = React.useState(false);

  const schema = Yup.object({
    nomeCompleto: Yup.string().required().min(3),
    celular: Yup.string().required().min(13),
    usuario: Yup.string().required().min(5),
    senha: Yup.string().required().min(5),
    confirmarSenha: Yup.string()
      .required()
      .min(5)
      .oneOf([Yup.ref("senha"), null], "As senhas tem que ser iguais."),
  });

  function trocarTipoSenha() {
    setMostrarSenha(!mostrarSenha);
    setIconeSenha(mostrarSenha ? "eye-off-outline" : "eye-outline");
  }

  return (
    <View>
      <Formik
        initialValues={{
          nomeCompleto: "",
          celular: "",
          Usuario: "",
          Senha: "",
          confirmarSenha: "",
        }}
        validationSchema={schema}
        validateOnChange={false}
        onSubmit={(data) => {
          setLoading(true);
          const { nomeCompleto, celular, usuario, senha } = data;
          const dataCliente = {
            UserName: usuario,
            Celular: celular,
            Password: senha,
            nomeCompleto,
            ImagemPerfil: "",
          };
          dataCliente.ImagemPerfil = "";
          cadastroClienteService
            .postRegistroUsuario(dataCliente)
            .then(() => {
              setSucesso(true);
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        {({
          values,
          errors,
          handleSubmit,
          handleChange,
          handleBlur,
          touched,
        }) => (
          <ScrollView>
            <View style={styles.container}>
              <Title style={{ textAlign: "center" }}>Cadastro de cliente</Title>
              <TextInput
                value={values.nomeCompleto}
                error={touched.nomeCompleto && errors.nomeCompleto}
                onChangeText={handleChange("nomeCompleto")}
                onBlur={handleBlur("nomeCompleto")}
                label="Nome completo"
              />
              <TextInput
                value={values.celular}
                error={touched.celular && errors.celular}
                onChangeText={handleChange("celular")}
                onBlur={handleBlur("celular")}
                label="Celular"
                render={(props) => (
                  <TextInputMask {...props} mask="[00] [00000]-[0000]" />
                )}
              />
              <TextInput
                value={values.usuario}
                error={touched.usuario && errors.usuario}
                onChangeText={handleChange("usuario")}
                onBlur={handleBlur("usuario")}
                label="Usuário"
              />
              <TextInput
                value={values.senha}
                error={touched.senha && errors.senha}
                nomeIcone={iconeSenha}
                funcaoIcone={trocarTipoSenha}
                label="Senha"
                secureTextEntry={mostrarSenha}
                onChangeText={handleChange("senha")}
                onBlur={handleBlur("senha")}
              />
              <TextInput
                value={values.confirmarSenha}
                error={touched.confirmarSenha && errors.confirmarSenha}
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
                onPress={handleSubmit}
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
      <ModalSucesso
        visible={sucesso}
        titulo="Sucesso!"
        subtitulo="Cadastro de cliente criado!"
        onClose={() => {
          setSucesso(false);
          setTimeout(() => {
            navigation.navigate("Login");
          }, 100);
        }}
      />
      <ModalLoading loading={loading} />
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
  button: {
    height: 50,
  },
});
