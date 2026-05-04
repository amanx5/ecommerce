import { MinimalHeader } from '@/components/header/MinimalHeader';

export default function NotFoundPage() {
	return (
		<>
			<MinimalHeader />
			<div className='flex justify-center items-center h-screen pt-15'>
				<div className='font-bold text-2xl text-gray-800'>404 Page Not Found</div>
			</div>
		</>
	);
}
