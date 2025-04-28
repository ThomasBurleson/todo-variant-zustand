import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { StoreApi, createStore } from 'zustand/vanilla';

export type UpdateStateCallback<T> = (state: T) => T | Partial<T> | void;
export type UpdateState<T = unknown> = (state: T | Partial<T> | UpdateStateCallback<T>, replace?: boolean) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const makeStore = <T = unknown>(name: string, configureStoreFn: any): StoreApi<T> => {
  return createStore<T>()(
          devtools(
                immer(
                  configureStoreFn
                ), 
                { name }
              )
          ) as unknown as StoreApi<T>
}

export function upsert<T extends { id: string }>(item: T, target: T[]) {
  const existing = target.find((it) => it.id === item.id);
  return existing ? target.map((it) => (it.id === item.id ? item : it)) : [...target, item];
}


export function findById<T extends {id: string }>(id: string, target: T[]) {
  return target.find((it) => it.id === id);
}