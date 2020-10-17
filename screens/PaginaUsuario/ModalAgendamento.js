import React from "react";
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

const today = moment();

const ModalAgendamento = (props) => {
  const { visible, onClose, listaAdm } = props;
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
    props.onLoading(true)
    paginaUsuarioService.getHorariosDisponiveis(empresa, dateValue)
      .then((res) => {
        if (res.data[0] === '00:00:00') {
          return
        }
        setListaHorarios(res.data.map((e) => {
          return {
            label: e,
            value: e
          }
        }))
      })
      .catch((err) => {
        props.onError(err)
      })
      .finally(() => {
        props.onLoading(false)
      })
  }

  const onSubmit = () => {
    props.onLoading(true)
    let momentObj = moment(valorData + horario, 'DD/MM/YYYYHH:mm:s');
    let dateTime = momentObj.format('YYYY-MM-DDTHH:mm:ss:00z');
    const { cidade, company, id, fullName, marketSegment } = admObjState
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
      observacao: ""
    }

    paginaUsuarioService.postAgendarCliente(data)
      .then(() => {
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
            onChangeItem={(empresa) => {
              let admObj = listaAdm.filter((el) => el.company == empresa)[0]
              setAdmObjState(admObj)
              const { fds } = admObj
              setDatasBloqueadas([])

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
            }}
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
          <Select
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
};

const styles = StyleSheet.create(modalCss);

export { ModalAgendamento };
