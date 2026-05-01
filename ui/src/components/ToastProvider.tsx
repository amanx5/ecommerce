import Toast from '@/components/Toast';
import { ToastContext } from '@/context/ToastContext';
import type { ToastData } from '@/types';
import { useState, type ReactNode } from 'react';

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toast, setToast] = useState<ToastData | null>(null);

	return (
		<ToastContext.Provider value={{ toast, setToast }}>
			<Toast toast={toast} />
			{children}
		</ToastContext.Provider>
	);
}
