import { Alert, Typography } from "@mui/material";

export default function EmptyOrError({ error, empty }: { error?: string | null; empty?: boolean }) {
  if (error) return <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>{error}</Alert>;
  if (empty) return <Typography sx={{ mt: 3, textAlign: "center" }} color="text.secondary">No athletes found.</Typography>;
  return null;
}
