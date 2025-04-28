import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import { TodoAction, useTodoDispatch, useTodoState } from "./services";

export const NotesDialog: React.FC<{
  isOpen: boolean;
  itemIndex: number;
  onClose: () => void;
}> = ({ isOpen, itemIndex, onClose }) => {
  const [noteIndex, setNoteIndex] = useState<number>();
  const [showNewNote, setShowNewNote] = useState(false);
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      {noteIndex !== undefined ? (
        <ShowNote
          itemIndex={itemIndex}
          noteIndex={noteIndex}
          goBack={() => setNoteIndex(undefined)}
        />
      ) : showNewNote ? (
        <ShowNote itemIndex={itemIndex} goBack={() => setShowNewNote(false)} />
      ) : (
        <PickNote
          itemIndex={itemIndex}
          goToShowNote={ind => setNoteIndex(ind)}
          goToNewNote={() => setShowNewNote(true)}
        />
      )}
    </Dialog>
  );
};

const PickNote: React.FC<{
  itemIndex: number;
  goToShowNote: (index: number) => void;
  goToNewNote: () => void;
}> = ({ itemIndex, goToShowNote, goToNewNote }) => {
  const title = useTodoState(
    s => `Notes for ${s[itemIndex].title ?? `Item ${itemIndex + 1}`}`
  );
  const notes = useTodoState(s => s[itemIndex].notes);
  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container flexDirection="column" gap={2}>
          {notes.map((note, index) => (
            <Grid
              container
              item
              flexDirection="row"
              alignItems="center"
              key={index}
              wrap="nowrap"
            >
              <Grid item flex={1} minWidth={0}>
                <Typography
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  {note}
                </Typography>
              </Grid>
              <Grid item>
                <Button onClick={() => goToShowNote(index)}>Edit</Button>
              </Grid>
            </Grid>
          ))}
          <Button variant="contained" onClick={() => goToNewNote()}>
            Add Note
          </Button>
        </Grid>
      </DialogContent>
    </>
  );
};

const ShowNote: React.FC<{
  itemIndex: number;
  noteIndex?: number;
  goBack: () => void;
}> = ({ itemIndex, noteIndex, goBack }) => {
  const title = useTodoState(s => {
    const itemTitle = s[itemIndex].title ?? `Item ${itemIndex + 1}`;
    return noteIndex === undefined
      ? `New Note for ${itemTitle}`
      : `Note ${noteIndex + 1} for ${itemTitle}`;
  });
  const existingNote = useTodoState(s =>
    noteIndex !== undefined ? s[itemIndex].notes[noteIndex] : undefined
  );
  const dispatch = useTodoDispatch();
  const [text, setText] = useState(existingNote ?? "");
  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Grid
          container
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
          wrap="nowrap"
          flex={1}
        >
          <Grid item>
            {noteIndex !== undefined && (
              <Button
                onClick={() => {
                  dispatch(
                    TodoAction.userRemovedNote({ itemIndex, noteIndex })
                  );
                  goBack();
                }}
              >
                Delete
              </Button>
            )}
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                goBack();
              }}
            >
              {existingNote ? "Discard Changes" : "Discard"}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                dispatch(
                  noteIndex !== undefined
                    ? TodoAction.userEditedNote({
                        itemIndex,
                        noteIndex,
                        contents: text,
                      })
                    : TodoAction.userAddedNote({
                        itemIndex,
                        contents: text,
                      })
                );
                goBack();
              }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </>
  );
};
