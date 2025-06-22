import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { SelectChangeEvent } from '@mui/material/Select';
import { FormEvent, useState, ChangeEvent, useCallback } from 'react';
import { AnyNode, isAsset, isDatapoint } from 'features/store/types';

const uuid = () => crypto.randomUUID();

enum NodeType {
  Node = 'Node',
  Asset = 'Asset',
  Datapoint = 'Datapoint',
}

type FormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (node: AnyNode) => void;
  node?: AnyNode; // editing existing node
  parentId?: string; // creating new node
  pathText?: string;
};

export default function FormDialog({
  open,
  onClose,
  onSubmit,
  node,
  parentId,
  pathText,
}: FormDialogProps) {
  const [form, setForm] = useState<AnyNode>(
    node ?? {
      id: uuid(),
      parentId: parentId ?? '',
      label: '',
    },
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
    onClose();
  };

  const handleNodeTypeSelected = useCallback(
    (e: SelectChangeEvent<NodeType>) => {
      // TODO consider adding AnyNode.type field
      switch (e.target.value) {
        case NodeType.Asset:
          setForm(prev => ({
            id: prev.id,
            parentId: prev.parentId,
            label: prev.label,
            assetType: '',
          }));
          break;
        case NodeType.Datapoint:
          setForm(prev => ({
            id: prev.id,
            parentId: prev.parentId,
            label: prev.label,
            value: '',
          }));
          break;
        default:
          setForm(prev => ({
            id: prev.id,
            parentId: prev.parentId,
            label: prev.label,
          }));
      }
    },
    [],
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {node ? `Edit Node (${pathText})` : `Create Node (in ${pathText})`}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {!node && (
            <FormControl fullWidth margin="dense">
              <InputLabel>Node Type</InputLabel>
              <Select
                label="Node Type"
                defaultValue={NodeType.Node}
                onChange={handleNodeTypeSelected}
              >
                {Object.values(NodeType).map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField
            autoFocus
            required
            margin="dense"
            name="label"
            value={form.label}
            onChange={handleChange}
            label="Label"
            placeholder="Label"
            fullWidth
            variant="standard"
          />
          {isAsset(form) && (
            <TextField
              required
              margin="dense"
              name="assetType"
              value={form.assetType}
              onChange={handleChange}
              label="Asset Type"
              placeholder="Asset Type"
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
                value={form.value}
                onChange={handleChange}
                label="Value"
                placeholder="Value"
                fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                name="units"
                value={form.units}
                onChange={handleChange}
                label="Units"
                placeholder="Units"
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
