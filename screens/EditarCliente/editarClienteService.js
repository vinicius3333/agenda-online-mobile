import axios from "axios";

class EditarClienteService {
    getInfoUsuarioService (userName) {
        return axios.get(`agenda/ObterUsuario?UserName=${userName}`)
    }
    putEditarCliente (data) {
        return axios.put('user/UpdateUser', data)
    }
    deleteClienteService (idUsuario) {
        return axios.delete(`user/DeletarUsuario/${idUsuario}`)
    }
}

export default new EditarClienteService()