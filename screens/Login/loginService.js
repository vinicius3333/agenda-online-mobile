import axios from "axios";

class LoginService {
  postLogin(data) {
    return axios.post("/user/v1/login", data);
  }
}

export default new LoginService();
