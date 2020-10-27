import React, { useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { ModalLoading, ModalErro, ModalSucesso, ModalConfirmar } from "../../shared/componentes/index";
import { Colors, IconButton, Menu } from "react-native-paper";
import PaginaAdmService from "./paginaAdmService";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import theme from "../../shared/themes/baseTheme";
import { ModalInfoAgendamento } from './ModalInfoAgendamento'
import { ModalAgendamento } from './ModalAgendamento'
import moment from 'moment'
import { ModalMarcaEvento } from './ModalMarcaEvento'
import { ModalDisponibilizarEvento } from './ModalDisponibilizarEvento'

const { width: screenWidth } = Dimensions.get("window");

export default function App({ idUsuario, userName }) {
  const [mostrarAgendamento, setMostrarAgendamento] = React.useState(false)
  const [loading, setLoading] = React.useState(false);
  const [mostrarModalErro, setMostrarModalErro] = React.useState(false);
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [listaCliente, setListaCliente] = React.useState([]);
  const [imagem, setImagem] = React.useState("");
  const [listaAgendamentos, setListaAgendamentos] = React.useState([]);
  const [listaDias, setListaDias] = React.useState([]);
  const [infoUsuario, setInfoUsuario] = React.useState({})
  const [sucesso, setSucesso] = React.useState(false)
  const [mostrarModalInfo, setMostrarModalInfo] = React.useState(false)
  const [objInfo, setObjInfo] = React.useState({})
  const [acaoModal, setAcaoModal] = React.useState('add')
  const [mostrarModalConfirmar, setMostrarModalConfirmar] = React.useState(false)
  const [objetoExcluir, setObjetoExcluir] = React.useState({
    id: null,
    empresa: ''
  })
  const [subtituloSucesso, setSubtituloSucesso] = React.useState("Agendamento cadastrado com sucesso!")
  const modalAgendamentoRef = React.useRef(null)
  const [mostrarMenuIcone, setMostrarMenuIcone] = React.useState(false)
  const [mostrarModalEvento, setMostrarModalEvento] = React.useState(false)
  const [listaHorariosExcluidos, setListaHorariosExcluidos] = React.useState([])
  const [mostrarModalDisponivel, setMostrarModalDisponivel] = React.useState(false)
  const [carouselComponente, setCarouselComponente] = React.useState(null);

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

  function getListaClientes(isCancelled) {
    return new Promise((resolve) => {
      PaginaAdmService.getListaClienteService()
        .then((res) => {
          if (!isCancelled) {
            setListaCliente(res.data);
          }
        })
        .catch((err) => handlerError(err))
        .finally(() => resolve());
    });
  }

  function delMotorRemocao() {
    return new Promise((resolve) => {
      PaginaAdmService.delMotorRemocaoService(idUsuario)
        .catch((err) => handlerError(err))
        .finally(() => resolve());
    });
  }

  function getListaAgendamentos(isCancelled) {
    return new Promise((resolve) => {
      PaginaAdmService.getListaAgendamentosService(idUsuario)
        .then((res) => {
          if (!isCancelled) {
            setListaAgendamentos(res.data);
          }
        })
        .catch((err) => handlerError(err))
        .finally(() => resolve());
    });
  }

  function getListaDiasAgendados(isCancelled) {
    return new Promise((resolve) => {
      PaginaAdmService.getListaDiasAgendadosService(idUsuario)
        .then((res) => {
          if (!isCancelled) {
            if (res.data === 'vazio') {
              setListaDias([])
              return
            }
            setListaDias(res.data);
          }
        })
        .catch((err) => handlerError(err))
        .finally(() => resolve());
    });
  }

  function getInfoUsuario (isCancelled) {
    return new Promise((resolve) => {
      PaginaAdmService.getInfoUsuarioService(userName)
        .then((res) => {
          if (!isCancelled) {
            setInfoUsuario(res.data)
          }
        })
        .catch((err) => handlerError(err))
        .finally(() => resolve());
    })
  }

  function excluirAgendamento () {
    setLoading(true)
    PaginaAdmService.delAgendamento(objetoExcluir.id)
      .then(() => {
        setSubtituloSucesso("Agendamento excluido com sucesso!")
        setSucesso(true)
      })
      .catch((err) => {
        handlerError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  
  async function onInit(isCancelled) {
    setLoading(true);
    getInfoUsuario(isCancelled).finally(() => {
      getListaClientes(isCancelled).finally(() => {
            delMotorRemocao().finally(() => {
              getListaAgendamentos(isCancelled).finally(() => {
                getListaDiasAgendados(isCancelled).finally(() => {
                  if (!isCancelled) {
                    setLoading(false)
                  }
                });
              });
          });
      });
    })
  }

  React.useEffect(() => {
    let isCancelled = false;

    if (!isCancelled) {
      onInit(isCancelled);
    }
    return () => {
      isCancelled = true;
    }
  }, []);

  function comparaDataAgenda(agendas, data) {
    if (!agendas || !agendas) {
      return agendas;
    }
    var parts = data.split('/');
    var mydate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])); 
    var dataConvertida = new Date(mydate.toDateString());

    return agendas.filter(function(age){
      let dataAge = new Date(age.dataHora.toString());

      return dataAge.getDate() == dataConvertida.getDate();
    })
  }

  function adiarEvento () {
    setMostrarMenuIcone(false)
    setLoading(true)
    PaginaAdmService.getDatasExcluidas(idUsuario)
      .then((res) => {
        setListaHorariosExcluidos(res.data.map((e) => {
          return { label: e, value: e }
        }))
        setMostrarModalDisponivel(true)
      })
      .catch((err) => {
        handlerError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function marcarEvento () {
    setMostrarMenuIcone(false)
    setMostrarModalEvento(true)
  }

  function _renderItem({ item, index }, parallaxProps) {
    return (
      <TouchableOpacity onPress={() => {
        const { empresa, endereco, celularAdm, dataHora, duracao, observacao } = item
        let momentObj = moment(dataHora, 'YYYY-MM-DDTHH:mm:ss');
        let dateTime = momentObj.format('DD/MM/YYYY HH:mm');
        let obj = { empresa, endereco, celularAdm, dataHora: dateTime, duracao, observacao }
        setObjInfo(obj)
        setMostrarModalInfo(true)
      }}>
      <View
        style={{
          height: 160,
          width: screenWidth - 60,
        }}
      >
          {item.imagemPerfilPrestador.length === 0 ? (
            <ParallaxImage
              source={require("../../shared/assets/imagens/imgPerfil.jpg")}
              containerStyle={styles.imageContainer}
              style={styles.image}
              parallaxFactor={0.4}
              {...parallaxProps}
            />
          ) : (
            <ParallaxImage
              source={{
                uri: `${item.imagemPerfilPrestador}`,
              }}
              containerStyle={styles.imageContainer}
              style={styles.image}
              dimensions={{ width: 50, height: 50 }}
              parallaxFactor={0.4}
              {...parallaxProps}
            />
          )}

        <View style={styles.icones}>
          <IconButton
            icon="square-edit-outline"
            size={20}
            color={theme.colors.success}
            onPress={() => {
              setAcaoModal('edit')
              const { nome, celularCliente, usuarioId, dataHora, duracao, id } = item
              const clienteFiltrado = listaCliente.filter((e) => e.id === usuarioId)[0]
              const horarioEstipulado = infoUsuario.duracao === '00:00:00'
              const userName = clienteFiltrado.userName

              let momentObj = moment(dataHora, 'YYYY-MM-DDTHH:mm:ss');
              let dateValue = momentObj.format('DD/MM/YYYY');
              let timeValue = momentObj.format('HH:mm:ss')

              let data = { userName, nome, celularCliente, dateValue, timeValue, duracao, horarioEstipulado, id }
              setMostrarAgendamento(true)
              modalAgendamentoRef.current.preencherCampos(data)
            }}
            />
          <IconButton
            icon="delete-outline"
            size={20}
            color={theme.colors.error}
            onPress={() => {
              setObjetoExcluir({ empresa: item.empresa, id: item.id })
              setMostrarModalConfirmar(true)
            }}
            />
        </View>
      </View>
      </TouchableOpacity>
    );
  }

  function changeLoading (bool) {
    setLoading(bool)
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.iconesAcao}>
          <Menu
            statusBarHeight={38}
            visible={mostrarMenuIcone}
            onDismiss={() => setMostrarMenuIcone(false)}
            anchor={
            <IconButton
              icon="calendar-remove"
              size={40}
              onPress={() => {
                setMostrarMenuIcone(true)
              }}
              color="black"
            />
            }
          >
            <Menu.Item
              onPress={() => {
                marcarEvento()
              }}
              title="Marcar evento"
            />
            <Menu.Item
              onPress={() => {
                adiarEvento()
              }}
              title="Adiar evento"
            />
          </Menu>
          <IconButton
            style={{ marginLeft: 'auto' }}
            icon="calendar"
            size={40}
            onPress={() => {
              setAcaoModal('add')
              setSubtituloSucesso("Agendamento cadastrado com sucesso!")
              setMostrarAgendamento(true)
            }}
            color={theme.colors.header}
          />
        </View>
        {listaDias.map((prop, key) => {
          return (
            <View key={key} style={{ paddingBottom: 8 }}>
              <Text style={styles.datasCarousel}>{prop}</Text>
              {
                <Carousel
                  layout={"default"}
                  data={comparaDataAgenda(listaAgendamentos, prop)}
                  sliderWidth={screenWidth}
                  itemWidth={screenWidth}
                  hasParallaxImages={true}
                  lockScrollWhileSnapping={true}
                  ref={(ref) => setCarouselComponente(ref)}
                  renderItem={_renderItem}
                />
              }
            </View>
          );
        })}
      </ScrollView>
      <ModalInfoAgendamento
        visible={mostrarModalInfo}
        onClose={() => setMostrarModalInfo(false)}
        objetoAdm={objInfo}
      />
      <ModalErro
        visible={mostrarModalErro}
        error={error}
        status={status}
        onClose={() => setMostrarModalErro(false)}
      />
      <ModalSucesso
        visible={sucesso}
        titulo="Sucesso!"
        subtitulo={subtituloSucesso}
        onClose={() => {
          setSucesso(false);
          setTimeout(() => {
            onInit();
          }, 100);
        }}
      />
      <ModalConfirmar
        visible={mostrarModalConfirmar}
        onClose={() => setMostrarModalConfirmar(false)}
        empresa={objetoExcluir.empresa}
        excluir={() => {
          setMostrarModalConfirmar(false)
          excluirAgendamento()
        }}
      />
      <ModalAgendamento
        visible={mostrarAgendamento}
        onClose={() => setMostrarAgendamento(false)}
        onError={(err) => handlerError(err)}
        onLoading={(bool) => changeLoading(bool)}
        onSuccess={() => {
          setSubtituloSucesso(acaoModal === 'add' ? "Agendamento cadastrado com sucesso!" : "Agendamento editado com sucesso!")
          setSucesso(true)
        }}
        idUsuario={idUsuario}
        listaCliente={listaCliente}
        infoUsuario={infoUsuario}
        acao={acaoModal}
        ref={modalAgendamentoRef}
      />
      <ModalDisponibilizarEvento
        visible={mostrarModalDisponivel}
        onClose={() => setMostrarModalDisponivel(false)}
        onError={(err) => handlerError(err)}
        onLoading={(bool) => changeLoading(bool)}
        onSuccess={() => {
          setSubtituloSucesso("Esse horário foi disponivel novamente!")
          setSucesso(true)
        }}
        listaHorariosExcluidos={listaHorariosExcluidos}
        idUsuario={idUsuario}
      />
      <ModalMarcaEvento
        visible={mostrarModalEvento}
        onClose={() => setMostrarModalEvento(false)}
        onError={(err) => handlerError(err)}
        onLoading={(bool) => changeLoading(bool)}
        onSuccess={() => {
          setSubtituloSucesso("Esse horário foi excluido da sua agenda!")
          setSucesso(true)
        }}
        infoUsuario={infoUsuario}
        idUsuario={idUsuario}
      />
      <ModalLoading loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  datasCarousel: {
    backgroundColor: theme.colors.primary,
    color: "white",
    textAlign: "center",
    width: screenWidth - 60,
    paddingVertical: 4,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "rgb(227, 248, 253)",
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    resizeMode: "contain",
  },
  icones: {
    position: "absolute",
    top: 118,
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
  },
  iconesAcao: {
    flexDirection: "row",
  }
});