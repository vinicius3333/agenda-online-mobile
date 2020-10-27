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
import { Button } from 'react-native-paper'
import theme from '../../shared/themes/baseTheme'
import moment from 'moment'
import paginaAdmService from "./paginaAdmService";
import Select from '../../shared/componentes/Select'


const ModalDisponibilizarEvento = React.forwardRef((props, ref) => {
  const { visible, onClose, listaHorariosExcluidos, idUsuario, infoUsuario } = props;
  const [horario, setHorario] = React.useState("")

  const onSubmit = () => {
    props.onLoading(true)
    let momentObj = moment(horario, 'DD/MM/YYYY HH:mm:ss');
    let dateTime = momentObj.format('YYYY-MM-DDTHH:mm:ss.000z');
    let newDate = new Date(dateTime)
    newDate.setHours(newDate.getHours() + 3)
    let data = {
        admId: idUsuario,
        dataHora: newDate,
        motivo: "--"
    }
    console.log(data)
    disponibilizarEvento(data)
  }

  function disponibilizarEvento (data) {
    paginaAdmService.postDisponibilizarHorario(data)
      .then((res) => {
        if (res.data === 'eventoInexistente') {
          props.onError({ message: 'Não existe um evento com esta Data!', status: 400});
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

  function fecharModal () {
    setHorario("")
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
                Disponibilize uma Data/Hora que foi excluída
            </Text>
            <Select
                value={horario}
                onValueChange={(value) => setHorario(value)}
                disabled={listaHorariosExcluidos.length === 0}
                items={listaHorariosExcluidos}
                placeholder="Selecione um horário"
            />
            <Button
                mode="contained"
                onPress={onSubmit}
                style={{ marginTop: 8}}
                contentStyle={{height: 40}}
                labelStyle={{ color: "white" }}
            >
                DISPONIBILIZAR
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

export { ModalDisponibilizarEvento };