import { useCallback, useEffect, useMemo, useState } from "react";
import { getAthleteRiskSeries, RiskMetricKey, RiskPoint } from "../services/coach/athletes/athleteRiskService";

export function useAthleteRisk(
    athleteId?: number | null,
    fromMonth?: string,
    toMonth?: string,
    metrics: RiskMetricKey[] = ["acwr", "monotony", "strain"]
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [points, setPoints] = useState<RiskPoint[]>([]);

    const load = useCallback(async () => {
        if (!athleteId || !fromMonth || !toMonth) return;
        setLoading(true);
        setError(null);
        try {
            const res = await getAthleteRiskSeries(athleteId, fromMonth, toMonth, metrics);
            setPoints(res.points ?? []);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? "Falha ao carregar cálculos de risco.");
        } finally {
            setLoading(false);
        }
    }, [athleteId, fromMonth, toMonth, metrics]);

    useEffect(() => {
        load();
    }, [load]);

    const have = useMemo(() => ({
        acwr: points.some(p => p.acwr != null),
        monotony: points.some(p => p.monotony != null),
        strain: points.some(p => p.strain != null),
    }), [points]);

    return { loading, error, points, reload: load, have };
}
