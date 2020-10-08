import axios from "axios";

class UsuarioService {
  getUsuario(idUsuario) {
    return axios.get(`/user/GetUser/${idUsuario}`);
  }
}

export default new UsuarioService();
