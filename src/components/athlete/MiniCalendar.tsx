import { Box, Stack, Typography, Tooltip, useTheme } from "@mui/material";

type Marker = { dateISO: string; type: "game" | "training"; label: string };

export default function MiniCalendar({ markers = [] as Marker[] }) {
    const theme = useTheme();
    const base = new Date(); base.setDate(1);
    const year = base.getFullYear(), month = base.getMonth();

    // agrupa eventos por dia
    const byDay = new Map<string, Marker[]>();
    for (const m of markers) {
        const d = new Date(m.dateISO);
        const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString();
        const list = byDay.get(key) ?? [];
        list.push(m);
        byDay.set(key, list);
    }

    const startDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = Array.from({ length: startDay + daysInMonth }).map((_, i) => (i < startDay ? null : i - startDay + 1));
    const todayStr = new Date().toDateString();

    const colorFor = (t?: "game" | "training") =>
        t === "game"
            ? (theme.palette.mode === "dark" ? "error.dark" : "error.light")
            : t === "training"
                ? (theme.palette.mode === "dark" ? "success.dark" : "success.light")
                : "transparent";

    const CELL = 40;
    const OPTICAL_Y = 1;

    return (
        <Box>
            {/* cabeçalho */}
            <Stack direction="row" spacing={0.5} sx={{ mb: 0.5 }}>
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d =>
                    <Typography
                        key={d}
                        variant="caption"
                        color="text.secondary"
                        sx={{ width: CELL, textAlign: "center" }}
                    >
                        {d}
                    </Typography>
                )}
            </Stack>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    width: 7 * CELL + 6 * 4,
                }}
            >
                {cells.map((day, idx) => {
                    const date = day ? new Date(year, month, day) : null;
                    const key = date ? date.toDateString() : "";
                    const events = day ? (byDay.get(key) ?? []) : [];
                    const hasEvents = events.length > 0;
                    // prioridade de cor se tiver mais de um tipo no mesmo dia (game > training)
                    const firstType = hasEvents
                        ? (events.some(e => e.type === "game") ? "game" as const : "training" as const)
                        : undefined;

                    const isToday = date ? key === todayStr : false;

                    const cell = (
                        <Box
                            sx={{
                                width: CELL, height: CELL, borderRadius: 1, boxSizing: "border-box",
                                display: "grid", placeItems: "center",
                                bgcolor: day ? colorFor(firstType) : "transparent",
                                border: day
                                    ? (isToday ? `1px solid ${theme.palette.success.main}` : `1px solid ${theme.palette.divider}`)
                                    : "none",
                                color: "text.primary",
                                opacity: day ? 1 : 0,
                                cursor: hasEvents ? "pointer" : "default",
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    transform: `translateY(${OPTICAL_Y}px)`,
                                    lineHeight: 1,
                                    fontSize: theme.typography.caption.fontSize,
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {day ?? ""}
                            </Box>
                        </Box>
                    );

                    // se o dia tem eventos, envolve no Tooltip
                    return hasEvents ? (
                        <Tooltip
                            key={idx}
                            arrow
                            placement="top"
                            enterDelay={150}
                            title={
                                <Box sx={{ px: 0.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, display: "block", mb: 0.5 }}>
                                        {date?.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" })}
                                    </Typography>
                                    {events.map((e, i) => (
                                        <Typography key={i} variant="caption" sx={{ display: "block" }}>
                                            {e.label}
                                        </Typography>
                                    ))}
                                </Box>
                            }
                        >
                            {cell}
                        </Tooltip>
                    ) : (
                        <Box key={idx}>{cell}</Box>
                    );
                })}
            </Box>

            {/* legenda */}
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Legend swatch={colorFor("game")} label="Game" />
                <Legend swatch={colorFor("training")} label="Training" />
            </Stack>
        </Box>
    );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
    return (
        <Stack direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: swatch, border: theme => `1px solid ${theme.palette.divider}` }} />
            <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Stack>
    );
}
