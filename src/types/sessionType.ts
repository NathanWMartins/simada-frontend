export type SessionType = "training" | "game";

// O QUE O APP USA
export interface Session {
  id: number;
  trainerId?: number;
  trainerPhoto?: string;
  start: string;
  end: string;
  type: SessionType;
  title: string;
  athleteCount: number;
  score?: string | null;
  description?: string | null;
  location?: string | null;
}

// O QUE O BACK ENVIA/ESPERA
export interface SessionDTO {
  id: number;
  trainer_id?: number;
  trainer_photo?: string | null;
  start: string;
  end?: string | null;
  type: SessionType;
  title: string;
  athletes_count: number;
  score?: string | null;
  description?: string | null;
  location?: string | null;
}

export interface NewSessionRequest {
  trainerId: number;
  type: SessionType;
  title: string;
  date: string;
  athletesCount: number;
  score?: string | null;
  notes?: string | null;
  location?: string | null;
}

export interface TrainerSession {
  id: number;
  trainerId?: number;
  trainerPhoto?: string;
  start: string;
  end: string;
  type: SessionType;
  title: string;
  athleteCount: number;
  score?: string | null;
  description?: string | null;
  location?: string | null;
}