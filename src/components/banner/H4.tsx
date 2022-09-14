export function H4({
	children,
	...restProps
}: React.HTMLProps<HTMLHeadingElement>) {
	// eslint-disable-next-line jsx-a11y/heading-has-content
	return (
		<h4 className="mb-2 text-xl" {...restProps}>
			{children}
		</h4>
	);
}
