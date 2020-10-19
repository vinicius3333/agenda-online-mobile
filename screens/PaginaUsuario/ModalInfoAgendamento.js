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

const ModalInfoAgendamento = (props) => {
  const { visible, onClose, objetoAdm: {
    empresa, endereco, celularAdm, dataHora, duracao, observacao
  } } = props;

  function fecharModal () {
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
      <View style={[styles.modalContent, {alignItems: "flex-start", width: 330}]}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.container}
        >
            <Text style={{ fontSize: 24, color: theme.colors.header, textAlign: 'center', paddingBottom: 16 }}>
                Informações do seu Agendamento
            </Text>
            <Text style={stylesTexto.esquerda}>
                Empresa: <Text style={stylesTexto.direita}> {empresa} </Text>
            </Text>
            <Text style={stylesTexto.esquerda}>
                Endereço: <Text style={stylesTexto.direita}> {endereco} </Text>
            </Text>
            <Text style={stylesTexto.esquerda}>
                Celular: <Text style={stylesTexto.direita}> {celularAdm} </Text>
            </Text>
            <Text style={stylesTexto.esquerda}>
                Data do Agendamento: <Text style={stylesTexto.direita}> {dataHora} </Text>
            </Text>
            <Text style={stylesTexto.esquerda}>
                Duração do Agendamento: <Text style={stylesTexto.direita}> {duracao} </Text>
            </Text>
            <Text style={stylesTexto.esquerda}>
                Observação do Prestador de Serviço: <Text style={stylesTexto.direita}> {observacao} </Text>
            </Text>
        
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
const stylesTexto = StyleSheet.create({
    esquerda: {
        color: theme.colors.primary,
        fontSize: 14
    },
    direita: {
        color: 'black'
    }
})

export { ModalInfoAgendamento };
