import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { redisClient } from "@/lib/redis";
import { nanoid } from "nanoid";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request, res: Response) {
	try {
		const { message, chatId } = await req.json();
		const session = await getServerSession(authOptions);

		if (!session) {
			return Response.json(
				{ success: false, message: "UNAUTHORIZED" },
				{ status: 402 }
			);
		}

		const userId = session?.user.id;

		const [userId1, userId2] = chatId.split("--");

		const otherUserId = userId === userId1 ? userId2 : userId1;

		const otherUserDataRaw: any = await redisClient.get(`user:${otherUserId}`);
		const otherUserData = {
			id: otherUserDataRaw.id,
			name: otherUserDataRaw.name,
			email: otherUserDataRaw.email,
			image: otherUserDataRaw.image,
		};
		console.log(userId);
		console.log(otherUserData);
		const isFriends = await redisClient.sismember(
			`user:${userId}:friends`,
			otherUserData
		);
		console.log(isFriends);
		if (!isFriends) {
			return Response.json(
				{ success: false, message: "UNAUTHORIZED" },
				{ status: 402 }
			);
		}
		const timestamp = Date.now();
		const messageData = {
			id: nanoid(),
			senderId: userId,
			message,
			timestamp: timestamp,
		};

		pusherServer.trigger(
			toPusherKey(`chat:${chatId}:messages`),
			"messages",
			messageData
		);

		await redisClient.zadd(`chat:${chatId}:messages`, {
			score: timestamp,
			member: JSON.stringify(messageData),
		});

		return Response.json({ success: true, message: "Sent" }, { status: 200 });
	} catch (error) {
		console.log(error);
	}
}
