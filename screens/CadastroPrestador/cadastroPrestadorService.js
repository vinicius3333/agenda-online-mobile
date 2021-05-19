import axios from "axios";

class cadastroPrestadorService {
  postRegistroPrestador(data) {
    return axios.post("/adm/v1/RegisterAdm", data);
  }
}

export default new cadastroPrestadorService();
