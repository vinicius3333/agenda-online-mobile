import React from "react";
import { StyleSheet, View } from "react-native";
import { Title, Button, Subheading } from "react-native-paper";
import TextInput from "../../shared/componentes/TextInput";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import LoginService from "./loginService";
import {
  ModalLoading,
  ModalSucesso,
  ModalErro,
} from "../../shared/componentes/index";
import AsyncStorage from "@react-native-community/async-storage";

export default function App({ navigation, logar }) {
  const [iconeSenha, setIconeSenha] = React.useState("eye-outline"),
    [mostrarSenha, setMostrarSenha] = React.useState(true);

  const [loading, setLoading] = React.useState(false);
  const [sucesso, setSucesso] = React.useState(false);
  const [mostrarModalErro, setMostrarModalErro] = React.useState(false);
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState("");

  const schema = yup.object().shape({
    Usuario: yup.string().required().min(3),
    Senha: yup.string().required().min(3),
  });

  function trocarTipoSenha() {
    setMostrarSenha(!mostrarSenha);
    setIconeSenha(mostrarSenha ? "eye-off-outline" : "eye-outline");
  }

  const { control, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  async function salvarToken(token) {
    try {
      await AsyncStorage.setItem("@tokenBeaer", token);
    } catch (err) {
      console.log(err);
    }
  }

  const onSubmit = (data) => {
    const { Usuario, Senha } = data;

    let dataLogin = {
      UserName: Usuario,
      Password: Senha,
    };

    setLoading(true);

    LoginService.postLogin(dataLogin)
      .then((res) => {
        salvarToken(res.data.token);
        setSucesso(true);
      })
      .catch((error) => {
        if (error.response) {
          setStatus(error.response.status);
          setError(error.response.data?.message);
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
    <View style={styles.container}>
      <Title style={{ textAlign: "center" }}>Por favor</Title>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <TextInput
            value={value}
            error={errors.Usuario?.message}
            onChangeText={(value) => onChange(value)}
            onBlur={onBlur}
            nomeIcone="alert-circle-outline"
            label="Usuário"
          />
        )}
        name="Usuario"
        defaultValue=""
      />
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <TextInput
            value={value}
            error={errors.Senha?.message}
            nomeIcone={iconeSenha}
            funcaoIcone={trocarTipoSenha}
            label="Senha"
            secureTextEntry={mostrarSenha}
            onChangeText={(value) => onChange(value)}
            onBlur={onBlur}
          />
        )}
        name="Senha"
        defaultValue=""
      />

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        contentStyle={styles.button}
        style={{ marginTop: 4 }}
        labelStyle={{ color: "white" }}
      >
        ENTRAR
      </Button>
      <Subheading style={{ paddingVertical: 12, textAlign: "center" }}>
        Não tem login? Cadastre-se abaixo
      </Subheading>
      <Button
        mode="text"
        onPress={() => navigation.navigate("Prestadores de serviço")}
      >
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
      <ModalLoading loading={loading} />
      <ModalSucesso
        visible={sucesso}
        titulo="Sucesso!"
        subtitulo="Logado com êxito!"
        onClose={() => {
          setSucesso(false);
          setTimeout(() => {
            logar();
          }, 100);
        }}
      />
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
