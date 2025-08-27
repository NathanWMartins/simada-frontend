// src/services/trainer/athletes/athletesService.ts
import { api } from "../../api";
import { AthleteDTO, TrainerAthletes } from "../../types/types";

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

/** -------- Listagem com filtros -------- */
export async function getAthletes(params?: {
  /** busca por nome/email/telefone */
  q?: string;
  /** status para filtrar */
  status?: "active" | "injured" | "inactive";
  /** paginação (opcional) */
  page?: number;
  limit?: number;
}): Promise<TrainerAthletes[]> {
  const { q, status, page, limit } = params ?? {};
  const { data } = await api.get<AthleteDTO[]>("/trainer/athletes", {
    params: { q, status, page, limit },
  });
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
