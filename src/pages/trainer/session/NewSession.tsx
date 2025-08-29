import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HeaderHomeTrainer from "../../../components/header/HeaderHomeTrainer";
import { SwitchLightDarkMode } from "../../../components/common";
import { useUserContext } from "../../../contexts/UserContext";
import { SnackbarState } from "../../../types/types";
import { useNavigate } from "react-router-dom";
import SessionField from "../../../components/common/SessionField";
import { newSession } from "../../../services/trainer/session/sessionsService";

export default function NewSession() {
  const theme = useTheme();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const [sessionType, setSessionType] = useState("");
  const [title, setTitle] = useState("");
  const [athletes, setAthletes] = useState<number | string>("");
  const [date, setDate] = useState("");
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");

  const [errorSessionType, setErrorSessionType] = useState(false);
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorAthletes, setErrorAthletes] = useState(false);
  const [errorDate, setErrorDate] = useState(false);
  const [errorScore, setErrorScore] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "error",
  });

  const resetError = () => {
    setErrorSessionType(false);
    setErrorTitle(false);
    setErrorAthletes(false);
    setErrorDate(false);
    setErrorScore(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleNewSession = async () => {
    const errors: string[] = [];

    resetError();

    if (!sessionType) { errors.push("Session Type is required"); setErrorSessionType(true); }
    if (!title) { errors.push("Password is required"); setErrorTitle(true); }
    if (!athletes) { errors.push("Athletes is required"); setErrorAthletes(true); }
    if (!date) { errors.push("Date is required"); setErrorDate(true); }
    if (!score) { errors.push("Score is required"); setErrorScore(true); }

    if (errors.length > 0) {
      setSnackbar({
        open: true,
        message: errors.join("\n"),
        severity: "error",
      });
      return;
    }
    try {
      if (!user) return;

      const startISO = new Date(`${date}T00:00:00`).toISOString();

      const response = await newSession({
        trainerId: user.id,
        type: sessionType as "training" | "game",
        title: title.trim(),
        start: startISO,
        athletesCount: Number(athletes),
        score: sessionType === "game" ? (score?.trim() || null) : null,
        notes: notes?.trim() || null,
      });

      if (response.status === 200 || response.status === 201) {
        setSnackbar({
          open: true,
          message: "Session created successfully!",
          severity: "success",
        });
        navigate("/trainer-sessions");
      } else {
        setSnackbar({
          open: true,
          message: (response.data?.message as string) || "Error creating session",
          severity: "error",
        });
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error?.message || "Error creating session",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: "100vh" }}>
      <HeaderHomeTrainer />

      <Box sx={{ px: 8, pt: 4, pb: 8 }}>
        {/* Barra verde */}
        <Paper
          elevation={4}
          sx={{
            position: "relative",
            mb: 2,
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "transparent",
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              background:
                "linear-gradient(90deg, #1db954 0%, #17a24a 50%, #12903f 100%)",
            }}
          >
            <Typography variant="h6" fontWeight={700} color="#fff">
              + New Session
            </Typography>
          </Box>
        </Paper>

        {/* Formulário */}
        <Paper
          elevation={4}
          sx={{
            borderRadius: 3,
            p: 4,
            bgcolor: theme.palette.background.default,
            maxWidth: 1500,
            mx: "auto",
          }}
        >
          {/* UM ÚNICO GRID: 2 colunas, itens aos pares */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: 3,
              rowGap: 3,
              alignItems: "start",
            }}
          >
            {/* Linha 1: títulos */}
            <Typography variant="subtitle1">Create your Session</Typography>
            <Typography variant="body2" sx={{ textAlign: "right" }}>
              After creating your session, you can import the CSV spreadsheet with player data.
            </Typography>

            {/* Linha 2: Session Type | Title */}
            <SessionField
              select
              label="Session Type"
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              error={errorSessionType}
              helperText={errorSessionType ? "Required field" : ""}
              FormHelperTextProps={{ sx: { minHeight: 20 } }}
            >
              <MenuItem value="training">Training</MenuItem>
              <MenuItem value="game">Game</MenuItem>
            </SessionField>

            <SessionField
              label="Title"
              placeholder="Match/Session Title (e.g., Brazil x Argentina)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errorTitle}
              helperText={errorTitle ? "Required field" : ""}
              FormHelperTextProps={{ sx: { minHeight: 20 } }}
            />

            {/* Linha 3: Number of Athletes | Date */}
            <SessionField
              label="Number of Athletes"
              type="text"
              restriction="onlyNumbers"
              value={String(athletes)}
              onChange={(e) => setAthletes(e.target.value)}
              error={errorAthletes}
              helperText={errorAthletes ? "Required field" : ""}
              FormHelperTextProps={{ sx: { minHeight: 20 } }}
            />

            <SessionField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={errorDate}
              helperText={errorDate ? "Required field" : ""}
              FormHelperTextProps={{ sx: { minHeight: 20 } }}
            />

            {/* Linha 4: Score | Notes (notes ocupa só a col 2) */}
            <SessionField
              label="Score"
              placeholder="0 - 0"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              error={errorScore}
              helperText={errorScore ? "Required field" : ""}
              FormHelperTextProps={{ sx: { minHeight: 20 } }}
            />

            <SessionField
              label="Session Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              rows={4}
              tall
            />

            {/* Linha 5: botão central ocupando as 2 colunas */}
            <Box sx={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", mt: 1 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1db954",
                  "&:hover": { backgroundColor: "#17a24a" },
                  borderRadius: 2,
                  px: 4,
                  color: "white",
                }}
                onClick={handleNewSession}
              >
                Add Session
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%", whiteSpace: "pre-line" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <SwitchLightDarkMode />
    </Box>
  );
}
