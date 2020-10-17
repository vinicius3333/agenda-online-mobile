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
  getInfoUsuarioService (userName) {
    return axios.get(`agenda/ObterUsuario?UserName=${userName}`)
  }
  getCidadeFiltro (cidade = null, segmento = null) {
    return axios.get(`agenda/BuscarCidades?text=${cidade}&segmento=${segmento}`)
  }
  getSegmentoFiltro (cidade = null, segmento = null) {
    return axios.get(`agenda/BuscarSegmentos?text=${segmento}&cidade=${cidade}`)
  }
  getEmpresaFiltro (cidade = null, segmento = null, empresa = null) {
    return axios.get(`agenda/BuscarEmpresas?text=${empresa}&segmento=${segmento}&cidade=${cidade}`)
  }
  postAgendarCliente (data) {
    return axios.post('agenda/AgendarCliente', data)
  }
}

export default new CadastroClienteService();
