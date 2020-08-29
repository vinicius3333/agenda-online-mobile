import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Title, TextInput, Button, Subheading } from 'react-native-paper';

export default function App({ navigation }) {
  const [text, setText ] = React.useState(''),
        [password, setPassword] = React.useState(''),
        [iconeSenha, setIconeSenha] = React.useState('eye-outline'),
        [mostrarSenha, setMostrarSenha ] = React.useState(true),
    elementoIconeUsuario = <TextInput.Icon name="alert-circle-outline"/>,
    elementoIconeSenha = <TextInput.Icon name={iconeSenha} onPress={trocarTipoSenha}/>
  
  function trocarTipoSenha () {
    setMostrarSenha(!mostrarSenha)
    setIconeSenha(mostrarSenha ? 'eye-off-outline' : 'eye-outline')
  }

  return (
    <View style={styles}>
      <Title
        style={{ textAlign: 'center' }}
      >
        Por favor
      </Title>
      <TextInput
        mode="outlined"
        right={elementoIconeUsuario}
        label="Usuário"
        value={text}
        onChangeText={text => setText(text)}
      />
      <TextInput
        mode="outlined"
        right={elementoIconeSenha}
        label="Senha"
        secureTextEntry={mostrarSenha}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <Button
        mode="contained"
        onPress={() => console.log('Entrando!')}
        contentStyle={styleButton}
        style={{ marginTop: 4 }}
        labelStyle={{ color: "white" }}
      >
        ENTRAR
      </Button>
      <Subheading
        style={{ paddingVertical: 12, textAlign: 'center' }}
      >
        Não tem login? Cadastre-se abaixo
      </Subheading>
      <Button
        mode="text"
        onPress={() => console.log('Lista de empresas')}
      >
        Lista de Empresas
      </Button>
      <Button
        mode="text"
        onPress={() => console.log('quero me cadastrar')}
      >
        Quero me cadastrar
      </Button>
    </View>
  );
}

const styles = {
  padding: 24,
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center'
};

const styleButton = StyleSheet.create({
  height: 50
})
