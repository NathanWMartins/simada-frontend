import { api } from "../../api";
import { AlertDTO, PsychoAlert } from "../../types/types";

function mapPsychoDTO(d: AlertDTO): PsychoAlert {
  return {
    athleteName: d.athlete_name ?? "Nome",
    athletePhoto: d.athlete_photo ?? undefined,
    date: d.alert_date,
    risk: (d.alert_status as PsychoAlert["risk"]) || "CAUTION",
    fatigue: d.fatigue ?? null,
    humor: d.humor ?? null,
    hoursSlept: d.hours_slept ?? null,
  };
}

export async function getPsychoAlerts(params?: { days?: number; limit?: number }) {
  const { days = 7, limit = 5 } = params ?? {};
  const { data } = await api.get<AlertDTO[]>("/trainer/alerts", {
    params: { category: "PSICO", days, limit },
  });
  return (data ?? []).map(mapPsychoDTO);
}
