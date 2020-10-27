import React, { useImperativeHandle } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableWithoutFeedback,
  ScrollView
} from "react-native";
import modalCss from '../../shared/componentes/sass/Modal'
import Autocomplete from '../../shared/componentes/Autocomplete'
import { Button } from 'react-native-paper'
import theme from '../../shared/themes/baseTheme'
import TextInput from '../../shared/componentes/TextInput'
import moment from 'moment'
import paginaAdmService from "./paginaAdmService";
import Select from '../../shared/componentes/Select'
import TextInputMask from "react-native-text-input-mask";

const today = moment();

const ModalAgendamento = React.forwardRef((props, ref) => {
  const { visible, onClose, listaCliente, acao, idUsuario, infoUsuario } = props;
  const [loadingUsuarios, setLoadingUsuarios] = React.useState(false)
  const [listaUsuarios, setListaUsuarios] = React.useState([{
    id: 0,
    children: []
  }])
  const [valorData, setValorData] = React.useState("")
  const [datasBloqueadas, setDatasBloqueadas] = React.useState([])
  const [itemsHorario, setListaHorarios] = React.useState([])
  const [usuarioObjState, setUsuarioObjState] = React.useState({})
  const [horario, setHorario] = React.useState("")
  const [estipularHorario, setEstipularHorario] = React.useState(false)
  const [valorEstipulado, setValorEstipulado] = React.useState("")
  const [idAgendamento, setIdAgendamento] = React.useState(null)
  const [valueTimer, setValueTimer] = React.useState(new Date())
  const [nomeUsuario, setNomeUsuario] = React.useState("")
  const [celularUsuario, setCelular] = React.useState("")
  const [userName, setUserName] = React.useState("")

  const pesquisarUserName = (texto) => {
    setUserName(texto)
    if (texto.length === 0) {
        setListaUsuarios([{ id: 0, children: [] }])
        return
    }
    setLoadingUsuarios(true)
    paginaAdmService.getBuscarCliente(texto)
      .then((res) => {
        let listaRes = []
        if (res.data === 'NotFound') {
          listaRes = []
        } else {
          listaRes = res.data.map((e, index) => {
            return { id: index + 1, title: e }
          })
        }
        setListaUsuarios([{ id: 0, children: listaRes }])
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoadingUsuarios(false)
      })
  }

  const horariosDisponiveis = (dateValue) => {
    return new Promise((resolve) => {
      props.onLoading(true)
      paginaAdmService.getHorariosDisponiveis(infoUsuario.company, dateValue)
        .then((res) => {
          switch (res.data) {
            case 'indisponível':
            props.onError({ message: 'Não há mais Horários disponíveis para este dia', status: 400});
            return
            case 'empresainvalida':
            props.onError({ message: 'Digite uma empresa Válida', status: 400});
            return
            case 'diaVencido':
            props.onError({ message: 'Escolha um dia de hoje em diante', status: 400});
            return
            case 'duracaoNaoEstipulada':
            return
          }
          const listaHorarios = res.data.map((e) => {
            return {
              label: e,
              value: e
            }
          })
          setListaHorarios(listaHorarios)
          resolve(listaHorarios)
        })
        .catch((err) => {
          props.onError(err)
        })
        .finally(() => {
          props.onLoading(false)
          
        })
    })
  }

  const onSubmit = () => {
    if (!userName || !valorData || !(estipularHorario ? valorEstipulado : horario)) return
    props.onLoading(true)
    let newHorario = (Number(horario.substring(0, 2)) + 3)
    newHorario = (newHorario.length < 2 ? '0' + newHorario : newHorario) + horario.substring(2)
    let momentObj = moment(valorData + newHorario, 'DD/MM/YYYYHH:mm:s');
    let dateTime = momentObj.format('YYYY-MM-DDTHH:mm:ss:00z');
    const { celular, id, fullName } = usuarioObjState
    let data = {
      cidade: infoUsuario.cidade,
      empresa: infoUsuario.company,
      dataHora: dateTime,
      admId: idUsuario,
      nome: fullName,
      segmento: infoUsuario.marketSegment,
      usuarioId: id,
      celularCliente: celular,
      celularAdm: "",
      endereco: "",
      imagemPerfilCliente: "",
      imagemPerfilPrestador: "",
      observacao: infoUsuario.observacao || ''
    }

    if (estipularHorario) {
      data.duracao = valorEstipulado
    }
    if (acao === 'add') {
      salvarAgendamento(data)
    } else if (acao === 'edit') {
      data.id = idAgendamento
      atualizarAgendamento(data)
    }
  }

  function handlerErroAgendamento (erro) {
    switch (erro) {
      case 'valido':
      props.onError({ message: 'Escolha um horário de Atendimento válido !', status: 400});
      return
      case 'dataCerta':
      props.onError({ message: 'Escolha uma data que ainda não foi agendada !', status: 400});
      return
      case 'momento':
      props.onError({ message: 'Escolha uma data/hora após a deste momento', status: 400});
      return
      case 'empresainvalida':
      props.onError({ message: 'Digite uma empresa Cadastrada', status: 400});
      return
      case 'horarioImproprio':
      props.onError({ message: 'Escolha um Horário de Serviço ou que não seja do almoço', status: 400});
      return
      default:
      props.onError({ message: `Esta Data/Hora foi excluida da Agenda pelo seguinte motivo: ${er.text}`, status: 400});
      return
    }
  }

  function atualizarAgendamento (data) {
    paginaAdmService.putEditarAgendamento(data)
    .then((res) => {
      if (res.status === 200) {
        handlerErroAgendamento(res.data)
      }
      fecharModal()
      props.onSuccess()
    })
    .catch((err) => {
      props.onError(err)
    })
    .finally(() => {
      props.onLoading(false)
    })
  }

  function salvarAgendamento (data) {
    paginaAdmService.postAgendarCliente(data)
      .then((res) => {
        if (res.status === 200) {
          handlerErroAgendamento(res.data)
        }
        fecharModal()
        props.onSuccess()
      })
      .catch((err) => {
        props.onError(err)
      })
      .finally(() => {
        props.onLoading(false)
      })
  }

  function fecharModal () {
    setListaUsuarios([{ id: 0, children: [] }])
    setValorData("")
    setHorario("")
    setUserName("")
    setNomeUsuario("")
    setCelular("")
    setEstipularHorario(false)
    setValorEstipulado('')
    setListaHorarios([])
    onClose()
  }

  useImperativeHandle(ref, () => ({
    preencherCampos (data) {
      const { userName, nome, celularCliente, dateValue, timeValue, duracao, horarioEstipulado, id } = data
      setIdAgendamento(id)
      handlerUsuario(userName)
      setNomeUsuario(nome)
      setCelular(celularCliente)
      setValorData(dateValue)
      setEstipularHorario(horarioEstipulado)
      if (horarioEstipulado) {
        setValorEstipulado(duracao)
        setHorario(timeValue)
      } else {
        horariosDisponiveis(dateValue, userName)
          .then((listaHorarios) => {
            let newArray = listaHorarios
            newArray.push({ label: timeValue, value: timeValue  })
            setListaHorarios(newArray)
            setHorario(timeValue)
          })
      }
    }
  }))

  function handlerUsuario (userName) {
    let usuarioObj = listaCliente.filter((el) => el.userName == userName)[0]
    setUsuarioObjState(usuarioObj)
    const { fullName, celular } = usuarioObj
    setDatasBloqueadas([])
    setNomeUsuario(fullName)
    setCelular(celular)

    const { fds, duracao } = infoUsuario

    if (duracao === '00:00:00') {
      setEstipularHorario(true)
    }

    if (fds === 3) {
      setDatasBloqueadas([0,6]);
    }
    else if (fds === 1) {
      setDatasBloqueadas([6]);
    }
    else if (fds === 2) {
      setDatasBloqueadas([0]);
    }

    setUserName(userName)
  }

  return (
    <Modal
      onRequestClose={fecharModal}
      onDismiss={fecharModal}
      visible={visible}
      transparent={true}
      animationType={"fade"}
    >
      <TouchableWithoutFeedback onPressOut={fecharModal}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={[styles.modalContent, {alignItems: "flex-start"}]}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.container}
        >

        <Text style={{ fontSize: 20, color: theme.colors.header, textAlign: 'left', paddingBottom: 8 }}>
          Agende um Horário
        </Text>
          <Autocomplete
            placeholder="Pesquise um usuário"
            pesquisarTexto={(texto) => pesquisarUserName(texto)}
            onChangeItem={(userName) => handlerUsuario(userName)}
            value={userName}
            items={listaUsuarios}
            loading={loadingUsuarios}
            searchPlaceholderText="Procure o usuário pelo userName"
          />
          <TextInput
            disabled
            label="Nome"
            value={nomeUsuario}
          />
          <TextInput
            disabled
            label="Celular"
            value={celularUsuario}
          />
          <TextInput
            disabledDates={(date) => {
              const diaSemana = new Date(date).getDay()
              return date.isBefore(today, "day") || datasBloqueadas.includes(diaSemana)
            }}
            disabled={[null, undefined, ''].includes(userName)}
            value={valorData}
            onChangeText={(value) => setValorData(value)}
            label="Data"
            mode="date"
            mostrarCalendario={true}
            onChangeTimer={(date) => {
              const dateValue = moment(new Date(date)).format('DD/MM/YYYY')
              setValorData(dateValue)
              horariosDisponiveis(dateValue, userName)
            }}
          />
            {
              estipularHorario && 
              <TextInput
                style={{paddingTop: 0}}
                label="Escreva um horário"
                value={horario}
                onChangeText={(value) => setHorario(value)}
                mostrarCalendario={true}
                mode="time"
                valueTimer={valueTimer}
                maxLength={5}
                onChangeTimer={(date) => {
                  const dataValue = new Date(date)
                    .toTimeString()
                    .split(" ")[0]
                    .substring(0, 5);
                  setHorario(dataValue);
                }}
              />
            }
            {
              estipularHorario ? 
              <TextInput
                style={{paddingTop: 0}}
                label="Duração do Serviço"
                value={valorEstipulado}
                onChangeText={(value) => setValorEstipulado(value)}
                render={(props) => (
                  <TextInputMask {...props} mask="[00]:[00]" />
                )}
              /> :
              <Select
                value={horario}
                onValueChange={(value) => setHorario(value)}
                disabled={itemsHorario.length === 0}
                items={itemsHorario}
                placeholder="Selecione um horário"
              />
            }
          <Button
            mode="contained"
            onPress={onSubmit}
            style={{ marginTop: 8}}
            contentStyle={{height: 40}}
            labelStyle={{ color: "white" }}
          >
            SALVAR ALTERAÇÕES
          </Button>
          <Button
            mode="outlined"
            onPress={fecharModal}
            style={{marginVertical: 8}}
            contentStyle={{height: 40}}
          >
            FECHAR
          </Button>          
        </ScrollView>
      </View>
    </Modal>
  );
})

const styles = StyleSheet.create(modalCss);

export { ModalAgendamento };
