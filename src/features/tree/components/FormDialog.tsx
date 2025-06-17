import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormEvent, useState, ChangeEvent } from 'react';
import { AnyNode, isAsset, isDatapoint } from '../types';

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (node: AnyNode) => void;
  node: AnyNode;
}

export default function FormDialog({
  open,
  onClose,
  onSubmit,
  node,
}: FormDialogProps) {
  const [form, setForm] = useState<AnyNode>(node);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{node ? 'Edit Node' : 'Create Node'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            name="label"
            label="Label"
            value={form.label}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          {isAsset(form) && (
            <TextField
              required
              margin="dense"
              name="assetType"
              label="Asset Type"
              value={form.assetType}
              onChange={handleChange}
              fullWidth
              variant="standard"
            />
          )}
          {isDatapoint(form) && (
            <>
              <TextField
                required
                margin="dense"
                name="value"
                label="Value"
                value={form.value}
                onChange={handleChange}
                fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                name="units"
                label="Units"
                value={form.units}
                onChange={handleChange}
                fullWidth
                variant="standard"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">{node ? 'Save' : 'Create'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
