import { Rating as MuiRating } from '@mui/material';

interface RatingProps {
	value: number;
	readOnly?: boolean;
	size?: 'small' | 'medium' | 'large';
	className?: string;
	'data-testid'?: string;
	'data-rating'?: string;
}

export default function Rating({
	value,
	readOnly = true,
	size = 'small',
	className,
	'data-testid': dataTestId,
	'data-rating': dataRating,
}: RatingProps) {
	return (
		<MuiRating
			value={value}
			precision={0.1}
			readOnly={readOnly}
			size={size}
			className={className}
			data-testid={dataTestId}
			data-rating={dataRating}
			sx={{
				'& .MuiRating-iconFilled': {
					color: 'var(--primary-green, rgb(25, 135, 84))',
				},
				'& .MuiRating-iconEmpty': {
					color: '#ddd',
				},
			}}
		/>
	);
}
