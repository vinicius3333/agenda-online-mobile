import axios from "axios";
import config from "../config/config";

axios.defaults.baseURL = config.API_URL;
//axios.defaults.headers.common["Authorization"] = "AUTH TOKEN";
axios.defaults.headers.post["Content-Type"] = "application/json";

class BaseService {
  startRequestAxios() {
    axios.interceptors.request.use(
      (request) => {
        console.log(request)
        return request;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  startResponseAxios() {
    axios.interceptors.response.use(
      (response) => {
        //console.log(response)
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}

export default new BaseService();
