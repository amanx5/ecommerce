export interface User {
	id: string;
	email: string;
}

export interface Rating {
	stars: number;
	count: number;
}

export interface Product {
	id: string;
	name: string;
	image: string;
	rating: Rating;
	priceCents: number;
	keywords: string[];
	createdAt: string;
	updatedAt: string;
}

export interface DeliveryOption {
	id: string;
	deliveryDays: number;
	priceCents: number;
}

export interface DeliveryOptionExpanded extends DeliveryOption {
	estimatedDeliveryTimeMs: number;
}

export interface CartItem {
	id: string;
	productId: string;
	quantity: number;
	deliveryOptionId: string;
}

export interface CartItemExpanded extends CartItem {
	product: Product;
}

export interface OrderItem {
	id: string;
	orderId: string;
	productId: string;
	quantity: number;
	deliveryOptionId: string;
	estimatedDeliveryTimeMs: number;
	deliveredOnTimeMs?: number;
	createdAt: string;
	updatedAt: string;
}

export interface OrderItemExpanded extends OrderItem {
	product: Product;
}

export interface Order<E = OrderItem> {
	id: string;
	orderTimeMs: number;
	totalCostCents: number;
	orderItems: E[];
}

export type OrderExpanded = Order<OrderItemExpanded>;

export interface ToastData {
	message: string;
	type?: 'success' | 'error' | 'info';
}

export interface PaymentSummaryData {
	totalItems: number;
	productCostCents: number;
	shippingCostCents: number;
	totalCostBeforeTaxCents: number;
	taxCents: number;
	totalCostCents: number;
}
