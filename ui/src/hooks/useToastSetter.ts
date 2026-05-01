import { useContext } from 'react';
import {
	type ToastSetter,
	ToastSetterContext,
} from '@/context/ToastSetterContext';

export function useToastSetter(): ToastSetter {
	const toastSetter = useContext(ToastSetterContext);

	if (!toastSetter) {
		throw new Error('useToastSetter must be used within ToastSetterProvider');
	}

	return toastSetter;
}
