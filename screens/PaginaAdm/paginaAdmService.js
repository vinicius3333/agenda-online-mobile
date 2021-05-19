import axios from "axios";

class PaginaAdmService {
  getListaClienteService() {
    return axios.get("agenda/v1/ListaDeClientes");
  }
  getImagemPerfilService(idUsuario) {
    return axios.get(`agenda/v1/ObterImagemDePerfil/${idUsuario}`);
  }
  delMotorRemocaoService(idUsuario) {
    return axios.delete(`agenda/v1/MotorRemocao/${idUsuario}`);
  }
  getListaAgendamentosService(idUsuario) {
    return axios.get(`agenda/v1/ListaAgendamentosPorUsuario/${idUsuario}`);
  }
  getListaDiasAgendadosService(idUsuario) {
    return axios.get(`agenda/v1/ListaDiasAgendados/${idUsuario}`);
  }
  getInfoUsuarioService (userName) {
    return axios.get(`agenda/v1/ObterUsuario?UserName=${userName}`)
  }
  delAgendamento (id) {
    return axios.delete('agenda/v1/' + id)
  }
  getBuscarCliente (userName) {
    return axios.get(`agenda/v1/BuscarClientes?text=${userName}`)
  }
  getHorariosDisponiveis(empresa, data) {
    return axios.get(
      `agenda/v1/HorariosDisponiveis?empresa=${empresa}&data=${data}`
    );
  }
  postAgendarCliente (data) {
    return axios.post('agenda/v1/AgendarCliente', data)
  }
  putEditarAgendamento (data) {
    return axios.put('agenda/v1/Atualizaragenda/v1/', data)
  }
  delAgendamento (id) {
    return axios.delete('agenda/v1/' + id)
  }
  postDeclararMotivo (data) {
    return axios.post("evento/v1/DeclararMotivo", data)
  }
  getDatasExcluidas (idUsuario) {
    return axios.get(`evento/v1/ListaDeDatasExcluidas/${idUsuario}`)
  }
  postDisponibilizarHorario (data) {
    return axios.post("evento/v1/DisponibilizarEvento", data)
  }
}

export default new PaginaAdmService();
