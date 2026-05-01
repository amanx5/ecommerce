import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { ToastData } from '@/types';

export type ToastSetter = Dispatch<SetStateAction<ToastData | null>>;
export type ToastSetterContextType = ToastSetter | null;

export const ToastSetterContext = createContext<ToastSetterContextType>(null);
