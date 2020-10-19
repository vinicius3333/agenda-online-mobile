import * as React from "react";
import AppNavigator from "./routes/AppNavigator";
import {
  Provider as PaperProvider
} from "react-native-paper";
import theme from "./shared/themes/baseTheme";
import BaseService from "./shared/service/baseService";
import { ModalLoading, ModalSucesso } from './shared/componentes/index'

export default function App() {
  const [loading, setLoading] = React.useState(false)
  const [mostrarSucesso, setMostrarSucesso] = React.useState(false)
  const [subtituloSucesso, setSubtituloSucesso] = React.useState('')
  BaseService.startRequestAxios();
  BaseService.startResponseAxios();

  return (
    <PaperProvider theme={theme}>
      <AppNavigator onChangeLoading={(bool) => setLoading(bool)} onSucesso={(subtitulo) => {
        setMostrarSucesso(true)
        setSubtituloSucesso(subtitulo)
      }}/>
      <ModalLoading loading={loading} />
      <ModalSucesso visible={mostrarSucesso} subtitulo={subtituloSucesso} onClose={() => setMostrarSucesso(false)}/>
    </PaperProvider>
  );
}
