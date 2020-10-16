import React from "react";
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import modalCss from '../../shared/componentes/sass/Modal'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Autocomplete from '../../shared/componentes/Autocomplete'
import PaginaUsuarioService from "./paginaUsuarioService";

const ModalAgendamento = (props) => {
  const { visible, onClose } = props;
  const [loadingCidade, setLoadingCidade] = React.useState(false)
  const [cidade, setCidade] = React.useState(null)
  const [segmento, setSegmento] = React.useState(null)
  const [empresa, setEmpresa] = React.useState(null)
  const [listaCidades, setListaCidades] = React.useState([  {
    id: 0,
    children: []
  }])


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

  function fecharModal () {
    setListaCidades([{ id: 0, children: [] }])
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
      <View style={styles.modalContent}>
        <Autocomplete
          placeholder="Pesquisa uma cidade"
          pesquisarTexto={(texto) => pesquisarCidade(texto)}
          items={listaCidades}
          loading={loadingCidade}
          searchPlaceholderText="Procure por alguma cidade"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create(modalCss);

export { ModalAgendamento };
