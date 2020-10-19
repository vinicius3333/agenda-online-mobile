import axios from "axios";

class UsuarioService {
  getUsuario(idUsuario) {
    return axios.get(`/user/GetUser/${idUsuario}`);
  }
  postUploadImagemPerfil (data) {
    return axios.post('/agenda/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data;'
      }
    })
  }
  getImagemPerfilService(idUsuario) {
    return axios.get(`agenda/ObterImagemDePerfil/${idUsuario}`);
  }
}

export default new UsuarioService();
