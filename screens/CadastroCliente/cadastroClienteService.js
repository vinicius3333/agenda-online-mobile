import axios from "axios";

class CadastroClienteService {
  postRegistroUsuario(data) {
    return axios.post("/user/RegisterUser", data);
  }
}

export default new CadastroClienteService();
