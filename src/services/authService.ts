import axios from "axios";

const API_URL = "http://localhost:8080/auth"; // URL base do seu backend

// Tipo dos dados que serão enviados no registro
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

// Função para registrar um treinador
export const registerTrainer = async (data: RegisterData): Promise<string> => {
  try {
    console.log(data);
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data; // retorna o UID ou mensagem do backend
  } catch (error: any) {
    console.error("Erro ao registrar treinador:", error);
    throw new Error(error.response?.data || "Erro no registro");
  }
};
