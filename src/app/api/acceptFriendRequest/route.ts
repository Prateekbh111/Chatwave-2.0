import { redisClient } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request, res: Response) {
	const session = await getServerSession(authOptions);
	const { requestId } = await req.json();

	if (!session) {
		return Response.json(
			{ success: false, message: "UNAUTHORIZED" },
			{ status: 402 }
		);
	}

	try {
		const requestUserDataJson = await redisClient.get<User>(
			`user:${requestId}`
		);
		const requestUserData: FriendRequest = {
			senderId: requestUserDataJson?.id!,
			senderName: requestUserDataJson?.name!,
			senderEmail: requestUserDataJson?.email!,
			senderImage: requestUserDataJson?.image!,
		};

		const hasFriendRequest = await redisClient.sismember(
			`user:${session.user.id}:friendRequests`,
			requestUserData
		);

		if (!hasFriendRequest) {
			return Response.json(
				{ success: false, message: "You don't have friend request" },
				{ status: 402 }
			);
		}

		const isAlreadyFriend = await redisClient.sismember(
			`user:${session.user.id}:friends`,
			requestUserData
		);
		if (isAlreadyFriend) {
			return Response.json(
				{ success: false, message: "Already are friends" },
				{ status: 402 }
			);
		}

		pusherServer.trigger(
			toPusherKey(`user:${session.user.id}:friends`),
			"friends",
			{
				id: requestUserDataJson?.id!,
				name: requestUserDataJson?.name!,
				email: requestUserDataJson?.email!,
				image: requestUserDataJson?.image!,
			}
		);
		pusherServer.trigger(toPusherKey(`user:${requestId}:friends`), "friends", {
			id: session.user.id,
			name: session.user.name,
			email: session.user.email,
			image: session.user.image,
		});

		await redisClient.sadd(`user:${session.user.id}:friends`, {
			id: requestUserDataJson?.id!,
			name: requestUserDataJson?.name!,
			email: requestUserDataJson?.email!,
			image: requestUserDataJson?.image!,
		});
		await redisClient.sadd(`user:${requestId}:friends`, {
			id: session.user.id,
			name: session.user.name,
			email: session.user.email,
			image: session.user.image,
		});
		await redisClient.srem(
			`user:${session.user.id}:friendRequests`,
			requestUserData
		);

		return Response.json(
			{ success: true, message: "Friend Request Accepted" },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
	}
}
