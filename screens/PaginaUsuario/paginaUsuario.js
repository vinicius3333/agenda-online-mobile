import React from "react";
import { StyleSheet, View, Text, Dimensions, ScrollView } from "react-native";
import { ModalLoading, ModalErro } from "../../shared/componentes/index";
import { Colors, IconButton } from "react-native-paper";
import PaginaUsuarioService from "./paginaUsuarioService";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import theme from "../../shared/themes/baseTheme";

const { width: screenWidth } = Dimensions.get("window");

export default function App({ idUsuario, mostrando }) {
  const [loading, setLoading] = React.useState(false);
  const [mostrarModalErro, setMostrarModalErro] = React.useState(false);
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [listaAdm, setListaAdm] = React.useState([]);
  const [listaCliente, setListaCliente] = React.useState([]);
  const [imagem, setImagem] = React.useState("");
  const [listaAgendamentos, setListaAgendamentos] = React.useState([]);
  const [listaDias, setListaDias] = React.useState([]);

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

  function getImagemPerfil(isCancelled) {
    return new Promise((resolve) => {
      PaginaUsuarioService.getImagemPerfilService(idUsuario)
        .then((res) => {
          if (!isCancelled) {
            setImagem(res.data);
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
            setListaDias(res.data);
          }
        })
        .catch((err) => handlerError(err))
        .finally(() => resolve());
    });
  }

  React.useEffect(() => {
    let isCancelled = false;
    async function onInit() {
      setLoading(true);
      getListaAdm(isCancelled).finally(() => {
          getImagemPerfil(isCancelled).finally(() => {
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
      });
    }
    if (!isCancelled) {
      onInit();
    }
    return () => {
      isCancelled = true;
    }
  }, []);

  function comparaDataAgenda(agendas, data) {
    if (!agendas || !agendas) {
      return agendas;
    }
    var b = new Date(data.toString());
    let dataFormatada =
      b.getDate() + "/" + (b.getMonth() + 1) + "/" + b.getFullYear();
    var novaData = new Date(dataFormatada);
    return agendas.filter(function (age) {
      let dataAge = new Date(age.dataHora.toString());

      return dataAge.getDate() == novaData.getDate();
    });
  }

  function _renderItem({ item, index }, parallaxProps) {
    return (
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
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <IconButton
          style={{ alignSelf: "flex-end" }}
          icon="calendar"
          size={40}
          onPress={() => console.log("agendar")}
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
                  onSnapToItem={(index) =>
                    setCarousel({
                      activeIndex: index,
                      carouselItems: carousel.carouselItems,
                    })
                  }
                />
              }
            </View>
          );
        })}
      </ScrollView>
      <ModalLoading loading={loading} />
      <ModalErro
        visible={mostrarModalErro}
        error={error}
        status={status}
        onClose={() => setMostrarModalErro(false)}
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
