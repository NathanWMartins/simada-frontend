import { api } from "../../api";

export async function uploadSessionMetrics(sessionId: number, file: File): Promise<void> {
    const form = new FormData();
    form.append("file", file);

    console.log(form);

    await api.post(`/trainer/sessions/${sessionId}/metrics/import`, form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}
