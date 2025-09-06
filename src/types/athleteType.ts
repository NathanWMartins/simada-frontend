export type AthletePosition = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";

export interface AthleteExtraData {
  height_cm?: number | null;
  weight_kg?: number | null;
  lean_mass_kg?: number | null;
  fat_mass_kg?: number | null;
  body_fat_pct?: number | null;
  dominant_foot?: "Left" | "Right" | "Both" | null;
  nationality?: string | null;
  injury_status?: "Healthy" | "Injured" | "Rehab" | null;
}

export interface CoachAthletes {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  birth: string;
  avatarUrl?: string | null;
  jersey_number: string;
  position?: AthletePosition | null;

  extra?: AthleteExtraData | null;
}

export interface UpdateAthletePayload {
  name?: string;
  email?: string | null;
  phone?: string | null;
  birth?: string;
  position?: AthletePosition | null;

  extra?: AthleteExtraData | null;
}

export interface AthleteDTO {
  id: number;
  name: string;
  email: string;
  birth: string;
  phone?: string | null;
  jersey_number: string;
  position: AthletePosition;
  avatarUrl?: string | null;

  extra?: AthleteExtraData | null;
}