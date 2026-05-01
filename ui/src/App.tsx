import './App.css';
import { Router } from '@/pages/Router';
import { ToastProvider } from '@/components/ToastProvider';
import { UserProvider } from '@/components/UserProvider';

export default function App() {
	return (
		<ToastProvider>
			<UserProvider>
				<Router />
			</UserProvider>
		</ToastProvider>
	);
}
