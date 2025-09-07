// TIPOS DE ALERTA
export type AlertType = "PERFORMANCE" | "PSYCHO";

/** ------------------------ DTOs (vindos do backend) ------------------------ **/

// Base comum da tabela Alertas
export interface AlertBaseDTO {
    alert_id?: number;
    alert_date: string;
    alert_type: AlertType;
    alert_message: string;
    alert_status?: string | null;
    suggested_action?: string | null;

    athlete_name?: string;
    athlete_photo?: string | null;
}

// Performance específico
export interface PerformanceAlertDTO extends AlertBaseDTO {
    alert_type: "PERFORMANCE";
    prev_value?: number | string | null;
    curr_value?: number | string | null;
    percent?: number | string | null;
    unit?: string | null;
}

/** ------------------------ MODELOS de UI (front) ------------------------ **/

export interface AlertBase {
    id?: number;
    date: string;
    type: AlertType;
    message: string;
    status?: string | null;
    action?: string | null;

    athleteName: string;
    athletePhoto?: string;
}

// Performance na UI
export interface PerformanceAlert extends AlertBase {
    type: "PERFORMANCE";
    prevValue?: number | null;
    currValue?: number | null;
    percent?: number | null;
    unit?: string | null;
}

// Psycho na UI
export interface PsychoAlert extends AlertBase {
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

export interface GetPsychoAnswersParams{
  q?: string;         
  position?: string;
}