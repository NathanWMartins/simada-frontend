import { api } from "../../api";

export async function inviteAthlete(trainerId: number, email: string) {
    const { data } = await api.post(`/trainers/${trainerId}/athlete-invitations`, { email });
    return data;
}