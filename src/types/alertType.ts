//======   Performance   =====
export type TLLabel =
    | "unavailable"
    | "low" | "optimal" | "attention" | "risk"
    | "sharp_drop" | "stable"
    | "healthy" | "high_risk"
    ;


export interface TLAnswerDTO {
    id: number;
    athleteId: number;
    athleteName?: string | null;
    athleteEmail?: string | null;
    athletePosition?: string | null;
    athletePhoto?: string | null;
    athleteNationality?: string | null;

    qwStart?: string | null;
    createdAt?: string | null;

    acwr?: number | null;
    monotony?: number | null;
    strain?: number | null;
    pctQwUp?: number | null;

    acwrLabel?: TLLabel | null;
    monotonyLabel?: TLLabel | null;
    strainLabel?: TLLabel | null;
    pctQwUpLabel?: TLLabel | null;
}

export interface TrainingLoadAlert {
    id: number;
    athleteId: number;
    coachId: number;
    sessionId?: number | null;

    acwr?: number | null;
    monotony?: number | null;
    strain?: number | null;
    pctQwUp?: number | null;

    acwrLabel?: TLLabel | null;
    monotonyLabel?: TLLabel | null;
    strainLabel?: TLLabel | null;
    pctQwUpLabel?: TLLabel | null;

    createdAt?: string | null;
    qwStart?: string | null;

    athleteName?: string | null;
    athletePhoto?: string | null;
}



//======   Psycho   ======
export interface PsychoAlert {
    alertId: number;
    athleteId: number;
    sessionId: number;
    answerId: number;
    athleteName: string;
    athletePhoto: string;
    srpe: number;
    fatigue: number;
    soreness: number;
    mood: number;
    energy: number;
    total: number;
    risk: string;
    date: string;
}

export interface PsyAnswerDTO {
    answerId: number;
    athleteId: number;
    athleteName: string;
    athleteEmail: string;
    athletePosition?: string | null;
    athletePhoto?: string | null;
    submittedAt?: string | null;
    srpe?: number | null;
    fatigue?: number | null;
    soreness?: number | null;
    mood?: number | null;
    energy?: number | null;
    token?: string | null;
}

export interface GetPsychoAnswersParams {
    q?: string;
    position?: string;
}