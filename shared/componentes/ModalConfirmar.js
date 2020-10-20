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
import theme from "../themes/baseTheme";

const ModalConfirmar = (props) => {
  const { visible, onClose, empresa, excluir } = props;

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
      <View style={[styles.modalContent, {alignItems: "flex-start"}]}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.container}
        >
            <Text style={{ fontSize: 24, color: theme.colors.header, textAlign: 'center', paddingBottom: 8 }}>
                Apague um Agendamento
            </Text>
            <Text>
                Tem certeza que deseja excluir o agendamento de<Text style={{color: theme.colors.primary}}> {empresa}</Text>?
            </Text>
            <Button
                mode="contained"
                onPress={excluir}
                style={{ marginTop: 16}}
                contentStyle={{height: 40}}
                labelStyle={{ color: "white" }}
            >
                DELETAR
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

export { ModalConfirmar };
