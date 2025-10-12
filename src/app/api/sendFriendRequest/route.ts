import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request) {
	try {
		const { friendEmail } = await req.json();
		const session = await getServerSession(authOptions);

		if (!session) {
			return Response.json(
				{ success: false, message: "Not Authorized" },
				{ status: 401 }
			);
		}

		const userEmail = session?.user.email;
		if (userEmail === friendEmail) {
			return Response.json(
				{ success: false, message: "Can't send request to yourself." },
				{ status: 400 }
			);
		}

		const userToAdd = await prisma.user.findUnique({
			where: {
				email: friendEmail,
			},
			select: {
				id: true,
			},
		});

		const idToAdd = userToAdd?.id;

		if (!idToAdd) {
			return Response.json(
				{ success: false, message: "User with this email does not exist." },
				{ status: 400 }
			);
		}

		const isAlreadyFriendRequested = await prisma.friendRequest.findFirst({
			where: {
				senderId: session.user.id,
				receiverId: idToAdd,
			},
		});

		if (isAlreadyFriendRequested) {
			return Response.json(
				{ success: false, message: "Already Requested." },
				{ status: 400 }
			);
		}

		const isAlreadyFriend = await prisma.friends.findFirst({
			where: {
				friendOfId: session.user.id,
				friendId: idToAdd,
			},
		});

		if (isAlreadyFriend) {
			return Response.json(
				{ success: false, message: "Already Friends." },
				{ status: 400 }
			);
		}

		// Create friend request first
		await prisma.friendRequest.create({
			data: {
				senderId: session.user.id,
				receiverId: idToAdd,
			},
		});

		// Send Pusher notification
		await pusherServer.trigger(
			toPusherKey(`user:${idToAdd}:friendRequests`),
			"friendRequests",
			{
				id: session.user.id,
				name: session.user.name,
				email: session.user.email,
				image: session.user.image,
			}
		);


		return Response.json(
			{
				success: true,
				message: "Friend request sent.",
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error("Error in sendFriendRequest:", error);
		return Response.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		);
	}
}
