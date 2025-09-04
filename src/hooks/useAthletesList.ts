// hooks/useAthletesList.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { deleteAthlete, getAthletes } from "../services/trainer/athletes/trainerAthletesService";
import type { TrainerAthletes } from "../types/athleteType";

export type PositionFilter = "All" | "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
export type InjuryFilter = "All" | "Healthy" | "Injured" | "Rehab";

export const POSITIONS: PositionFilter[] = ["All", "Goalkeeper", "Defender", "Midfielder", "Forward"];
export const STATUS: InjuryFilter[] = ["All", "Healthy", "Injured", "Rehab"];

const norm = (s?: string | null) => (s ?? "").trim().toLowerCase();

export function useAthletesList(trainerId?: number) {
    const [raw, setRaw] = useState<TrainerAthletes[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [position, setPosition] = useState<PositionFilter>("All");
    const [injury, setInjury] = useState<InjuryFilter>("All");

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
        const q = search.trim().toLowerCase();

        return raw.filter(a => {
            // texto
            const textOk =
                !q ||
                a.name.toLowerCase().includes(q) ||
                (a.email ?? "").toLowerCase().includes(q) ||
                (a.phone ?? "").toLowerCase().includes(q);

            // posição
            const posOk =
                position === "All" ||
                (a.position && norm(a.position) === norm(position));

            const injuryVal =
                a.extra?.injury_status ??
                (a as any).injury_status ??       
                (a as any).extraData?.injury_status ??
                null;

            const injuryOk =
                injury === "All" ||
                (injuryVal != null && norm(injuryVal) === norm(injury));

            return textOk && posOk && injuryOk;
        });
    }, [raw, search, position, injury]);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return {
        loading,
        error,
        list,
        search, setSearch,
        position, setPosition,
        injury, setInjury,
        formatDate,
        remove,
    };
}
