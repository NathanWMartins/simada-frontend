import axios from 'axios';

const API_URL = 'http://localhost:8080/atletas';

export const registerUser = async (userData: {
  fullName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Erro ao registrar usuário' };
  }
};
