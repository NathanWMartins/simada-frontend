import { api } from "../../api/api";
import { TopPerformer, TopPerformerDTO, TrainingStats } from "../../types/types";
import { CoachProfileDTO } from "../../types/coachType";

function mapTopPerformerDTO(d: TopPerformerDTO): TopPerformer {
  const previous = d.last_score ?? null;
  return {
    name: d.athlete_name,
    avatarUrl: d.photo ?? undefined,
    updatedAt: d.update_date,
    score: d.score,
    delta: typeof previous === "number" ? d.score - previous : undefined,
  };
}

export async function getCoachStats(coachId: number): Promise<TrainingStats> {
  const { data } = await api.get<TrainingStats>("/coach/stats", { params: { coachId } });
  return data;
}

export async function getTopPerformers(limit = 3): Promise<TopPerformer[]> {
  const { data } = await api.get<TopPerformerDTO[]>("/coach/top-performers", {
    params: { limit },
  });
  return (data ?? []).map(mapTopPerformerDTO);
}

export async function getCoachProfile(coachId: number): Promise<CoachProfileDTO | null> {
  if (!coachId) return null;
  const { data } = await api.get<CoachProfileDTO>(`/coach/profile/${coachId}`);
  return data ?? null;
}

export async function uploadCoachAvatar(coachId: number, file: File): Promise<{ photoUrl: string } | null> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<{ photoUrl: string }>(`/coach/profile/${coachId}/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data ?? null;
}

export async function updateCoachProfile(coachId: number, payload: CoachProfileDTO): Promise<void> {
  await api.put(`/coach/profile/${coachId}`, payload);
}

export async function deleteOrTransferCoachAccount(
  coachId: number,
  transferToEmail?: string
): Promise<void> {
  await api.post(`/coach/profile/${coachId}/delete-or-transfer`, {
    transferToEmail: transferToEmail?.trim() || null,
  });
}