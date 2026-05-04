import SearchIcon from '@/assets/icons/search-icon.png';
import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import clsx from 'clsx';

export default function SearchBar() {
	const [urlSearchParams] = useSearchParams();
	const productSearch = urlSearchParams.get('product');
	const [searchValue, setSearchValue] = useState(productSearch || '');
	const navigate = useNavigate();

	return (
		<>
			<input
				className={clsx(
					'flex-1 w-0 text-[16px] h-[40px] pl-[15px]',
					'border-none rounded-l-[5px] rounded-r-none',
					'bg-white text-black focus:outline-none',
					'max-[600px]:h-[36px]'
				)}
				type='text'
				placeholder='Search'
				value={searchValue}
				onChange={searchInputOnChange}
				onKeyDown={searchInputOnKeyDown}
			/>

			<button 
				className={clsx(
					'bg-[rgb(186,255,190)] border-none w-[45px] h-[40px]',
					'rounded-r-[5px] rounded-l-none shrink-0 cursor-pointer',
					'flex items-center justify-center',
					'max-[600px]:h-[36px]'
				)}
				onClick={searchButtonOnClick}
			>
				<img className='h-[20px]' src={SearchIcon} />
			</button>
		</>
	);

	function searchInputOnChange(event: ChangeEvent<HTMLInputElement>) {
		const newSearchValue = String(event.target.value);

		if (newSearchValue.length > 20) {
			alert('Please enter product name within 20 characters');
		} else {
			setSearchValue(newSearchValue);
		}
	}

	function searchInputOnKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key == 'Enter') {
			navigateToSearchProduct();
		} else if (event.key == 'Escape') {
			setSearchValue('');
		}
	}

	function searchButtonOnClick() {
		navigateToSearchProduct();
	}

	function navigateToSearchProduct() {
		const url = searchValue ? `/?product=${searchValue}` : '/';
		navigate(url);
	}
}
