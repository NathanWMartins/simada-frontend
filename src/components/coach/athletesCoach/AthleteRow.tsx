import { Avatar, Box, IconButton, Skeleton, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Athletes } from "../../../types/athleteType";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteDialog from "../../dialog/ConfirmDelete";
import { useState } from "react";
import { SmartToy } from "@mui/icons-material";

type Props = {
    athlete?: Athletes;
    formatDate: (iso: string) => string;
    onDelete?: (id: number) => Promise<void> | void;
};

export default function AthleteRow({ athlete, formatDate, onDelete }: Props) {
    const a = athlete;
    const isSkeleton = !a;
    const navigate = useNavigate();
    const position = isSkeleton ? "" : ((a as any).position ?? "—");

    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <Box
            sx={(t) => ({
                display: "flex",
                alignItems: "center",
                px: 1.5,
                py: 1.25,
                mt: 1,
                borderRadius: 2,
                bgcolor: t.palette.background.paper,
                border: `1px solid ${t.palette.divider}`,
            })}
        >
            {/* name */}
            <Box sx={{ flex: 2, display: "flex", alignItems: "center", gap: 1.25 }}>
                {isSkeleton ? (
                    <>
                        <Skeleton variant="circular" width={28} height={28} />
                        <Skeleton variant="text" width={140} />
                    </>
                ) : (
                    <>
                        <Avatar src={a!.avatarUrl ?? undefined} sx={{ width: 28, height: 28 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {a!.name}
                        </Typography>
                    </>
                )}
            </Box>

            {/* position */}
            <Box sx={{ flex: 1.4, color: "text.secondary" }}>
                {isSkeleton ? <Skeleton variant="text" width={100} /> : position}
            </Box>

            {/* email */}
            <Box sx={{ flex: 2, color: "text.secondary" }}>
                {isSkeleton ? <Skeleton variant="text" width={180} /> : a!.email}
            </Box>

            {/* birth */}
            <Box sx={{ flex: 1.3, color: "text.secondary" }}>
                {isSkeleton ? <Skeleton variant="text" width={90} /> : formatDate(a!.birth)}
            </Box>

            {/* phone */}
            <Box sx={{ flex: 1.3, color: "text.secondary" }}>
                {isSkeleton ? <Skeleton variant="text" width={110} /> : (a!.phone || "—")}
            </Box>

            {/* actions */}
            <Box sx={{ width: 120, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                {isSkeleton ? (
                    <>
                        <Skeleton variant="circular" width={28} height={28} />
                        <Skeleton variant="circular" width={28} height={28} />
                        <Skeleton variant="circular" width={28} height={28} />
                    </>
                ) : (
                    <>
                        <Tooltip title="Analyze">
                            <IconButton size="small">
                                <SmartToy fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => navigate(`/athletes/${a!.id}/edit`)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => setConfirmOpen(true)}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Box>

            {/* Confirmar remoção */}
            {!isSkeleton && (
                <ConfirmDeleteDialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={async () => {
                        if (onDelete) {
                            await onDelete(a!.id);
                        }
                        setConfirmOpen(false);
                    }}
                    entity="athlete"
                    itemName={athlete?.name}
                />
            )}
        </Box>
    );
}
