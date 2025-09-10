import { api } from "../../api/api";


export interface PeerAthlete {
    id: number;
    name: string;
    email?: string | null;
    position?: string | null;
    jersey?: string | number | null;
    nationality?: string;
    avatar?: string | null;
    points?: number;      
}

export async function getPeersByAthlete(athleteId: number): Promise<PeerAthlete[]> {
    const { data } = await api.get(`/athletes/${athleteId}/peers`);
    return data ?? [];
}
