import { useCallback, useEffect, useState } from "react";
import { CoachSession } from "../types/sessionType";
import { deleteSession, getCoachSessions } from "../services/coach/session/sessionsService";
import { updateSessionNotes, uploadSessionMetrics } from "../services/coach/session/metricsService";

export type FilterType = "All" | "Training" | "Game";

export function useSessionsList(coachId?: number) {
    const [sessions, setSessions] = useState<CoachSession[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        if (!coachId) return;
        try {
            setLoading(true);
            setError(null);
            const data = await getCoachSessions(coachId);
            setSessions(data);
        } catch (e) {
            console.error(e);
            setError("Falha ao carregar sessões");
            setSessions([]);
        } finally {
            setLoading(false);
        }
    }, [coachId]);

    useEffect(() => { fetch(); }, [fetch]);

    const remove = useCallback(async (id: number) => {
        await deleteSession(id);
        setSessions(prev => prev.filter(s => s.id !== id));
    }, []);

    const saveNotes = useCallback(async (id: number, description: string) => {
        await updateSessionNotes(id, description);
        setSessions(prev => prev.map(s => s.id === id ? { ...s, description } : s));
    }, []);

    const importCsv = useCallback(async (id: number, file: File) => {
        await uploadSessionMetrics(id, file);
        setSessions(prev => prev.map(s => s.id === id ? { ...s, has_metrics: true } : s));
    }, []);

    const formatDate = (iso: string) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
            const [y, m, d] = iso.split("-").map(Number);
            return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        }
        return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return { sessions, loading, error, fetch, remove, saveNotes, importCsv, formatDate, setSessions };
}
