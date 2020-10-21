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
import PaginaUsuarioService from "./paginaUsuarioService";
import { Button } from 'react-native-paper'
import theme from '../../shared/themes/baseTheme'
import TextInput from '../../shared/componentes/TextInput'
import moment from 'moment'
import paginaUsuarioService from "./paginaUsuarioService";
import Select from '../../shared/componentes/Select'
import TextInputMask from "react-native-text-input-mask";

const today = moment();

const ModalAgendamento = React.forwardRef((props, ref) => {
  const { visible, onClose, listaAdm, acao } = props;
  const [loadingCidade, setLoadingCidade] = React.useState(false)
  const [loadingSegmento, setLoadingSegmento] = React.useState(false)
  const [LoadingEmpresa, setLoadingEmpresa] = React.useState(false)
  const [cidade, setCidade] = React.useState(null)
  const [segmento, setSegmento] = React.useState(null)
  const [empresa, setEmpresa] = React.useState(null)
  const [listaCidades, setListaCidades] = React.useState([{
    id: 0,
    children: []
  }])
  const [listaSegmentos, setListaSegmentos] = React.useState([{
    id: 0,
    children: []
  }])
  const [listaEmpresas, setListaEmpresas] = React.useState([{
    id: 0,
    children: []
  }])
  const [mostrarFiltro, setMostrarFiltro] = React.useState(false)
  const [valorData, setValorData] = React.useState("")
  const [datasBloqueadas, setDatasBloqueadas] = React.useState([])
  const [itemsHorario, setListaHorarios] = React.useState([])
  const [admObjState, setAdmObjState] = React.useState({})
  const [horario, setHorario] = React.useState("")
  const [estipularHorario, setEstipularHorario] = React.useState(false)
  const [valorEstipulado, setValorEstipulado] = React.useState("")
  const [idAgendamento, setIdAgendamento] = React.useState(null)
  const [valueTimer, setValueTimer] = React.useState(new Date())

  const pesquisarCidade = (texto) => {
    setCidade(texto)
    if (texto.length === 0) {
      setListaCidades([{ id: 0, children: [] }])
      return
    }
    setLoadingCidade(true)
    PaginaUsuarioService.getCidadeFiltro(texto, segmento)
      .then((res) => {
        let listaCidadesRes = []
        if (res.data === 'NotFound') {
          listaCidadesRes = []
        } else {
          listaCidadesRes = res.data.map((e, index) => {
            return { id: index + 1, title: e }
          })
        }
        setListaCidades([{ id: 0, children: listaCidadesRes }])
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoadingCidade(false)
      })
  }

  const pesquisarSegmento = (texto) => {
    setSegmento(texto)
    if (texto.length === 0) {
      setListaSegmentos([{ id: 0, children: [] }])
      return
    }
    setLoadingSegmento(true)
    PaginaUsuarioService.getSegmentoFiltro(cidade, texto)
      .then((res) => {
        let listaRes = []
        if (res.data === 'NotFound') {
          listaRes = []
        } else {
          listaRes = res.data.map((e, index) => {
            return { id: index + 1, title: e }
          })
        }
        setListaSegmentos([{ id: 0, children: listaRes }])
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoadingSegmento(false)
      })
  }

  const pesquisarEmpresa = (texto) => {
    setEmpresa(texto)
    if (texto.length === 0) {
      setListaEmpresas([{ id: 0, children: [] }])
      return
    }
    setLoadingEmpresa(true)
    PaginaUsuarioService.getEmpresaFiltro(cidade, segmento, texto)
      .then((res) => {
        let listaRes = []
        if (res.data === 'NotFound') {
          listaRes = []
        } else {
          listaRes = res.data.map((e, index) => {
            return { id: index + 1, title: e }
          })
        }
        setListaEmpresas([{ id: 0, children: listaRes }])
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoadingEmpresa(false)
      })
  }

  const horariosDisponiveis = (dateValue, empresa) => {
    return new Promise((resolve) => {
      props.onLoading(true)
      paginaUsuarioService.getHorariosDisponiveis(empresa, dateValue)
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
    if (!empresa || !valorData || !(estipularHorario ? valorEstipulado : horario)) return
    props.onLoading(true)
    let newHorario = (Number(horario.substring(0, 2)) + 3)
    newHorario = (newHorario.length < 2 ? '0' + newHorario : newHorario) + horario.substring(2)
    let momentObj = moment(valorData + newHorario, 'DD/MM/YYYYHH:mm:s');
    let dateTime = momentObj.format('YYYY-MM-DDTHH:mm:ss:00z');
    const { cidade, company, id, fullName, marketSegment, observacao } = admObjState
    let data = {
      cidade,
      empresa: company,
      dataHora: dateTime,
      admId: id,
      nome: fullName,
      segmento: marketSegment,
      usuarioId: props.idUsuario,
      celularCliente: props.infoUsuario.celular,
      celularAdm: "",
      endereco: "",
      imagemPerfilCliente: "",
      imagemPerfilPrestador: "",
      observacao: observacao || ''
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
    paginaUsuarioService.putEditarAgendamento(data)
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
    paginaUsuarioService.postAgendarCliente(data)
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
    setListaSegmentos([{ id: 0, children: [] }])
    setListaCidades([{ id: 0, children: [] }])
    setListaEmpresas([{ id: 0, children: [] }])
    setValorData("")
    setHorario("")
    setEmpresa("")
    setSegmento("")
    setCidade("")
    setEstipularHorario(false)
    setValorEstipulado('')
    setListaEmpresas([{
      id: 0,
      children: []
    }])
    setListaSegmentos([{
      id: 0,
      children: []
    }])
    setListaCidades([{
      id: 0,
      children: []
    }])
    setListaHorarios([])
    onClose()
  }

  useImperativeHandle(ref, () => ({
    preencherCampos (data) {
      const { empresa, dateValue, timeValue, duracao, horarioEstipulado, id } = data
      setIdAgendamento(id)
      handlerEmpresa(empresa)
      setValorData(dateValue)
      setEstipularHorario(horarioEstipulado)
      if (horarioEstipulado) {
        setValorEstipulado(duracao)
        setHorario(timeValue)
      } else {
        horariosDisponiveis(dateValue, empresa)
          .then((listaHorarios) => {
            let newArray = listaHorarios
            newArray.push({ label: timeValue, value: timeValue  })
            setListaHorarios(newArray)
            setHorario(timeValue)
          })
      }
    }
  }))

  function handlerEmpresa (empresa) {
    let admObj = listaAdm.filter((el) => el.company == empresa)[0]
    setAdmObjState(admObj)
    const { fds, duracao } = admObj
    setDatasBloqueadas([])

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

    setEmpresa(empresa)
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
        <Button color={theme.colors.header} style={{ paddingTop: 1 }} mode="outlined" onPress={() => setMostrarFiltro(!mostrarFiltro)}>
          FILTRO
        </Button>
          { mostrarFiltro && (
            <Autocomplete
              placeholder="Pesquisa uma cidade"
              pesquisarTexto={(texto) => pesquisarCidade(texto)}
              onChangeItem={(cidade) => setCidade(cidade)}
              items={listaCidades}
              loading={loadingCidade}
              searchPlaceholderText="Procure por alguma cidade"
            />
            )
          }
          { mostrarFiltro && (
            <Autocomplete
              placeholder="Pesquise um segmento"
              pesquisarTexto={(texto) => pesquisarSegmento(texto)}
              onChangeItem={(segmento) => setSegmento(segmento)}
              items={listaSegmentos}
              loading={loadingSegmento}
              searchPlaceholderText="Procure por algum segmento"
            />)
          }
          <Autocomplete
            placeholder="Pesquise uma empresa"
            pesquisarTexto={(texto) => pesquisarEmpresa(texto)}
            onChangeItem={(empresa) => handlerEmpresa(empresa)}
            value={empresa}
            items={listaEmpresas}
            loading={LoadingEmpresa}
            searchPlaceholderText="Procure por alguma empresa"
          />
          <TextInput
            disabledDates={(date) => {
              const diaSemana = new Date(date).getDay()
              return date.isBefore(today, "day") || datasBloqueadas.includes(diaSemana)
            }}
            disabled={[null, undefined, ''].includes(empresa)}
            value={valorData}
            onChangeText={(value) => setValorData(value)}
            label="Data"
            mode="date"
            mostrarCalendario={true}
            onChangeTimer={(date) => {
              const dateValue = moment(new Date(date)).format('DD/MM/YYYY')
              setValorData(dateValue)
              horariosDisponiveis(dateValue, empresa)
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
