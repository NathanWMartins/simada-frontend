import { useCallback, useEffect, useMemo, useState } from "react";
import { deleteAthlete, getAthletes } from "../services/trainer/athletes/trainerAthletesService";
import type { TrainerAthletes } from "../types/athleteType";

export type PositionFilter = "All" | "Goalkeeper" | "Defender" | "Midfielder" | "Forward";

export const POSITIONS: PositionFilter[] = ["All", "Goalkeeper", "Defender", "Midfielder", "Forward"];

export function useAthletesList(trainerId?: number) {
    const [raw, setRaw] = useState<TrainerAthletes[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [position, setPosition] = useState<PositionFilter>("All");

    useEffect(() => {
        if (!trainerId) return;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAthletes(trainerId, { page: 1, limit: 20 });
                setRaw(data ?? []);
            } catch (e) {
                console.error(e);
                setError("Falha ao carregar atletas.");
                setRaw([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [trainerId]);

    const remove = useCallback(async (id: number) => {
        await deleteAthlete(id);
        setRaw(prev => prev.filter(s => s.id !== id));
    }, []);

    const list = useMemo(() => {
        const lower = search.trim().toLowerCase();
        return raw.filter((a) => {
            const matchText =
                !lower ||
                a.name.toLowerCase().includes(lower) ||
                (a.email ?? "").toLowerCase().includes(lower) ||
                (a.phone ?? "").toLowerCase().includes(lower);

            const pos = (a as any).position as string | undefined;
            const matchPos = position === "All" || (pos && pos.toLowerCase() === position.toLowerCase());

            return matchText && matchPos;
        });
    }, [raw, search, position]);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return {
        loading,
        error,
        list,
        search,
        setSearch,
        position,
        setPosition,
        formatDate,
        remove
    };
}
