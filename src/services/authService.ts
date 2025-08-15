import axios from "axios";

const API_URL = "http://localhost:8080/auth";

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const registerTrainer = async (data: RegisterData): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao registrar treinador:", error);
    throw new Error(error.response?.data || "Erro no registro");
  }
};

export const registerLogin = async (data: LoginData): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao logar:", error);
    throw new Error(error.response?.data || "Erro ao logar");
  }
};
