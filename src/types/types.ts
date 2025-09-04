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