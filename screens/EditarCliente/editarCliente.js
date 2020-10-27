import React, { useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { Button } from 'react-native-paper'
import { ModalLoading, ModalErro, ModalSucesso, ModalConfirmar } from "../../shared/componentes/index";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import theme from '../../shared/themes/baseTheme'
import TextInput from '../../shared/componentes/TextInput'
import TextInputMask from "react-native-text-input-mask";
import editarClienteService from './editarClienteService'

export default function App({ idUsuario, userName, navigation, onExcluirUsuario }) {
    const [iconeSenha, setIconeSenha] = React.useState("eye-outline"),
    [mostrarSenha, setMostrarSenha] = React.useState(true),
    [iconeConfirmarSenha, setIconeConfirmarSenha] = React.useState(
        "eye-outline"
    ),
    [mostrarConfirmarSenha, setMostrarConfirmarSenha] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [mostrarModalErro, setMostrarModalErro] = React.useState(false);
    const [error, setError] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [sucesso, setSucesso] = React.useState(false)
    const [subtituloSucesso, setSubtituloSucesso] = React.useState("Usuário editado com sucesso!")
    const [objUsuario, setObjUsuario] = React.useState({})
    const [mostrarModalConfirmar, setMostrarModalConfirmar] = React.useState(false)
  
  function handlerError(error) {
    if (error.response) {
      setStatus(error.response.status);
      setError(error.response.data?.message);
    } else {
      setError(error.message);
      setStatus(500);
    }
    setMostrarModalErro(true);
  }

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

  const { control, handleSubmit, errors, setValue } = useForm({
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
    const { imagemPerfil } = objUsuario
    let dataUsuario = {
        fullName: nomeCompleto, celular, userName: usuario, password: senha, imagemPerfil, id: idUsuario
    }
    editarClienteService.putEditarCliente(dataUsuario)
        .then(() => {
            setSubtituloSucesso("Usuário editado com sucesso!")
            setSucesso(true)
        })
        .catch((err) => {
            handlerError(err)
        })
        .finally(() => {
            setLoading(false)
        })
  };

  function excluirUsuario () {
    setLoading(true)
    editarClienteService.deleteClienteService(idUsuario)
      .then(() => {
        onExcluirUsuario()
      })
      .catch((err) => {
        handlerError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function getInfoUsuario () {
      return new Promise((resolve, reject) => {
        editarClienteService.getInfoUsuarioService(userName)
            .then((res) => {
                if (res.data === 'user not found') {
                    handlerError({ message: 'Usuário não encontrado!', status: 400})
                    return
                }
                setObjUsuario(res.data)
                const { fullName, celular, userName, password } = res.data
                setValue('nomeCompleto', fullName)
                setValue('celular', celular)
                setValue('usuario', userName)
                setValue('senha', password)
                setValue('confirmarSenha', password)
                resolve()
            })
            .catch((err) => {
                handlerError(err)
                reject()
            })
      })
  }

  async function onInit() {
    setLoading(true);
    getInfoUsuario()
        .finally(() => {
            setLoading(false);
        })
  }

  useEffect(() => {
      onInit();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
      <View style={styles.container}>
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
                  <TextInputMask {...props} 
                  mask="([00]) [00000]-[0000]" />
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
            EDITAR
          </Button>
          <Button
            mode="outlined"
            theme={theme.colors.success}
            onPress={() => setMostrarModalConfirmar(true)}
            contentStyle={styles.button}
            style={{ marginTop: 8 }}
          >
            ENCERRAR CONTA
          </Button>
        </View>
      </ScrollView>
      <ModalErro
        visible={mostrarModalErro}
        error={error}
        status={status}
        onClose={() => setMostrarModalErro(false)}
      />
      <ModalSucesso
        visible={sucesso}
        titulo="Sucesso!"
        subtitulo={subtituloSucesso}
        onClose={() => {
          setSucesso(false);
          setTimeout(() => {
            navigation.navigate('Página do usuário')
          }, 100);
        }}
      />
      <ModalLoading loading={loading} />
      <ModalConfirmar
        visible={mostrarModalConfirmar}
        mensagem="Tem certeza que deseja excluir sua conta?"
        titulo="Excluir perfil"
        onClose={() => setMostrarModalConfirmar(false)}
        excluir={() => {
          setMostrarModalConfirmar(false)
          excluirUsuario()
        }}
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
        height: 40,
      },
});
