import * as React from "react";
import AppNavigator from "./routes/AppNavigator";
import { Provider as PaperProvider } from "react-native-paper";
import theme from "./shared/themes/baseTheme";
export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
}
