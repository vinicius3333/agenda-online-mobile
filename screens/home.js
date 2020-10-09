import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { DataTable, Button } from "react-native-paper";
import theme from "../shared/themes/baseTheme";

export default function App({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({});
  });
  return (
    <View style={styles.container}>
      <View style={styles.empresas}>
        <Text style={styles.tituloEmpresa}>Empresas</Text>
      </View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Empresa</DataTable.Title>
          <DataTable.Title>Segmento</DataTable.Title>
          <DataTable.Title>Cidade</DataTable.Title>
          <DataTable.Title>Abertura</DataTable.Title>
          <DataTable.Title>Fechamento</DataTable.Title>
          <DataTable.Title>Duração</DataTable.Title>
          <DataTable.Title>Dia de folga</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>Agenda online</DataTable.Cell>
          <DataTable.Cell>Desenvolvimento</DataTable.Cell>
          <DataTable.Cell>São vicente</DataTable.Cell>
          <DataTable.Cell>08:00:00</DataTable.Cell>
          <DataTable.Cell>22:00:00</DataTable.Cell>
          <DataTable.Cell>01:00:00</DataTable.Cell>
          <DataTable.Cell>Sábado</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Agenda online</DataTable.Cell>
          <DataTable.Cell>Desenvolvimento</DataTable.Cell>
          <DataTable.Cell>São vicente</DataTable.Cell>
          <DataTable.Cell>08:00:00</DataTable.Cell>
          <DataTable.Cell>22:00:00</DataTable.Cell>
          <DataTable.Cell>01:00:00</DataTable.Cell>
          <DataTable.Cell>Sábado</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Agenda online</DataTable.Cell>
          <DataTable.Cell>Desenvolvimento</DataTable.Cell>
          <DataTable.Cell>São vicente</DataTable.Cell>
          <DataTable.Cell>08:00:00</DataTable.Cell>
          <DataTable.Cell>22:00:00</DataTable.Cell>
          <DataTable.Cell>01:00:00</DataTable.Cell>
          <DataTable.Cell>Sábado</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Agenda online</DataTable.Cell>
          <DataTable.Cell>Desenvolvimento</DataTable.Cell>
          <DataTable.Cell>São vicente</DataTable.Cell>
          <DataTable.Cell>08:00:00</DataTable.Cell>
          <DataTable.Cell>22:00:00</DataTable.Cell>
          <DataTable.Cell>01:00:00</DataTable.Cell>
          <DataTable.Cell>Sábado</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Agenda online</DataTable.Cell>
          <DataTable.Cell>Desenvolvimento</DataTable.Cell>
          <DataTable.Cell>São vicente</DataTable.Cell>
          <DataTable.Cell>08:00:00</DataTable.Cell>
          <DataTable.Cell>22:00:00</DataTable.Cell>
          <DataTable.Cell>01:00:00</DataTable.Cell>
          <DataTable.Cell>Sábado</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Pagination
          page={1}
          numberOfPages={3}
          onPageChange={(page) => {
            console.log(page);
          }}
          label="Mostrando 5 de 10"
        />
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  empresas: {
    height: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
  },
  tituloEmpresa: {
    fontSize: theme.text.size.h2,
    color: theme.text.colors.secondary,
    fontWeight: "700",
    textAlign: "center",
  },
  button: {
    height: 50,
  },
});
