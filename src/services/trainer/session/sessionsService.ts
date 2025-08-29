import { api } from "../../api";
import { TrainerSession } from "../../../types/sessionType";

export type SessionType = "training" | "game";

export interface NewSessionPayload {
  trainerId: number;
  type: SessionType;
  title: string;
  date: string;        
  athletesCount: number;
  score?: string | null;
  notes?: string | null;
}

export async function getTrainerSessions(trainerId: number): Promise<TrainerSession[]> {
  const { data } = await api.get<TrainerSession[]>("/session/get", { params: { trainerId }});
  return data ?? [];
}

export function newSession(payload: NewSessionPayload) {
  const body = {
    trainer_id: payload.trainerId,
    type: payload.type,
    title: payload.title,
    date: payload.date,
    athletes_count: payload.athletesCount,
    score: payload.score ?? null,
    notes: payload.notes ?? null,
  };
  return api.post("/session/register", body);
}