import { api } from "../../api";
import { AthleteDTO, TrainerAthletes, UpdateAthletePayload } from "../../../types/athleteType";

type GetAthletesParams = {
  q?: string;
  status?: "active" | "injured" | "inactive";
  page?: number;
  limit?: number;
};

export async function getAthletes(
  userId: number,
  params: GetAthletesParams = {}
): Promise<TrainerAthletes[]> {
  const limit = Math.max(1, params.limit ?? 50);
  const page = Math.max(1, params.page ?? 1);
  const offset = (page - 1) * limit;

  const query: Record<string, string | number> = {
    trainerId: userId,
    limit,
    offset,
  };

  if (params.q?.trim()) query.q = params.q.trim();

  const { data } = await api.get<AthleteDTO[]>("/trainer/athletes", { params: query });
  return data ?? [];
}

/** --------- Buscar por ID --------- */
export async function getAthleteById(trainerId: number, athleteId: number): Promise<TrainerAthletes> {
  const { data } = await api.get<TrainerAthletes>(`/trainer/${trainerId}/athletes/${athleteId}`);
  return data;
}

/** --------- Criar --------- */
// export async function createAthlete(payload: {
//   name: string;
//   email: string;
//   birth: string; // ISO
//   phone?: string | null;
//   avatarUrl?: string | null;
//   status?: "active" | "injured" | "inactive";
// }): Promise<TrainerAthletes> {
//   const { data } = await api.post<AthleteDTO>("/trainer/athletes", payload);
//   return mapAthlete(data);
// }

/** --------- Atualizar --------- */
export async function updateAthlete(trainerId: number, athleteId: number, payload: UpdateAthletePayload) {
  return api.put(`/trainer/${trainerId}/update/athlete/${athleteId}`, payload);
}

/** --------- Remover --------- */
export async function deleteAthlete(id: number): Promise<void> {
  await api.delete(`/trainer/athletes/${id}`);
}
