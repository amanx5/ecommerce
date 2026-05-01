import { useCallback, useEffect, useState } from 'react';
import { ToastData } from '@/types';
import './Toast.css';
import { useToastSetter } from '@/hooks/useToastSetter';

interface ToastProps {
	toast: ToastData | null;
}

interface ActiveToast extends ToastData {
	id: string;
}

export default function Toast({ toast }: ToastProps) {
	const [activeToasts, setActiveToasts] = useState<ActiveToast[]>([]);
	const setToast = useToastSetter();

	useEffect(() => {
		if (toast) {
			const id = Math.random().toString(36).substring(2, 9);
			setActiveToasts((prev) => [...prev, { ...toast, id }]);
			// Clear the global toast so it can be re-triggered with the same data if needed
			// and to signal the toast has been "received"
			setToast(null);
		}
	}, [toast, setToast]);

	const removeToast = (id: string) => {
		setActiveToasts((prev) => prev.filter((t) => t.id !== id));
	};

	if (activeToasts.length === 0) return null;

	return (
		<div className="toast-container">
			{activeToasts.map((t) => (
				<ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
			))}
		</div>
	);
}

function ToastItem({
	toast,
	onRemove,
}: {
	toast: ActiveToast;
	onRemove: () => void;
}) {
	const [isExiting, setIsExiting] = useState(false);

	const handleClose = useCallback(() => {
		setIsExiting(true);
		setTimeout(() => {
			onRemove();
		}, 300); // match animation duration
	}, [onRemove]);

	useEffect(() => {
		const timer = setTimeout(() => {
			handleClose();
		}, 5000);
		return () => clearTimeout(timer);
	}, [handleClose]);

	const typeClass = `toast-${toast.type || 'info'}`;

	return (
		<div className={`toast ${typeClass} ${isExiting ? 'exit' : ''}`}>
			<div className="toast-content">{toast.message}</div>
			<button className="toast-close" onClick={handleClose}>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		</div>
	);
}
