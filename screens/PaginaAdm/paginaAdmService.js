import axios from "axios";

class PaginaAdmService {
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
      getInfoUsuarioService (userName) {
        return axios.get(`agenda/ObterUsuario?UserName=${userName}`)
      }
}

export default new PaginaAdmService();
