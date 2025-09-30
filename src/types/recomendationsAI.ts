export interface PsyRecoRequest {
    sessionId: number;
    athleteId: number;
    srpe: number;
    fatigue: number;
    soreness: number;
    mood: number;
    energy: number;
}

export interface AIRecoResponse{
    recommendations: string; 
}

export interface PerformanceRecoRequest {
    coachId: number;
    sessionId: number;
    athleteId: number;
    acwr: number;
    monotony: number;
    strain: number;
    pctQwUp: number;
}