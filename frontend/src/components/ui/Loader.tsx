import { Loader2 } from 'lucide-react';

type LoaderProps = {
	size?: number;
	label?: string;
};

export const Loader = ({ size, label }: LoaderProps) => {
	return (
		<div className="p-20 text-center flex flex-col items-center gap-4">
			<Loader2 className="animate-spin text-infranet" size={size} />
			{ label && <p className="text-sm text-gray-500">{label}</p> }
		</div>
	);
};
