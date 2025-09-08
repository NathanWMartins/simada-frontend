import { api } from "../../api";
import { AthleteDTO, CoachAthletes, UpdateAthletePayload } from "../../../types/athleteType";

type GetAthletesParams = {
  q?: string;
  page?: number;
  limit?: number;
};

export async function getAthletes(
  userId: number,
  params: GetAthletesParams = {}
): Promise<CoachAthletes[]> {
  const limit = Math.max(1, params.limit ?? 50);
  const page = Math.max(1, params.page ?? 1);
  const offset = (page - 1) * limit;

  const query: Record<string, string | number> = {
    coachId: userId,
    limit,
    offset,
  };

  if (params.q?.trim()) query.q = params.q.trim();

  const { data } = await api.get<AthleteDTO[]>("/coach/athletes", { params: query });
  return data ?? [];
}

export async function getAthleteById(coachId: number, athleteId: number): Promise<CoachAthletes> {
  const { data } = await api.get<CoachAthletes>(`/coach/${coachId}/athletes/${athleteId}`);
  return data;
}

export async function updateAthlete(coachId: number, athleteId: number, payload: UpdateAthletePayload) {
  return api.put(`/coach/${coachId}/update/athlete/${athleteId}`, payload);
}

export async function deleteAthlete(id: number): Promise<void> {
  await api.delete(`/coach/athlete/${id}`);
}