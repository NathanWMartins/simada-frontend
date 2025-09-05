import { api } from "../../api";

export async function createPsyFormInvite(trainerId: number, sessionId?: number) {
    const { data } = await api.post("/psycho-form/create", { sessionId }, { params: { trainerId } });
    return data as {token: string };
}

export async function validatePsyForm(token: string) {
    const { data } = await api.get(`/psycho-form/${token}`);    
    return data;
}

export async function submitPsyForm(token: string, payload: {
    sRPE: number; fatigue: number; soreness: number; mood: number; energy: number;
}) {
    await api.post(`/psycho-form/${token}/submit`, payload);
}
