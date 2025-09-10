import { SessionType } from "../../types/sessionType";
import { api } from "../../api/api";

export interface AthleteSession {
    id: number;
    coachPhoto: string | null;
    date: string;      
    type: SessionType;         
    title: string;
    athleteCount: number;
    score: number | null;    
    location: string | null;
    description: string | null;
    has_metrics: boolean;  
}
export async function getAthleteSessions(athleteId: number): Promise<AthleteSession[]> {
    const { data } = await api.get(`/athletes/${athleteId}/sessions`);
    return data ?? [];
}
