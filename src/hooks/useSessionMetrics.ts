import { useEffect, useState } from "react";
import { getMetricsForAthlete } from "../services/coach/session/sessionsService";
import { MetricsRow } from "../types/sessionGraphsType";

export function useSessionMetrics(sessionId: number, athleteId: number) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [rows, setRows] = useState<MetricsRow[]>([]);

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true); setError("");
            try {
                const r = await getMetricsForAthlete(sessionId, athleteId);
                if (alive) setRows(r);
            } catch (e) {
                console.error(e);
                if (alive) setError("Não foi possível carregar os dados da sessão.");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [sessionId, athleteId]);

    return { loading, error, rows };
}
