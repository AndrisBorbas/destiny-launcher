import { FaGithub } from "react-icons/fa";

export default function Footer() {
	return (
		<footer
			className="z-20 p-8 w-full text-white bg-green-700 rounded-t-2xl"
			id="footer"
		>
			<div className="container flex flex-col items-center justify-center mx-auto space-y-6">
				<div className="flex items-center justify-evenly w-full lg:w-1/3">
					<a
						href="https://www.github.com/andrisborbas/destiny-launcher"
						target="_blank"
						rel="noopener noreferrer"
					>
						<FaGithub className="hover:text-blue text-blue-dark w-10 h-auto" />
					</a>
				</div>

				<div className="flex flex-row justify-between w-full">
					<p className="pr-4 text-xs">
						Destiny is a registered trademark of Bungie. Some content and images
						are the property of Bungie.
					</p>
					<p className="text-xs">© 2021 AndrisBorbas</p>
				</div>
			</div>
		</footer>
	);
}
