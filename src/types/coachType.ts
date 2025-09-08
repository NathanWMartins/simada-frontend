export interface CoachProfile {
  id: number;
  name: string;
  email: string;
  gender?: string;
  team?: string;
  phone?: string;
  photoUrl?: string | null;
}

export interface CoachProfileDTO {
  id: number;
  name: string;
  email: string;
  gender?: string;
  team?: string;
  phone?: string;
  photoUrl?: string | null;
}

export interface CoachAvatar {
  photoUrl: string;
}