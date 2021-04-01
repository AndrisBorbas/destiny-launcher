import { useDroppable } from "@dnd-kit/core";

export default function DroppableContainer({
	children,
	className,
	id,
}: {
	children: React.ReactNode;
	className: string;
	id: string;
}) {
	const { setNodeRef } = useDroppable({
		id,
	});

	return (
		<section ref={setNodeRef} className={className}>
			{children}
		</section>
	);
}
