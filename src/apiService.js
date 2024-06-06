// src/apiService.js
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const CheckApiConnection = async () => {
  try {
    const response = await axios.post(`${apiUrl}/api/token/`, {
      username: "api",
      password: "aP1",
    });
    if (response.status === 200 && response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      return true;
    }
  } catch (error) {
    console.log(
      "Using mock data. Error connecting to API. You can ignore the ERR_CONNECTION_REFUSED message below."
    );
    return false;
  }
  return false;
};
