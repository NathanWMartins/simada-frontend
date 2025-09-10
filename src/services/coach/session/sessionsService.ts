import { api } from "../../../api/api";
import { SessionType, CoachSession } from "../../../types/sessionType";

export interface NewSessionPayload {
  coachId: number;
  type: SessionType;
  title: string;
  date: string;
  score?: string | null;
  notes?: string | null;
}

export async function getCoachSessions(coachId: number): Promise<CoachSession[]> {
  const { data } = await api.get<CoachSession[]>("/session/get", { params: { coachId } });
  return data ?? [];
}

export function newSession(payload: NewSessionPayload) {
  const body = {
    coachId: payload.coachId,
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