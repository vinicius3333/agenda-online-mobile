import axios from "axios";

class EditarClienteService {
    getInfoUsuarioService (userName) {
        return axios.get(`agenda/v1/ObterUsuario?UserName=${userName}`)
    }
    putEditarAdm (data) {
        return axios.put('adm/v1/UpdateAdm', data)
    }
    deleteClienteService (idUsuario) {
        return axios.delete(`user/v1/DeletarUsuario/${idUsuario}`)
    }
}

export default new EditarClienteService()