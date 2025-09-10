import { Box, Button, MenuItem, TextField, InputAdornment, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { AthletePosition, Athletes, UpdateAthletePayload } from "../../../types/athleteType";

const POSITIONS: AthletePosition[] = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
const DOMINANT_FEET = ["Left", "Right", "Both"] as const;
const INJURY_STATUS = ["Healthy", "Injured", "Rehab"] as const;

const toNumberOrNull = (s: string) => {
    if (s === "" || s == null) return null;
    const n = Number(String(s).replace(",", "."));
    return Number.isFinite(n) ? n : null;
};
const clampNN = (v: number | null) => (v != null && v < 0 ? 0 : v);
const round1 = (v: number) => Math.round(v * 10) / 10;

type Props = {
    initial: Athletes;
    saving?: boolean;
    onCancel: () => void;
    onSubmit: (values: UpdateAthletePayload) => Promise<void> | void;
};

export default function AthleteForm({ initial, saving, onCancel, onSubmit }: Props) {
    const theme = useTheme();

    const toDateInput = (iso: string) => {
        const d = new Date(iso);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    const [values, setValues] = useState<UpdateAthletePayload>({
        name: initial.name,
        email: initial.email ?? "",
        phone: initial.phone ?? "",
        birth: toDateInput(initial.birth),
        position: initial.position ?? null,
        // sem notes aqui
        extra: {
            height_cm: initial.extra?.height_cm ?? null,
            weight_kg: initial.extra?.weight_kg ?? null,
            lean_mass_kg: initial.extra?.lean_mass_kg ?? null,
            fat_mass_kg: initial.extra?.fat_mass_kg ?? null,
            body_fat_pct: initial.extra?.body_fat_pct ?? null,
            dominant_foot: initial.extra?.dominant_foot ?? null,
            nationality: initial.extra?.nationality ?? null,
            injury_status: initial.extra?.injury_status ?? null,
        },
    });

    const [errors, setErrors] = useState<Partial<Record<keyof UpdateAthletePayload, string>>>({});

    // flags para preferir valores manuais de lean/fat/pct
    const [manualLean, setManualLean] = useState(false);
    const [manualFat, setManualFat] = useState(false);
    const [manualPct, setManualPct] = useState(false);

    const setField = <K extends keyof UpdateAthletePayload>(k: K, v: UpdateAthletePayload[K]) =>
        setValues(prev => ({ ...prev, [k]: v }));

    const setExtra = <
        K extends keyof NonNullable<UpdateAthletePayload["extra"]>
    >(k: K, v: NonNullable<UpdateAthletePayload["extra"]>[K]) =>
        setValues(prev => ({ ...prev, extra: { ...(prev.extra ?? {}), [k]: v } }));

    const validate = () => {
        const e: typeof errors = {};
        if (!values.name?.trim()) e.name = "Required";
        if (!values.birth) e.birth = "Required";

        const ex = values.extra ?? {};
        const nonNeg = ["height_cm", "weight_kg", "lean_mass_kg", "fat_mass_kg", "body_fat_pct"] as const;
        for (const k of nonNeg) {
            const v = ex[k];
            if (v != null && v < 0) e[k as unknown as keyof UpdateAthletePayload] = "Must be >= 0";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const recalcFromWeightPct = (weight: number | null, pct: number | null) => {
        if (weight != null && weight > 0 && pct != null && pct >= 0 && pct <= 100) {
            if (!manualFat || !manualLean) {
                const fat = round1(weight * (pct / 100));
                const lean = round1(weight - fat);
                if (!manualFat) setExtra("fat_mass_kg", clampNN(fat)!);
                if (!manualLean) setExtra("lean_mass_kg", clampNN(lean)!);
            }
        }
    };

    const recalcFromMasses = (weight: number | null, lean: number | null, fat: number | null) => {
        if (!manualPct && weight != null && weight > 0) {
            const fatKnown = fat != null ? fat : (lean != null ? weight - lean : null);
            if (fatKnown != null && fatKnown >= 0) {
                const pct = round1((fatKnown / weight) * 100);
                setExtra("body_fat_pct", clampNN(pct)!);
            }
        }
    };

    const onChangeWeight = (raw: string) => {
        const weight = clampNN(toNumberOrNull(raw));
        setExtra("weight_kg", weight);
        recalcFromWeightPct(weight, values.extra?.body_fat_pct ?? null);
    };

    const onChangePct = (raw: string) => {
        const pct = clampNN(toNumberOrNull(raw));
        setExtra("body_fat_pct", pct);
        setManualPct(true);
        recalcFromWeightPct(values.extra?.weight_kg ?? null, pct);
    };

    const onChangeLean = (raw: string) => {
        const lean = clampNN(toNumberOrNull(raw));
        setExtra("lean_mass_kg", lean);
        setManualLean(true);

        const weight = values.extra?.weight_kg ?? null;
        let fat = values.extra?.fat_mass_kg ?? null;

        if (weight != null && !manualFat && lean != null) {
            const calcFat = round1(weight - lean);
            fat = clampNN(calcFat)!;
            setExtra("fat_mass_kg", fat);
        }

        recalcFromMasses(weight, lean, fat);
    };

    const onChangeFat = (raw: string) => {
        const fat = clampNN(toNumberOrNull(raw));
        setExtra("fat_mass_kg", fat);
        setManualFat(true);

        const weight = values.extra?.weight_kg ?? null;

        if (weight != null && !manualLean && fat != null) {
            const calcLean = round1(weight - fat);
            setExtra("lean_mass_kg", clampNN(calcLean)!);
        }

        recalcFromMasses(weight, values.extra?.lean_mass_kg ?? null, fat);
    };

    const submit = async () => {
        if (!validate()) return;
        await onSubmit(values);
    };

    const tfSx = {
        "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
        },
    } as const;

    return (
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
            {/* Cabeçalho */}
            <Typography variant="subtitle1">Edit Athlete</Typography>
            <Typography variant="body2" sx={{ textAlign: "right" }}>
                Changes affect only this athlete profile.
            </Typography>

            <TextField
                label="Name"
                value={values.name ?? ""}
                onChange={(e) => setField("name", e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                size="small"
                sx={tfSx}
            />
            <TextField
                select
                label="Position"
                value={values.position ?? ""}
                onChange={(e) => setField("position", (e.target.value || null) as AthletePosition | null)}
                size="small"
                sx={tfSx}
            >
                <MenuItem value="">—</MenuItem>
                {POSITIONS.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>

            {/* Email | Phone */}
            <TextField
                label="Email"
                value={values.email ?? ""}
                onChange={(e) => setField("email", e.target.value)}
                size="small"
                sx={tfSx}
            />
            <TextField
                label="Phone"
                value={values.phone ?? ""}
                onChange={(e) => setField("phone", e.target.value)}
                size="small"
                sx={tfSx}
            />

            {/* Birth | Nationality */}
            <TextField
                label="Birth"
                type="date"
                value={values.birth ?? ""}
                onChange={(e) => setField("birth", e.target.value)}
                InputLabelProps={{ shrink: true }}
                error={!!errors.birth}
                helperText={errors.birth}
                size="small"
                sx={tfSx}
            />
            <TextField
                label="Nationality"
                value={values.extra?.nationality ?? ""}
                onChange={(e) => setExtra("nationality", e.target.value || null)}
                size="small"
                sx={tfSx}
            />

            {/* Dominant Foot | Injury Status */}
            <TextField
                select
                label="Dominant Foot"
                value={values.extra?.dominant_foot ?? ""}
                onChange={(e) => setExtra("dominant_foot", (e.target.value || null) as "Left" | "Right" | "Both" | null)}
                size="small"
                sx={tfSx}
            >
                <MenuItem value="">—</MenuItem>
                {DOMINANT_FEET.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </TextField>
            <TextField
                select
                label="Injury Status"
                value={values.extra?.injury_status ?? ""}
                onChange={(e) => setExtra("injury_status", (e.target.value || null) as "Healthy" | "Injured" | "Rehab" | null)}
                size="small"
                sx={tfSx}
            >
                <MenuItem value="">—</MenuItem>
                {INJURY_STATUS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>

            <Box sx={{ gridColumn: "1 / -1", mt: 1, mb: 0 }}>
                <Divider />
            </Box>

            {/* Body Composition */}
            <Typography variant="subtitle1">Body Composition</Typography>
            <Box />

            <TextField
                label="Height"
                type="number"
                value={values.extra?.height_cm ?? ""}
                onChange={(e) => setExtra("height_cm", clampNN(toNumberOrNull(e.target.value)))}
                size="small"
                InputProps={{ endAdornment: <InputAdornment position="end">cm</InputAdornment>, inputProps: { min: 0, step: "0.1" } }}
                sx={tfSx}
            />
            <TextField
                label="Weight"
                type="number"
                value={values.extra?.weight_kg ?? ""}
                onChange={(e) => onChangeWeight(e.target.value)}
                size="small"
                InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment>, inputProps: { min: 0, step: "0.1" } }}
                sx={tfSx}
            />

            <TextField
                label="Lean Mass"
                type="number"
                value={values.extra?.lean_mass_kg ?? ""}
                onChange={(e) => onChangeLean(e.target.value)}
                size="small"
                InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment>, inputProps: { min: 0, step: "0.1" } }}
                sx={tfSx}
            />
            <TextField
                label="Fat Mass"
                type="number"
                value={values.extra?.fat_mass_kg ?? ""}
                onChange={(e) => onChangeFat(e.target.value)}
                size="small"
                InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment>, inputProps: { min: 0, step: "0.1" } }}
                sx={tfSx}
            />

            <TextField
                label="Body Fat"
                type="number"
                value={values.extra?.body_fat_pct ?? ""}
                onChange={(e) => onChangePct(e.target.value)}
                size="small"
                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment>, inputProps: { min: 0, step: "0.1" } }}
                sx={tfSx}
            />
            <Box />

            {/* Ações */}
            <Box sx={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
                <Button color="inherit" onClick={onCancel} disabled={!!saving}>Cancel</Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={async () => {
                        const ex = values.extra ?? {};
                        setValues(prev => ({
                            ...prev,
                            extra: {
                                ...ex,
                                height_cm: clampNN(ex.height_cm ?? null),
                                weight_kg: clampNN(ex.weight_kg ?? null),
                                lean_mass_kg: clampNN(ex.lean_mass_kg ?? null),
                                fat_mass_kg: clampNN(ex.fat_mass_kg ?? null),
                                body_fat_pct: clampNN(ex.body_fat_pct ?? null),
                                dominant_foot: ex.dominant_foot ?? null,
                                nationality: (ex.nationality ?? "") === "" ? null : ex.nationality,
                                injury_status: ex.injury_status ?? null,
                            }
                        }));
                        await submit();
                    }}
                    disabled={!!saving}
                >
                    {saving ? "Saving..." : "Save"}
                </Button>
            </Box>
        </Box>
    );
}
