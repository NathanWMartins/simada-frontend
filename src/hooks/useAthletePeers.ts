import { useCallback, useEffect, useMemo, useState } from "react";
import { PeerAthlete, getPeersByAthlete } from "../services/athlete/peersService";

export function useAthletePeers(athleteId?: number | null) {
    const [peers, setPeers] = useState<PeerAthlete[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!athleteId) return;
        setLoading(true);
        setError(null);
        try {
            const list = await getPeersByAthlete(athleteId);
            setPeers(list);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? "Falha ao carregar atletas do seu time.");
        } finally {
            setLoading(false);
        }
    }, [athleteId]);

    useEffect(() => {
        load();
    }, [load]);

    const positions = useMemo(() => {
        const set = new Set<string>();
        peers.forEach((p) => { if (p.position) set.add(p.position); });
        return Array.from(set).sort();
    }, [peers]);

    return { peers, setPeers, loading, error, reload: load, positions };
}
