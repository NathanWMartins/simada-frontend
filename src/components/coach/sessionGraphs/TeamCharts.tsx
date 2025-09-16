import {
    BarChart, Bar, LineChart, Line,
    CartesianGrid, XAxis, YAxis, Tooltip as RTooltip, Legend,
    ResponsiveContainer, ScatterChart, Scatter, ZAxis,
    ComposedChart, Area
} from "recharts";
import { Box, useTheme } from "@mui/material";
import { ChartCard } from "./ChartCard";
import { KpiPanel } from "./KpiPanel";
import type { TeamCharts as TeamChartsType } from "../../../types/sessionGraphsType";

export const TeamCharts: React.FC<{ data: TeamChartsType }> = ({ data }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const GREEN = "#2CAE4D";

    return (
        <>
            {/* Row 1 */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <ChartCard
                    title="Total Distance per Athlete (km)"
                    info="Total distance covered by each athlete in this session. Use it to spot workload outliers and how volume is distributed across the squad."
                >
                    <Box sx={{ width: "100%", overflowX: "auto", overflowY: "hidden"}}>
                        <Box sx={{ minWidth: 1000 }}>
                            <ResponsiveContainer width="100%" height={270}>
                                <BarChart data={data.distanceByAthlete} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="athlete" interval={0} tick={{ fontSize: 12 }} tickMargin={10} />
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
                                    <Bar dataKey="km" name="km" fill={GREEN} maxBarSize={48} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>
                </ChartCard>

                <ChartCard
                    title="Sprints per Athlete"
                    info="Number of sprint efforts per athlete. Higher values indicate more high-intensity bouts and neuromuscular load."
                >
                    <Box sx={{ width: "100%", overflowX: "auto", overflowY: "hidden"}}>
                        <Box sx={{ minWidth: 1000 }}>
                            <ResponsiveContainer width="100%" height={270}>
                                <BarChart data={data.sprintsByAthlete} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="athlete" interval={0} tick={{ fontSize: 12 }} tickMargin={10} />
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
                                    <Bar dataKey="sprints" name="sprints" fill={GREEN} maxBarSize={48} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>
                </ChartCard>
            </Box>

            {/* Row 2 */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <ChartCard
                    title="HSR per Athlete"
                    info="High-Speed Running (HSR) volume per athlete (distance above the HSR threshold defined in your backend). Good proxy for metabolic stress."
                >
                    <Box sx={{ width: "100%", overflowX: "auto",overflowY: "hidden"}}>
                        <Box sx={{ minWidth: 1000 }}>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={data.hsrByAthlete} barCategoryGap="20%">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="athlete" interval={0} tick={{ fontSize: 12 }} tickMargin={10} />
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
                                    <Bar dataKey="hsr" name="HSR" fill={GREEN} maxBarSize={48} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>
                </ChartCard>

                <ChartCard
                    title="Explosive Accelerations by Athlete"
                    info="Count of explosive accelerations per athlete. Useful to monitor mechanical load and change-of-pace demands."
                >
                    <Box sx={{ width: "100%", overflowX: "auto", overflowY: "hidden"}}>
                        <Box sx={{ minWidth: 1000 }}>
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={data.accByAthlete} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="athlete" interval={0} tick={{ fontSize: 12 }} tickMargin={10} />
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
                                    <Line type="monotone" dataKey="num_acc_expl" name="accelerations" stroke={GREEN} strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>
                </ChartCard>
            </Box>

            {/* Row 3 */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <ChartCard
                    title="Avg Speed per Athlete (km/h)"
                    info="Average speed achieved by each athlete during the session. Compare pacing profiles across the team."
                >
                    <Box sx={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}>
                        <Box sx={{ minWidth: 900 }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data.avgSpeedByAthlete} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="athlete" interval={0} tick={{ fontSize: 12 }} tickMargin={10} />
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
                                    <Bar dataKey="avg" name="avg speed" fill={GREEN} maxBarSize={48} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>
                </ChartCard>

                <ChartCard
                    title="Max Speed per Athlete (km/h)"
                    info="Peak speed each athlete reached. Helpful to track speed exposure and readiness for high-velocity demands."
                >
                    <Box sx={{ width: "100%", overflowX: "auto", overflowY: "hidden"}}>
                        <Box sx={{ minWidth: 1000 }}>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={data.maxSpeedByAthlete}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="athlete" interval={0} tick={{ fontSize: 12 }} tickMargin={10} />
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
                                    <Bar dataKey="max_speed" name="max speed" fill={GREEN} maxBarSize={48} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>
                </ChartCard>
            </Box>

            {/* Row 4 */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <ChartCard
                    title="Velocity Zones per Athlete (stacked)"
                    info="Distribution of distance by velocity ranges (VR1–VR6) for each athlete. Taller stacks indicate more total volume; darker greens represent faster ranges."
                >
                    <Box sx={{ width: "100%", overflowX: "auto", overflowY: "hidden"}}>
                        <Box sx={{ minWidth: 900 }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data.velocityZonesByAthlete} barGap={2}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="athlete" interval={0} tick={{ fontSize: 12 }} tickMargin={10} />
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
                                    <Bar dataKey="vr1" stackId="vz" name="VR1" fill="#4caf50" />
                                    <Bar dataKey="vr2" stackId="vz" name="VR2" fill="#43a047" />
                                    <Bar dataKey="vr3" stackId="vz" name="VR3" fill="#388e3c" />
                                    <Bar dataKey="vr4" stackId="vz" name="VR4" fill="#2e7d32" />
                                    <Bar dataKey="vr5" stackId="vz" name="VR5" fill="#1b5e20" />
                                    <Bar dataKey="vr6" stackId="vz" name="VR6" fill="#0d3b12" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>
                </ChartCard>

                <ChartCard
                    title="Distance vs Avg Speed (bubble: PlayerLoad)"
                    info="Scatter plot of Distance (x) vs Avg Speed (y). Bubble size encodes PlayerLoad. Hover to see the athlete’s name and exact values."
                >
                    <Box sx={{ width: "100%" }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" dataKey="km" name="Distance (km)" />
                                <YAxis type="number" dataKey="avg" name="Avg speed (km/h)" />
                                <ZAxis type="number" dataKey="pl" range={[60, 200]} name="PlayerLoad" />
                                <RTooltip
                                    cursor={{ strokeDasharray: "3 3" }}
                                    content={({ active, payload }) => {
                                        if (!active || !payload || payload.length === 0) return null;
                                        const p = payload[0].payload as { athlete: string; km: number; avg: number; pl: number };
                                        return (
                                            <div
                                                style={{
                                                    background: isDark ? theme.palette.background.paper : "#fff",
                                                    color: theme.palette.text.primary,
                                                    border: `1px solid ${theme.palette.divider}`,
                                                    borderRadius: 8,
                                                    padding: "8px 12px",
                                                    boxShadow: isDark ? "0 6px 18px rgba(0,0,0,.5)" : "0 6px 18px rgba(0,0,0,.12)",
                                                }}
                                            >
                                                <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.athlete}</div>
                                                <div>Avg speed: {p.avg.toFixed(2)} km/h</div>
                                                <div>Distance: {p.km.toFixed(2)} km</div>
                                                <div>PlayerLoad: {Math.round(p.pl)}</div>
                                            </div>
                                        );
                                    }}
                                />
                                <Legend />
                                <Scatter data={data.perfScatter} name="Athletes" fill={GREEN} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </Box>
                </ChartCard>

                <ChartCard
                    title="Distance (Bar) + Avg Speed (Line) + PlayerLoad (Area)"
                    info="Composed chart with two y-axes: bars show distance (left axis), the green line shows average speed, and the shaded area shows PlayerLoad (right axis)."
                >
                    <Box sx={{ width: "100%" }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={data.perfComposed} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="athlete" interval={0} tick={{ fontSize: 12 }} tickMargin={10} />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
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
                                <Bar yAxisId="left" dataKey="km" name="km" fill={theme.palette.text.secondary} maxBarSize={36} />
                                <Line yAxisId="right" dataKey="avg" name="avg (km/h)" stroke="#2CAE4D" dot={false} strokeWidth={2} />
                                <Area yAxisId="right" dataKey="pl" name="PlayerLoad" stroke="#2CAE4D" fill="#2CAE4D" fillOpacity={0.18} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </Box>
                </ChartCard>

                <ChartCard
                    title="Pareto — Distance per Athlete + Cumulative %"
                    info="Athletes sorted by distance (bars). The green line shows the cumulative percentage. Helps identify the few players contributing most of the volume (80/20 rule)."
                >
                    <Box sx={{ width: "100%" }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={data.cumulativeDistance} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="athlete" interval={0} tick={{ fontSize: 12 }} tickMargin={10} />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
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
                                <Bar yAxisId="left" dataKey="km" name="km" fill={theme.palette.text.secondary} maxBarSize={36} />
                                <Line yAxisId="right" dataKey="cumPct" name="Cumulative %" stroke="#2CAE4D" dot={false} strokeWidth={2} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </Box>
                </ChartCard>

                <ChartCard
                    title="HSR vs PlayerLoad (bubble: Accelerations)"
                    info="Scatter of HSR (x) vs PlayerLoad (y). Bubble size represents explosive accelerations. Use it to find profiles with high metabolic load, high mechanical load, or both."
                >
                    <Box sx={{ width: "100%" }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" dataKey="hsr" name="HSR" />
                                <YAxis type="number" dataKey="pl" name="PlayerLoad" />
                                <ZAxis type="number" dataKey="acc" range={[60, 200]} name="Acc Explosive" />
                                <RTooltip
                                    cursor={{ strokeDasharray: "3 3" }}
                                    content={({ active, payload }) => {
                                        if (!active || !payload?.length) return null;
                                        const p = payload[0].payload as { athlete: string; hsr: number; pl: number; acc: number };
                                        return (
                                            <div style={{
                                                background: isDark ? theme.palette.background.paper : "#fff",
                                                color: theme.palette.text.primary,
                                                border: `1px solid ${theme.palette.divider}`, borderRadius: 8, padding: "8px 12px"
                                            }}>
                                                <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.athlete}</div>
                                                <div>HSR: {p.hsr.toFixed(2)}</div>
                                                <div>PlayerLoad: {Math.round(p.pl)}</div>
                                                <div>Acc. Explosive: {Math.round(p.acc)}</div>
                                            </div>
                                        );
                                    }}
                                />
                                <Legend />
                                <Scatter data={data.hsrVsPLScatter} name="Athletes" fill="#2CAE4D" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </Box>
                </ChartCard>

                <KpiPanel rows={data.kpiTable} />
            </Box>
        </>
    );
};
