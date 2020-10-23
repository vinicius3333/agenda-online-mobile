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
  delAgendamento (id) {
    return axios.delete('agenda/' + id)
  }
  getBuscarCliente (userName) {
    return axios.get(`agenda/BuscarClientes?text=${userName}`)
  }
  getHorariosDisponiveis(empresa, data) {
    return axios.get(
      `agenda/HorariosDisponiveis?empresa=${empresa}&data=${data}`
    );
  }
  postAgendarCliente (data) {
    return axios.post('agenda/AgendarCliente', data)
  }
  putEditarAgendamento (data) {
    return axios.put('agenda/AtualizarAgenda/', data)
  }
  delAgendamento (id) {
    return axios.delete('agenda/' + id)
  }
}

export default new PaginaAdmService();
