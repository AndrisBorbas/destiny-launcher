import type { NextApiRequest, NextApiResponse } from "next";

import { oauthClientId } from "@/utils/bungieApi/consts";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case "GET": {
			const queryParams = new URLSearchParams({
				client_id: oauthClientId(),
				response_type: "code",
			});
			return res.redirect(
				`https://www.bungie.net/en/OAuth/Authorize?${queryParams}`,
			);
		}

		default: {
			res.setHeader("Allow", "GET");
			return res.status(405).end();
		}
	}
};
