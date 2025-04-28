
import { produce } from 'immer';
import { findById, makeStore, UpdateState, upsert } from './store.utils';
import { initState, ItemStatus, makeNote, makeTodo, TodoAPI, TodoItem, TodoNote, TodoState, TodoViewModel } from "./todo.model";

export const store = makeStore<TodoViewModel>(
  'store:Todo', 
  (set: UpdateState<TodoState>) => {
    const data = initState();
    const api: TodoAPI = {
        selectTodo: (id: string) => {
          set(state => { 
            state.selectedTodoId = id 
          });
        },
        addTodo: () => {
          set(state => { 
            state.items.push(makeTodo(api)); 
          });
        },
        removeTodo: (id: string) => {
          set(state => {
            state.items = state.items.filter(item => item.id !== id);
          });
        },
        updateTitle: (id: string, title: string) => {
          set(state => {
            const item = findById<TodoItem>(id, state.items);
            if (item) {
              item.title = title;
            }
          });
        },
        updateStatus: async (id: string, status: ItemStatus) => {
          const response = await Promise.resolve({status: 200});
          set(state => {
            const item = findById<TodoItem>(id, state.items);
            if (item) {
              item.status = status;
              if (status !== 'sleep') item.sleepUntil = null;
            }
          });

          return true;
        },
        sleep: (id: string, until: Date | null) => {
          set(state => {
            const item = findById<TodoItem>(id, state.items);
            if (item) {
              item.status = until ? 'sleep' : 'todo';
              item.sleepUntil = until;
            }
          });
        },
        upsertNote: (note: Partial<TodoNote>, todoId?:string) => {
          set(state => {
            todoId ||= state.selectedTodoId;

            const fullNote = { ...makeNote(''), ...note };
            const item = findById<TodoItem>(todoId, state.items);

            if (item) {
              item.notes = upsert<TodoNote>(fullNote, item.notes);
            }
          });
        },
        removeNote: (noteId: string, todoId?: string) => {
          set(state => {
            todoId ||= state.selectedTodoId;
            const item = findById<TodoItem>(todoId, state.items);

            if (item) {
              item.notes = item.notes.filter(note => note.id !== noteId);
            }
          });
        }          
    }


    // Publish initial state and API (aka ViewModel)
    return {
      ...data,
      api
    } as TodoViewModel;
  }
)


