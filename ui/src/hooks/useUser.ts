import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';

export function useUser() {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useUser must be used within an AppContext.Provider');
	}

	const { user, setUser } = context;

	return { user, setUser };
}
