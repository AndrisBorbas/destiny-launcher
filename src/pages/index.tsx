import Banner from "@/components/banner/Banner";
import Layout from "@/components/Layout";

export default function Page() {
	return (
		<Layout className="mb-8 mt-20 mx-auto px-3 sm:mt-28 sm:px-8 md:px-12 lg:mt-32 lg:px-16 xl:px-32">
			<div className="grid gap-4 grid-cols-1 2xl:grid-cols-3 justify-items-center md:grid-cols-2">
				<Banner />
				<Banner />
				<Banner />

				<Banner />
				<Banner />
				<Banner />
			</div>
		</Layout>
	);
}
