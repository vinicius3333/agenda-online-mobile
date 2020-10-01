import React from "react";
import { StyleSheet, View } from "react-native";
import { Title, Button, Subheading } from "react-native-paper";
import TextInput from "../shared/componentes/TextInput";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

export default function App({ navigation }) {
  const [iconeSenha, setIconeSenha] = React.useState("eye-outline"),
    [mostrarSenha, setMostrarSenha] = React.useState(true);

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
  });
  const onSubmit = (data) => console.log(data);

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
