import { Loader2 } from 'lucide-react';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'danger'
	| 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	isLoading?: boolean;
	icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
	primary: 'bg-infranet hover:bg-[#e5ac00] text-gray-800',
	secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
	success: 'bg-[#1D6F42] hover:bg-[#155231] text-white',
	danger: 'btn-danger',
	ghost: 'bg-transparent hover:bg-bg-card-hover text-text-primary',
};

const sizeStyles: Record<ButtonSize, string> = {
	sm: 'px-3 py-1.5 text-xs rounded-sm font-bold gap-1',
	md: 'px-6 py-3 text-sm rounded-md font-bold gap-3',
	lg: 'px-8 py-4 text-base rounded-md font-bold gap-4',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			children,
			variant = 'primary',
			size = 'sm',
			isLoading = false,
			disabled,
			className = '',
			icon,
			...props
		},
		ref,
	) => {
		return (
			<button
				ref={ref}
				disabled={disabled || isLoading}
				className={`flex items-center gap-2 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
				{...props}
			>
				{isLoading ? (
					<span className="flex items-center gap-2">
						<Loader2 />
						Loading...
					</span>
				) : (
					<>
						{icon && icon}
						<span className='mt-1'>{children}</span>
					</>
				)}
			</button>
		);
	},
);

Button.displayName = 'Button';
