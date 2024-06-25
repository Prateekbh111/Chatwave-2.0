import { Redis } from "@upstash/redis";

export const redisClient = new Redis({
	url: "https://usw1-top-griffon-33935.upstash.io",
	token:
		"AYSPASQgMjlkODQ5MzgtYWI5OC00OTlkLTliOTctMjhiYjdiYzUxYjM3YzU0MTgyOTgyNzEzNGEzMWFhYzNmYmRhZTgzZDFmODU=",
});

export async function fetchRedis(
	fetchCommand: string,
	...toBeFetched: (string | number)[]
) {
	const commandUrl = `${
		process.env.UPSTASH_REDIS_REST_URL
	}/${fetchCommand}/${toBeFetched.join("/")}`;

	try {
		const response = await fetch(commandUrl, {
			headers: {
				Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
			},
			cache: "no-store",
		});

		const data = await response.json();
		return data.result;
	} catch (error) {
		console.log(error);
	}
}
