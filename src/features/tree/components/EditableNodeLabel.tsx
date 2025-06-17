import { useState, ChangeEvent, FormEvent } from 'react';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

type EditableNodeLabelProps = {
  value: string;
  onUpdate: (label: string) => Promise<void>;
  onDelete: () => Promise<void>;
};

export default function EditableNodeLabel({
  value,
  onUpdate,
  onDelete,
}: EditableNodeLabelProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [label, setLabel] = useState<string>(value);

  const toggleIsEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
  };

  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await onUpdate(label);
      setIsEditing(false);
    } catch {
      setLabel(value);
    }
  };

  const handleDelete = (event: FormEvent) => {
    event.preventDefault();
    onDelete();
  };

  return (
    <>
      {!isEditing && (
        <>
          <b>{label}</b>
          <EditIcon onClick={toggleIsEditing} fontSize="small" />
        </>
      )}
      {isEditing && (
        <>
          <TextField
            name="label"
            value={label}
            onChange={handleLabelChange}
            required
            size="small"
          />
          <DoneIcon onClick={handleUpdate} fontSize="small" />
        </>
      )}
      <ClearIcon onClick={handleDelete} fontSize="small" />
    </>
  );
}
