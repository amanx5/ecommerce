import './OrdersPage.css';
import Header from '@/components/header/Header';
import OrderComponent from './components/Order';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS, refreshStateViaAPI } from '@/utils';
import { type OrderExpanded } from '@/types';
import { useToastSetter } from '@/hooks/useToastSetter';

export default function OrdersPage() {
	const setToast = useToastSetter();
	const [orders, setOrders] = useState<OrderExpanded[] | undefined>(undefined);
	const hasOrders = Array.isArray(orders) && orders.length > 0;

	useEffect(() => {
		refreshStateViaAPI<OrderExpanded[] | undefined>(
			API_ENDPOINTS.orders.GETEXPANDED,
			setOrders,
			{
				setToast,
				when: 'onFailure',
			},
		);
	}, [setToast]);

	if (orders === undefined) {
		return "Loading";
	}

	return (
		<>
			{/* head */}
			<title>Orders</title>

			{/* body */}
			<Header />
			<div className="orders-page">
				<div className="page-title">Your Orders</div>

				{hasOrders ? (
					<div className="orders-grid">
						{orders.map((order) => (
							<OrderComponent key={order.id} order={order} />
						))}
					</div>
				) : (
					<div>No orders found</div>
				)}
			</div>
		</>
	);
}
