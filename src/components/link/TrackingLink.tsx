import Link, { LinkProps } from "next/link";

import { trackEvent } from "@/utils/track";

type TrackingLinkProps = {
	isExternal?: boolean;
	eventName: string;
	eventData?: object;
	href: string;
	ref?: React.Ref<HTMLAnchorElement>;
} & React.HTMLProps<HTMLAnchorElement> &
	LinkProps;

export function TrackingLink({
	isExternal,
	eventName,
	eventData,
	href,
	onClick,
	children,
	...restProps
}: TrackingLinkProps) {
	return (
		<>
			{isExternal && (
				<a
					href={href}
					onClick={(e) => {
						trackEvent(eventName, { link: href, ...eventData });
						onClick?.(e);
					}}
					{...restProps}
				>
					{children}
				</a>
			)}
			{!isExternal && (
				<Link
					href={href}
					onClick={(e) => {
						trackEvent(eventName, { link: href, ...eventData });
						onClick?.(e);
					}}
					{...restProps}
				>
					{children}
				</Link>
			)}
		</>
	);
}
