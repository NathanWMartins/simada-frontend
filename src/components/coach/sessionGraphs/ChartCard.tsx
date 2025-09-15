import * as React from "react";
import { Card, CardContent, Box, Typography, IconButton, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

type ChartCardProps = {
    title: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
    children: React.ReactNode;
};

export const ChartCard: React.FC<ChartCardProps> = ({ title, icon, info, children }) => {
    return (
        <Card sx={{ flex: 1, minWidth: 360 }}>
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="subtitle1">{title}</Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {icon}
                        {info && (
                            <Tooltip
                                title={info}
                                arrow
                                enterTouchDelay={0}
                                placement="left"
                            >
                                <IconButton size="small" aria-label="chart info" sx={{ ml: 0.5 }}>
                                    <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>

                <Box sx={{ mb: 1, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }} />
                {children}
            </CardContent>
        </Card>
    );
};
