import type { NextApiRequest, NextApiResponse } from "next";

import { oauthClientId } from "@/utils/bungieApi/consts";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case "GET": {
			const queryParams = new URLSearchParams({
				client_id: oauthClientId(),
				response_type: "code",
			});
			res.redirect(`https://www.bungie.net/en/OAuth/Authorize?${queryParams}`);
			return;
		}

		default: {
			res.setHeader("Allow", "GET");
			res.status(405).end();
			return;
		}
	}
};
