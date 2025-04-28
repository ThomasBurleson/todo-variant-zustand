import { memo } from "react";

import { Grid, IconButton, MenuItem, Select, TextField } from "@mui/material";
import { Delete, Note } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";

import { ItemStatus, TodoItem } from "./services";

export type TodoEntryProps = { item: TodoItem; onDelete: (id: string) => void};

type StatusProps = { status: ItemStatus, onStatusChange: (val:ItemStatus) => void };
type SleepProps = { untilDate: Date | null, onSleepChange: (until: Date | null) => void };
type TitleProps = { title: string, onTitleChange: (val: string) => void };

export const TodoEntry: React.FC<TodoEntryProps> = 
  memo(({item, onDelete}) => {
    const updateStatus = async (val: ItemStatus) => {
      await item.updateStatus(val);
      alert('Done')
    }
    return (
      <Grid container alignItems="center" item width="100%">
        <Grid item>
          <Status status={item.status} onStatusChange={item.updateStatus} />
        </Grid>
        <Grid item>
          <SleepUntil untilDate={item.sleepUntil} onSleepChange={item.sleep} />
        </Grid>
        <Grid item flex={1}>
          <Title title={item.title} onTitleChange={item.updateTitle} />
        </Grid>
        <Grid item>
          <ViewNotes item={item} />
          <IconButton onClick={() => onDelete(item.id)} >
            <Delete />
          </IconButton>
        </Grid>
      </Grid>
    );
  });

const Status: React.FC<StatusProps> = ({ status, onStatusChange}) => {
  return (
    <Select
      autoWidth
      size="small"
      value={status}
      onChange={s => onStatusChange(s.target.value as ItemStatus)}
    >
      <MenuItem value="todo">Todo</MenuItem>
      <MenuItem value="onHold">On Hold</MenuItem>
      <MenuItem value="sleep">Sleep</MenuItem>
      <MenuItem value="done">Done</MenuItem>
    </Select>
  );
};


const SleepUntil: React.FC<SleepProps> = ({ untilDate, onSleepChange }) => {
  return untilDate ? (
    <DatePicker
      slotProps={{ textField: { size: "small" } }}
      sx={theme => ({ width: theme.spacing(20) })}
      value={untilDate}
      onChange={onSleepChange}
    /> 
  ) : null;
};

const Title: React.FC<TitleProps> = ({ title, onTitleChange }) => {
  return (
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      placeholder={`Title Required`}
      value={title}
      onChange={e => onTitleChange(e.target.value || '')}
    />
  );
};

const ViewNotes: React.FC<{ item: TodoItem }> = () => {
  return (
    <>
      <IconButton>
        <Note />
      </IconButton>
    </>
  );
};
