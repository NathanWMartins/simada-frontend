import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HeaderHomeTrainer from "../../../components/header/HeaderHomeTrainer";
import { SwitchLightDarkMode } from "../../../components/common";

export default function NewSession() {
  const theme = useTheme();

  // estado local básico (a lógica depois você integra com backend)
  const [sessionType, setSessionType] = useState("");
  const [title, setTitle] = useState("");
  const [athletes, setAthletes] = useState<number | string>("");
  const [date, setDate] = useState("");
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");

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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 3,
            }}
          >
            {/* Coluna esquerda */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Create your Session
              </Typography>

              <TextField
                select
                label="Session Type"
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                  },
                }}
              >
                <MenuItem value="training">Training</MenuItem>
                <MenuItem value="game">Game</MenuItem>
              </TextField>

              <TextField
                label="Number of Athletes"
                type="number"
                value={athletes}
                onChange={(e) => setAthletes(e.target.value)}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                  },
                }}
              />

              <TextField
                label="Score"
                placeholder="0 - 0"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                  },
                }}
              />
            </Box>

            {/* Coluna direita */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 2, textAlign: "right" }}>
                After creating your session, you can import the CSV spreadsheet with player data.
              </Typography>

              <TextField
                label="Title"
                placeholder="Match/Session Title (e.g., Brazil x Argentina)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                  },
                }}
              />

              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                  },
                }}
              />

              <TextField
                label="Session Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={3}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Botão */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1db954",
                "&:hover": { backgroundColor: "#17a24a" },
                borderRadius: 2,
                px: 4,
                color: "white"
              }}
            >
              Add Session
            </Button>
          </Box>
        </Paper>
      </Box>
      <SwitchLightDarkMode />
    </Box>
  );
}
