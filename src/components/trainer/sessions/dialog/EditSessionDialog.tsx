import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import SessionForm from "../SessionForm";
import { UpdateSessionPayload } from "../../../../types/sessionType";

type Props = {
  open: boolean;
  initial: UpdateSessionPayload;
  onClose: () => void;
  onSave: (payload: UpdateSessionPayload) => Promise<void>;
  saving?: boolean;
};

export default function EditSessionDialog({ open, initial, onClose, onSave, saving }: Props) {
  return (
    <Dialog open={open} onClose={() => !saving && onClose()} fullWidth maxWidth="md">
      <DialogTitle>Edit session</DialogTitle>
      <DialogContent dividers>
        <SessionForm initial={initial} onCancel={onClose} onSubmit={onSave} saving={saving} />
      </DialogContent>
    </Dialog>
  );
}
