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
  getCidadeFiltro (cidade = null, segmento = null) {
    return axios.get(`agenda/BuscarCidades?text=${cidade}&segmento=${segmento}`)
  }
  getSegmentoFiltro (cidade = null, segmento = null) {
    return axios.get(`BuscarSegmentos?text=${segmento}&cidade=${cidade}`)
  }
  getEmpresaFiltro (cidade = null, segmento = null, empresa = null) {
    return axios.get(`BuscarEmpresas?text=${empresa}&segmento=${segmento}&cidade=${cidade}`)
  }
}

export default new CadastroClienteService();
