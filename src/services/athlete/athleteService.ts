import { AthleteProfile } from "../../types/athleteType";
import { api } from "../../api/api";

export async function getAthleteProfile(athleteId: number): Promise<AthleteProfile> {
    const { data } = await api.get(`/athletes/${athleteId}/profile`);
    return {
        id: data.id,
        name: data.name ?? "",
        email: data.email ?? "",
        gender: data.gender ?? "",
        phone: data.phone ?? "",
        nationality: data.nationality ?? "",
        photoUrl: data.photoUrl ?? data.photo_url ?? null,
    };
}

export async function updateAthleteProfile(
    athleteId: number,
    payload: Partial<AthleteProfile>
): Promise<void> {
    await api.put(`/athletes/${athleteId}/profile`, payload);
}

export async function uploadAthleteAvatar(
    athleteId: number,
    file: File
): Promise<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post(`/athletes/${athleteId}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return { photoUrl: data.photoUrl ?? data.photo_url };
}

export async function updateAthletePassword(
    athleteId: number,
    currentPassword: string,
    newPassword: string
): Promise<void> {
    await api.post(`/athletes/${athleteId}/password`, {
        currentPassword,
        newPassword,
    });
}
