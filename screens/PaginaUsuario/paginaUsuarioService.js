import axios from "axios";

class CadastroClienteService {
  getListaAdmService() {
    return axios.get("/agenda/ListaDeAdms");
  }
  getListaClienteService() {
    return axios.get("agenda/ListaDeClientes");
  }
  getImagemPerfilService(idUsuario) {
    return axios.get(`agenda/ObterImagemDePerfil/${idUsuario}`);
  }
  delMotorRemocaoService(idUsuario) {
    return axios.delete(`agenda/MotorRemocao/${idUsuario}`);
  }
  getListaAgendamentosService(idUsuario) {
    return axios.get(`agenda/ListaAgendamentosPorUsuario/${idUsuario}`);
  }
  getListaDiasAgendadosService(idUsuario) {
    return axios.get(`agenda/ListaDiasAgendados/${idUsuario}`);
  }
  getHorariosDisponiveis(empresa, data) {
    return axios.get(
      `agenda/HorariosDisponiveis?empresa=${empresa}&data=${data}`
    );
  }
}

export default new CadastroClienteService();
