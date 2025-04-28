import { fields, TypeNames, variantModule, VariantOf } from "variant";

export const TodoItemStatus = variantModule({
  todo: {},
  onHold: {},
  sleep: fields<{ until: Date }>(),
  done: {},
});
export type TodoItemStatus<
  T extends TypeNames<typeof TodoItemStatus> = undefined,
> = VariantOf<typeof TodoItemStatus, T>;

export type TodoItem = {
  status: TodoItemStatus;
  title: string | undefined;
  notes: string[];
};

export const emptyItem: TodoItem = {
  status: TodoItemStatus.todo(),
  title: undefined,
  notes: [],
};
