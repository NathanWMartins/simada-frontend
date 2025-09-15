import React from "react";
import { KpiPanel } from "./KpiPanel";
import { Box, useTheme } from "@mui/system";
import { ChartCard } from "./ChartCard";
import { Area, AreaChart, Tooltip as RTooltip, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { AthleteCharts as AthleteChartsType } from "../../../types/sessionGraphsType";

export const AthleteCharts: React.FC<{ data: AthleteChartsType; athleteName?: string }> = ({ data, athleteName }) => {
    const PIE_COLORS = ["#4caf50", "#43a047", "#388e3c", "#2e7d32", "#1b5e20", "#0d3b12"];
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const GREEN = "#2CAE4D";
    const GREY = "#D0D5DD";

    return (
        <>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <ChartCard
                    title={`Max Speed Utilization (${athleteName || "Athlete"})`}
                    info={
                        "Shows how much of the athlete’s top speed was used on average in this session. " +
                        "Green arc = average speed; Grey arc = the remaining gap to max speed. " +
                        "The percentage equals Avg / Max × 100."
                    }
                >
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: "avg", value: data.speedGauge?.filled ?? 0 },
                                    { name: "rest", value: data.speedGauge ? (data.speedGauge.max - (data.speedGauge.filled ?? 0)) : 0 },
                                ]}
                                dataKey="value"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={60}
                                outerRadius={90}
                                stroke="none"
                            >
                                <Cell fill={GREEN} />
                                <Cell fill={GREY} />
                            </Pie>
                            <Legend
                                formatter={(v) => v === "avg" ? "Avg speed" : "Max – Avg"}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {data.speedGauge && (
                        <Box sx={{ textAlign: "center", mt: 0 }}>
                            <Box sx={{ fontSize: 22, fontWeight: 700, color: GREEN }}>
                                {data.speedGauge.pct.toFixed(0)}%
                            </Box>
                            <Box sx={{ fontSize: 12, color: "text.secondary" }}>
                                {`Avg ${data.speedGauge.avg.toFixed(1)} / Max ${data.speedGauge.max.toFixed(1)} km/h`}
                            </Box>
                        </Box>
                    )}
                </ChartCard>

                <ChartCard title={`VR1–VR6 Distribution (${athleteName || "Atleta"})`}
                    info={
                        "Distance covered per velocity range (VR1 = slowest … VR6 = fastest). " +
                        "Use it to inspect how training load was distributed across intensities."
                    }>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={data.velocityRanges}
                                dataKey="distance"
                                nameKey="zone"
                                innerRadius={60}
                                outerRadius={90}
                                label
                            >
                                {data.velocityRanges.map((_, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="ACC / HSR throughout the session"
                    info={
                        "Session timeline split into thirds. Green areas show cumulative High-Speed Running (HSR) " +
                        "and Explosive Accelerations (ACC). Helps identify when mechanical/metabolic load peaked."
                    }>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={data.accHsrProgress} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis />
                            <RTooltip
                                contentStyle={{
                                    backgroundColor: isDark ? theme.palette.background.paper : "#fff",
                                    color: theme.palette.text.primary,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 8,
                                    boxShadow: isDark ? "0 6px 18px rgba(0,0,0,.5)" : "0 6px 18px rgba(0,0,0,.12)",
                                }}
                                labelStyle={{ color: GREEN }}
                                itemStyle={{ color: theme.palette.text.primary }}
                                formatter={(value: number, name: string) => [value.toFixed(2), name]}
                            />
                            <Legend />
                            <Area type="monotone" dataKey="acc" name="acelerações" fill="#1e7a35ff" />
                            <Area type="monotone" dataKey="hsr" name="HSR" fill="#2CAE4D" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <KpiPanel rows={data.kpiTable} />
            </Box>
        </>
    );
}