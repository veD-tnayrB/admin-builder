import React from 'react';

interface IProps {
	value: string;
}

export const Descriptor = (props: IProps) => {
	const [isOpen, setIsOpen] = React.useState(false);

	const openTooltip = () => {
		setIsOpen(true);
	};

	const closeTooltip = () => {
		setIsOpen(false);
	};
	return (
		<div
			className="descriptor"
			onMouseLeave={closeTooltip}
			onMouseEnter={openTooltip}>
			{isOpen && (
				<div className="content">
					<p>{props.value}</p>
				</div>
			)}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="lucide lucide-circle-alert-icon lucide-circle-alert">
				<circle cx="12" cy="12" r="10" />
				<line x1="12" x2="12" y1="8" y2="12" />
				<line x1="12" x2="12.01" y1="16" y2="16" />
			</svg>
		</div>
	);
};
