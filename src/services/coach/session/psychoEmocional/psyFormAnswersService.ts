import { api } from "../../../../api/api";

export type PsychoAnswerDTO = {
  id: number;
  id_session: number;
  id_athlete: number;
  token: string;
  submitted_at: string;
  srpe: number;
  fatigue: number;
  soreness: number;
  mood: number;
  energy: number;

  athlete_name: string;
  athlete_email: string;
  athlete_photo?: string | null;
  athlete_position: string;
};

export async function getPsychoAnswersBySession(sessionId: number) {
  const { data } = await api.get<PsychoAnswerDTO[]>(`/psycho-form/answers/sessions/${sessionId}`);
  console.log(data);
  return data;
}

export function exportAnswersToCSV(rows: PsychoAnswerDTO[]) {
  const headers = [
    "athleteName","athleteEmail","submitted_at",
    "sRPE","fatigue","soreness","mood","energy","token","id_athlete","id_session"
  ];

  const body = rows.map(r => [
    r.athlete_name,
    r.athlete_email,
    new Date(r.submitted_at).toISOString(),
    r.srpe, r.fatigue, r.soreness, r.mood, r.energy,
    r.token, r.id_athlete, r.id_session
  ]);

  const csv = [headers.join(";"), ...body.map(line => line.join(";"))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `psycho_answers_session_${rows[0]?.id_session ?? "unknown"}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
