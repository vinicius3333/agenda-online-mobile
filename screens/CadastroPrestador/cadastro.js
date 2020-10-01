import React from "react";
import { StyleSheet, View, Platform, Text } from "react-native";
import { Title, Button, Subheading } from "react-native-paper";
import TextInput from "../../shared/componentes/TextInput";
import { Formik } from "formik";
import Yup from "../../shared/validators/validator";
import { ScrollView } from "react-native-gesture-handler";
import theme from "../../shared/themes/baseTheme";
import cadastroPrestadorService from "./cadastroPrestadorService";
import {
  ModalLoading,
  ModalSucesso,
  DatePickerComponent,
} from "../../shared/componentes/index";

export default function App({ navigation }) {
  const [iconeSenha, setIconeSenha] = React.useState("eye-outline"),
    [mostrarSenha, setMostrarSenha] = React.useState(true),
    [iconeConfirmarSenha, setIconeConfirmarSenha] = React.useState(
      "eye-outline"
    ),
    [mostrarConfirmarSenha, setMostrarConfirmarSenha] = React.useState(true);
  const [showTimerPickerAbertura, setShowTimerPickerAbertura] = React.useState(
    false
  );
  const [
    showTimerPickerFechamento,
    setShowTimerPickerFechamento,
  ] = React.useState(false);
  const [showTimerPickerInicio, setShowTimerPickerInicio] = React.useState(
    false
  );
  const [showTimerPickerFim, setShowTimerPickerFim] = React.useState(false);

  const schema = Yup.object({
    nomeCompleto: Yup.string().required().min(3),
    email: Yup.string().required().email(),
    empresa: Yup.string().required().min(2),
    segmento: Yup.string().required().min(5),
    cidade: Yup.string().required().min(5),
    aberturaEstabelecimento: Yup.string()
      .required()
      .matches(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Deve seguir o padrão: HH:MM"
      ),
    fechamentoEstabelecimento: Yup.string()
      .required()
      .matches(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Deve seguir o padrão: HH:MM"
      ),
    inicioAlmoco: Yup.string().required().min(5),
    fimAlmoco: Yup.string(),
    duracaoServico: Yup.string(),
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
    <Formik
      enableReinitialize
      initialValues={{
        nomeCompleto: "",
        email: "",
        empresa: "",
        segmento: "",
        cidade: "",
        aberturaEstabelecimento: "",
        fechamentoEstabelecimento: "",
        inicioAlmoco: "",
        fimAlmoco: "",
        duracaoServico: "",
        Usuario: "",
        Senha: "",
        confirmarSenha: "",
      }}
      validationSchema={schema}
      onSubmit={(data) => {
        console.log("Submit: ", data);
      }}
    >
      {({
        values,
        errors,
        handleChange,
        handleBlur,
        touched,
        setFieldValue,
      }) => (
        <ScrollView>
          <DatePickerComponent
            mode="time"
            show={showTimerPickerAbertura}
            onChange={(date = new Date()) => {
              setShowTimerPickerAbertura(false);
              const dataAbertura = new Date(date)
                .toTimeString()
                .split(" ")[0]
                .substring(0, 5);
              setFieldValue("aberturaEstabelecimento", dataAbertura);
            }}
          />
          <DatePickerComponent
            mode="time"
            show={showTimerPickerFechamento}
            onChange={(date = new Date()) => {
              setShowTimerPickerFechamento(false);
              const dataFechamento = new Date(date)
                .toTimeString()
                .split(" ")[0]
                .substring(0, 5);
              setFieldValue("fechamentoEstabelecimento", dataFechamento);
            }}
          />
          <DatePickerComponent
            mode="time"
            show={showTimerPickerInicio}
            onChange={(date = new Date()) => {
              setShowTimerPickerInicio(false);
              const dataInicio = new Date(date)
                .toTimeString()
                .split(" ")[0]
                .substring(0, 5);
              setFieldValue("inicioAlmoco", dataInicio);
            }}
          />
          <DatePickerComponent
            mode="time"
            show={showTimerPickerFim}
            onChange={(date = new Date()) => {
              setShowTimerPickerFim(false);
              const dataFim = new Date(date)
                .toTimeString()
                .split(" ")[0]
                .substring(0, 5);
              setFieldValue("fimAlmoco", dataFim);
            }}
          />
          <View style={styles.container}>
            <Title style={{ textAlign: "center" }}>
              Cadastro de prestador de serviço
            </Title>
            <TextInput
              value={values.nomeCompleto}
              error={touched.nomeCompleto && errors.nomeCompleto}
              onChangeText={handleChange("nomeCompleto")}
              onBlur={handleBlur("nomeCompleto")}
              label="Nome completo"
            />
            <TextInput
              value={values.email}
              error={touched.email && errors.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              label="Email"
            />
            <TextInput
              value={values.empresa}
              error={touched.empresa && errors.empresa}
              onChangeText={handleChange("empresa")}
              onBlur={handleBlur("empresa")}
              label="Empresa"
            />
            <TextInput
              value={values.segmento}
              error={touched.segmento && errors.segmento}
              onChangeText={handleChange("segmento")}
              onBlur={handleBlur("segmento")}
              label="Segmento"
            />
            <TextInput
              value={values.cidade}
              error={touched.cidade && errors.cidade}
              onChangeText={handleChange("cidade")}
              onBlur={handleBlur("cidade")}
              label="Cidade"
            />
            <TextInput
              value={values.aberturaEstabelecimento}
              error={
                touched.aberturaEstabelecimento &&
                errors.aberturaEstabelecimento
              }
              onChangeText={handleChange("aberturaEstabelecimento")}
              onBlur={handleBlur("aberturaEstabelecimento")}
              onFocus={() => {
                setShowTimerPickerAbertura(true);
              }}
              label="Abertura do estabelecimento"
              maxLength={5}
            />
            <TextInput
              value={values.fechamentoEstabelecimento}
              error={
                touched.fechamentoEstabelecimento &&
                errors.fechamentoEstabelecimento
              }
              onChangeText={handleChange("fechamentoEstabelecimento")}
              onBlur={handleBlur("fechamentoEstabelecimento")}
              label="Fechamento do estabelecimento"
              onFocus={() => {
                setShowTimerPickerFechamento(true);
              }}
              maxLength={5}
            />
            <TextInput
              value={values.inicioAlmoco}
              error={touched.inicioAlmoco && errors.inicioAlmoco}
              onChangeText={handleChange("inicioAlmoco")}
              onBlur={handleBlur("inicioAlmoco")}
              label="Início do almoço"
              disabled={
                values.aberturaEstabelecimento === "" &&
                values.fechamentoEstabelecimento === ""
              }
              onFocus={() => {
                setShowTimerPickerInicio(true);
              }}
            />
            <TextInput
              value={values.fimAlmoco}
              error={touched.fimAlmoco && errors.fimAlmoco}
              onChangeText={handleChange("fimAlmoco")}
              onBlur={handleBlur("fimAlmoco")}
              label="Fim do almoço"
              disabled={
                values.aberturaEstabelecimento === "" &&
                values.fechamentoEstabelecimento === ""
              }
              onFocus={() => {
                setShowTimerPickerFim(true);
              }}
            />
            <TextInput
              value={values.duracaoServico}
              error={touched.duracaoServico && errors.duracaoServico}
              onChangeText={handleChange("duracaoServico")}
              onBlur={handleBlur("duracaoServico")}
              label="Duração do serviço"
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
              nomeIcone={iconeConfirmarSenha}
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
