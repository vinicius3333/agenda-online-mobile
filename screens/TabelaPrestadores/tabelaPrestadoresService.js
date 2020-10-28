import axios from "axios";

class tabelaPrestadoresService {
  getListaAdmService() {
    return axios.get("/agenda/ListaDeAdms");
  }
}

export default new tabelaPrestadoresService();
