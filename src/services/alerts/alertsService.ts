import { api } from "../api";
import { Alert, AlertDTO } from "../types/types";

function mapAlertaDTO(d: AlertDTO): Alert {
  return {
    date: d.alert_date,
    type: d.alert_type,
    message: d.alert_message,
    status: d.alert_status ?? null,
    action: d.suggested_action ?? null,
    athleteName: d.athlete_name ?? "Nome",
    athletePhoto: d.athlete_photo ?? undefined,
  };
}

export async function getAlerts(params?: { days?: number; limit?: number }) {
  const { days = 7, limit = 10 } = params ?? {};
  const { data } = await api.get<AlertDTO[]>("/trainer/alerts", {
    params: { days, limit },
  });
  return (data ?? []).map(mapAlertaDTO);
}
