import React from "react";
import { StyleSheet, View } from "react-native";
import { Title, Button, Subheading } from "react-native-paper";
import TextInput from "../shared/componentes/TextInput";
import { Formik } from "formik";
import Yup from "../shared/validators/validator";
import { ScrollView } from "react-native-gesture-handler";
import theme from "../shared/themes/baseTheme";

export default function App({ navigation }) {
  const [iconeSenha, setIconeSenha] = React.useState("eye-outline"),
    [mostrarSenha, setMostrarSenha] = React.useState(true);

  const schema = Yup.object({
    nomeCompleto: Yup.string().required().min(3),
    email: Yup.string().email().required(),
    empresa: Yup.string().required().min(2),
    segmento: Yup.string().required().min(5),
    cidade: Yup.string().required().min(5),
    aberturaEstabelecimento: Yup.string().required().min(5),
    fechamentoEstabelecimento: Yup.string().required().min(5),
    inicioAlmoco: Yup.string().required().min(5),
    fimAlmoco: Yup.string().required().min(5),
    duracaoServico: Yup.string().required().min(5),
    usuario: Yup.string().required().min(5),
    senha: Yup.string().required().min(5),
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
              Cadastro d prestador de serviço
            </Title>
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
            <TextInput
              value={values.fechamentoEstabelecimento}
              error={errors.fechamentoEstabelecimento}
              onChangeText={handleChange("fechamentoEstabelecimento")}
              onBlur={handleBlur("fechamentoEstabelecimento")}
              label="Fechamento do estabelecimento"
            />
            <TextInput
              value={values.inicioAlmoco}
              error={errors.inicioAlmoco}
              onChangeText={handleChange("inicioAlmoco")}
              onBlur={handleBlur("inicioAlmoco")}
              label="Início do almoço"
            />
            <TextInput
              value={values.fimAlmoco}
              error={errors.fimAlmoco}
              onChangeText={handleChange("fimAlmoco")}
              onBlur={handleBlur("fimAlmoco")}
              label="Fim do almoço"
            />
            <TextInput
              value={values.duracaoServico}
              error={errors.duracaoServico}
              onChangeText={handleChange("duracaoServico")}
              onBlur={handleBlur("duracaoServico")}
              label="Duração do serviço"
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
