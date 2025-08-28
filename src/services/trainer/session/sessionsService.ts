import { api } from "../../api";
import { Session } from "../../types/types";

export async function getTrainerSessions(trainerId: number) {
  const { data } = await api.get<Session[]>('/trainer/sessions', {
    params: { trainerId }
  });
  return data;
}