
import { useStore } from 'zustand';
import { store } from './todo.store';
import { TodoViewModel } from './todo.model';

export type TodoSelector<T = unknown> = (state: TodoViewModel) => T;
const identity: TodoSelector<TodoViewModel> = (state: TodoViewModel) => state;

export const useTodoState = (selector = identity) => useStore(store, selector || identity);