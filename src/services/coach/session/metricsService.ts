import { UpdateSessionPayload } from "../../../types/sessionType";
import { api } from "../../../api/api";

export async function uploadSessionMetrics(sessionId: number, file: File): Promise<void> {
    const form = new FormData();
    form.append("file", file);

    await api.post(`/coach/sessions/${sessionId}/metrics/import`, form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function updateSessionNotes(id: number, description: string) {
    const { data } = await api.patch(`coach/sessions/update/notes/${id}`, { description });
    return data;
}

export async function updateSession(id: number, payload: UpdateSessionPayload) {
    const { data } = await api.put(`/coach/sessions/update/${id}`, payload);
    return data;
}

export async function deleteSessionMetrics(sessionId: number, coachId: number): Promise<void> {
    await api.delete(`/coach/sessions/${sessionId}/metrics?coachId=${coachId}`);
}