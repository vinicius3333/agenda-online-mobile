import React from "react";
import { StyleSheet, View } from "react-native";
import { Title, Button } from "react-native-paper";
import TextInput from "../../shared/componentes/TextInput";
import { ScrollView } from "react-native-gesture-handler";
import theme from "../../shared/themes/baseTheme";
import TextInputMask from "react-native-text-input-mask";
import cadastroClienteService from "./cadastroClienteService";
import {
  ModalLoading,
  ModalSucesso,
  ModalErro,
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
    [mostrarConfirmarSenha, setMostrarConfirmarSenha] = React.useState(true),
    [loading, setLoading] = React.useState(false),
    [sucesso, setSucesso] = React.useState(false);

  const [mostrarModalErro, setMostrarModalErro] = React.useState(false);
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState("");

  const schema = yup.object().shape({
    nomeCompleto: yup.string().required().min(3),
    celular: yup.string().required().matches(/^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/, 'Celular inválido'),
    usuario: yup.string().required().min(5),
    senha: yup.string().required().min(5),
    confirmarSenha: yup
      .string()
      .required()
      .min(5)
      .oneOf([yup.ref("senha"), null], "As senhas tem que ser iguais."),
  });

  const { control, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  function trocarTipoSenha() {
    setMostrarSenha(!mostrarSenha);
    setIconeSenha(mostrarSenha ? "eye-off-outline" : "eye-outline");
  }

  const onSubmit = (data) => {
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
      .catch((error) => {
        if (error.response) {
          setStatus(error.response.status);
          setError(error.response.data);
        } else {
          setError(error.message);
          setStatus(500);
        }
        setMostrarModalErro(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <Title style={{ textAlign: "center", marginBottom: 8 }}>Cadastro de cliente</Title>
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
                error={errors.celular?.message}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
                label="Celular"
                render={(props) => (
                  <TextInputMask {...props} mask="([00]) [00000]-[0000]" />
                )}
              />
            )}
            name="celular"
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
                nomeIcone={iconeConfirmarSenha}
                funcaoIcone={() => {
                  setMostrarConfirmarSenha(!mostrarConfirmarSenha);
                  setIconeConfirmarSenha(
                    mostrarConfirmarSenha ? "eye-off-outline" : "eye-outline"
                  );
                }}
                label="Confirmar senha"
                secureTextEntry={mostrarConfirmarSenha}
              />
            )}
            name="confirmarSenha"
            defaultValue=""
          />
          <Button
            mode="contained"
            theme={theme.colors.success}
            onPress={handleSubmit(onSubmit)}
            contentStyle={styles.button}
            style={{ marginTop: 4 }}
            labelStyle={{ color: "white" }}
          >
            CADASTRAR
          </Button>
        </View>
      </ScrollView>
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
      <ModalErro
        visible={mostrarModalErro}
        error={error}
        status={status}
        onClose={() => setMostrarModalErro(false)}
      />
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
