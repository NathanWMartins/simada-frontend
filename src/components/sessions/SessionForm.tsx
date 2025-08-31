import { Box, Button, MenuItem, Typography } from "@mui/material";
import SessionField from "../../components/common/SessionField";
import { useState } from "react";
import type { SessionType, UpdateSessionPayload } from "../../types/sessionType";

type Props = {
    initial: UpdateSessionPayload;
    saving?: boolean;
    onCancel: () => void;
    onSubmit: (values: UpdateSessionPayload) => Promise<void> | void;
};

export default function SessionForm({ initial, saving, onCancel, onSubmit }: Props) {
    const [values, setValues] = useState<UpdateSessionPayload>(initial);
    const [errors, setErrors] = useState<{ [K in keyof UpdateSessionPayload]?: string }>({});

    const set = <K extends keyof UpdateSessionPayload>(k: K, v: UpdateSessionPayload[K]) =>
        setValues(prev => ({ ...prev, [k]: v }));

    const validate = () => {
        const e: typeof errors = {};
        if (!values.type) e.type = "Required";
        if (!values.title?.trim()) e.title = "Required";
        if (!values.date) e.date = "Required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submit = async () => {
        if (!validate()) return;
        await onSubmit(values);
    };


    return (
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
            {/* linha 1 */}
            <Typography variant="subtitle1">Edit Session</Typography>
            <Typography variant="body2" sx={{ textAlign: "right" }}>
                Changes affect only this session. Metrics are not altered.
            </Typography>

            {/* linha 2: type | title */}
            <SessionField
                color="success"
                select
                label="Session Type"
                value={values.type}
                onChange={(e) => set("type", e.target.value as SessionType)}
                error={!!errors.type}
                helperText={errors.type}
            >
                <MenuItem value="Training">Training</MenuItem>
                <MenuItem value="Game">Game</MenuItem>
            </SessionField>

            <SessionField
                label="Title"
                color="success"
                placeholder="Match/Session Title (e.g., Brazil x Argentina)"
                value={values.title}
                onChange={(e) => set("title", e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
            />

            {/* linha 3: date | location */}
            <SessionField
                label="Date"
                color="success"
                type="date"
                value={values.date}
                onChange={(e) => set("date", e.target.value)}
                InputLabelProps={{ shrink: true }}
                error={!!errors.date}
                helperText={errors.date}
            />

            <SessionField
                label="Location"
                color="success"
                placeholder="Training Center A"
                value={values.location ?? ""}
                onChange={(e) => set("location", e.target.value)}
            />

            {/* linha 4: score | notes */}
            <SessionField
                label="Score"
                color="success"
                placeholder="0 - 0"
                value={values.score ?? ""}
                onChange={(e) => set("score", e.target.value)}
            />

            <SessionField
                label="Session Notes"
                color="success"
                value={values.description ?? ""}
                onChange={(e) => set("description", e.target.value)}
                multiline
                rows={4}
                tall
            />

            {/* ações */}
            <Box sx={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button color="inherit" onClick={onCancel} disabled={!!saving}>Cancel</Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={submit}
                    disabled={!!saving}
                >
                    {saving ? "Saving..." : "Save"}
                </Button>
            </Box>
        </Box>
    );
}
