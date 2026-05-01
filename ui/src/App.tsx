import { Router } from '@/pages/Router';
import { ToastProvider } from '@/components/ToastProvider';
import { UserProvider } from '@/components/UserProvider';
import { ServerCheck } from '@/components/ServerCheck';

export default function App() {
	return (
		<ServerCheck>
			<ToastProvider>
				<UserProvider>
					<Router />
				</UserProvider>
			</ToastProvider>
		</ServerCheck>
	);
}
