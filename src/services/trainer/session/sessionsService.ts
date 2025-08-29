import { Session } from "inspector";
import { api } from "../../api";
import { TrainerSession } from "../../../types/sessionType";

export type SessionType = "training" | "game";

export interface NewSessionPayload {
  trainerId: number;
  type: SessionType;
  title: string;
  start: string;            // ISO string
  athletesCount: number;
  score?: string | null;    // para game
  notes?: string | null;    // opcional
}

export async function getTrainerSessions(trainerId: number): Promise<TrainerSession[]> {
  const { data } = await api.get<TrainerSession[]>("/trainer/sessions", { params: { trainerId }});
  return data ?? [];
}

export function newSession(payload: NewSessionPayload) {
  const body = {
    trainer_id: payload.trainerId,
    type: payload.type,
    title: payload.title,
    start: payload.start,
    athletes_count: payload.athletesCount,
    score: payload.score ?? null,
    description: payload.notes ?? null,
  };
  return api.post("/trainer/sessions", body);
}