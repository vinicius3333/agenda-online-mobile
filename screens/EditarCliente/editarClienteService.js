import axios from "axios";

class EditarClienteService {
    getInfoUsuarioService (userName) {
        return axios.get(`agenda/v1/ObterUsuario?UserName=${userName}`)
    }
    putEditarCliente (data) {
        return axios.put('user/v1/UpdateUser', data)
    }
    deleteClienteService (idUsuario) {
        return axios.delete(`user/v1/DeletarUsuario/${idUsuario}`)
    }
}

export default new EditarClienteService()