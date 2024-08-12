import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { redisClient } from "@/lib/redis";
import { nanoid } from "nanoid";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import prisma from "@/lib/prisma";

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

		// const otherUserData = await prisma.user.findUnique({
		// 	where: {
		// 		id: otherUserId,
		// 	},
		// });
		const isFriends = await prisma.friends.findFirst({
			where: {
				friendOfId: userId,
				friendId: otherUserId,
			},
		});
		if (!isFriends) {
			return Response.json(
				{ success: false, message: "UNAUTHORIZED" },
				{ status: 402 }
			);
		}

		let prevChat = await prisma.chat.findFirst({
			where: {
				user1Id: userId1,
				user2Id: userId2,
			},
		});

		if (!prevChat) {
			prevChat = await prisma.chat.create({
				data: {
					user1Id: userId1,
					user2Id: userId2,
				},
			});
		}

		await prisma.message.create({
			data: {
				chatId: prevChat.id,
				content: message,
				senderId: userId,
				receiverId: otherUserId,
				timestamp: new Date(),
			},
		});

		await pusherServer.trigger(
			toPusherKey(`chat:${chatId}:messages`),
			"messages",
			{
				chatId: prevChat.id,
				content: message,
				senderId: userId,
				receiverId: otherUserId,
				timestamp: new Date(),
			}
		);
		return Response.json({ success: true, message: "Sent" }, { status: 200 });
		const timestamp = Date.now();
		const messageData = {
			senderId: userId,
			receiverId: otherUserId,
			content: message,
			timestamp: new Date(),
			chatId: chatId,
		};

		await redisClient.zadd(`chat:${chatId}:messages`, {
			score: timestamp,
			member: JSON.stringify(messageData),
		});

		return Response.json({ success: true, message: "Sent" }, { status: 200 });
	} catch (error) {
		console.log(error);
	}
}
