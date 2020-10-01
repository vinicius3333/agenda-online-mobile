import axios from "axios";

class cadastroPrestadorService {
  postRegistroPrestador(data) {
    return axios.post("/adm/RegisterAdm", data);
  }
}

export default new cadastroPrestadorService();
