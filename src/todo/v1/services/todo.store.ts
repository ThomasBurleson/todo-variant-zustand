import { create } from "zustand";
import { devtools, redux } from "zustand/middleware";
import {
  initialTodoState,
  TodoAction,
  todoReducer,
  TodoState,
} from "./reducer";
import { useCallback } from "react";

const wrappedReducer = (
  { state }: { state: TodoState },
  action: TodoAction
) => ({
  state: todoReducer(state, action),
});

const useStore = create(
  devtools(redux(wrappedReducer, { state: initialTodoState }))
);

export const useTodoState = <Result>(selector: (state: TodoState) => Result) =>
  useStore(useCallback(({ state }) => selector(state), [selector]));

const selectDispatch = ({
  dispatch,
}: {
  dispatch: (a: TodoAction) => TodoAction;
}) => dispatch;
export const useTodoDispatch = () => useStore(selectDispatch);
