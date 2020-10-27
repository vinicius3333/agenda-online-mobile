import React, { useEffect, useImperativeHandle } from "react";
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

const ModalMarcaEvento = React.forwardRef((props, ref) => {
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
  const [motivo, setMotivo] = React.useState("")
  const [userName, setUserName] = React.useState("")

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
    props.onLoading(true)
    let newHorario = (Number(horario.substring(0, 2)) + 3)
    newHorario = (newHorario.length < 2 ? '0' + newHorario : newHorario) + horario.substring(2)
    let momentObj = moment(valorData + newHorario, 'DD/MM/YYYYHH:mm:s');
    let dateTime = momentObj.format('DD/MM/YYYY HH:mm:ss');
    let formData = new FormData()
    formData.append('motivo', motivo)
    formData.append('admId', idUsuario)
    formData.append('dataHora', dateTime)

    declararMotivo(formData)
  }

  function declararMotivo (data) {
    paginaAdmService.postDeclararMotivo(data)
      .then((res) => {
        if (res.status === 200) {
          handlerErroAgendamento(res.data)
          return
        }
        fecharModal()
        props.onSuccess()
      })
      .catch((err) => {
        console.log(err.response)
        props.onError(err)
      })
      .finally(() => {
        props.onLoading(false)
      })
  }

  function handlerErroAgendamento (erro) {
    switch (erro) {
      case 'indisponível':
      props.onError({ message: 'DataHora Já foi indisponibilizada anteriormente!', status: 400});
      return
      case 'DataHora Ultrapassada':
      props.onError({ message: 'Escolha uma DataHora além da atual!', status: 400});
      return
      default:
      props.onError({ message: `Erro: ${erro}`, status: 400});
      return
    }
  }

  useEffect(() => {
    if (!visible) return
    setDatasBloqueadas([])

    const { fds } = infoUsuario

    if (fds === 3) {
      setDatasBloqueadas([0,6]);
    }
    else if (fds === 1) {
      setDatasBloqueadas([6]);
    }
    else if (fds === 2) {
      setDatasBloqueadas([0]);
    }
  }, [visible])

  function fecharModal () {
    setListaUsuarios([{ id: 0, children: [] }])
    setValorData("")
    setHorario("")
    setUserName("")
    setMotivo("")
    setEstipularHorario(false)
    setValorEstipulado('')
    setListaHorarios([])
    onClose()
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
          Indisponibilize(Exclua) uma Data/Hora da sua Agenda
        </Text>
        <TextInput
          label="Motivo"
          value={motivo}
          onChangeText={(value) => setMotivo(value)}
          multiline
        />
          <TextInput
            disabledDates={(date) => {
              const diaSemana = new Date(date).getDay()
              return date.isBefore(today, "day") || datasBloqueadas.includes(diaSemana)
            }}
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
          <Select
            value={horario}
            onValueChange={(value) => setHorario(value)}
            disabled={itemsHorario.length === 0}
            items={itemsHorario}
            placeholder="Selecione um horário"
          />
          <Button
            mode="contained"
            onPress={onSubmit}
            style={{ marginTop: 8}}
            contentStyle={{height: 40}}
            labelStyle={{ color: "white" }}
          >
            EXCLUIR
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

export { ModalMarcaEvento };
