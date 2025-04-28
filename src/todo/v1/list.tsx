import { Fragment } from "react";
import { Box, Button, Grid } from "@mui/material";

import { TodoEntry } from "./entry";
import { TodoAction, useTodoState, useTodoDispatch } from "./services";

export const TodoList = () => {
  const indices = useTodoState(state => state.map((_, i) => i));
  const dispatch = useTodoDispatch();
  return (
    <Grid
      container
      flexDirection="column"
      padding={theme => theme.spacing(1, 2)}
    >
      {indices.map(index => (
        <Fragment key={index}>
          <TodoEntry index={index} />
          <Divider />
        </Fragment>
      ))}
      <Button
        variant="contained"
        onClick={() => dispatch(TodoAction.userAddedItem())}
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
