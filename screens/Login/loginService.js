import axios from "axios";

class LoginService {
  postLogin(data) {
    return axios.post("/user/login", data);
  }
}

export default new LoginService();
