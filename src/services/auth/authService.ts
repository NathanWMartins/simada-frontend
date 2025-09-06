import axios from "axios";

import { LoginData, RegisterAthleteData, RegisterCoachData } from "../../types/types";

const API_URL = "http://localhost:8080/auth";

export const login = async (data: LoginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.response?.data || "Login error");
  }
};

export const registerCoach = async (data: RegisterCoachData) => {
  try {
    const response = await axios.post(`${API_URL}/register/coach`, data);
    return response;
  } catch (error: any) {
    console.error("Error when registering coach:", error);

    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data ||
      "Erro no registro";

    throw new Error(msg);
  }
};


export const registerAthlete = async (data: RegisterAthleteData) => {
  try {
    const response = await axios.post(`${API_URL}/register/athlete`, data);
    return response;
  } catch (error: any) {
    console.error("Error when registering athlete:", error);
    throw new Error(error.response?.data || "Register erro");
  }
};

