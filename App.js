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

export default function App() {
  BaseService.startRequestAxios();
  BaseService.startResponseAxios();

  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
}
