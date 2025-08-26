import { api } from "../../api";
import { Session } from "../../types/types";

export async function getSessions(): Promise<Session[]> {
    const { data } = await api.get("/sessions");
    return data.map((s: any) => ({
        id: s.id_sessao,
        coachId: s.id_treinador,
        start: s.data_hora_inicio,
        end: s.data_hora_termino,
        type: s.tipo_sessao === "jogo" ? "game" : "training",
        title: s.titulo,
        score: s.placar,
        description: s.descricao,
        location: s.local,
    }));
}
