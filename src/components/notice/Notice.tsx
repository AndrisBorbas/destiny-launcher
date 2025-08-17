import { HTMLProps, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

import { cn } from "@/utils/utils";

import styles from "./Notice.module.css";

type NoticeProps = {
	id: string;
} & HTMLProps<HTMLDivElement>;

export function Notice({ id, children, className }: NoticeProps) {
	const [isVisible, toggleVisible] = useState(false);

	useEffect(() => {
		const jsonString = localStorage.getItem(id);
		let value = true;
		if (jsonString !== null) {
			try {
				const parsed: unknown = JSON.parse(jsonString);
				value = typeof parsed === "boolean" ? parsed : true;
			} catch {
				value = true;
			}
		}
		toggleVisible(value);
	}, [id]);
	return (
		<div
			style={{ display: isVisible ? "" : "none" }}
			className={cn("mb-4 mt-6", className)}
		>
			<div
				className={cn(
					styles.notice,
					"bg-blur-10 relative ml-auto border-t border-gray-300 bg-button/50 p-3 px-6 text-center text-xl backdrop-blur",
				)}
			>
				{children}
				<button
					className="absolute top-1 right-1 p-1 hover:text-red-300"
					aria-label={isVisible ? "Close" : "Open"}
					type="button"
					title={isVisible ? "Close" : "Open"}
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
