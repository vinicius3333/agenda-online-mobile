import React from "react";
import { StyleSheet, View, Platform, Text } from "react-native";
import { Title, Button, Subheading } from "react-native-paper";
import TextInput from "../../shared/componentes/TextInput";
import { Formik } from "formik";
import { ScrollView } from "react-native-gesture-handler";
import theme from "../../shared/themes/baseTheme";
import cadastroPrestadorService from "./cadastroPrestadorService";
import {
  ModalLoading,
  ModalSucesso,
  DatePickerComponent,
} from "../../shared/componentes/index";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

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

  function trocarTipoSenha() {
    setMostrarSenha(!mostrarSenha);
    setIconeSenha(mostrarSenha ? "eye-off-outline" : "eye-outline");
  }

  const schema = yup.object().shape({
    nomeCompleto: yup.string().required().min(3),
    email: yup.string().required().email(),
    empresa: yup.string().required().min(2),
    segmento: yup.string().required().min(5),
    cidade: yup.string().required().min(5),
    aberturaEstabelecimento: yup
      .string()
      .required()
      .matches(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Deve seguir o padrão: HH:MM"
      ),
    fechamentoEstabelecimento: yup
      .string()
      .required()
      .matches(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Deve seguir o padrão: HH:MM"
      ),
    inicioAlmoco: yup.string().required().min(5),
    fimAlmoco: yup.string(),
    duracaoServico: yup.string(),
    usuario: yup.string().required().min(5),
    senha: yup.string().required().min(5),
    confirmarSenha: yup
      .string()
      .required()
      .min(5)
      .oneOf([yup.ref("senha"), null], "As senhas tem que ser iguais."),
  });

  const { control, handleSubmit, errors, getValues, setValue, watch } = useForm(
    {
      resolver: yupResolver(schema),
      mode: "onBlur",
      reValidateMode: "onChange",
    }
  );

  const onSubmit = (data) => {
    console.log("Submit: ", data);
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <Title style={{ textAlign: "center" }}>
            Cadastro de prestador de serviço
          </Title>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                value={value}
                error={errors.nomeCompleto?.message}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
                label="Nome completo"
              />
            )}
            name="nomeCompleto"
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                value={value}
                error={errors.email?.message}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
                label="Email"
              />
            )}
            name="email"
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                value={value}
                error={errors.empresa?.message}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
                label="Empresa"
              />
            )}
            name="empresa"
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                value={value}
                error={errors.cidade?.message}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
                label="Cidade"
              />
            )}
            name="cidade"
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                value={value}
                error={errors.aberturaEstabelecimento?.message}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
                label="Abertura do estabelecimento"
                maxLength={5}
                mostrarCalendario={true}
                onChangeTimer={(date) => {
                  const dataValue = new Date(date)
                    .toTimeString()
                    .split(" ")[0]
                    .substring(0, 5);
                  setValue("aberturaEstabelecimento", dataValue);
                }}
              />
            )}
            name="aberturaEstabelecimento"
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                value={value}
                error={errors.fechamentoEstabelecimento?.message}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
                label="Fechamento do estabelecimento"
                maxLength={5}
                onFocus={() => {
                  setShowTimerPickerFechamento(true);
                }}
                mostrarCalendario={true}
                onChangeTimer={(date) => {
                  const dataValue = new Date(date)
                    .toTimeString()
                    .split(" ")[0]
                    .substring(0, 5);
                  setValue("fechamentoEstabelecimento", dataValue);
                }}
              />
            )}
            name="fechamentoEstabelecimento"
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                value={value}
                error={errors.inicioAlmoco?.message}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
                label="Início do almoço"
                maxLength={5}
                onFocus={() => {
                  setShowTimerPickerInicio(true);
                }}
                disabled={
                  getValues("aberturaEstabelecimento") == "" ||
                  (getValues("aberturaEstabelecimento") == undefined &&
                    getValues("fechamentoEstabelecimento") == "") ||
                  getValues("fechamentoEstabelecimento") == undefined
                }
                mostrarCalendario={true}
                onChangeTimer={() => {
                  const dataValue = new Date(date)
                    .toTimeString()
                    .split(" ")[0]
                    .substring(0, 5);
                  setValue("inicioAlmoco", dataValue);
                }}
              />
            )}
            name="inicioAlmoco"
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                value={value}
                error={errors.fimAlmoco?.message}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
                label="Fim do almoço"
                maxLength={5}
                onFocus={() => {
                  setShowTimerPickerInicio(true);
                }}
                disabled={
                  getValues("aberturaEstabelecimento") == "" ||
                  (getValues("aberturaEstabelecimento") == undefined &&
                    getValues("fechamentoEstabelecimento") == "") ||
                  getValues("fechamentoEstabelecimento") == undefined
                }
                mostrarCalendario={true}
                onChangeTimer={() => {
                  const dataValue = new Date(date)
                    .toTimeString()
                    .split(" ")[0]
                    .substring(0, 5);
                  setValue("fimAlmoco", dataValue);
                }}
              />
            )}
            name="fimAlmoco"
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                value={value}
                error={errors.duracaoServico?.message}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
                label="Duração do serviço"
                maxLength={5}
                onFocus={() => {
                  setShowTimerPickerInicio(true);
                }}
                disabled={
                  getValues("aberturaEstabelecimento") == "" ||
                  (getValues("aberturaEstabelecimento") == undefined &&
                    getValues("fechamentoEstabelecimento") == "") ||
                  getValues("fechamentoEstabelecimento") == undefined
                }
                mostrarCalendario={true}
                onChangeTimer={(date) => {
                  const dataValue = new Date(date)
                    .toTimeString()
                    .split(" ")[0]
                    .substring(0, 5);
                  setValue("duracaoServico", dataValue);
                }}
              />
            )}
            name="duracaoServico"
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                value={value}
                error={errors.usuario?.message}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
                label="Usuário"
              />
            )}
            name="usuario"
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                value={value}
                error={errors.senha?.message}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
                label="Senha"
                nomeIcone={iconeSenha}
                funcaoIcone={trocarTipoSenha}
                secureTextEntry={mostrarSenha}
              />
            )}
            name="senha"
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                value={value}
                error={errors.confirmarSenha?.message}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
                label="Confirmar senha"
                nomeIcone={iconeConfirmarSenha}
                funcaoIcone={() => {
                  setMostrarConfirmarSenha(!mostrarConfirmarSenha);
                  setIconeConfirmarSenha(
                    mostrarConfirmarSenha ? "eye-off-outline" : "eye-outline"
                  );
                }}
                secureTextEntry={mostrarConfirmarSenha}
              />
            )}
            name="confirmarSenha"
            defaultValue=""
          />
          <Button
            mode="contained"
            theme={theme.colors.success}
            onPress={() => handleSubmit(onSubmit)}
            contentStyle={styles.button}
            style={{ marginTop: 4 }}
            labelStyle={{ color: "white" }}
          >
            CADASTRAR
          </Button>
        </View>
      </ScrollView>
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
