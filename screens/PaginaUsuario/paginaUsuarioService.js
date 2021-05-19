import axios from "axios";

class CadastroClienteService {
  getListaAdmService() {
    return axios.get("/agenda/v1/ListaDeAdms");
  }
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
  getHorariosDisponiveis(empresa, data) {
    return axios.get(
      `agenda/v1/HorariosDisponiveis?empresa=${empresa}&data=${data}`
    );
  }
  getCidadeFiltro (cidade = null, segmento = null) {
    return axios.get(`agenda/v1/BuscarCidades?text=${cidade}&segmento=${segmento}`)
  }
  getSegmentoFiltro (cidade = null, segmento = null) {
    return axios.get(`agenda/v1/BuscarSegmentos?text=${segmento}&cidade=${cidade}`)
  }
  getEmpresaFiltro (cidade = null, segmento = null, empresa = null) {
    return axios.get(`agenda/v1/BuscarEmpresas?text=${empresa}&segmento=${segmento}&cidade=${cidade}`)
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
}

export default new CadastroClienteService();
