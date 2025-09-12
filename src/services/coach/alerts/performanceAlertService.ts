import { api } from "../../../api/api";
import type { TLAnswerDTO, TrainingLoadAlert } from "../../../types/alertType";

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
    return data ?? [];
}

export async function getTrainingLoadAnswerByAthlete(
  athleteId: number
): Promise<TLAnswerDTO | null> {
  const { data } = await api.get(`/alerts/training-load/athlete/${athleteId}`);  

  return data ?? [];
}

export async function askPerfRecommendations(payload: {
    sessionId: number;
    athleteId: number;
    acwr?: number;
    monotony?: number;
    strain?: number;
    pctQwUp?: number;
}): Promise<{ recommendations?: string }> {
    const { data } = await api.post(`/coach/alerts/training-load/ask-recommendations`, payload);
    return { recommendations: data?.recommendations || "" };
}