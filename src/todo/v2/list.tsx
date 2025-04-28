import { Fragment } from "react";
import { Box, Button, Grid } from "@mui/material";

import { useTodoState } from "./services";
import { TodoEntry } from "./entry";

export const TodoList = () => {
  const {items, api} = useTodoState();
  return (
    <Grid
      container
      flexDirection="column"
      padding={theme => theme.spacing(1, 2)}
    >
      {items.map(it => (
        <Fragment key={it.id}>
          <TodoEntry item={it} onDelete={api.removeTodo} />
          <Divider />
        </Fragment>
      ))}
      <Button
        variant="contained"
        onClick={() => api.addTodo()}
      >
        Add Item
      </Button>
    </Grid>
  );
};

const Divider: React.FC = () => (
  <Box
    margin={theme => theme.spacing(1.5, 0)}
    sx={{ height: "1px", backgroundColor: "darkgray" }}
  />
);
