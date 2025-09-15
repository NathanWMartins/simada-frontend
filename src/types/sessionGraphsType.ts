export type Athlete = {
    id: number;
    name: string;
    position?: string | null;
    jerseyNumber?: number | null;
    avatarUrl?: string | null;
};


export type MetricsRow = {
    id: number;
    id_athlete: number;
    player?: string | null;
    date?: string | null;
    total_distance?: number | null;
    sprints?: number | null;
    num_acc_expl?: number | null;
    average_speed?: number | null;
    player_load?: number | null;
    hsr?: number | null;
    max_speed?: number | null;
    distance_vrange1?: number | null;
    distance_vrange2?: number | null;
    distance_vrange3?: number | null;
    distance_vrange4?: number | null;
    distance_vrange5?: number | null;
    distance_vrange6?: number | null;
    time?: number | null;
};


export type TeamCharts = {
    distanceByAthlete: Array<{ athlete: string; km: number }>;
    sprintsByAthlete: Array<{ athlete: string; sprints: number }>;
    accByAthlete: Array<{ athlete: string; num_acc_expl: number }>;
    avgSpeedByAthlete: Array<{ athlete: string; avg: number }>;
    maxSpeedByAthlete: Array<{ athlete: string; max_speed: number }>;
    playerLoadByAthlete: Array<{ athlete: string; pl: number }>;
    hsrByAthlete: Array<{ athlete: string; hsr: number }>;
    velocityZonesByAthlete: Array<{
        athlete: string;
        vr1: number;
        vr2: number;
        vr3: number;
        vr4: number;
        vr5: number;
        vr6: number;
    }>;
    perfScatter: Array<{
        athlete: string;
        km: number;
        avg: number;
        pl: number;
        hsr: number;
    }>;
    perfComposed: Array<{ athlete: string; km: number; avg: number; pl: number }>;
    cumulativeDistance: Array<{ athlete: string; km: number; cumPct: number }>;
    hsrVsPLScatter: Array<{ athlete: string; hsr: number; pl: number; acc: number }>;
    kpiTable: Array<{ metric: string; value: string; change?: number | null }>;
};


export type AthleteCharts = {
  velocityRanges: Array<{ zone: string; distance: number }>;
  accHsrProgress: Array<{ label: string; acc: number; hsr: number }>;
  kpiTable: Array<{ metric: string; value: string }>;
  speedGauge?: {
    avg: number;
    max: number;
    filled: number;
    remain: number;
    pct: number;
  };
};
