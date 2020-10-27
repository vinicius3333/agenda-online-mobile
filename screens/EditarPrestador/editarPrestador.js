import React from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  Title,
  Button,
  Checkbox,
  Paragraph,
  TouchableRipple,
} from "react-native-paper";
import TextInput from "../../shared/componentes/TextInput";
import { ScrollView } from "react-native-gesture-handler";
import theme from "../../shared/themes/baseTheme";
import editarPrestadorService from "./editarPrestadorService";
import {
  ModalLoading, ModalErro, ModalSucesso, ModalConfirmar
} from "../../shared/componentes/index";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import TextInputMask from "react-native-text-input-mask";
import Select from '../../shared/componentes/Select'

export default function App({ idUsuario, userName, navigation, onExcluirUsuario }) {
  const [iconeSenha, setIconeSenha] = React.useState("eye-outline"),
    [mostrarSenha, setMostrarSenha] = React.useState(true),
    [iconeConfirmarSenha, setIconeConfirmarSenha] = React.useState(
      "eye-outline"
    ),
    [mostrarConfirmarSenha, setMostrarConfirmarSenha] = React.useState(true),
    [sabado, setSabado] = React.useState(false),
    [domingo, setDomingo] = React.useState(false),
    [pegouLocalizacao, setpegouLocalizacao] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [sucesso, setSucesso] = React.useState(false);
  const [mostrarModalErro, setMostrarModalErro] = React.useState(false);
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [segmentos] = React.useState(['Saúde','Tecnologia da Informação','Serviços','Comércio','Educação','Assitência Social','Previdência Social','Desenvolvimento urbano / Habitação','Política Agrária','Direitos Humanos','Meio Ambiente','Órgãos de Controle Social','Jurídico', 'Comunicação', 'Engenharias'])
  const [objUsuario, setObjUsuario] = React.useState({})
  const [mostrarModalConfirmar, setMostrarModalConfirmar] = React.useState(false)
  const [subtituloSucesso, setSubtituloSucesso] = React.useState("Usuário editado com sucesso!")

  function trocarTipoSenha() {
    setMostrarSenha(!mostrarSenha);
    setIconeSenha(mostrarSenha ? "eye-off-outline" : "eye-outline");
  }

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
    inicioAlmoco: yup
      .string()
      .required()
      .matches(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Deve seguir o padrão: HH:MM"
      ),
    fimAlmoco: yup
      .string()
      .matches(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Deve seguir o padrão: HH:MM"
      ),
    duracaoServico: yup
      .string()
      .matches(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Deve seguir o padrão: HH:MM"
      ),
    endereco: yup.string(),
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
    setLoading(true);
    const {
      aberturaEstabelecimento,
      cidade,
      duracaoServico,
      email,
      empresa,
      endereco,
      fechamentoEstabelecimento,
      fimAlmoco,
      inicioAlmoco,
      nomeCompleto,
      segmento,
      senha,
      usuario,
      celular
    } = data;
    let fds = 0;
    if (sabado && domingo) {
      fds = 3;
    } else if (domingo && !sabado) {
      fds = 2;
    } else if (sabado && !domingo) {
      fds = 1;
    }

    let dataCliente = {
      UserName: usuario,
      Company: empresa,
      ImagemPerfil: "",
      Email: email,
      MarketSegment: segmento,
      Celular: celular,
      Endereco: endereco,
      Cidade: cidade,
      Abertura: aberturaEstabelecimento,
      Fechamento: fechamentoEstabelecimento,
      Duracao: duracaoServico,
      AlmocoIni: inicioAlmoco,
      AlmocoFim: fimAlmoco,
      Fds: fds,
      Password: senha,
      FullName: nomeCompleto,
      id: idUsuario
    };

    editarPrestadorService
      .putEditarAdm(dataCliente)
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
      editarPrestadorService.getInfoUsuarioService(userName)
          .then((res) => {
              if (res.data === 'user not found') {
                  handlerError({ message: 'Usuário não encontrado!', status: 400})
                  return
              }
              setObjUsuario(res.data)
              const { fds, duracao, celular, fullName, userName, password, email, company, marketSegment, cidade, abertura, fechamento, almocoIni, almocoFim, endereco } = res.data
              setValue('nomeCompleto', fullName)
              setValue('email', email)
              setValue('empresa', company)
              setValue('segmento', marketSegment)
              setValue('cidade', cidade)
              setValue('aberturaEstabelecimento', abertura.substring(0, 5))
              setValue('fechamentoEstabelecimento', fechamento.substring(0, 5))
              setValue('inicioAlmoco', almocoIni.substring(0, 5))
              setValue('fimAlmoco', almocoFim.substring(0, 5))
              setValue('endereco', endereco)
              setValue('usuario', userName)
              setValue('senha', password)
              setValue('confirmarSenha', password)
              setValue('duracaoServico', duracao.substring(0, 5))
              setValue('celular', celular)

              if (fds === 3) {
                setSabado(true)
                setDomingo(true)
              } else if (fds === 2) {
                fds = 2;
                setDomingo(true)
              } else if (fds === 1) {
                setSabado(true)
              }
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

  React.useEffect(() => {
    onInit()
  }, []);

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <Title style={{ textAlign: "center", marginBottom: 8 }}>
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
              <Select
                value={value}
                onValueChange={onChange}
                items={segmentos.map((e) => { return { label: e, value: e }})}
                placeholder="Selecione um segmento"
              />
              // <TextInput
              //   value={value}
              //   error={errors.segmento?.message}
              //   onChangeText={(value) => onChange(value)}
              //   onBlur={onBlur}
              //   label="Segmento"
              // />
            )}
            name="segmento"
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
                mode="time"
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
                mostrarCalendario={true}
                onChangeTimer={(date) => {
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
                mostrarCalendario={true}
                onChangeTimer={(date) => {
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
                render={(props) => (
                  <TextInputMask {...props} mask="[00]:[00]" />
                )}
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
                error={errors.endereco?.message}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
                label="Endereço"
              />
            )}
            name="endereco"
            defaultValue=""
          />
          <Text>Dias de folga</Text>
          <TouchableRipple onPress={() => setSabado(!sabado)}>
            <View style={styles.row}>
              <View pointerEvents="none">
                <Checkbox status={sabado ? "checked" : "unchecked"} />
              </View>
              <Paragraph>Sábado</Paragraph>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => setDomingo(!domingo)}>
            <View style={styles.row}>
              <View pointerEvents="none">
                <Checkbox status={domingo ? "checked" : "unchecked"} />
              </View>
              <Paragraph>Domingo</Paragraph>
            </View>
          </TouchableRipple>
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
      <ModalLoading loading={loading} />
      <ModalSucesso
        visible={sucesso}
        titulo="Sucesso!"
        subtitulo={subtituloSucesso}
        onClose={() => {
          setSucesso(false);
          setTimeout(() => {
            navigation.navigate("Pagina do prestador");
          }, 100);
        }}
      />
      <ModalErro
        visible={mostrarModalErro}
        error={error}
        status={status}
        onClose={() => setMostrarModalErro(false)}
      />
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
    height: 50,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
