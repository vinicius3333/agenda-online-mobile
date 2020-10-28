import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import theme from "../../shared/themes/baseTheme";
import tabelaPrestadoresService from './tabelaPrestadoresService'
import { ModalLoading, ModalErro, ModalSucesso, ModalConfirmar } from "../../shared/componentes/index";

export default function TabelaPrestadores () {
    const tableHead = ['Empresa', 'Segmento', 'Cidade', 'Abertura', 'Fechamento', 'Duração', 'Dia de folga']
    const widthArr = [140, 140, 140, 140, 140, 140, 140]
    const [loading, setLoading] = useState(false)
    const [mostrarModalErro, setMostrarModalErro] = useState(false)
    const [error, setError] = useState("")
    const [status, setStatus]= useState('')
    const [tableData, setTableData] = useState([])

    function handlerError(error) {
        if (error.response) {
          setStatus(error.response.status);
          setError(error.response.data?.message);
        } else {
          setError(error.message);
          setStatus(500);
        }
        setMostrarModalErro(true);
    }

    useEffect(() => {
        setLoading(true)
        tabelaPrestadoresService.getListaAdmService()
            .then((res) => {
                const data = res.data
                const tableData = data.map((e) => {
                    let fds = ''
                    if (e.fds === 3) {
                        fds = 'Sábado e Domingo'
                    } else if (e.fds === 2) {
                        fds = 'Domingo'
                    } else if (e.fds === 1) {
                        fds = 'Sábado'
                    }
                    return [e.company, e.marketSegment, e.cidade, e.abertura, e.fechamento, e.duracao, fds]
                })
                setTableData(tableData)
            })
            .catch((err) => {
                handlerError(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.empresas}>
            <Text style={styles.tituloEmpresa}>Empresas</Text>
            </View>
            <ScrollView horizontal={true}>
            <View>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={[styles.text, { fontWeight: 'bold' }]}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {
                    tableData.map((rowData, index) => (
                        <Row
                        key={index}
                        data={rowData}
                        widthArr={widthArr}
                        style={styles.row}
                        textStyle={styles.text}
                        />
                    ))
                    }
                </Table>
                </ScrollView>
            </View>
            </ScrollView>
            <ModalErro
                visible={mostrarModalErro}
                error={error}
                status={status}
                onClose={() => setMostrarModalErro(false)}
            />
            <ModalLoading loading={loading} />
        </View>
    )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#e9ecef'},
  text: { textAlign: 'center', fontWeight: '100', color: 'black' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: 'white' },
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
});
