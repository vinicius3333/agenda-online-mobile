import * as React from "react";
import AppNavigator from "./routes/AppNavigator";
import {
  Provider as PaperProvider,
  Dialog,
  Portal,
  Paragraph,
} from "react-native-paper";
import theme from "./shared/themes/baseTheme";
import BaseService from "./shared/service/baseService";
import axios from "axios";

export default function App() {
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState("");

  BaseService.startRequestAxios();
  BaseService.startResponseAxios((error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 500) {
        setError("Error no servidor.");
        setStatus("500");
      } else if (status === 404) {
        setError("Url não encontrada.");
        setStatus("404");
      } else {
        setError(error.response.data);
        setStatus(error.response.status);
      }
    } else {
      setError(error.message);
    }
    showModal();
  });

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
      <Portal>
        <Dialog visible={visible} onDismiss={hideModal}>
          <Dialog.Title>Oops, algo deu errado!</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Mensagem: {error}</Paragraph>
            <Paragraph>Status: {status}</Paragraph>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
}
