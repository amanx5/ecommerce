import { formatDate } from "@/utils/date";
import { getPriceNative } from "@/utils/money";
import { OrderExpanded } from "@/types";

export function OrderHeader({ order }: { order: OrderExpanded }) {
	const { id, orderTimeMs, totalCostCents } = order;

	return (
		<div className='bg-white border border-[rgb(222,222,222)] flex items-center justify-between p-5 px-6 rounded-t-[5px] max-[575px]:flex-col max-[575px]:items-start max-[575px]:leading-[23px] max-[575px]:p-[15px]'>
			<div className='flex shrink-0 max-[575px]:flex-col'>
				<div className='mr-[45px] max-[575px]:grid max-[575px]:grid-cols-[auto_1fr] max-[575px]:mr-0'>
					<div className='font-bold max-[575px]:mr-1'>Order Placed:</div>
					<div>{formatDate(orderTimeMs)}</div>
				</div>
				<div className='mr-[45px] max-[575px]:grid max-[575px]:grid-cols-[auto_1fr] max-[575px]:mr-0'>
					<div className='font-bold max-[575px]:mr-1'>Total:</div>
					<div>{getPriceNative(totalCostCents)}</div>
				</div>
			</div>

			<div className='shrink max-[575px]:grid max-[575px]:grid-cols-[auto_1fr]'>
				<div className='font-bold max-[575px]:mr-1'>Order ID:</div>
				<div>{id}</div>
			</div>
		</div>
	);
}