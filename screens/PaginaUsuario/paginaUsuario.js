import React, { useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { ModalLoading, ModalErro, ModalSucesso } from "../../shared/componentes/index";
import { Colors, IconButton } from "react-native-paper";
import PaginaUsuarioService from "./paginaUsuarioService";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import theme from "../../shared/themes/baseTheme";
import { ModalAgendamento } from './ModalAgendamento'
import { ModalInfoAgendamento } from './ModalInfoAgendamento'
import moment from 'moment'

const { width: screenWidth } = Dimensions.get("window");

export default function App({ idUsuario, userName }) {
  const [mostrarAgendamento, setMostrarAgendamento] = React.useState(false)
  const [loading, setLoading] = React.useState(false);
  const [mostrarModalErro, setMostrarModalErro] = React.useState(false);
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [listaAdm, setListaAdm] = React.useState([]);
  const [listaCliente, setListaCliente] = React.useState([]);
  const [imagem, setImagem] = React.useState("");
  const [listaAgendamentos, setListaAgendamentos] = React.useState([]);
  const [listaDias, setListaDias] = React.useState([]);
  const [infoUsuario, setInfoUsuario] = React.useState({})
  const [sucesso, setSucesso] = React.useState(false)
  const [mostrarModalInfo, setMostrarModalInfo] = React.useState(false)
  const [objInfo, setObjInfo] = React.useState({})

  const [carouselComponente, setCarouselComponente] = React.useState(null);
  const [carousel, setCarousel] = React.useState({
    activeIndex: 0,
    carouselItems: [
      {
        title: "Item 1",
        text: "Text 1",
      },
      {
        title: "Item 2",
        text: "Text 2",
      },
      {
        title: "Item 3",
        text: "Text 3",
      },
      {
        title: "Item 4",
        text: "Text 4",
      },
      {
        title: "Item 5",
        text: "Text 5",
      },
    ],
  });

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

  function getListaAdm(isCancelled) {
    return new Promise((resolve) => {
      PaginaUsuarioService.getListaAdmService()
        .then((res) => {
          if (!isCancelled) {
            setListaAdm(res.data);
          }
        })
        .catch((err) => handlerError(err))
        .finally(() => resolve());
    });
  }



  function delMotorRemocao() {
    return new Promise((resolve) => {
      PaginaUsuarioService.delMotorRemocaoService(idUsuario)
        .catch((err) => handlerError(err))
        .finally(() => resolve());
    });
  }

  function getListaAgendamentos(isCancelled) {
    return new Promise((resolve) => {
      PaginaUsuarioService.getListaAgendamentosService(idUsuario)
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
      PaginaUsuarioService.getListaDiasAgendadosService(idUsuario)
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
      PaginaUsuarioService.getInfoUsuarioService(userName)
        .then((res) => {
          if (!isCancelled) {
            setInfoUsuario(res.data)
          }
        })
        .catch((err) => handlerError(err))
        .finally(() => resolve());
    })
  }

  async function onInit(isCancelled) {
    setLoading(true);
    getInfoUsuario(isCancelled).finally(() => {
      getListaAdm(isCancelled).finally(() => {
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
            onPress={() => console.log("Pressed")}
            />
          <IconButton
            icon="delete-outline"
            size={20}
            color={theme.colors.error}
            onPress={() => console.log("Pressed 2")}
            />
        </View>
      </View>
      </TouchableOpacity>
    );
  }

  const changeLoading = (bool) => {
    setLoading(bool)
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <IconButton
          style={{ alignSelf: "flex-end" }}
          icon="calendar"
          size={40}
          onPress={() => setMostrarAgendamento(true)}
          color={theme.colors.header}
        />
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
      <ModalAgendamento
        visible={mostrarAgendamento}
        onClose={() => setMostrarAgendamento(false)}
        onError={(err) => handlerError(err)}
        onLoading={(bool) => changeLoading(bool)}
        onSuccess={() => setSucesso(true)}
        idUsuario={idUsuario}
        listaAdm={listaAdm}
        infoUsuario={infoUsuario}
      />
      <ModalInfoAgendamento
        visible={mostrarModalInfo}
        onClose={() => setMostrarModalInfo(false)}
        objetoAdm={objInfo}
      />
      <ModalLoading loading={loading} />
      <ModalErro
        visible={mostrarModalErro}
        error={error}
        status={status}
        onClose={() => setMostrarModalErro(false)}
      />
      <ModalSucesso
        visible={sucesso}
        titulo="Sucesso!"
        subtitulo="Agendamento cadastrado com sucesso!"
        onClose={() => {
          setSucesso(false);
          setTimeout(() => {
            onInit();
          }, 100);
        }}
      />
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
});
