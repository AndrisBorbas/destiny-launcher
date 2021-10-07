import clsx from "clsx";
import React, { HTMLProps, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

import styles from "./Notice.module.scss";

type NoticeProps = {
	id: string;
} & HTMLProps<HTMLDivElement>;

export default function Notice({ id, children, className }: NoticeProps) {
	const [isVisible, toggleVisible] = useState(false);

	useEffect(() => {
		const jsonString = localStorage.getItem(id);
		const value = jsonString != null ? JSON.parse(jsonString) : true;
		toggleVisible(value);
		return () => {};
	}, [id]);
	return (
		<div
			style={{ display: isVisible === true ? "" : "none" }}
			className={clsx("mb-4", className)}
		>
			<div
				className={clsx(
					styles.notice,
					"relative p-3 px-6 ml-auto text-xl text-center bg-button bg-opacity-50 border-t border-gray-300 bg-blur-10",
				)}
			>
				{children}
				<button
					className="absolute top-1 right-1 p-1"
					type="button"
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
