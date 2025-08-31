import { UpdateSessionPayload } from "../../../types/sessionType";
import { api } from "../../api";

export async function uploadSessionMetrics(sessionId: number, file: File): Promise<void> {
    const form = new FormData();
    form.append("file", file);

    console.log(form);

    await api.post(`/trainer/sessions/${sessionId}/metrics/import`, form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function updateSessionNotes(id: number, description: string) {
    const { data } = await api.patch(`trainer/sessions/update/notes/${id}`, { description });
    return data;
}

export async function updateSession(id: number, payload: UpdateSessionPayload) {
  const { data } = await api.put(`/trainer/sessions/update/${id}`, payload);
  return data;
}