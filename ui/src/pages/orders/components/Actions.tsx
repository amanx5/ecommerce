import { useNavigate } from 'react-router';
import type { Order } from '@/types';

interface ActionsProps {
	order: Order;
	productId: string;
}

export default function Actions({ order, productId }: ActionsProps) {
	const { id: orderId } = order;
	const navigate = useNavigate();

	return (
		<div className='self-start max-[800px]:col-start-2 max-[800px]:mb-7.5 max-[450px]:col-auto max-[450px]:mb-17.5'>
			<button
				className='w-full text-sm p-2 max-[800px]:w-[140px] max-[450px]:w-full max-[450px]:p-3 button-secondary'
				onClick={trackPackageOnClick}
			>
				Track package
			</button>
		</div>
	);

	function trackPackageOnClick(_event: React.MouseEvent<HTMLButtonElement>) {
		navigate(`/tracking?orderId=${orderId}&productId=${productId}`);
	}
}
