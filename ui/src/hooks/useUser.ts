import { useQuery, useQueryClient } from '@tanstack/react-query';
import { verifyLogin } from '@/utils/authentication';
import type { User } from '@/types';

const USER_QUERY_KEY = 'user';

export function useUser() {
	const { data, isLoading, isError } = useQueryUser();

	if (data === undefined || isLoading || isError) {
		throw new Error(
			'Missing guard! The component is trying to read the user which is not loaded/failed to load.',
		);
	}

	return data;
}

export function useQueryUser() {
	const result = useQuery({
		queryKey: [USER_QUERY_KEY],
		queryFn: async () => {
			return await verifyLogin();
		},
		retry: false, // important for auth
		staleTime: Infinity, // don't refetch even on remounts
	});

	return result;
}

export function useSetUser() {
	const queryClient = useQueryClient();

	return (user: User | null) => {
		queryClient.setQueryData([USER_QUERY_KEY], user);
	};

	// TODO: use invalidateQueries or refetch
	// const queryClient = useQueryClient();
	// queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
}
