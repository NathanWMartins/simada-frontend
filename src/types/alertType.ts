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

// Psycho específico
export interface PsychoAlertDTO extends AlertBaseDTO {
    alert_type: "PSYCHO";
    fatigue?: string | null;
    humor?: string | null;
    hours_slept?: number | string | null;
}

// Union de DTO
export type AlertDTO = PerformanceAlertDTO | PsychoAlertDTO;

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
    type: "PSYCHO";
    fatigue?: string | null;
    mood?: string | null;
    hoursSlept?: number | null;
}

// Union na UI (se precisar lidar com ambos juntos)
export type AnyAlert = PerformanceAlert | PsychoAlert;

/** ------------------------ Type Guards (DTO) ------------------------ **/
export function isPerformanceDTO(d: AlertDTO): d is PerformanceAlertDTO {
    return d.alert_type === "PERFORMANCE";
}
export function isPsychoDTO(d: AlertDTO): d is PsychoAlertDTO {
    return d.alert_type === "PSYCHO";
}
