import { api } from "../../../api/api";


// métricas disponíveis no back (lowercase)
export type RiskMetricKey = "ca" | "cc" | "pctqwup" | "acwr" | "monotony" | "strain";

export type WeeklyLoadRowDTO = {
    athleteId: number;
    qwStart: string;          // ISO date (yyyy-MM-dd)
    ca?: number | null;
    cc?: number | null;

    acwr?: number | null;
    acwrLabel?: string | null;

    pctQwUp?: number | null;
    pctQwUpLabel?: string | null;

    monotony?: number | null;
    monotonyLabel?: string | null;

    strain?: number | null;
    strainLabel?: string | null;

    daysWithLoad?: number | null;
    warnings?: string[];      // e.g. ["monotony_strain_unavailable"]
};

export type WeeklyLoadResponseDTO = {
    ccMethod: string;         // "sma4_qw"
    rows: WeeklyLoadRowDTO[];
};

export type AthleteRiskPoint = {
    date: string;             // ISO date (qwStart)
    ca?: number | null;
    cc?: number | null;
    pctqwup?: number | null;
    acwr?: number | null;
    monotony?: number | null;
    strain?: number | null;

    // labels (se vierem do back)
    acwrLabel?: string | null;
    pctqwupLabel?: string | null;
    monotonyLabel?: string | null;
    strainLabel?: string | null;

    warnings?: string[];
};

function buildMetricsParam(metrics: RiskMetricKey[] | undefined): string | undefined {
    if (!metrics || metrics.length === 0) return undefined;
    // backend espera lower-case, separado por vírgula
    return metrics.map(m => m.toLowerCase()).join(",");
}

/**
 * GET /coach/athletes/{athleteId}/risk-calculations?from=YYYY-MM-DD&to=YYYY-MM-DD&metrics=acwr,monotony
 */
export async function fetchAthleteRisk(
    athleteId: number,
    from: string | undefined,
    to: string | undefined,
    metrics: RiskMetricKey[] | undefined
): Promise<AthleteRiskPoint[]> {
    if (!athleteId || !from || !to) return [];

    const params: any = { from, to };
    const metricsParam = buildMetricsParam(metrics);
    if (metricsParam) params.metrics = metricsParam;

    const { data } = await api.get<WeeklyLoadResponseDTO>(
        `/coach/athletes/${athleteId}/risk-calculations`,
        { params }
    );

    const points: AthleteRiskPoint[] = (data?.rows ?? []).map((r: WeeklyLoadRowDTO) => ({
        date: r.qwStart,
        ca: r.ca ?? null,
        cc: r.cc ?? null,
        pctqwup: r.pctQwUp ?? null,
        acwr: r.acwr ?? null,
        monotony: r.monotony ?? null,
        strain: r.strain ?? null,
        acwrLabel: r.acwrLabel ?? null,
        pctqwupLabel: r.pctQwUpLabel ?? null,
        monotonyLabel: r.monotonyLabel ?? null,
        strainLabel: r.strainLabel ?? null,
        warnings: r.warnings ?? [],
    }));


    return points;
}

export function mapRiskError(e: any): string {
    const msg = e?.response?.data?.message ?? e?.message ?? "Unknown error.";
    const code = e?.response?.data?.code ?? e?.response?.data?.error;
    const ctx = e?.response?.data;

    if (code === "INSUFFICIENT_HISTORY" || ctx?.errorCode === "INSUFFICIENT_HISTORY") {
        const need = ctx?.required ?? ctx?.requiredCount ?? 4;
        const have = ctx?.have ?? ctx?.currentCount ?? 0;
        return `Insufficient history for ACWR (SMA-4). Need at least ${need} previous quad-weeks, found ${have}. Try widening the date range or deselecting ACWR.`;
    }
    return msg;
}
