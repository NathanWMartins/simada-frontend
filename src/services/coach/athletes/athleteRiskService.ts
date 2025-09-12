import { api } from "../../../api/api";

export type RiskMetricKey = "acwr" | "monotony" | "strain";

export interface RiskPoint {
    date: string;             // ISO
    acwr?: number | null;
    monotony?: number | null;
    strain?: number | null;   // "tension" no back -> mapeado aqui
}

export interface RiskSeriesResponse {
    athleteId: number;
    points: RiskPoint[];
}

function normalizePoint(p: any): RiskPoint {
    return {
        date: p?.date ?? p?.weekStart ?? p?.day ?? p?.when ?? "",
        acwr: typeof p?.acwr === "number" ? p.acwr : (typeof p?.ACWR === "number" ? p.ACWR : null),
        // mapeia "monotony", "monotonia", "mono", "Mono"
        monotony:
            typeof p?.monotony === "number" ? p.monotony :
                typeof p?.monotonia === "number" ? p.monotonia :
                    typeof p?.mono === "number" ? p.mono :
                        typeof p?.Mono === "number" ? p.Mono : null,
        // "strain" ~ "tension"
        strain:
            typeof p?.strain === "number" ? p.strain :
                typeof p?.tension === "number" ? p.tension :
                    typeof p?.Strain === "number" ? p.Strain : null,
    };
}

export async function getAthleteRiskSeries(
    athleteId: number,
    fromMonth: string,          // "YYYY-MM"
    toMonth: string,            // "YYYY-MM"
    metrics: RiskMetricKey[]
): Promise<RiskSeriesResponse> {
    const params = new URLSearchParams();
    params.set("from", fromMonth);
    params.set("to", toMonth);
    if (metrics.length > 0) params.set("metrics", metrics.join(","));

    const { data } = await api.get(`/coach/athletes/${athleteId}/risk-calculations?${params.toString()}`);

    const arr: any[] = Array.isArray(data?.points) ? data.points : (Array.isArray(data) ? data : []);
    const points = arr.map(normalizePoint);

    return { athleteId, points };
}
