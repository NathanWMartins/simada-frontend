import { api } from "../api";
import { TopPerformer, TopPerformerDTO, TrainingStats } from "../../types/types";

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
