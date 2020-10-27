import axios from "axios";

class EditarClienteService {
    getInfoUsuarioService (userName) {
        return axios.get(`agenda/ObterUsuario?UserName=${userName}`)
    }
    putEditarAdm (data) {
        return axios.put('adm/UpdateAdm', data)
    }
    deleteClienteService (idUsuario) {
        return axios.delete(`user/DeletarUsuario/${idUsuario}`)
    }
}

export default new EditarClienteService()