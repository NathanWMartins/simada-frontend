import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button, MenuItem, Alert, CircularProgress } from "@mui/material";
import { completeInvite, fetchInvite } from "../../../services/auth/invite";

const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

export default function InviteSignup() {
    const [params] = useSearchParams(); const token = params.get("invite") || "";
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [inv, setInv] = useState<{ email: string, trainerName: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState(""); const [password, setPassword] = useState("");
    const [phone, setPhone] = useState(""); const [birth, setBirth] = useState("");
    const [position, setPosition] = useState("");

    useEffect(() => {
        (async () => {
            if (!token) { setError("Missing invite token"); setLoading(false); return; }
            try { const data = await fetchInvite(token); setInv(data); }
            catch (e: any) { setError(e?.response?.data?.message || "Invalid or expired invite."); }
            finally { setLoading(false); }
        })();
    }, [token]);

    const submit = async () => {
        try {
            await completeInvite({ token, name, password, phone, birth, position });
            navigate("/athlete-login");
        } catch (e: any) {
            setError(e?.response?.data?.message || "Failed to complete signup.");
        }
    };

    if (loading) return <Box sx={{ display: "grid", placeItems: "center", minHeight: "50vh" }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ display: "grid", placeItems: "center", minHeight: "50vh" }}><Alert severity="error">{error}</Alert></Box>;

    return (
        <Box sx={{ display: "grid", placeItems: "center", minHeight: "100vh", px: 2 }}>
            <Paper sx={{ p: 3, borderRadius: 3, width: "100%", maxWidth: 520 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Create your athlete account</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>Invited by <b>{inv?.trainerName}</b></Typography>

                <TextField label="Email" value={inv?.email || ""} fullWidth size="small" sx={{ mb: 2 }} InputProps={{ readOnly: true }} />
                <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth size="small" sx={{ mb: 2 }} />
                <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth size="small" sx={{ mb: 2 }} />
                <TextField label="Phone" value={phone} onChange={e => setPhone(e.target.value)} fullWidth size="small" sx={{ mb: 2 }} />
                <TextField label="Birth" type="date" value={birth} onChange={e => setBirth(e.target.value)} fullWidth size="small" sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
                <TextField select label="Position" value={position} onChange={e => setPosition(e.target.value)} fullWidth size="small" sx={{ mb: 2 }}>
                    <MenuItem value="">—</MenuItem>
                    {POSITIONS.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </TextField>

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Button onClick={() => navigate("/login")}>Cancel</Button>
                    <Button variant="contained" color="success" onClick={submit} disabled={!name || !password}>Create account</Button>
                </Box>
            </Paper>
        </Box>
    );
}
