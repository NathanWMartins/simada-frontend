//Snackbar
export interface SnackbarState {
    open: boolean;
    message: string;
    severity: "error" | "success" | "warning" | "info";
};

export interface TrainingStats {
    completedTrainings: number;
    trainingsThisWeek: number;
    matchesPlayed: number;
    matchesThisMonth: number;
    totalSessions: number;
    totalAthletes: number;
}

export interface TopPerformerDTO {
    athlete_name: string;
    photo?: string | null;
    update_date: string;
    score: number;
    last_score?: number | null;
}

export interface TopPerformer {
    name: string;
    avatarUrl?: string;
    updatedAt: string;
    score: number;
    delta?: number;
}

//Auth
export interface RegisterCoachData {
    name: string;
    email: string;
    password: string;
    gender?: string;
}

export interface RegisterAthleteData {
    name: string;
    email: string;
    password: string;
    gender?: string;
    jerseyNumber?: string;
    position?: string;
}

export interface LoginData {
    email: string;
    password: string;
}