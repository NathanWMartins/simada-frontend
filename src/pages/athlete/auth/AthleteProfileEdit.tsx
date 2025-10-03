import { useEffect, useMemo, useState } from "react";
import {
    Alert, Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, MenuItem,
    Paper, Snackbar, Stack, TextField, Typography, useTheme
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useUserContext } from "../../../contexts/UserContext";
import { AthleteProfile } from "../../../types/athleteType";
import HeaderHomeAthlete from "../../../components/header/HeaderHomeAthlete";
import { SwitchLightDarkMode } from "../../../components/common";
import { deleteAthleteAccount, getAthleteProfile, updateAthletePassword, updateAthleteProfile, uploadAthleteAvatar } from "../../../services/athlete/athleteService";
import { useNavigate } from "react-router-dom";
import { DeleteForever } from "@mui/icons-material";

export default function AthleteProfileEdit() {
    const theme = useTheme();
    const isLight = theme.palette.mode === "light";
    const { user, setUser } = useUserContext();
    const athleteId = useMemo(() => Number(user?.id ?? 0), [user?.id]);
    const navigate = useNavigate();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [deleting, setDeleting] = useState(false);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savingPwd, setSavingPwd] = useState(false);

    const [snackbar, setSnackbar] = useState<{ open: boolean; severity: "success" | "error"; message: string }>({
        open: false, severity: "success", message: ""
    });

    const [form, setForm] = useState<AthleteProfile>({
        id: athleteId, name: "", email: "", gender: "", phone: "", nationality: "", photoUrl: ""
    });

    // avatar local
    const MAX_BYTES = 500_000;
    const ALLOWED = new Set(["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"]);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // senha
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (!athleteId) return;
        (async () => {
            try {
                setLoading(true);
                const data = await getAthleteProfile(athleteId);
                setForm(data);
                setAvatarPreview(data.photoUrl ?? null);

                // atualiza foto no contexto global se mudou
                if (user && data.photoUrl && user.userPhoto !== data.photoUrl) {
                    setUser({ ...user, userPhoto: data.photoUrl });
                }
            } catch (e: any) {
                setSnackbar({
                    open: true,
                    severity: "error",
                    message: e?.response?.data?.message ?? "Falha ao carregar perfil do atleta."
                });
            } finally {
                setLoading(false);
            }
        })();
    }, [athleteId]);

    useEffect(() => {
        return () => {
            if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
        };
    }, [avatarPreview]);

    const setField = (k: keyof AthleteProfile) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [k]: e.target.value }));

    const handlePickAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        if (!ALLOWED.has(f.type)) {
            setSnackbar({ open: true, severity: "error", message: `Tipo de imagem não suportado: ${f.type || "desconhecido"}` });
            e.target.value = "";
            return;
        }
        if (f.size > MAX_BYTES) {
            setSnackbar({ open: true, severity: "error", message: `Imagem acima do limite de ${Math.floor(MAX_BYTES / 1024)} KB.` });
            e.target.value = "";
            return;
        }

        setAvatarFile(f);

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = String(reader.result || "");
            setAvatarPreview(dataUrl);
            setForm(prev => ({ ...prev, photoUrl: dataUrl }));
        };
        reader.readAsDataURL(f);

        e.target.value = "";
    };

    const validateProfile = () => {
        if (!form.name?.trim()) return "Full Name is required.";
        return null;
    };

    const validatePassword = () => {
        if (!newPassword && !currentPassword && !confirmPassword) return null;
        if (!currentPassword) return "Current password is required.";
        if (newPassword.length < 6) return "New password must be at least 6 characters.";
        if (newPassword !== confirmPassword) return "Password confirmation does not match.";
        return null;
    };

    const handleSaveProfile = async () => {
        const err = validateProfile();
        if (err) { setSnackbar({ open: true, severity: "error", message: err }); return; }

        try {
            setSaving(true);

            let photoUrl = form.photoUrl ?? undefined;
            if (avatarFile) {
                const uploaded = await uploadAthleteAvatar(athleteId, avatarFile);
                photoUrl = uploaded?.photoUrl ?? photoUrl;
            }

            await updateAthleteProfile(athleteId, {
                name: form.name,
                gender: form.gender,
                phone: form.phone,
                nationality: form.nationality,
                photoUrl, 
            });

            setForm(prev => ({ ...prev, photoUrl: photoUrl ?? null }));
            if (photoUrl) setAvatarPreview(photoUrl);

            if (user) {
                setUser({
                    ...user,
                    userPhoto: photoUrl ?? user.userPhoto ?? null,
                    name: form.name || user.name,
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


    const openDeleteDialog = () => {
        setConfirmText("");
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!athleteId) return;
        try {
            setDeleting(true);
            await deleteAthleteAccount(athleteId);

            localStorage.clear();
            if (user) setUser(null as any);

            setSnackbar({ open: true, severity: "success", message: "Account deleted successfully." });

            navigate("/", { replace: true });
        } catch (e: any) {
            setSnackbar({
                open: true,
                severity: "error",
                message: e?.response?.data?.message ?? "Failed to delete account."
            });
        } finally {
            setDeleting(false);
            setConfirmOpen(false);
        }
    };

    const handleSavePassword = async () => {
        const perr = validatePassword();
        if (perr) { setSnackbar({ open: true, severity: "error", message: perr }); return; }
        if (!newPassword) return;

        try {
            setSavingPwd(true);
            await updateAthletePassword(athleteId, currentPassword, newPassword);
            setSnackbar({ open: true, severity: "success", message: "Password changed successfully." });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (e: any) {
            setSnackbar({ open: true, severity: "error", message: e?.response?.data?.message ?? "Failed to change password." });
        } finally {
            setSavingPwd(false);
        }
    };

    const handleCloseSnackbar = () => setSnackbar(s => ({ ...s, open: false }));

    return (
        <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: "100vh" }}>
            <HeaderHomeAthlete />

            <Box sx={{ px: 8, pt: 4, pb: 8 }}>
                {/* Barra topo */}
                <Paper elevation={4} sx={{ position: "relative", mb: 2, borderRadius: 3, overflow: "hidden", bgcolor: "transparent" }}>
                    <Box sx={{
                        px: 2.5, py: 1.5, display: "flex", alignItems: "center",
                        background: "linear-gradient(90deg, #1db954 0%, #17a24a 50%, #12903f 100%)",
                    }}>
                        <Typography variant="h6" fontWeight={700} color="#fff">Edit Profile</Typography>
                    </Box>
                </Paper>

                {/* Conteúdo */}
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
                "left pwd"
                "left button"
              `,
                                ["@media (max-width:900px)"]: {
                                    gridTemplateColumns: "1fr",
                                    gridTemplateAreas: `
                  "left"
                  "titleR"
                  "form"
                  "pwd"
                  "button"
                `
                                }
                            }}
                        >
                            {/* Coluna esquerda: Avatar + info curta */}
                            <Stack spacing={3} sx={{ gridArea: "left" }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar src={avatarPreview ?? form.photoUrl ?? undefined} sx={{ width: 96, height: 96 }}>
                                        {form.name?.[0]?.toUpperCase()}
                                    </Avatar>
                                    <Stack spacing={0.5}>
                                        <Typography variant="subtitle1" fontWeight={800}>{form.name || "—"}</Typography>
                                        <Typography variant="body2" color="text.secondary">{form.email || "—"}</Typography>
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

                            {/* Texto auxiliar */}
                            <Typography variant="body2" sx={{ gridArea: "titleR", textAlign: { xs: "left", md: "right" } }}>
                                Keep your information up to date. Physical data (weight, height, etc.) are managed by your coach.
                            </Typography>

                            {/* Form principal (dados pessoais) */}
                            <Box sx={{ gridArea: "form", display: "grid", columnGap: 3, rowGap: 2.5, gridTemplateColumns: "1fr 1fr" }}>
                                <ProfileField label="Full Name" placeholder="Your Full Name" value={form.name} onChange={setField("name")} />
                                <TextField
                                    label="Email"
                                    value={form.email}
                                    InputLabelProps={{ shrink: true }}
                                    size="small"
                                    fullWidth
                                    disabled
                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                />

                                <ProfileField label="Gender" select value={form.gender ?? ""} onChange={setField("gender")}>
                                    <MenuItem value="">—</MenuItem>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </ProfileField>

                                <ProfileField label="Phone" placeholder="+55 11 9 9999-9999" value={form.phone ?? ""} onChange={setField("phone")} />
                                <ProfileField label="Nationality" placeholder="Brazil, Spain, ..." value={form.nationality ?? ""} onChange={setField("nationality")} />
                            </Box>

                            {/* Alterar senha (opcional) */}
                            <Box sx={{ gridArea: "pwd", mt: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>Change Password (optional)</Typography>
                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
                                    <TextField
                                        label="Current Password"
                                        type="password"
                                        size="small"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <TextField
                                        label="New Password"
                                        type="password"
                                        size="small"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <TextField
                                        label="Confirm New Password"
                                        type="password"
                                        size="small"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleSavePassword}
                                        disabled={savingPwd}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {savingPwd ? "Saving..." : "Save Password"}
                                    </Button>
                                </Box>
                            </Box>

                            {/* Botões */}
                            <Box sx={{ gridArea: "button", display: "flex", justifyContent: "center", mt: 1, gap: 2, flexWrap: "wrap", ml: "auto" }}>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: "#1db954", "&:hover": { backgroundColor: "#17a24a" }, borderRadius: 2, px: 4, color: "white" }}
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteForever />}
                                    onClick={openDeleteDialog}
                                    sx={{ borderRadius: 2, px: 3 }}
                                    disabled={deleting}
                                >
                                    Delete Account
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Box>

            {/* Dialog de confirmação de exclusão */}
            <Dialog open={confirmOpen} onClose={() => !deleting && setConfirmOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Delete account</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        This action is <b>irreversible</b>. All your sessions, metrics and related data will be permanently removed.
                        To confirm, type <b>DELETE</b> below and click Confirm.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        fullWidth
                        size="small"
                        label='Type "DELETE" to confirm'
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        disabled={deleting}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmDelete}
                        disabled={deleting || confirmText !== "DELETE"}
                    >
                        {deleting ? "Deleting..." : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>

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
