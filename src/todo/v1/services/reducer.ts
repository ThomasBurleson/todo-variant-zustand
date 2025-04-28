import {
  fields,
  match,
  matcher,
  matchLiteral,
  TypeNames,
  variantModule,
  VariantOf,
} from "variant";
import { emptyItem, TodoItem, TodoItemStatus } from "./types";

export type TodoState = TodoItem[];
export const initialTodoState: TodoState = [];

export const TodoAction = variantModule({
  userAddedItem: {},
  
  userSetSleepUntilDate: fields<{ index: number; date: Date }>(),
  userEditedItemTitle: fields<{ index: number; title: string | undefined }>(),
  userRemovedItem: fields<{ index: number }>(),
  userAddedNote: fields<{ itemIndex: number; contents: string }>(),
  userEditedNote: fields<{itemIndex: number; noteIndex: number; contents: string; }>(),
  userRemovedNote: fields<{ itemIndex: number; noteIndex: number }>(),

  userSelectedStatus: (args: { index: number; status: TodoItemStatus["type"]; }) => ({ ...args, timestamp: new Date() }),
});
export type TodoAction<T extends TypeNames<typeof TodoAction> = undefined> =
  VariantOf<typeof TodoAction, T>;

export const todoReducer = (state: TodoState, action: TodoAction): TodoState =>
  match(action, {
    userAddedItem: () => [...state, emptyItem],
    userSelectedStatus: ({ index, status, timestamp }) =>
      state.map((item, ind) =>
        ind === index
          ? matchLiteral(status, {
              todo: () => ({ ...item, status: TodoItemStatus.todo() }),
              onHold: () => ({ ...item, status: TodoItemStatus.onHold() }),
              sleep: () => ({
                ...item,
                status: TodoItemStatus.sleep({ until: timestamp }),
              }),
              done: () => ({ ...item, status: TodoItemStatus.done() }),
            })
          : item
      ),
    userSetSleepUntilDate: ({ index, date }) =>
      state.map((item, ind) =>
        ind === index
          ? matcher(item.status)
              .when(["sleep"], () => ({
                ...item,
                status: TodoItemStatus.sleep({ until: date }),
              }))
              .when(["todo", "onHold", "done"], () => item)
              .complete()
          : item
      ),
    userEditedItemTitle: ({ index, title }) =>
      state.map((item, ind) =>
        ind === index ? { ...item, title: title } : item
      ),
    userRemovedItem: ({ index }) => state.filter((_, ind) => ind !== index),
    userAddedNote: ({ itemIndex, contents }) =>
      state.map((item, ind) =>
        ind === itemIndex ? { ...item, notes: [...item.notes, contents] } : item
      ),
    userEditedNote: ({ itemIndex, noteIndex, contents }) =>
      state.map((item, ind) =>
        ind === itemIndex
          ? {
              ...item,
              notes: item.notes.map((note, ind) =>
                noteIndex === ind ? contents : note
              ),
            }
          : item
      ),
    userRemovedNote: ({ itemIndex, noteIndex }) =>
      state.map((item, ind) =>
        ind === itemIndex
          ? {
              ...item,
              notes: item.notes.filter((_, ind) => noteIndex !== ind),
            }
          : item
      ),
  });
