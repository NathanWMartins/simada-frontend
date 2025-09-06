import { api } from "../api";

export async function fetchInvite(token: string) {
  const { data } = await api.get(`/athletes/invitations/${token}`);
  return data as { email: string; coachName: string };
}

export async function completeInvite(payload: {
  token: string; name: string; password: string; phone?: string; birth?: string; position?: string;
}) {
  const { data } = await api.post("/auth/complete-invite", payload);
  return data;
}