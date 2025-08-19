import axios from "axios";

const API_URL = "http://localhost:8080/auth";

export interface RegisterTrainerData {
  fullName: string;
  email: string;
  password: string;
  modality?: string;
  gender?: string;
}

export interface RegisterAthleteData {
  fullName: string;
  email: string;
  password: string;
  gender?: string;
  shirtNumber?: string;
  position?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

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
    throw new Error(error.response?.data || "Erro no registro");
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

