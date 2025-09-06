export type SessionType = "Training" | "Game";

// O QUE O APP USA
export interface Session {
  id: number;
  coachId?: number;
  coachPhoto?: string;
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
  coach_id?: number;
  coach_photo?: string | null;
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
  coachId: number;
  type: SessionType;
  title: string;
  date: string;
  athletesCount: number;
  score?: string | null;
  notes?: string | null;
  location?: string | null;
}

export interface CoachSession {
  id: number;
  coachId?: number;
  coachPhoto?: string;
  date: string;
  type: SessionType;
  title: string;
  athleteCount: number;
  score?: string | null;
  description?: string | null;
  location?: string | null;
  has_metrics: boolean;
  has_psycho: boolean;
}

export interface UpdateSessionPayload {
  type: SessionType;
  title: string;
  date: string;
  score?: string | null;
  description?: string | null;
  location?: string | null;
}