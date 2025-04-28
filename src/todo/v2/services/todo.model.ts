import { v4 as uuidv4 } from 'uuid';

// **************************************************
// Todo Types
// **************************************************

export type ItemStatus = 'todo' | 'onHold' | 'sleep' | 'done';



export interface TodoNote {
  id: string;
  text: string;
}
export interface TodoItem extends ItemAPI {
  id: string;
  title: string;
  status: ItemStatus;
  notes: TodoNote[];
  sleepUntil: Date | null; 
}

export interface ItemAPI {
  updateStatus: (status: ItemStatus) => void;
  updateTitle: (title: string) => void;
  sleep: (until: Date | null) => void;

  upsertNote: (note: Partial<TodoNote>) => void;
  removeNote: (noteId: string) => void;
}

// **************************************************
// Todo State and API
// **************************************************

export interface TodoState {
  items : TodoItem[];
  filterBy: ItemStatus;
  selectedTodoId: string;
}

export interface TodoAPI {
  addTodo: () => void;
  removeTodo: (id: string) => void;
  selectTodo: (id: string) => void;

  updateStatus: (id: string, status: ItemStatus) => void;
  updateTitle: (id: string, title: string) => void;
  sleep: (id: string, until: Date | null) => void;

  upsertNote: (note: Partial<TodoNote>, todoId?:string) => void;
  removeNote: (noteId: string, todoId?: string) => void;
}

export type TodoViewModel = TodoState & { api: TodoAPI };

// **************************************************
// Initializers
// **************************************************

export const makeTodo = (api: TodoAPI): TodoItem =>  {
  const id = uuidv4();
  const itemAPI = {
    updateStatus: (status: ItemStatus) => api.updateStatus(id, status),
    updateTitle: (title: string) => api.updateTitle(id, title),
    sleep: (until: Date | null) => api.sleep(id, until),
    upsertNote: (note: Partial<TodoNote>) => api.upsertNote(note, id),
    removeNote: (noteId: string) => api.removeNote(noteId, id),
  }
  
  return {
    id,
    status: 'todo',
    title: '',
    notes: [],
    sleepUntil: null,
    ...itemAPI
  }
};

export const makeNote = (text: string): TodoNote => ({
  id: uuidv4(),
  text,
});

export const initState = (): TodoState => ({
  items: [],
  filterBy: 'todo', // not currently used...
  selectedTodoId: '',
});