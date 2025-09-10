import { api } from "../../../api/api";

export async function inviteAthlete(coachId: number, email: string) {
    const { data } = await api.post(`/coach/${coachId}/athlete-invitations`, { email });
    return data;
}