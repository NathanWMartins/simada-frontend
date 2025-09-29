import axios from "axios";

import { LoginData, RegisterAthleteData, RegisterCoachData } from "../../types/types";
import { api } from "../../api/api";

export const login = async (data: LoginData) => {
  const response = await api.post(`/login`, data);
  return response;
};

export const registerCoach = async (data: RegisterCoachData) => {
  try {
    const response = await api.post(`/register/coach`, data);
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
    const response = await axios.post(`/register/athlete`, data);
    return response;
  } catch (error: any) {
    console.error("Error when registering athlete:", error);
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data ||
      "Erro no registro";

    throw new Error(msg);
  }
};

