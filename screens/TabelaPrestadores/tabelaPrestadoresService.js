import axios from "axios";

class tabelaPrestadoresService {
  getListaAdmService() {
    return axios.get("/agenda/v1/ListaDeAdms");
  }
}

export default new tabelaPrestadoresService();
