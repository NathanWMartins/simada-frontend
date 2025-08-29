import { api } from "../api";
import { TopPerformer, TopPerformerDTO, TrainingStats } from "../../types/types";

function mapTopPerformerDTO(d: TopPerformerDTO): TopPerformer {
  const previous = d.ultima_pontuacao ?? null;
  return {
    name: d.nome_atleta,
    avatarUrl: d.foto ?? undefined,
    updatedAt: d.data_atualizacao,
    score: d.pontuacao,
    delta: typeof previous === "number" ? d.pontuacao - previous : undefined,
  };
}

export async function getTrainerStats(trainerId: number): Promise<TrainingStats> {
  const { data } = await api.get<TrainingStats>("/trainer/stats", { params: { trainerId } });
  return data;
}

export async function getTopPerformers(limit = 3): Promise<TopPerformer[]> {
  const { data } = await api.get<TopPerformerDTO[]>("/trainer/top-performers", {
    params: { limit },
  });
  return (data ?? []).map(mapTopPerformerDTO);
}
