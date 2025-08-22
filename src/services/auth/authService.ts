import axios from "axios";

import { LoginData, RegisterAthleteData, RegisterTrainerData } from "../types/types";

const API_URL = "http://localhost:8080/auth";

export const login = async (data: LoginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    return response;
  } catch (error: any) {
    console.error("Erro ao logar:", error);
    throw new Error(error.response?.data || "Erro ao logar");
  }
};

export const registerTrainer = async (data: RegisterTrainerData) => {
  try {
    const response = await axios.post(`${API_URL}/register/trainer`, data);
    return response;
  } catch (error: any) {
    console.error("Erro ao registrar treinador:", error);

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
    console.error("Erro ao registrar atleta:", error);
    throw new Error(error.response?.data || "Erro no registro");
  }
};

