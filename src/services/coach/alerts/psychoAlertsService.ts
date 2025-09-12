import { api } from "../../../api/api";
import type {
  PsyAnswerDTO,
  PsychoAlert,
} from "../../../types/alertType";
import { PsyRecoRequest, PsyRecoResponse } from "../../../types/recomendationsAI";

export async function getPsychoAlerts(params: { coachId: number; }): Promise<PsychoAlert[]> {
  const { coachId } = params;
  const { data } = await api.get<PsychoAlert[]>(`/alerts/psycho-risk/${coachId}`);
  return data ?? [];
}

export async function getPsychoAnswerByAthlete(
  sessionId: number,
  athleteId: number
): Promise<PsyAnswerDTO | null> {
  if (!sessionId || !athleteId) return null;
  const { data } = await api.get<PsyAnswerDTO>(
    `/alerts/sessions/${sessionId}/psy-form/answers/${athleteId}`
  );
  const item = Array.isArray(data) ? data[0] : data;
  if (!item) return null;
  
  return item;
}

export async function askPsyRecommendations(payload: PsyRecoRequest): Promise<PsyRecoResponse> {
  const { sessionId, athleteId, ...metrics } = payload;
  const { data } = await api.post<PsyRecoResponse>(
    `/coach/psy-form/${sessionId}/athletes/${athleteId}/recommendations`,
    metrics
  );
  return data;
}