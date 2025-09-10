import { Athletes } from "../../types/athleteType";
import { api } from "../api";

export type PerfHighlight = { points: number; rank: number };

export type MatchInfo = {
    dateISO: string;
    title: string;
    subtitle?: string;
};

export type CalendarEvent = {
    dateISO: string;
    label: string;
    type: "game" | "training";
};

export async function getAthleteSummary(athleteId: number): Promise<Athletes> {
    const { data } = await api.get(`/athlete/${athleteId}/home`);
    return data;
}

export async function getAthletePerformance(athleteId: number): Promise<PerfHighlight> {
    const { data } = await api.get(`/athlete/${athleteId}/home/performance`);
    return data;
}

export async function getAthleteRecent(athleteId: number): Promise<MatchInfo> {
    const { data } = await api.get(`/athlete/${athleteId}/home/recent`);
    return data;
}

export async function getAthleteNextMatch(athleteId: number): Promise<MatchInfo> {
    const { data } = await api.get(`/athlete/${athleteId}/home/next-match`);
    return data;
}

export async function getAthleteCalendar(athleteId: number, year: number, month: number): Promise<CalendarEvent[]> {
    const { data } = await api.get(`/athlete/${athleteId}/home/calendar`, {
        params: { year, month: month + 1 }
    });
    return data ?? [];
}
