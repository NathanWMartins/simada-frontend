// src/hooks/useAthleteRisk.ts
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { AthleteRiskPoint, fetchAthleteRisk, mapRiskError, RiskMetricKey } from "../services/coach/athletes/athleteRiskService";

export function useAthleteRisk(
    athleteId: number,
    from?: string,          // YYYY-MM-DD
    to?: string,            // YYYY-MM-DD
    metrics?: RiskMetricKey[]
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [points, setPoints] = useState<AthleteRiskPoint[]>([]);

    // evita corrida de requests
    const reqId = useRef(0);

    useEffect(() => {
        if (!athleteId || !from || !to) {
            setPoints([]);
            setError(null);
            return;
        }

        const id = ++reqId.current;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchAthleteRisk(athleteId, from, to, metrics);
                if (id !== reqId.current) return;

                // Ordena por data só por garantia
                const ordered = [...data].sort((a, b) =>
                    dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
                );
                setPoints(ordered);
            } catch (e: any) {
                if (id === reqId.current) {
                    setPoints([]);
                    setError(mapRiskError(e));
                }
            } finally {
                if (id === reqId.current) setLoading(false);
            }
        })();
    }, [athleteId, from, to, JSON.stringify(metrics)]);

    return { loading, error, points };
}
