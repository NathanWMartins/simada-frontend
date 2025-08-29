import { api } from "../../api";
import { AthleteDTO, TrainerAthletes } from "../../../types/types";

type GetAthletesParams = {
  q?: string;
  status?: "active" | "injured" | "inactive";
  page?: number;
  limit?: number;
};

/** Mapeia DTO → UI (garante defaults) */
function mapAthlete(d: AthleteDTO): TrainerAthletes {
  return {
    id: d.id,
    name: d.name,
    email: d.email,
    birth: d.birth,
    phone: d.phone ?? null,
    avatarUrl: d.avatarUrl ?? null,
    status: (d.status ?? "active") as TrainerAthletes["status"],
  };
}

export async function getAthletes(userId: number, params: GetAthletesParams = {}): Promise<TrainerAthletes[]> {
  const limit = params.limit ?? 50;
  const offset = ((params.page ?? 1) - 1) * limit;

  const query: Record<string, string | number> = {
    trainerId: userId,
    limit,
    offset,
  };
  if (params.q?.trim()) query.q = params.q.trim();
  if (params.status) query.status = params.status;

  const { data } = await api.get<AthleteDTO[]>("/trainer/athletes", { params: query });
  return (data ?? []).map(mapAthlete);
}

/** --------- Buscar por ID --------- */
export async function getAthleteById(id: number): Promise<TrainerAthletes> {
  const { data } = await api.get<AthleteDTO>(`/trainer/athletes/${id}`);
  return mapAthlete(data);
}

/** --------- Criar --------- */
export async function createAthlete(payload: {
  name: string;
  email: string;
  birth: string; // ISO
  phone?: string | null;
  avatarUrl?: string | null;
  status?: "active" | "injured" | "inactive";
}): Promise<TrainerAthletes> {
  const { data } = await api.post<AthleteDTO>("/trainer/athletes", payload);
  return mapAthlete(data);
}

/** --------- Atualizar --------- */
export async function updateAthlete(id: number, payload: Partial<{
  name: string;
  email: string;
  birth: string; // ISO
  phone?: string | null;
  avatarUrl?: string | null;
  status?: "active" | "injured" | "inactive";
}>): Promise<TrainerAthletes> {
  const { data } = await api.put<AthleteDTO>(`/trainer/athletes/${id}`, payload);
  return mapAthlete(data);
}

/** --------- Remover --------- */
export async function deleteAthlete(id: number): Promise<void> {
  await api.delete(`/trainer/athletes/${id}`);
}
