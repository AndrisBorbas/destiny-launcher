import clsx from "clsx";
import { HTMLProps, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

import styles from "./Notice.module.scss";

type NoticeProps = {
	id: string;
} & HTMLProps<HTMLDivElement>;

export function Notice({ id, children, className }: NoticeProps) {
	const [isVisible, toggleVisible] = useState(false);

	useEffect(() => {
		const jsonString = localStorage.getItem(id);
		const value = jsonString != null ? JSON.parse(jsonString) : true;
		toggleVisible(value);
		return () => {};
	}, [id]);
	return (
		<div
			style={{ display: isVisible ? "" : "none" }}
			className={clsx("mb-4", className)}
		>
			<div
				className={clsx(
					styles.notice,
					"bg-blur-10 relative ml-auto border-t border-gray-300 bg-button bg-opacity-50 p-3 px-6 text-center text-xl",
				)}
			>
				{children}
				<button
					className="absolute top-1 right-1 p-1 hover:text-red-300"
					type="button"
					title="Close"
					onClick={() => {
						localStorage.setItem(id, JSON.stringify(false));
						toggleVisible(false);
					}}
				>
					<FaTimes />
				</button>
			</div>
		</div>
	);
}
