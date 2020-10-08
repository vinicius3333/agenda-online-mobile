import React from "react";
import { Avatar, TouchableRipple, Menu } from "react-native-paper";

const MenuHeader = (props) => {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <Menu
      statusBarHeight={38}
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <TouchableRipple
          borderless
          style={{ marginRight: 8, borderRadius: 50 }}
          onPress={() => openMenu()}
        >
          <Avatar.Image
            size={36}
            source={require("../assets/imagens/imgPerfil.jpg")}
          />
        </TouchableRipple>
      }
    >
      <Menu.Item
        onPress={() => {
          props.trocarImagem();
        }}
        title="Trocar imagem"
      />
      <Menu.Item
        onPress={() => {
          props.editarPerfil();
        }}
        title="Editar perfil"
      />
      <Menu.Item
        onPress={() => {
          props.sair();
          closeMenu();
        }}
        title="Sair"
      />
    </Menu>
  );
};

export { MenuHeader };
