import { useEffect, useState, type ReactNode } from 'react';
import { apiRequest } from '@/utils';

export function ServerCheck({ children }: { children: ReactNode }) {
	const [isServerUp, setIsServerUp] = useState<boolean | undefined>();
	const shouldCheck = isServerUp === undefined;

	useEffect(() => {
		if (shouldCheck) {
			checkServer();
		}
	}, [shouldCheck]);

	if (isServerUp === undefined) {
		return 'Server is waking up';
	}

	if (isServerUp === false) {
		return (
			<button
				onClick={() => {
					setIsServerUp(undefined);
				}}
			>
				Retry
			</button>
		);
	}

	return children;

	async function checkServer() {
		const resp = await apiRequest('/', { method: 'head' }, true);
		const isUp = [200, 304].includes(resp.status);
		setIsServerUp(isUp);
	}
}
