import axios from "axios";

class CadastroClienteService {
  postRegistroUsuario(data) {
    return axios.post("/user/v1/RegisterUser", data);
  }
}

export default new CadastroClienteService();
