import { api } from "../../../api/api";
import type { TLAnswerDTO, TrainingLoadAlert } from "../../../types/alertType";
import { AIRecoResponse, PerformanceRecoRequest } from "../../../types/recomendationsAI";

export async function getTrainingLoadAlerts(params: {
  coachId: number;
  athleteId?: number;
  from?: string; // ISO date
  to?: string;   // ISO date
}): Promise<TrainingLoadAlert[]> {
  const query = new URLSearchParams();
  query.set("coachId", String(params.coachId));
  if (params.athleteId) query.set("athleteId", String(params.athleteId));
  if (params.from) query.set("from", params.from);
  if (params.to) query.set("to", params.to);

  const { data } = await api.get(`/alerts/training-load?${query.toString()}`);
  return data ?? null;
}

export async function getTrainingLoadAnswerByAthlete(
  sessionId: number,
  athleteId: number
): Promise<TLAnswerDTO | null> {
  const resp = await api.get<TLAnswerDTO>(
    `/alerts/training-load/session/${sessionId}/athlete/${athleteId}`,
    {
      validateStatus: (s) => (s >= 200 && s < 300) || s === 204,
    }
  );

  if (resp.status === 204) return null;
  return resp.data ?? null;
}


export async function askPerfRecommendations(payload: PerformanceRecoRequest): Promise<AIRecoResponse> {
  const { coachId, sessionId, athleteId, ...metrics } = payload;
  const { data } = await api.post<AIRecoResponse>(
    `/coach/${coachId}/performance/${sessionId}/athletes/${athleteId}/recommendations`, metrics);
  return data;
} 

export async function deleteTrainingLoadAlert(alertId: number, coachId: number): Promise<void> {
  await api.delete(`/alerts/performance/${alertId}/delete/${coachId}`);
}