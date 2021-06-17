import React, { useEffect } from "react";

import Layout from "@/components/Layout";
import { NavLink } from "@/components/navbar/NavLink";
import { useD2Profile, useUser } from "@/utils/hooks";

export default function Dashboard() {
	const { user } = useUser("/", true);

	useEffect(() => {
		if (user) {
			console.log(user);
		}

		return () => {};
	}, [user]);

	return (
		<Layout className="safe-area-x relative flex flex-col mb-8 mx-auto sm:px-4 md:px-8 lg:px-12 xl:px-16">
			asd
			<NavLink
				href="/api/auth/login"
				label="Login"
				i={0}
				setNavbarOpen={() => {}}
				replace
			/>
		</Layout>
	);
}
