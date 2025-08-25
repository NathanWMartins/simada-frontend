export interface TrainingStats {
    completedTraining: number;
    trainingThisWeek: number;
    matchesPlayed: number;
    matchesThisMonth: number;
    totalSessions: number;
    totalAthletes: number;
}

export interface TopPerformerDTO {
    nome_atleta: string;
    foto?: string | null;
    data_atualizacao: string;
    pontuacao: number;
    ultima_pontuacao?: number | null;
}

export interface TopPerformer {
    name: string;
    avatarUrl?: string;
    updatedAt: string;
    score: number;
    delta?: number;
}

//Auth
export interface RegisterTrainerData {
    fullName: string;
    email: string;
    password: string;
    modality?: string;
    gender?: string;
}

export interface RegisterAthleteData {
    fullName: string;
    email: string;
    password: string;
    gender?: string;
    shirtNumber?: string;
    position?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

// Alert
export interface AlertDTO {
    alert_date: string;
    alert_type: string;
    alert_message: string;
    alert_status?: string | null;
    suggested_action?: string | null;
    athlete_name?: string;
    athlete_photo?: string | null;

    fatigue?: string | null;
    humor?: string | null;
    hours_slept?: number | null;
}

export interface Alert {
    date: string;
    type: string;
    message: string;
    status?: string | null;
    action?: string | null;
    athleteName: string;
    athletePhoto?: string;
}

export interface PsychoAlert {
    athleteName: string;
    athletePhoto?: string;
    date: string;
    risk: "LOW" | "CAUTION" | "HIGH";
    fatigue?: string | null;
    humor?: string | null;
    hoursSlept?: number | null;
}
