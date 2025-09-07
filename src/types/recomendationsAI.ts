export interface PsyRecoRequest {
    sessionId: number;
    athleteId: number;
    srpe: number;
    fatigue: number;
    soreness: number;
    mood: number;
    energy: number;
}

export interface PsyRecoResponse{
    recommendations: string; 
}