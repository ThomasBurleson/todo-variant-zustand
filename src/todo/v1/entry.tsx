import { memo, useState } from "react";

import { matcher } from "variant";
import { Grid, IconButton, MenuItem, Select, TextField } from "@mui/material";
import { Delete, Note } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";

import { NotesDialog } from "./notes-dialog";
import { useTodoDispatch, useTodoState, TodoAction } from "./services";

export const TodoEntry: React.FC<{
  index: number;
}> = memo(({ index }) => {
  const dispatch = useTodoDispatch();
  return (
    <Grid container alignItems="center" item width="100%">
      <Grid item>
        <Status index={index} />
      </Grid>
      <Grid item>
        <SleepUntil index={index} />
      </Grid>
      <Grid item flex={1}>
        <Title index={index} />
      </Grid>
      <Grid item>
        <ViewNotes index={index} />
        <IconButton
          onClick={() => dispatch(TodoAction.userRemovedItem({ index }))}
        >
          <Delete />
        </IconButton>
      </Grid>
    </Grid>
  );
});

const Status: React.FC<{ index: number }> = ({ index }) => {
  const status = useTodoState(s => s[index].status.type);
  const dispatch = useTodoDispatch();
  return (
    <Select
      autoWidth
      value={status}
      size="small"
      onChange={s =>
        dispatch(
          TodoAction.userSelectedStatus({
            index,
            status: s.target.value as typeof status,
          })
        )
      }
    >
      <MenuItem value="todo">Todo</MenuItem>
      <MenuItem value="onHold">On Hold</MenuItem>
      <MenuItem value="sleep">Sleep</MenuItem>
      <MenuItem value="done">Done</MenuItem>
    </Select>
  );
};

const SleepUntil: React.FC<{ index: number }> = ({ index }) => {
  const untilDate = useTodoState(s =>
    matcher(s[index].status)
      .when(["sleep"], ({ until }) => until)
      .when(["todo", "onHold", "done"], () => undefined)
      .complete()
  );
  const dispatch = useTodoDispatch();
  if (untilDate === undefined) return <></>;
  return (
    <DatePicker
      slotProps={{ textField: { size: "small" } }}
      sx={theme => ({ width: theme.spacing(20) })}
      value={untilDate}
      onChange={date =>
        date && dispatch(TodoAction.userSetSleepUntilDate({ index, date }))
      }
    />
  );
};

const Title: React.FC<{ index: number }> = ({ index }) => {
  const title = useTodoState(s => s[index].title ?? "");
  const dispatch = useTodoDispatch();
  return (
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      placeholder={`Item ${index + 1}`}
      value={title}
      onChange={e =>
        dispatch(
          TodoAction.userEditedItemTitle({
            index,
            title: e.target.value || undefined,
          })
        )
      }
    />
  );
};

const ViewNotes: React.FC<{ index: number }> = ({ index }) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  return (
    <>
      <IconButton onClick={() => setDialogIsOpen(true)}>
        <Note />
      </IconButton>
      <NotesDialog
        isOpen={dialogIsOpen}
        itemIndex={index}
        onClose={() => setDialogIsOpen(false)}
      />
    </>
  );
};
