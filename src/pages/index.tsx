import Layout from "@/components/Layout";

export default function Page() {
	return (
		<Layout className="mx-auto px-3 sm:px-8 md:px-12 lg:px-16 xl:px-32">
			<div className="grid gap-4 grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3">
				<div className="w-16 h-9 bg-rose-300"> </div>
				<div className="w-16 h-9 bg-rose-300"> </div>
				<div className="w-16 h-9 bg-rose-300"> </div>
				<div className="w-16 h-9 bg-rose-300"> </div>
				<div className="w-16 h-9 bg-rose-300"> </div>
				<div className="w-16 h-9 bg-rose-300"> </div>
				<div className="w-16 h-9 bg-rose-300"> </div>
			</div>
		</Layout>
	);
}
