import { api } from "../../api";
import type {
  AlertDTO,
  AnyAlert,
  PerformanceAlert,
  PsychoAlert,
  PerformanceAlertDTO,
  PsychoAlertDTO,
  AlertType,
} from "../../../types/alertType";
import { isPerformanceDTO, isPsychoDTO } from "../../../types/alertType";

// helpers
const toNumberOrNull = (v: unknown) =>
  v === null || v === undefined || v === "" ? null : Number(v);

/** ------------------------ MAPEADORES ------------------------ **/
function mapBase(d: AlertDTO) {
  return {
    id: d?.alert_id,
    date: d.alert_date,
    type: d.alert_type,
    message: d.alert_message,
    status: d.alert_status ?? null,
    action: d.suggested_action ?? null,
    athleteName: d.athlete_name ?? "Nome",
    athletePhoto: d.athlete_photo ?? undefined,
  };
}

function mapPerformance(d: PerformanceAlertDTO): PerformanceAlert {
  const base = mapBase(d);
  return {
    ...base,
    type: "PERFORMANCE",
    prevValue: toNumberOrNull(d.prev_value),
    currValue: toNumberOrNull(d.curr_value),
    percent: toNumberOrNull(d.percent),
    unit: d.unit ?? null,
  };
}

function mapPsycho(d: PsychoAlertDTO): PsychoAlert {
  const base = mapBase(d);
  return {
    ...base,
    type: "PSYCHO",
    fatigue: d.fatigue ?? null,
    mood: d.humor ?? null, // UI usa 'mood'
    hoursSlept: toNumberOrNull(d.hours_slept),
  };
}

/** Union mapper*/
function mapAnyAlert(d: AlertDTO): AnyAlert {
  if (isPerformanceDTO(d)) return mapPerformance(d);
  if (isPsychoDTO(d)) return mapPsycho(d);
  return mapPerformance({
    ...(d as any),
    alert_type: "PERFORMANCE",
    prev_value: null,
    curr_value: null,
    percent: null,
    unit: null,
  });
}

/** ------------------------ SERVICES ------------------------ **/
// Genérico: retorna o tipo solicitado
export async function getAlerts(params?: {
  days?: number;
  limit?: number;
  category?: AlertType;
}): Promise<AnyAlert[]> {
  const { days = 7, limit = 10, category } = params ?? {};
  const { data } = await api.get<AlertDTO[]>("/coach/alerts", {
    params: { days, limit, category },
  });
  return (data ?? []).map(mapAnyAlert);
}

// Conveniência: somente PERFORMANCE
export async function getPerformanceAlerts(params: {
  coachId: number;
  days?: number;
  limit?: number;
}): Promise<PerformanceAlert[]> {
  const { coachId, days = 7, limit = 10 } = params;

  const { data } = await api.get<PerformanceAlert[]>("/coach/alerts", {
    params: { coachId, days, limit, category: "PERFORMANCE" },
  });

  return data ?? [];
}

// Conveniência: somente PSYCHO
export async function getPsychoAlerts(params: {
  coachId: number; days?: number; limit?: number;
}): Promise<PsychoAlert[]> {
  const { coachId, days = 7, limit = 10 } = params;
  const { data } = await api.get<PsychoAlert[]>("/coach/alerts", {
    params: { coachId, days, limit, category: "PSYCHO" },
  });
  return data ?? [];
}
