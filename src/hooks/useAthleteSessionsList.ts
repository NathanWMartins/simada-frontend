import { useCallback, useEffect, useMemo, useState } from "react";
import { AthleteSession, getAthleteSessions } from "../services/athlete/sessionsService";

export type AthleteFilterType = "All" | "Training" | "Game";

export function useAthleteSessionsList(athleteId?: number | null) {
    const [sessions, setSessions] = useState<AthleteSession[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!athleteId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getAthleteSessions(athleteId);
            setSessions(data);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? "Failed loading sessions athlete.");
        } finally {
            setLoading(false);
        }
    }, [athleteId]);

    useEffect(() => {
        load();
    }, [load]);

    const formatDate = useCallback((iso: string) => {
        try {
            const d = new Date(iso);
            if (Number.isNaN(d.getTime())) return iso;
            return d.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" });
        } catch {
            return iso;
        }
    }, []);

    const stats = useMemo(() => {
        const total = sessions.length;
        const withMetrics = sessions.filter(s => s.has_metrics).length;
        return { total, withMetrics };
    }, [sessions]);

    return {
        sessions,
        setSessions,
        loading,
        error,
        reload: load,
        formatDate,
        stats,
    };
}
