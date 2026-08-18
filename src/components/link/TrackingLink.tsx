import Link, { LinkProps } from "next/link";

import { trackEvent } from "@/utils/track";
import { addUTMSource } from "@/utils/utils";

type TrackingLinkProps = {
	isExternal?: boolean;
	eventName: string;
	eventData?: { [key: string]: string | number | boolean | null | undefined };
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
	const externalHref = addUTMSource(href);

	return (
		<>
			{isExternal && (
				<a
					href={externalHref}
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
