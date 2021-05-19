import axios from "axios";

class UsuarioService {
  getUsuario(idUsuario) {
    return axios.get(`/user/v1/GetUser/${idUsuario}`);
  }
  postUploadImagemPerfil (data) {
    return axios.post('/agenda/v1/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data;'
      }
    })
  }
  getImagemPerfilService(idUsuario) {
    return axios.get(`agenda/v1/ObterImagemDePerfil/${idUsuario}`);
  }
}

export default new UsuarioService();
