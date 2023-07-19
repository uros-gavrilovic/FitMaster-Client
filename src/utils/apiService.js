import axios from "axios";
import { createNotification } from "./notificationService";
import { notificationType } from "../constants/globals";

const handleErrors = async (error) => {
  throw error;
};

const apiService = {
  get(url) {
    return axios
      .get(url, {
        headers: getSimpleHeaders(),
      })
      .catch(handleErrors);
  },

  post(url, body) {
    return axios
      .post(url, body, {
        headers: getSimpleHeaders(),
      })
      .catch(handleErrors);
  },

  put(url, body) {
    return axios
      .put(url, body, {
        headers: getSimpleHeaders(),
      })
      .catch(handleErrors);
  },

  delete(url) {
    return axios
      .delete(url, {
        headers: getSimpleHeaders(),
      })
      .catch(handleErrors);
  },
};

function getSimpleHeaders() {
  return {
    "Content-Type": "application/json",
    // "Content-Type": "text/plain",
    // locale: fetchLocaleFromSessionStorage(),
  };
}

export default apiService;
