import React, { useMemo, useState } from "react";
import { Alert, Box, Paper, Snackbar, Typography, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import HeaderHomeCoach from "../../../components/header/HeaderHomeCoach";
import { SwitchLightDarkMode } from "../../../components/common";
import { useUserContext } from "../../../contexts/UserContext";
import ImportCsvDialog from "../../../components/dialog/ImportCsvDialog";
import ConfirmDeleteDialog from "../../../components/dialog/ConfirmDelete";
import NotesDialog from "../../../components/dialog/NotesDialog";
import EditSessionDialog from "../../../components/dialog/EditSessionDialog";
import { useNavigate } from "react-router-dom";
import { UpdateSessionPayload } from "../../../types/sessionType";
import { useSessionsList, FilterType } from "../../../hooks/useSessionsList";
import { updateSession } from "../../../services/coach/session/metricsService";
import SessionsToolbar from "../../../components/coach/sessions/Toolbar";
import { FilterPopover } from "../../../components/coach";
import SessionRow from "../../../components/coach/sessions/Row";

export default function SessionsCoach() {
  const theme = useTheme();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const { sessions, loading, formatDate, importCsv, remove, saveNotes, setSessions } =
    useSessionsList(user?.id);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("All");
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);

  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  // dialogs: importar
  const [importOpen, setImportOpen] = useState(false);
  const [importCtx, setImportCtx] = useState<{ id: number; title: string } | null>(null);

  // dialogs: confirm removing
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmCtx, setConfirmCtx] = useState<{ id: number; title: string; has: boolean } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // dialogs: notes
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesCtx, setNotesCtx] = useState<{ id: number; title: string; value: string } | null>(null);
  const [notesLoading, setNotesLoading] = useState(false);

  // dialogs: edit session
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editInitial, setEditInitial] = useState<UpdateSessionPayload | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  // filtro + busca
  const filtered = useMemo(() => {
    const lower = search.trim().toLowerCase();
    return sessions.filter((s) => {
      const typeOk = filterType === "All" ? true : s.type === filterType;
      const textOk =
        !lower ||
        s.title.toLowerCase().includes(lower) ||
        (s.location ?? "").toLowerCase().includes(lower) ||
        (s.description ?? "").toLowerCase().includes(lower);
      return typeOk && textOk;
    });
  }, [sessions, search, filterType]);

  // handlers da linha
  const onEdit = (s: any) => {
    if (!s.has_metrics) {
      setImportCtx({ id: s.id, title: s.title });
      setImportOpen(true);
      return;
    }
    setEditId(s.id);
    const ymd = /^\d{4}-\d{2}-\d{2}$/.test(s.date)
      ? s.date
      : new Date(s.date).toISOString().slice(0, 10);

    setEditInitial({
      type: s.type,
      title: s.title,
      date: ymd,
      score: s.score ?? "",
      description: s.description ?? "",
      location: s.location ?? "",
    });
    setEditOpen(true);
  };

  const onInfo = (s: any) => {
    setNotesCtx({ id: s.id, title: s.title, value: s.description ?? "" });
    setNotesOpen(true);
  };

  const onDelete = (s: any) => {
    setConfirmCtx({ id: s.id, title: s.title, has: !!s.has_metrics });
    setConfirmOpen(true);
  };

  // salvar
  const handleSaveEdit = async (values: UpdateSessionPayload) => {
    if (!editId) return;
    try {
      setEditSaving(true);
      await updateSession(editId, values);

      // atualiza localmente
      setSessions((prev) =>
        prev.map((x) =>
          x.id === editId
            ? {
              ...x,
              type: values.type,
              title: values.title,
              date: values.date,
              score: values.score ?? null,
              description: values.description ?? null,
              location: values.location ?? null,
            }
            : x
        )
      );

      setSnack({ open: true, message: "Session updated successfully.", severity: "success" });
      setEditOpen(false);
      setEditId(null);
      setEditInitial(null);
    } catch (e: any) {
      setSnack({
        open: true,
        message: e?.response?.data?.message ?? "Failed updating session.",
        severity: "error",
      });
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.paper, minHeight: "100vh" }}>
      <HeaderHomeCoach />

      <Box sx={{ px: 8, pt: 4, pb: 8 }}>
        {/* barra topo */}
        <Paper
          elevation={4}
          sx={{ position: "relative", mb: 2, borderRadius: 3, overflow: "hidden", bgcolor: "transparent" }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "linear-gradient(90deg, #1db954 0%, #17a24a 50%, #12903f 100%)",
            }}
          >
            <Typography variant="h6" fontWeight={700} color="#fff">
              Sessions
            </Typography>
            <IconButton
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.25)" } }}
            >
              <AddIcon onClick={() => navigate("/coach-new-session")} />
            </IconButton>
          </Box>
        </Paper>

        {/* lista */}
        <Paper elevation={4} sx={{ borderRadius: 3, p: 2, bgcolor: theme.palette.background.default }}>
          <SessionsToolbar search={search} onSearch={setSearch} onOpenFilter={(e) => setFilterAnchor(e.currentTarget)} />

          <FilterPopover
            open={!!filterAnchor}
            anchorEl={filterAnchor}
            onClose={() => setFilterAnchor(null)}
            value={filterType}
            onChange={setFilterType}
          />

          {/* header */}
          <Box
            sx={(t) => ({
              display: "flex",
              alignItems: "center",
              px: 1.5,
              py: 1,
              borderRadius: 2,
              bgcolor: t.palette.background.paper,
              color: t.palette.text.secondary,
              fontSize: 13,
              fontWeight: 700,
            })}
          >
            <Box sx={{ flex: 0.9 }}>Task</Box>
            <Box sx={{ flex: 2.2 }}>Title</Box>
            <Box sx={{ flex: 1.3 }}>Athletes</Box>
            <Box sx={{ flex: 0.9, textAlign: "center" }}>Score</Box>
            <Box sx={{ flex: 1.2 }}>Date</Box>
            <Box sx={{ flex: 1 }}>Owner</Box>
            <Box sx={{ width: 120, textAlign: "right" }}>Actions</Box>
          </Box>

          {!loading && filtered.length === 0 && (
            <Typography sx={{ mt: 3, textAlign: "center" }} color="text.secondary">
              No sessions found.
            </Typography>
          )}

          {filtered.map((s) => (
            <SessionRow
              key={s.id}
              s={s}
              formatDate={formatDate}
              onInfo={onInfo}
              onEdit={onEdit}
              onDelete={onDelete}
              onNoMetrics={() =>
                setSnack({ open: true, message: "This session doesn't have metrics to visualize.", severity: "error" })
              }
              onPsyCreated={(sessionId, emails) => {
                setSessions(prev =>
                  prev.map(x => x.id === sessionId ? { ...x, has_psycho: true } : x)
                );
                setSnack({ open: true, message: `Formulário sent to ${emails.length} athlete(s).`, severity: "success" });
              }}
            />
          ))}

        </Paper>
      </Box>

      {/* Importar CSV */}
      <ImportCsvDialog
        open={importOpen}
        title={importCtx?.title}
        onClose={() => setImportOpen(false)}
        onDownloadTemplate={() => {
          const headers = [
            "session", "task", "date", "position", "dorsal", "player", "time", "total_distance",
            "minute_distance", "distance_vrange1", "distance_vrange2", "distance_vrange3", "distance_vrange4",
            "distance_vrange5", "distance_vrange6", "max_speed", "average_speed", "num_dec_expl", "max_dec",
            "num_acc_expl", "max_acc", "player_load", "hmld", "hmld_count", "hmld_relative", "hmld_time",
            "hid_intervals", "num_hids", "hsr", "sprints", "num_hsr", "time_vrange4", "rpe",
          ].join(";");

          const example = [
            "Partida x Time A;Total;2025-05-24;defender;2;Joao da Silva;784;5861,65;118,219;884,694;1066,515;1025,47;722,241;135,751;209,159;32,154;6,171;53;-7,186;51;4,513;200;980,234;183;29,348;4,27;2,018;15;339,117;11;15;2,41;7",
            "Partida x Time A;Total;2025-05-24;forward;10;Carlinhos;784;5861,65;118,219;884,694;1066,515;1025,47;722,241;135,751;209,159;32,154;6,171;53;-7,186;51;4,513;200;980,234;183;29,348;4,27;2,018;15;339,117;11;15;2,41;7",
          ].join("\n");

          const content = headers + "\n" + example;
          const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = `session_${importCtx?.id ?? "metrics"}_template.csv`;
          a.click();
          URL.revokeObjectURL(url);
        }}
        onImport={async (file) => {
          try {
            await importCsv(importCtx!.id, file);
            setSnack({
              open: true,
              message: "Métricas importadas com sucesso.",
              severity: "success",
            });
            setImportOpen(false);
          } catch (e: any) {
            console.error("Erro ao importar CSV", e);
            const backendMessage = e?.response?.data?.message || e?.response?.data?.error;
            setSnack({
              open: true,
              message: backendMessage ?? "Falha ao importar CSV.",
              severity: "error",
            });
          }
        }}
      />

      {/* Edit session */}
      {editInitial && (
        <EditSessionDialog
          open={editOpen}
          initial={editInitial}
          saving={editSaving}
          onClose={() => {
            setEditOpen(false);
            setEditId(null);
            setEditInitial(null);
          }}
          onSave={handleSaveEdit}
        />
      )}

      {/* Confirmar remoção */}
      <ConfirmDeleteDialog
        open={confirmOpen}
        loading={confirmLoading}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmLoading(true);
          try {
            await remove(confirmCtx!.id);
            setSnack({ open: true, message: "Session removed successfully.", severity: "success" });
          } catch {
            setSnack({ open: true, message: "Faile removing session.", severity: "error" });
          } finally {
            setConfirmLoading(false);
            setConfirmOpen(false);
          }
        }}
        entity="session"
        itemName={confirmCtx?.title}
        warningNote={confirmCtx?.has ? "Attention: this session has imported metrics." : undefined}
      />

      {/* Notas */}
      <NotesDialog
        open={notesOpen}
        title={notesCtx?.title}
        value={notesCtx?.value}
        loading={notesLoading}
        onClose={() => setNotesOpen(false)}
        onSave={async (text) => {
          setNotesLoading(true);
          try {
            await saveNotes(notesCtx!.id, text);
            setSnack({ open: true, message: "Notes saved successfully.", severity: "success" });
            setNotesOpen(false);
          } catch {
            setSnack({ open: true, message: "Faile saving notes.", severity: "error" });
          } finally {
            setNotesLoading(false);
          }
        }}
      />

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>

      <SwitchLightDarkMode />
    </Box>
  );
}
