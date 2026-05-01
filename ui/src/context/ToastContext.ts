import { createContext, Dispatch, SetStateAction } from 'react';
import { ToastData } from '@/types';

export type Toast = ToastData | null;
export type SetToast = Dispatch<SetStateAction<ToastData | null>>;

export interface ToastContextType {
	toast: Toast;
	setToast: SetToast;
}

export const ToastContext = createContext<ToastContextType | null>(null);
