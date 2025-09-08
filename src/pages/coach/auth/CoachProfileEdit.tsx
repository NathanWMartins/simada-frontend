import { useEffect, useMemo, useState } from "react";
import {
    Alert, Avatar, Box, Button, Chip, CircularProgress, MenuItem,
    Paper, Snackbar, Stack, TextField, Typography, useTheme
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useUserContext } from "../../../contexts/UserContext";
import { getCoachProfile, updateCoachProfile, uploadCoachAvatar } from "../../../services/coach/coachService";
import { CoachProfile } from "../../../types/coachType";
import HeaderHomeCoach from "../../../components/header/HeaderHomeCoach";
import { SwitchLightDarkMode } from "../../../components/common";

export default function CoachProfileEdit() {
    const theme = useTheme();
    const isLight = theme.palette.mode === "light";
    const { user, setUser } = useUserContext();
    const coachId = useMemo(() => Number(user?.id ?? 0), [user?.id]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; severity: "success" | "error"; message: string }>({
        open: false, severity: "success", message: ""
    });

    const [form, setForm] = useState<CoachProfile>({
        id: coachId, name: "", email: "",
        gender: "", team: "", phone: "", photoUrl: ""
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!coachId) return;
        (async () => {
            try {
                setLoading(true);
                const data = await getCoachProfile(coachId);
                if (data) {
                    setForm({
                        id: data.id,
                        name: data.name ?? "",
                        email: data.email ?? "",
                        gender: data.gender ?? "",
                        team: data.team ?? "",
                        phone: data.phone ?? "",
                        photoUrl: data.photoUrl ?? ""
                    });
                    setAvatarPreview(data.photoUrl ?? null);
                    if (user && data.photoUrl && user.userPhoto !== data.photoUrl) {
                        setUser({ ...user, userPhoto: data.photoUrl });
                    }
                }
            } catch (e: any) {
                setSnackbar({ open: true, severity: "error", message: e?.response?.data?.message ?? "Falha ao carregar perfil." });
            } finally {
                setLoading(false);
            }
        })();
    }, [coachId]);

    useEffect(() => {
        return () => {
            if (avatarPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    // Handlers
    const setField = (k: keyof CoachProfile) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [k]: e.target.value }));

    const handlePickAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setAvatarFile(f);
        const url = URL.createObjectURL(f);
        setAvatarPreview(url);
    };

    const validate = () => {
        if (!form.name?.trim()) return "Full Name is required.";
        if (!form.email?.trim()) return "Email is required.";
        return null;
    };

    const handleSave = async () => {
        const err = validate();
        if (err) { setSnackbar({ open: true, severity: "error", message: err }); return; }

        try {
            setSaving(true);

            let photoUrl = form.photoUrl ?? undefined;

            if (avatarFile) {
                const uploaded = await uploadCoachAvatar(coachId, avatarFile);
                photoUrl = uploaded?.photoUrl ?? photoUrl;
            }

            await updateCoachProfile(coachId, { ...form, photoUrl });

            setForm((prev) => ({ ...prev, photoUrl: photoUrl ?? null }));
            if (photoUrl) {
                setAvatarPreview(`${photoUrl}?t=${Date.now()}`);
            }

            if (user) {
                setUser({
                    ...user,
                    userPhoto: photoUrl ?? user.userPhoto ?? null,
                });
            }

            setSnackbar({ open: true, severity: "success", message: "Profile updated successfully." });
            setAvatarFile(null);
        } catch (e: any) {
            setSnackbar({ open: true, severity: "error", message: e?.response?.data?.message ?? "Failed to save profile." });
        } finally {
            setSaving(false);
        }
    };

    const handleCloseSnackbar = () => setSnackbar(s => ({ ...s, open: false }));

    return (
        <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: "100vh" }}>
            <HeaderHomeCoach />

            <Box sx={{ px: 8, pt: 4, pb: 8 }}>
                {/* Barra verde topo */}
                <Paper elevation={4} sx={{ position: "relative", mb: 2, borderRadius: 3, overflow: "hidden", bgcolor: "transparent" }}>
                    <Box sx={{
                        px: 2.5, py: 1.5, display: "flex", alignItems: "center",
                        background: "linear-gradient(90deg, #1db954 0%, #17a24a 50%, #12903f 100%)",
                    }}>
                        <Typography variant="h6" fontWeight={700} color="#fff">Edit Profile</Typography>
                    </Box>
                </Paper>

                {/* Conteúdo principal */}
                <Paper elevation={4} sx={{ borderRadius: 3, p: 4, bgcolor: theme.palette.background.default, maxWidth: 1500, mx: "auto" }}>
                    {loading ? (
                        <Stack alignItems="center" sx={{ py: 6 }}>
                            <CircularProgress />
                        </Stack>
                    ) : (
                        <Box
                            sx={{
                                display: "grid",
                                columnGap: 3,
                                rowGap: 3,
                                alignItems: "start",
                                gridTemplateColumns: "340px 1fr",
                                gridTemplateAreas: `
                  "left titleR"
                  "left form"
                  "left button"
                `,
                                ["@media (max-width:900px)"]: {
                                    gridTemplateColumns: "1fr",
                                    gridTemplateAreas: `
                    "left"
                    "titleR"
                    "form"
                    "button"
                  `
                                }
                            }}
                        >
                            {/* Coluna esquerda: Avatar + info curta */}
                            <Stack spacing={2} sx={{ gridArea: "left" }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar src={avatarPreview ?? undefined} sx={{ width: 96, height: 96 }}>
                                        {form.name?.[0]?.toUpperCase()}
                                    </Avatar>
                                    <Stack spacing={0.5}>
                                        <Typography variant="subtitle1" fontWeight={800}>{form.name || "—"}</Typography>
                                        <Typography variant="body2" color="text.secondary">{form.email || "—"}</Typography>
                                        <Chip size="small" label={"Trainer"} />
                                    </Stack>
                                </Stack>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<PhotoCamera />}
                                        color={isLight ? "success" : "inherit"}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Change Photo
                                        <input hidden accept="image/*" type="file" onChange={handlePickAvatar} />
                                    </Button>
                                    {avatarPreview && (
                                        <Button
                                            color={isLight ? "success" : "inherit"}
                                            variant="text"
                                            onClick={() => { setAvatarFile(null); setAvatarPreview(form.photoUrl ?? null); }}
                                        >
                                            Reset
                                        </Button>
                                    )}
                                </Stack>
                            </Stack>

                            {/* Título à direita (texto suporte) */}
                            <Typography variant="body2" sx={{ gridArea: "titleR", textAlign: { xs: "left", md: "right" } }}>
                                Keep your profile up to date. Your name, photo and team help athletes recognize you.
                            </Typography>

                            {/* Form em grid */}
                            <Box sx={{ gridArea: "form", display: "grid", columnGap: 3, rowGap: 2.5, gridTemplateColumns: "1fr 1fr" }}>
                                <ProfileField label="Full Name" placeholder="Your Full Name" value={form.name} onChange={setField("name")} />
                                <ProfileField label="Email" placeholder="Your Email" value={form.email} onChange={setField("email")} />

                                <ProfileField label="Gender" select value={form.gender} onChange={setField("gender")}>
                                    <MenuItem value="">—</MenuItem>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </ProfileField>

                                <ProfileField label="Team" placeholder="Your Team" value={form.team} onChange={setField("team")} />
                                <ProfileField label="Phone" placeholder="+55 11 9 9999-9999" value={form.phone} onChange={setField("phone")} />
                            </Box>

                            {/* Botão salvar */}
                            <Box sx={{ gridArea: "button", display: "flex", justifyContent: "center", mt: 1 }}>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: "#1db954", "&:hover": { backgroundColor: "#17a24a" }, borderRadius: 2, px: 4, color: "white" }}
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%", whiteSpace: "pre-line" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <SwitchLightDarkMode />
        </Box>
    );
}

function ProfileField(props: any & { tall?: boolean }) {
    const { tall, sx, ...rest } = props;
    return (
        <TextField
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            {...rest}
            sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                "& .MuiFormHelperText-root": { minHeight: 20 },
                ...(tall ? { alignSelf: "stretch" } : {}),
                ...sx
            }}
        />
    );
}
