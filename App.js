import * as React from 'react';
import AppNavigator from './routes/AppNavigator'
import { Provider as PaperProvider } from 'react-native-paper';
import theme from './themes/ThemePaper'

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppNavigator/>
    </PaperProvider>
  )
}