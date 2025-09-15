import type { Athlete, AthleteCharts, MetricsRow, TeamCharts } from "../types/sessionGraphsType";

const nf = (v: number | null | undefined): string => (v == null ? "--" : Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 }));
function mean(arr: Array<number | null | undefined>): number {
    if (arr.length === 0) return 0;
    const total: number = arr.reduce<number>(
        (sum, val) => sum + (val ?? 0), 0
    );
    return total / arr.length;
}

export function mapTeam(rows: MetricsRow[], athletes: Athlete[]): TeamCharts {
    const nameById = new Map<number, string>(athletes.map((a) => [a.id, a.name]));
    const label = (r: MetricsRow) => nameById.get(r.id_athlete) || r.player || `#${r.id_athlete}`;

    const distanceByAthlete = rows.map((r) => ({
        athlete: label(r),
        km: Number(r.total_distance ?? 0) / 1000,
    }));

    const sprintsByAthlete = rows.map((r) => ({
        athlete: label(r),
        sprints: Number(r.sprints ?? 0),
    }));

    const accByAthlete = rows.map((r) => ({
        athlete: label(r),
        num_acc_expl: Number(r.num_acc_expl ?? 0),
    }));

    const avgSpeedByAthlete = rows.map((r) => ({
        athlete: label(r),
        avg: Number(r.average_speed ?? 0),
    }));

    const maxSpeedByAthlete = rows.map((r) => ({
        athlete: label(r),
        max_speed: Number(r.max_speed ?? 0),
    }));

    const playerLoadByAthlete = rows.map((r) => ({
        athlete: label(r),
        pl: Number(r.player_load ?? 0),
    }));

    const hsrByAthlete = rows.map((r) => ({
        athlete: label(r),
        hsr: Number(r.hsr ?? 0),
    }));

    const velocityZonesByAthlete = rows.map((r) => ({
        athlete: label(r),
        vr1: Number(r.distance_vrange1 ?? 0),
        vr2: Number(r.distance_vrange2 ?? 0),
        vr3: Number(r.distance_vrange3 ?? 0),
        vr4: Number(r.distance_vrange4 ?? 0),
        vr5: Number(r.distance_vrange5 ?? 0),
        vr6: Number(r.distance_vrange6 ?? 0),
    }));

    const perfScatter = rows.map((r) => ({
        athlete: label(r),
        km: Number(r.total_distance ?? 0) / 1000,
        avg: Number(r.average_speed ?? 0),
        pl: Number(r.player_load ?? 0),
        hsr: Number(r.hsr ?? 0),
    }));
    const perfComposed = rows.map(r => ({
        athlete: label(r),
        km: (r.total_distance ?? 0) / 1000,
        avg: r.average_speed ?? 0,
        pl: r.player_load ?? 0,
    }));

    const sorted = [...distanceByAthlete].sort((a, b) => b.km - a.km);
    const totalKm = sorted.reduce((s, x) => s + x.km, 0) || 1;
    let acc = 0;
    const cumulativeDistance = sorted.map(x => {
        acc += x.km;
        return { athlete: x.athlete, km: x.km, cumPct: (acc / totalKm) * 100 };
    });

    const hsrVsPLScatter = rows.map(r => ({
        athlete: label(r),
        hsr: r.hsr ?? 0,
        pl: r.player_load ?? 0,
        acc: r.num_acc_expl ?? 0,
    }));

    const kpiTable = [
        { metric: "PlayerLoad avg", value: nf(mean(rows.map((r) => r.player_load))) },
        { metric: "Distance avg (km)", value: nf(mean(rows.map((r) => (r.total_distance ?? 0) / 1000))) },
        { metric: "Vel. avg (km/h)", value: nf(mean(rows.map((r) => r.average_speed))) },
        { metric: "HSR avg", value: nf(mean(rows.map((r) => r.hsr))) },
        { metric: "Acc expl. avg", value: nf(mean(rows.map((r) => r.num_acc_expl))) },
    ];

    return {
        distanceByAthlete,
        sprintsByAthlete,
        accByAthlete,
        avgSpeedByAthlete,
        maxSpeedByAthlete,
        playerLoadByAthlete,
        hsrByAthlete,
        velocityZonesByAthlete,
        perfScatter,
        perfComposed,
        cumulativeDistance,
        hsrVsPLScatter,
        kpiTable,
    };
}

export function mapAthlete(row?: MetricsRow): AthleteCharts {
    if (!row) return { velocityRanges: [], accHsrProgress: [], kpiTable: [] };

    const velocityRanges = [
        { zone: "VR1", distance: Number(row.distance_vrange1 ?? 0) },
        { zone: "VR2", distance: Number(row.distance_vrange2 ?? 0) },
        { zone: "VR3", distance: Number(row.distance_vrange3 ?? 0) },
        { zone: "VR4", distance: Number(row.distance_vrange4 ?? 0) },
        { zone: "VR5", distance: Number(row.distance_vrange5 ?? 0) },
        { zone: "VR6", distance: Number(row.distance_vrange6 ?? 0) },
    ];

    const acc = Number(row.num_acc_expl ?? 0);
    const hsr = Number(row.hsr ?? 0);
    const accHsrProgress = [
        { label: "1º terc.", acc: acc * 0.3, hsr: hsr * 0.3 },
        { label: "2º terc.", acc: acc * 0.35, hsr: hsr * 0.35 },
        { label: "3º terc.", acc: acc * 0.35, hsr: hsr * 0.35 },
    ];

    const kpiTable = [
        { metric: "PlayerLoad", value: nf(Number(row.player_load ?? 0)) },
        { metric: "Distância total (km)", value: nf(Number(row.total_distance ?? 0) / 1000) },
        { metric: "Vel. média (km/h)", value: nf(Number(row.average_speed ?? 0)) },
        { metric: "Vel. máxima (km/h)", value: nf(Number(row.max_speed ?? 0)) },
        { metric: "HSR", value: nf(Number(row.hsr ?? 0)) },
        { metric: "Sprints", value: nf(Number(row.sprints ?? 0)) },
        { metric: "Acelerações expl.", value: nf(Number(row.num_acc_expl ?? 0)) },
        { metric: "Tempo de sessão (min)", value: nf(Number(row.time ?? 0) / 60) },
    ];

    const avg = Math.max(0, Number(row.average_speed ?? 0));
    const max = Math.max(0, Number(row.max_speed ?? 0));
    const filled = Math.min(avg, max);
    const remain = Math.max(max - filled, 0);
    const pct = max > 0 ? Math.min(100, (filled / max) * 100) : 0;

    const speedGauge = { avg, max, filled, remain, pct };

    return { velocityRanges, accHsrProgress, kpiTable, speedGauge };
}
