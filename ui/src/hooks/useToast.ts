import { useContext } from 'react';
import { type Toast, type SetToast } from '@/context/ToastContext';
import { ToastContext } from '@/context/ToastContext';

export function useToast(): {
	toast: Toast;
	setToast: SetToast;
} {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within an ToastProvider');
	}

	const { toast, setToast } = context;

	return {
		toast,
		setToast,
	};
}
