import { useState, ChangeEvent, FormEvent } from 'react';
import useStyles from './styles';

export default function EditableNodeLabel(props: {
  id: string;
  label: string;
  onUpdate: (label: string) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const classes = useStyles();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [label, setLabel] = useState<string>(props.label);

  const toggleIsEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
  };

  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await props.onUpdate(label);
      setIsEditing(false);
    } catch {
      setLabel(props.label);
    }
  };

  const handleDelete = (event: FormEvent) => {
    event.preventDefault();
    props.onDelete();
  };

  return (
    <div className={classes.nodeItem}>
      {!isEditing && (
        <span>
          <span>{label}</span>
          <i className="fa fa-pencil" onClick={toggleIsEditing}></i>
        </span>
      )}
      {isEditing && (
        <span>
          <input
            name="label"
            value={label}
            onChange={handleLabelChange}
            required
          />
          <i className="fa fa-check" onClick={handleUpdate}></i>
        </span>
      )}
      <i className="fa fa-times" onClick={handleDelete}></i>
    </div>
  );
}
