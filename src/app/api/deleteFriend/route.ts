import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function POST(req: Request, res: Response) {
	const session = await getServerSession(authOptions);
	const { id: friendIdToBeDeleted } = await req.json();

	try {
		console.log(friendIdToBeDeleted);
		const areFriends = await prisma.friends.findMany({
			where: {
				OR: [
					{ friendId: friendIdToBeDeleted },
					{ friendOfId: friendIdToBeDeleted },
				],
			},
			select: {
				id: true,
			},
		});

		if (!areFriends) {
			return Response.json(
				{ success: false, message: "You are not friend with this user." },
				{ status: 400 }
			);
		}

		const chatsWithFriend = await prisma.chat.findFirst({
			where: {
				OR: [
					{ user1Id: session?.user.id, user2Id: friendIdToBeDeleted },
					{ user1Id: friendIdToBeDeleted, user2Id: session?.user.id },
				],
			},
			select: {
				id: true,
			},
		});

		await prisma.message.deleteMany({
			where: {
				OR: [
					{ senderId: session?.user.id, receiverId: friendIdToBeDeleted },
					{ senderId: friendIdToBeDeleted, receiverId: session?.user.id },
				],
			},
		});

		await prisma.chat.delete({
			where: {
				id: chatsWithFriend?.id,
			},
		});

		await prisma.friends.delete({
			where: {
				id: areFriends[0].id,
			},
		});

		await prisma.friends.delete({
			where: {
				id: areFriends[1].id,
			},
		});

		return Response.json(
			{ success: true, message: "Friend Deleted" },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
	}
}
