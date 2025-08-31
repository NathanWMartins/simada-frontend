import { api } from "../../api";
import { SessionType, TrainerSession } from "../../../types/sessionType";

export interface NewSessionPayload {
  trainerId: number;
  type: SessionType;
  title: string;
  date: string;
  score?: string | null;
  notes?: string | null;
}

export async function getTrainerSessions(trainerId: number): Promise<TrainerSession[]> {
  const { data } = await api.get<TrainerSession[]>("/session/get", { params: { trainerId } });
  return data ?? [];
}

export function newSession(payload: NewSessionPayload) {
  const body = {
    trainer_id: payload.trainerId,
    type: payload.type,
    title: payload.title,
    date: payload.date,
    score: payload.score ?? null,
    notes: payload.notes ?? null,
  };
  return api.post("/session/register", body);
}

export async function deleteSession(id: number): Promise<void> {
  await api.delete(`/session/${id}`);
}