import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Avatar } from "react-native-paper";
import theme from "../themes/baseTheme";

const ModalErro = (props) => {
  const { visible, error, status, onClose } = props;

  return (
    <Modal
      onRequestClose={onClose}
      onDismiss={onClose}
      visible={visible}
      transparent={true}
      animationType={"fade"}
    >
      <TouchableWithoutFeedback onPressOut={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContent}>
        <View>
          <Avatar.Icon
            color={theme.colors.error}
            style={styles.iconeSucesso}
            size={64}
            icon="alert-circle-outline"
          />
        </View>
        <Text style={styles.titulo}>Oops, algo deu errado!</Text>
        <Text style={styles.subtitulo}>{error}</Text>
        <Text style={styles.subtitulo}>{status}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#00000040",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    height: 150,
    width: 300,
    borderRadius: 10,
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
  },
  subtitulo: {
    fontSize: 14,
  },
  iconeSucesso: {
    paddingTop: 24,
    backgroundColor: "white",
  },
});

export { ModalErro };
